import { NextApiRequest, NextApiResponse } from 'next';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID는 필수 항목입니다.'
      });
    }

    // Firestore에서 해당 구독자 삭제
    const docRef = doc(db, 'newsletter', id);
    await deleteDoc(docRef);

    console.log(`✅ 구독자 ${id} 삭제 완료`);

    return res.status(200).json({
      success: true,
      message: '구독자가 삭제되었습니다.'
    });

  } catch (error) {
    console.error('❌ 구독자 삭제 오류:', error);
    return res.status(500).json({
      success: false,
      message: '구독자 삭제 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
} 