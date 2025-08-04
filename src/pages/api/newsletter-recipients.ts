import { NextApiRequest, NextApiResponse } from 'next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface NewsletterRecipient {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  createdAt: Date;
  updatedAt?: Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Firestore에서 newsletter 컬렉션 조회
    const newsletterRef = collection(db, 'newsletter');
    const snapshot = await getDocs(newsletterRef);
    
    const recipients: NewsletterRecipient[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      recipients.push({
        id: doc.id,
        name: data.name || '',
        company: data.company || '',
        email: data.email || '',
        phone: data.phone || '',
        status: data.status || 'active', // 기본값을 active로 설정
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate()
      });
    });

    // 생성일 기준으로 정렬 (최신순)
    recipients.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    console.log(`뉴스레터 수신자 목록 조회: ${recipients.length}명`);

    return res.status(200).json({
      success: true,
      recipients: recipients
    });

  } catch (error) {
    console.error('뉴스레터 수신자 목록 조회 중 오류:', error);
    return res.status(500).json({
      success: false, 
      message: '뉴스레터 수신자 목록을 가져오는데 실패했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
} 