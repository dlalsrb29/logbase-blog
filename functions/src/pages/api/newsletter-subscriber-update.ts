import { NextApiRequest, NextApiResponse } from 'next';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: 'ID와 상태는 필수 항목입니다.'
      });
    }

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: '상태는 active 또는 inactive만 가능합니다.'
      });
    }

    // Firestore에서 해당 구독자 상태 업데이트
    const docRef = doc(db, 'newsletter', id);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp()
    });

    console.log(`✅ 구독자 ${id} 상태를 ${status}로 변경 완료`);

    return res.status(200).json({
      success: true,
      message: `구독자 상태가 ${status === 'active' ? '활성화' : '비활성화'}되었습니다.`
    });

  } catch (error) {
    console.error('❌ 구독자 상태 업데이트 오류:', error);
    return res.status(500).json({
      success: false,
      message: '구독자 상태 업데이트 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
} 