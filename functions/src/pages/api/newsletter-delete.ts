import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { filename } = req.body;

    if (!filename) {
      return res.status(400).json({
        success: false, 
        message: '파일명이 필요합니다.'
      });
    }

    const newslettersDir = path.resolve(process.cwd(), 'public/newsletters');
    const newslettersJsonPath = path.join(newslettersDir, 'newsletters.json');
    const htmlFilePath = path.join(newslettersDir, `${filename}.html`);

    // HTML 파일 존재 여부 확인
    let htmlExists = false;
    try {
      await fs.access(htmlFilePath);
      htmlExists = true;
    } catch {
      htmlExists = false;
    }

    // newsletters.json에서 해당 항목 존재 여부 확인
    const functionsNewslettersJsonPath = path.join(process.cwd(), 'functions', 'public', 'newsletters', 'newsletters.json');
    let newslettersArr = [];
    let itemExistsInJson = false;
    
    try {
      const jsonContent = await fs.readFile(newslettersJsonPath, 'utf-8');
      newslettersArr = JSON.parse(jsonContent);
      if (!Array.isArray(newslettersArr)) newslettersArr = [];
      itemExistsInJson = newslettersArr.some((item: any) => item.filename === filename);
    } catch {
      newslettersArr = [];
      itemExistsInJson = false;
    }

    // HTML 파일과 JSON 항목 모두 없으면 404 반환
    if (!htmlExists && !itemExistsInJson) {
      return res.status(404).json({
        success: false, 
        message: `'${filename}' 뉴스레터를 찾을 수 없습니다. (HTML 파일 및 목록에서 존재하지 않음)`
      });
    }

    let deletedItems = [];
    let errors = [];

    try {
      // HTML 파일이 있으면 삭제
      if (htmlExists) {
        await fs.unlink(htmlFilePath);
        console.log(`HTML 파일 삭제됨: ${htmlFilePath}`);
        deletedItems.push('HTML 파일');
      }

      // JSON에 항목이 있으면 삭제
      if (itemExistsInJson) {
        const filteredArr = newslettersArr.filter((item: any) => item.filename !== filename);
        
        // 메인 프로젝트 파일에 저장
        await fs.writeFile(newslettersJsonPath, JSON.stringify(filteredArr, null, 2), 'utf-8');
        console.log(`newsletters.json에서 항목 제거 및 저장 완료`);
        deletedItems.push('목록 항목');
        
        // Firebase Functions 파일에도 저장 (동기화)
        try {
          await fs.writeFile(functionsNewslettersJsonPath, JSON.stringify(filteredArr, null, 2), 'utf-8');
          console.log('[newsletters] Firebase Functions 파일도 업데이트됨');
        } catch (functionsError) {
          console.warn('[newsletters] Firebase Functions 파일 업데이트 실패:', functionsError);
          errors.push('Functions 파일 동기화 실패');
        }
      }

      const message = `'${filename}' 뉴스레터 삭제 완료 (${deletedItems.join(', ')})` + 
                     (errors.length > 0 ? ` - 경고: ${errors.join(', ')}` : '');

      return res.status(200).json({
        success: true,
        message: message,
        details: {
          htmlDeleted: htmlExists,
          jsonDeleted: itemExistsInJson,
          errors: errors
        }
      });

    } catch (fileError) {
      console.error('파일 삭제 중 오류:', fileError);
      return res.status(500).json({
        success: false, 
        message: '파일 삭제 중 오류가 발생했습니다.',
        error: fileError instanceof Error ? fileError.message : '알 수 없는 오류'
      });
    }

  } catch (error) {
    console.error('뉴스레터 삭제 중 오류:', error);
    return res.status(500).json({
      success: false, 
      message: '뉴스레터 삭제에 실패했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
} 