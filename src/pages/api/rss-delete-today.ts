import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rssCollection = collection(db, 'rss_items');
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD 형식
    
    const todayQuery = query(
      rssCollection,
      where('collectedDate', '==', today)
    );
    
    const todaySnapshot = await getDocs(todayQuery);
    let deletedCount = 0;
    
    // 각 문서를 개별적으로 삭제
    for (const doc of todaySnapshot.docs) {
      await deleteDoc(doc.ref);
      deletedCount++;
    }
    
    res.status(200).json({
      success: true,
      deletedCount,
      date: today,
      message: `${deletedCount}개의 문서가 삭제되었습니다.`
    });
  } catch (error) {
    console.error('RSS 오늘 데이터 삭제 오류:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 