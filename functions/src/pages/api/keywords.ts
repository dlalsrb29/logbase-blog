import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

const keywordsFilePath = path.join(process.cwd(), 'public', 'keywords.json');
const functionsKeywordsFilePath = path.join(process.cwd(), 'functions', 'public', 'keywords.json');

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
      const keywordsData = await fs.readFile(keywordsFilePath, 'utf-8');
      const keywords = JSON.parse(keywordsData);
      
      res.status(200).json({
        success: true,
        keywords: keywords
      });
    } catch (error) {
      console.error('키워드 파일 읽기 오류:', error);
      res.status(500).json({
        success: false,
        error: '키워드 파일을 읽을 수 없습니다.'
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { keyword } = req.body;
      
      if (!keyword || typeof keyword !== 'string' || keyword.trim() === '') {
        return res.status(400).json({
          success: false,
          error: '유효한 키워드를 입력해주세요.'
        });
      }

      const trimmedKeyword = keyword.trim();
      
      // 기존 키워드 목록 읽기
      const keywordsData = await fs.readFile(keywordsFilePath, 'utf-8');
      const keywords = JSON.parse(keywordsData);
      
      // 중복 확인
      if (keywords.includes(trimmedKeyword)) {
        return res.status(400).json({
          success: false,
          error: '이미 존재하는 키워드입니다.'
        });
      }
      
      // 새 키워드 추가
      keywords.push(trimmedKeyword);
      
      // 메인 프로젝트 파일에 저장
      await fs.writeFile(keywordsFilePath, JSON.stringify(keywords, null, 2), 'utf-8');
      
      // Firebase Functions 파일에도 저장 (동기화)
      try {
        await fs.writeFile(functionsKeywordsFilePath, JSON.stringify(keywords, null, 2), 'utf-8');
        console.log('[keywords] Firebase Functions 파일도 업데이트됨');
      } catch (functionsError) {
        console.warn('[keywords] Firebase Functions 파일 업데이트 실패:', functionsError);
      }
      
      res.status(200).json({
        success: true,
        message: '키워드가 추가되었습니다.',
        keywords: keywords
      });
    } catch (error) {
      console.error('키워드 추가 오류:', error);
      res.status(500).json({
        success: false,
        error: '키워드 추가 중 오류가 발생했습니다.'
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const { oldKeyword, newKeyword } = req.body;
      
      if (!oldKeyword || !newKeyword || typeof oldKeyword !== 'string' || typeof newKeyword !== 'string') {
        return res.status(400).json({
          success: false,
          error: '유효한 키워드를 입력해주세요.'
        });
      }

      const trimmedNewKeyword = newKeyword.trim();
      
      if (trimmedNewKeyword === '') {
        return res.status(400).json({
          success: false,
          error: '새 키워드는 비어있을 수 없습니다.'
        });
      }
      
      // 기존 키워드 목록 읽기
      const keywordsData = await fs.readFile(keywordsFilePath, 'utf-8');
      const keywords = JSON.parse(keywordsData);
      
      // 기존 키워드가 존재하는지 확인
      const oldIndex = keywords.indexOf(oldKeyword);
      if (oldIndex === -1) {
        return res.status(404).json({
          success: false,
          error: '수정할 키워드를 찾을 수 없습니다.'
        });
      }
      
      // 새 키워드가 이미 존재하는지 확인 (자기 자신 제외)
      if (keywords.includes(trimmedNewKeyword) && oldKeyword !== trimmedNewKeyword) {
        return res.status(400).json({
          success: false,
          error: '이미 존재하는 키워드입니다.'
        });
      }
      
      // 키워드 수정
      keywords[oldIndex] = trimmedNewKeyword;
      
      // 메인 프로젝트 파일에 저장
      await fs.writeFile(keywordsFilePath, JSON.stringify(keywords, null, 2), 'utf-8');
      
      // Firebase Functions 파일에도 저장 (동기화)
      try {
        await fs.writeFile(functionsKeywordsFilePath, JSON.stringify(keywords, null, 2), 'utf-8');
        console.log('[keywords] Firebase Functions 파일도 업데이트됨');
      } catch (functionsError) {
        console.warn('[keywords] Firebase Functions 파일 업데이트 실패:', functionsError);
      }
      
      res.status(200).json({
        success: true,
        message: '키워드가 수정되었습니다.',
        keywords: keywords
      });
    } catch (error) {
      console.error('키워드 수정 오류:', error);
      res.status(500).json({
        success: false,
        error: '키워드 수정 중 오류가 발생했습니다.'
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { keyword } = req.body;
      
      if (!keyword || typeof keyword !== 'string') {
        return res.status(400).json({
          success: false,
          error: '유효한 키워드를 입력해주세요.'
        });
      }
      
      // 기존 키워드 목록 읽기
      const keywordsData = await fs.readFile(keywordsFilePath, 'utf-8');
      const keywords = JSON.parse(keywordsData);
      
      // 키워드가 존재하는지 확인
      const keywordIndex = keywords.indexOf(keyword);
      if (keywordIndex === -1) {
        return res.status(404).json({
          success: false,
          error: '삭제할 키워드를 찾을 수 없습니다.'
        });
      }
      
      // 키워드 삭제
      keywords.splice(keywordIndex, 1);
      
      // 메인 프로젝트 파일에 저장
      await fs.writeFile(keywordsFilePath, JSON.stringify(keywords, null, 2), 'utf-8');
      
      // Firebase Functions 파일에도 저장 (동기화)
      try {
        await fs.writeFile(functionsKeywordsFilePath, JSON.stringify(keywords, null, 2), 'utf-8');
        console.log('[keywords] Firebase Functions 파일도 업데이트됨');
      } catch (functionsError) {
        console.warn('[keywords] Firebase Functions 파일 업데이트 실패:', functionsError);
      }
      
      res.status(200).json({
        success: true,
        message: '키워드가 삭제되었습니다.',
        keywords: keywords
      });
    } catch (error) {
      console.error('키워드 삭제 오류:', error);
      res.status(500).json({
        success: false,
        error: '키워드 삭제 중 오류가 발생했습니다.'
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 