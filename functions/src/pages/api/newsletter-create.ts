import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface NewsletterData {
  title: string;
  content: string;
  url: string;
  sentDate: string;
  recipients: Array<{
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
  }>;
}

interface NewsletterMeta {
  title: string;
  content: string;
  url: string;
  sentDate: string;
  htmlFilePath: string;
  recipients: Array<{
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
  }>;
  filename?: string; // Added for newsletters.json
}

interface RssItem {
  link: string;
  title: string;
  creator: string;
  pubDate: string;
  news_letter_sent_date?: string;
}

// Helper to sanitize filenames
function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_.-]/g, '-');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { title, content, url, sentDate, recipients }: NewsletterData = req.body;

    console.log('--- Newsletter Generation Start ---');
    console.log('[DATA RECEIVED] Request Body:', { title, content, sentDate, url, recipientsCount: recipients?.length });

    if (!title?.trim() || !content?.trim() || !sentDate) {
      return res.status(400).json({
        success: false, 
        message: '제목, 내용, 발송일은 필수 항목입니다.'
      });
    }

    if (!recipients || recipients.length === 0) {
      return res.status(400).json({
        success: false, 
        message: '수신자를 한 명 이상 선택해주세요.'
      });
    }

    // 1. Read the template file
    const templatePath = path.resolve(process.cwd(), 'public/news_letter_template.html');
    let templateContent;
    try {
      templateContent = await fs.readFile(templatePath, 'utf-8');
      console.log('[TEMPLATE] Successfully loaded template file');
    } catch (e) {
      console.error("Template file not found:", templatePath);
      return res.status(500).json({
        success: false, 
        message: '템플릿 파일을 찾을 수 없습니다.'
      });
    }

    // 2. Replace placeholders
    const formattedDate = new Date(sentDate).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    templateContent = templateContent.replace(/{{제목}}/g, title);
    templateContent = templateContent.replace(/{{발송일}}/g, formattedDate);
    templateContent = templateContent.replace(/{{본문 내용 들어가는 곳}}/g, content.replace(/\n/g, '<br>'));

    // --- Start URL Crawling Logic ---
    let insightSectionHtml = '';
    if (url) {
      console.log('\n--- URL Crawling Section Start ---');
      console.log(`[CRAWL_URL] Attempting to crawl: ${url}`);
      try {
        // Added a 5-second timeout and a browser-like User-Agent to prevent being blocked
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

        console.log(`[CRAWL_RESULT] Title: "${pageTitle}"`);
        console.log(`[CRAWL_RESULT] Description: "${description ? description.substring(0, 200) + '...' : ''}"`);
        console.log(`[CRAWL_RESULT] Image URL: "${imageUrl}"`);

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
          console.log('[CRAWL_SUCCESS] URL insight section was generated with crawled data.');
        } else {
          console.log('[CRAWL_SKIP] No title found, so insight section will be empty.');
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error('[CRAWL_ERROR] Failed to crawl URL:', errorMessage);
      }
      console.log('--- URL Crawling Section End ---');
    } else {
      console.log('\n[CRAWL_SKIP] No URL provided, skipping crawl section.');
    }
    templateContent = templateContent.replace('{{URL_INSIGHT_SECTION}}', insightSectionHtml);
    // --- End URL Crawling Logic ---

    // --- New Logic to Inject RSS items from Firestore ---
    let blogListHtml = '';
    console.log(`\n[RSS SCAN] Fetching RSS items from Firestore for date: ${sentDate}`);

    try {
      // Firestore에서 해당 발송일의 RSS 아이템들을 가져오기
      const rssCollection = collection(db, 'rss_items');
      const q = query(
        rssCollection,
        where('news_letter_sent_date', '==', sentDate)
      );
      
      const querySnapshot = await getDocs(q);
      const matchingItems = querySnapshot.docs.map(doc => doc.data());
      
      console.log(`[RSS SCAN] Found ${matchingItems.length} matching RSS items in Firestore.`);

      for (const item of matchingItems) {
        const itemDate = new Date(item.pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const author = item.author || item.creator || 'Unknown';
        blogListHtml += `<li><a href="${item.link}" style="color:#0041C4; text-decoration:none;" target="_blank"><strong>${item.title}</strong></a><br>${author} — ${itemDate}</li>`;
        console.log(`    [MATCH FOUND!] Title: ${item.title}, Author: ${author}`);
      }
    } catch (e) {
      console.error("[ERROR] Error during Firestore RSS processing:", e);
      blogListHtml = '<li>Error loading blog posts from database.</li>';
    }

    if (!blogListHtml) {
      blogListHtml = '<li>No articles found for this date.</li>';
    }

    console.log('\n[HTML GENERATED] Final Blog List HTML:', blogListHtml);
    templateContent = templateContent.replace('{{BEHAVIORAL_DATA_UPDATES}}', blogListHtml);
    // --- End of New Logic ---

    // 3. Create a safe filename
    const filename = `newsletter_${sentDate}_${Date.now()}.html`;

    // 4. Define save directory and ensure it exists
    const saveDir = path.resolve(process.cwd(), 'public/newsletters');
    await fs.mkdir(saveDir, { recursive: true });
    
    const savePath = path.join(saveDir, filename);
    const publicPath = `/newsletters/${filename}`;

    // 5. Write the new file
    await fs.writeFile(savePath, templateContent, 'utf-8');
    console.log(`[SUCCESS] HTML file created at: ${publicPath}`);

    // 6. Update newsletters.json (목록 관리)
    const newslettersJsonPath = path.join(saveDir, 'newsletters.json');
    const functionsNewslettersJsonPath = path.join(process.cwd(), 'functions', 'public', 'newsletters', 'newsletters.json');
    let newslettersArr: NewsletterMeta[] = [];
    try {
      const jsonContent = await fs.readFile(newslettersJsonPath, 'utf-8');
      newslettersArr = JSON.parse(jsonContent);
      if (!Array.isArray(newslettersArr)) newslettersArr = [];
    } catch {
      newslettersArr = [];
    }
    const metadata: NewsletterMeta = {
      title: title,
      content: content,
      url: url || '',
      sentDate: sentDate,
      htmlFilePath: publicPath,
      recipients: recipients,
      filename: filename.replace('.html', '')
    };
    newslettersArr.push(metadata);
    
    // 메인 프로젝트 파일에 저장
    await fs.writeFile(newslettersJsonPath, JSON.stringify(newslettersArr, null, 2), 'utf-8');
    console.log(`[SUCCESS] newsletters.json updated`);
    
    // Firebase Functions 파일에도 저장 (동기화)
    try {
      await fs.writeFile(functionsNewslettersJsonPath, JSON.stringify(newslettersArr, null, 2), 'utf-8');
      console.log('[newsletters] Firebase Functions 파일도 업데이트됨');
    } catch (functionsError) {
      console.warn('[newsletters] Firebase Functions 파일 업데이트 실패:', functionsError);
    }

    console.log('--- Newsletter Generation End ---\n');

    return res.status(200).json({
      success: true,
      message: '뉴스레터가 성공적으로 생성되었습니다!',
      data: {
        filename: filename.replace('.html', ''),
        title: title,
        htmlUrl: publicPath
      }
    });

  } catch (error) {
    console.error('--- Newsletter Generation Failed ---');
    console.error('[FATAL ERROR]', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return res.status(500).json({
      success: false, 
      message: '뉴스레터 생성에 실패했습니다.',
      error: errorMessage
    });
  }
} 