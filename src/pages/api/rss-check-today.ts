import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
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
    const exists = !todaySnapshot.empty;
    const count = todaySnapshot.size;
    
    res.status(200).json({
      exists,
      count,
      date: today
    });
  } catch (error) {
    console.error('RSS 오늘 데이터 확인 오류:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 