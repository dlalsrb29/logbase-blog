import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

interface NewsletterMeta {
  title: string;
  content: string;
  url: string;
  sentDate: string;
  htmlFilePath: string;
  filename: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { filename } = req.query;

    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({
        success: false, 
        message: '파일명이 필요합니다.'
      });
    }

    const newslettersDir = path.resolve(process.cwd(), 'public/newsletters');
    const newslettersJsonPath = path.join(newslettersDir, 'newsletters.json');

    try {
      // newsletters.json 파일 읽기
      const jsonContent = await fs.readFile(newslettersJsonPath, 'utf-8');
      const newslettersArr = JSON.parse(jsonContent);
      
      if (!Array.isArray(newslettersArr)) {
        return res.status(404).json({
          success: false, 
          message: '뉴스레터 목록을 찾을 수 없습니다.'
        });
      }

      // 해당 filename의 뉴스레터 찾기
      const newsletter = newslettersArr.find((item: NewsletterMeta) => item.filename === filename);

      if (!newsletter) {
        return res.status(404).json({
          success: false, 
          message: '뉴스레터를 찾을 수 없습니다.'
        });
      }

      return res.status(200).json({
        success: true,
        newsletter: newsletter
      });

    } catch (fileError) {
      console.error('파일 읽기 중 오류:', fileError);
      return res.status(404).json({
        success: false, 
        message: '뉴스레터를 찾을 수 없습니다.',
        error: fileError instanceof Error ? fileError.message : '알 수 없는 오류'
      });
    }

  } catch (error) {
    console.error('뉴스레터 조회 중 오류:', error);
    return res.status(500).json({
      success: false, 
      message: '뉴스레터 조회에 실패했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
} 