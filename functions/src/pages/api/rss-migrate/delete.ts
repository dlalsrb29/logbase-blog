import { NextApiRequest, NextApiResponse } from 'next';
import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🔍 Delete API 호출됨:', { method: req.method, body: req.body });
  
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { guid } = req.body;
    console.log('📝 받은 GUID:', guid, typeof guid);

    if (!guid) {
      console.log('❌ GUID가 없음');
      return res.status(400).json({
        success: false,
        message: 'GUID는 필수 항목입니다.'
      });
    }

    console.log(`🗑️ RSS 아이템 삭제 요청: ${guid}`);

    // GUID로 문서를 찾아서 삭제
    const rssCollection = collection(db, 'rss_items');
    const q = query(rssCollection, where('guid', '==', guid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({
        success: false,
        message: '해당 RSS 아이템을 찾을 수 없습니다.'
      });
    }

    // 문서 삭제
    for (const docSnapshot of querySnapshot.docs) {
      await deleteDoc(docSnapshot.ref);
    }

    console.log(`✅ RSS 아이템 삭제 완료: ${guid}`);

    return res.status(200).json({
      success: true,
      message: 'RSS 아이템이 삭제되었습니다.'
    });

  } catch (error) {
    console.error('❌ RSS 아이템 삭제 오류:', error);
    console.error('❌ 오류 스택:', error instanceof Error ? error.stack : error);
    return res.status(500).json({
      success: false,
      message: 'RSS 아이템 삭제 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
} 