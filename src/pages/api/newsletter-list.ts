import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

interface NewsletterMeta {
  title: string;
  content: string;
  url: string;
  sentDate: string;
  htmlFilePath: string;
  filename: string; // 실제 JSON 파일명 추가
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // newsletters 디렉토리 경로
    const newslettersDir = path.resolve(process.cwd(), 'public/newsletters');
    const newslettersJsonPath = path.join(newslettersDir, 'newsletters.json');
    let newsletters: NewsletterMeta[] = [];

    try {
      // newsletters.json 파일 읽기
      const jsonContent = await fs.readFile(newslettersJsonPath, 'utf-8');
      newsletters = JSON.parse(jsonContent);
      if (!Array.isArray(newsletters)) newsletters = [];
    } catch (error) {
      console.error('newsletters.json 파일을 읽을 수 없습니다:', error);
      newsletters = [];
    }

    // 발송일 기준으로 내림차순 정렬 (최신순)
    newsletters.sort((a, b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime());

    return res.status(200).json({
      success: true,
      newsletters: newsletters
    });

  } catch (error) {
    console.error('뉴스레터 목록을 가져오는 중 오류:', error);
    return res.status(500).json({
      success: false, 
      message: '뉴스레터 목록을 가져오는데 실패했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
} 