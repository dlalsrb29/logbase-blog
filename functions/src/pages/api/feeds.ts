import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

const feedsFilePath = path.join(process.cwd(), 'public', 'feeds.json');
const functionsFeedsFilePath = path.join(process.cwd(), 'functions', 'public', 'feeds.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const feedsData = await fs.readFile(feedsFilePath, 'utf-8');
      const feeds = JSON.parse(feedsData);
      
      res.status(200).json({
        success: true,
        feeds: feeds
      });
    } catch (error) {
      console.error('RSS 피드 파일 읽기 오류:', error);
      res.status(500).json({
        success: false,
        error: 'RSS 피드 파일을 읽을 수 없습니다.'
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, url, type, status } = req.body;
      
      if (!name || !url || !type || !status) {
        return res.status(400).json({
          success: false,
          error: '모든 필드를 입력해주세요.'
        });
      }

      if (type !== 'competitor' && type !== 'noncompetitor') {
        return res.status(400).json({
          success: false,
          error: '타입은 competitor 또는 noncompetitor여야 합니다.'
        });
      }

      if (status !== 'active' && status !== 'error') {
        return res.status(400).json({
          success: false,
          error: '상태는 active 또는 error여야 합니다.'
        });
      }
      
      // 기존 피드 목록 읽기
      const feedsData = await fs.readFile(feedsFilePath, 'utf-8');
      const feeds = JSON.parse(feedsData);
      
      // 중복 확인 (이름으로)
      if (feeds.some((feed: any) => feed.name === name)) {
        return res.status(400).json({
          success: false,
          error: '이미 존재하는 피드 이름입니다.'
        });
      }
      
      // 새 피드 추가
      feeds.push({ name, url, type, status });
      
      // 메인 프로젝트 파일에 저장
      await fs.writeFile(feedsFilePath, JSON.stringify(feeds, null, 2), 'utf-8');
      
      // Firebase Functions 파일에도 저장 (동기화)
      try {
        await fs.writeFile(functionsFeedsFilePath, JSON.stringify(feeds, null, 2), 'utf-8');
        console.log('[feeds] Firebase Functions 파일도 업데이트됨');
      } catch (functionsError) {
        console.warn('[feeds] Firebase Functions 파일 업데이트 실패:', functionsError);
      }
      
      res.status(200).json({
        success: true,
        message: 'RSS 피드가 추가되었습니다.',
        feeds: feeds
      });
    } catch (error) {
      console.error('RSS 피드 추가 오류:', error);
      res.status(500).json({
        success: false,
        error: 'RSS 피드 추가 중 오류가 발생했습니다.'
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const { oldName, name, url, type, status } = req.body;
      
      if (!oldName || !name || !url || !type || !status) {
        return res.status(400).json({
          success: false,
          error: '모든 필드를 입력해주세요.'
        });
      }

      if (type !== 'competitor' && type !== 'noncompetitor') {
        return res.status(400).json({
          success: false,
          error: '타입은 competitor 또는 noncompetitor여야 합니다.'
        });
      }

      if (status !== 'active' && status !== 'error') {
        return res.status(400).json({
          success: false,
          error: '상태는 active 또는 error여야 합니다.'
        });
      }
      
      // 기존 피드 목록 읽기
      const feedsData = await fs.readFile(feedsFilePath, 'utf-8');
      const feeds = JSON.parse(feedsData);
      
      // 기존 피드가 존재하는지 확인
      const oldIndex = feeds.findIndex((feed: any) => feed.name === oldName);
      if (oldIndex === -1) {
        return res.status(404).json({
          success: false,
          error: '수정할 RSS 피드를 찾을 수 없습니다.'
        });
      }
      
      // 새 이름이 이미 존재하는지 확인 (자기 자신 제외)
      if (feeds.some((feed: any) => feed.name === name && feed.name !== oldName)) {
        return res.status(400).json({
          success: false,
          error: '이미 존재하는 피드 이름입니다.'
        });
      }
      
      // 피드 수정
      feeds[oldIndex] = { name, url, type, status };
      
      // 메인 프로젝트 파일에 저장
      await fs.writeFile(feedsFilePath, JSON.stringify(feeds, null, 2), 'utf-8');
      
      // Firebase Functions 파일에도 저장 (동기화)
      try {
        await fs.writeFile(functionsFeedsFilePath, JSON.stringify(feeds, null, 2), 'utf-8');
        console.log('[feeds] Firebase Functions 파일도 업데이트됨');
      } catch (functionsError) {
        console.warn('[feeds] Firebase Functions 파일 업데이트 실패:', functionsError);
      }
      
      res.status(200).json({
        success: true,
        message: 'RSS 피드가 수정되었습니다.',
        feeds: feeds
      });
    } catch (error) {
      console.error('RSS 피드 수정 오류:', error);
      res.status(500).json({
        success: false,
        error: 'RSS 피드 수정 중 오류가 발생했습니다.'
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { name } = req.body;
      
      if (!name || typeof name !== 'string') {
        return res.status(400).json({
          success: false,
          error: '유효한 피드 이름을 입력해주세요.'
        });
      }
      
      // 기존 피드 목록 읽기
      const feedsData = await fs.readFile(feedsFilePath, 'utf-8');
      const feeds = JSON.parse(feedsData);
      
      // 피드가 존재하는지 확인
      const feedIndex = feeds.findIndex((feed: any) => feed.name === name);
      if (feedIndex === -1) {
        return res.status(404).json({
          success: false,
          error: '삭제할 RSS 피드를 찾을 수 없습니다.'
        });
      }
      
      // 피드 삭제
      feeds.splice(feedIndex, 1);
      
      // 메인 프로젝트 파일에 저장
      await fs.writeFile(feedsFilePath, JSON.stringify(feeds, null, 2), 'utf-8');
      
      // Firebase Functions 파일에도 저장 (동기화)
      try {
        await fs.writeFile(functionsFeedsFilePath, JSON.stringify(feeds, null, 2), 'utf-8');
        console.log('[feeds] Firebase Functions 파일도 업데이트됨');
      } catch (functionsError) {
        console.warn('[feeds] Firebase Functions 파일 업데이트 실패:', functionsError);
      }
      
      res.status(200).json({
        success: true,
        message: 'RSS 피드가 삭제되었습니다.',
        feeds: feeds
      });
    } catch (error) {
      console.error('RSS 피드 삭제 오류:', error);
      res.status(500).json({
        success: false,
        error: 'RSS 피드 삭제 중 오류가 발생했습니다.'
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 