import { NextApiRequest, NextApiResponse } from 'next';
import { collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('🔧 뉴스레터 구독자 status 필드 일괄 업데이트 시작...');

    // Firestore에서 newsletter 컬렉션의 모든 문서 조회
    const newsletterRef = collection(db, 'newsletter');
    const snapshot = await getDocs(newsletterRef);
    
    let updatedCount = 0;
    let skippedCount = 0;

    // 각 문서를 확인하고 status 필드가 없으면 추가
    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      
      if (!data.status) {
        // status 필드가 없는 경우 'active'로 설정
        const docRef = doc(db, 'newsletter', docSnapshot.id);
        await updateDoc(docRef, {
          status: 'active',
          updatedAt: serverTimestamp()
        });
        
        console.log(`✅ 문서 ${docSnapshot.id} (${data.name || data.email}) status 필드 추가: active`);
        updatedCount++;
      } else {
        console.log(`⏭️ 문서 ${docSnapshot.id} (${data.name || data.email}) 이미 status 필드 존재: ${data.status}`);
        skippedCount++;
      }
    }

    console.log(`🎉 일괄 업데이트 완료: ${updatedCount}개 업데이트, ${skippedCount}개 건너뜀`);

    return res.status(200).json({
      success: true,
      message: `일괄 업데이트 완료: ${updatedCount}개 업데이트, ${skippedCount}개 건너뜀`,
      updated: updatedCount,
      skipped: skippedCount,
      total: snapshot.size
    });

  } catch (error) {
    console.error('❌ status 필드 일괄 업데이트 오류:', error);
    return res.status(500).json({
      success: false,
      message: 'status 필드 일괄 업데이트 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
} 