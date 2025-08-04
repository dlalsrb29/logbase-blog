import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface Recipient {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
}

interface NewsletterData {
  title: string;
  content: string;
  url: string;
  sentDate: string;
  recipients: Recipient[];
}

interface NewsletterMeta {
  title: string;
  content: string;
  url: string;
  sentDate: string;
  htmlFilePath: string;
  filename: string;
  recipients?: Recipient[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { filename } = req.query;
    const { title, content, url, sentDate, recipients }: NewsletterData = req.body;

    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({ success: false, message: '파일명이 필요합니다.' });
    }

    if (!title?.trim() || !content?.trim() || !sentDate) {
      return res.status(400).json({ success: false, message: '제목, 내용, 발송일을 모두 입력해주세요.' });
    }

    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ success: false, message: '수신자를 한 명 이상 선택해주세요.' });
    }

    const newslettersDir = path.resolve(process.cwd(), 'public/newsletters');
    const newslettersJsonPath = path.join(newslettersDir, 'newsletters.json');

    try {
      // newsletters.json 파일 읽기
      const jsonContent = await fs.readFile(newslettersJsonPath, 'utf-8');
      const newslettersArr = JSON.parse(jsonContent);
      
      if (!Array.isArray(newslettersArr)) {
        return res.status(404).json({ success: false, message: '뉴스레터 목록을 찾을 수 없습니다.' });
      }

      // 해당 filename의 뉴스레터 찾기
      const newsletterIndex = newslettersArr.findIndex((item: NewsletterMeta) => item.filename === filename);

      if (newsletterIndex === -1) {
        return res.status(404).json({ success: false, message: '뉴스레터를 찾을 수 없습니다.' });
      }

      const existingNewsletter = newslettersArr[newsletterIndex];

      // HTML 파일 경로
      const htmlFilePath = existingNewsletter.htmlFilePath;
      const htmlFullPath = path.resolve(process.cwd(), 'public', htmlFilePath.replace(/^\//, ''));

      // 템플릿 파일 읽기
      const templatePath = path.resolve(process.cwd(), 'public/news_letter_template.html');
      let templateContent = await fs.readFile(templatePath, 'utf-8');

      // 템플릿 변수 치환
      templateContent = templateContent
        .replace(/{{제목}}/g, title)
        .replace(/{{발송일}}/g, new Date(sentDate).toLocaleDateString('ko-KR'))
        .replace(/{{본문 내용 들어가는 곳}}/g, content.replace(/\n/g, '<br>'));

      // URL이 있는 경우 URL 크롤링하여 인사이트 섹션 추가
      let insightSectionHtml = '';
      if (url && url.trim()) {
        try {
          const { data: pageHtml } = await axios.get(url, {
            timeout: 5000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          const $ = cheerio.load(pageHtml);

          const imageUrl = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content') || '';
          const pageTitle = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
          const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';

          if (pageTitle) {
            insightSectionHtml = `
      <!-- URL 인사이트 영역 시작 -->
      <tr>
        <td style="padding: 20px; background-color: #f8fafc; border-radius: 6px; margin: 20px 0;">
          <h3 style="font-size: 18px; color: #111; margin-bottom: 16px;">LOGBASE INSIGHT</h3>
          <div style="display: flex; align-items: flex-start; gap: 16px;">
            ${imageUrl ? `<img src="${imageUrl}" alt="Insight Image" style="width: 200px; min-width: 120px; border-radius: 4px; object-fit: cover; display: block;" />` : ''}
            <div style="flex: 1;">
              <h4 style="margin-top: 0; margin-bottom: 6px; color: #111;">${pageTitle}</h4>
              <p style="margin: 0; font-size: 14px; color: #444;">${description}</p>
            </div>
          </div>
        </td>
      </tr>
      <!-- URL 인사이트 영역 끝 -->`;
          }
        } catch (e) {
          // ignore crawl error
        }
      }
      templateContent = templateContent.replace('{{URL_INSIGHT_SECTION}}', insightSectionHtml);

      // RSS 업데이트 섹션에 해당 발송일의 RSS 데이터 추가
      let blogListHtml = '';
      try {
        const rssCollection = collection(db, 'rss_items');
        const q = query(
          rssCollection,
          where('news_letter_sent_date', '==', sentDate)
        );
        
        const querySnapshot = await getDocs(q);
        const matchingItems = querySnapshot.docs.map(doc => doc.data());

        for (const item of matchingItems) {
          const itemDate = new Date(item.pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
          const author = item.author || item.creator || 'Unknown';
          blogListHtml += `<li><a href="${item.link}" style="color:#0041C4; text-decoration:none;" target="_blank"><strong>${item.title}</strong></a><br>${author} — ${itemDate}</li>`;
        }
      } catch (e) {
        blogListHtml = '<li>Error loading blog posts from database.</li>';
      }

      if (!blogListHtml) {
        blogListHtml = '<li>No articles found for this date.</li>';
      }

      templateContent = templateContent.replace('{{BEHAVIORAL_DATA_UPDATES}}', blogListHtml);

      const htmlTemplate = templateContent;

      // HTML 파일 업데이트
      await fs.writeFile(htmlFullPath, htmlTemplate, 'utf-8');

      // 메타데이터 업데이트
      const updatedNewsletter: NewsletterMeta = {
        ...existingNewsletter,
        title: title,
        content: content,
        url: url || '',
        sentDate: sentDate,
        recipients: recipients
      };

      // newsletters.json 배열에서 해당 항목 업데이트
      newslettersArr[newsletterIndex] = updatedNewsletter;

      // 메타데이터 업데이트
      const functionsNewslettersJsonPath = path.join(process.cwd(), 'functions', 'public', 'newsletters', 'newsletters.json');

      // 메인 프로젝트 파일에 저장
      await fs.writeFile(newslettersJsonPath, JSON.stringify(newslettersArr, null, 2), 'utf-8');
      
      // Firebase Functions 파일에도 저장 (동기화)
      try {
        await fs.writeFile(functionsNewslettersJsonPath, JSON.stringify(newslettersArr, null, 2), 'utf-8');
      } catch (functionsError) {
        // ignore
      }

      return res.status(200).json({
        success: true,
        message: '뉴스레터가 성공적으로 수정되었습니다!',
        data: {
          filename: filename,
          title: title,
          htmlUrl: `/${htmlFilePath}`
        }
      });

    } catch (fileError) {
      return res.status(404).json({
        success: false, 
        message: '뉴스레터를 찾을 수 없거나 수정할 수 없습니다.',
        error: fileError instanceof Error ? fileError.message : '알 수 없는 오류'
      });
    }

  } catch (error) {
    return res.status(500).json({
      success: false, 
      message: '뉴스레터 수정에 실패했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
} 