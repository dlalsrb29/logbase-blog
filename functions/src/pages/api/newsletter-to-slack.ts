import { NextApiRequest, NextApiResponse } from 'next';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Slack Webhook URL (환경 변수에서 가져오기)
const SLACK_WEBHOOK_URL = process.env.SLACK_NEWSLETTER_WEBHOOK_URL;

interface NewsletterRequest {
  name: string;
  email: string;
  company?: string;
  phone?: string;
}

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

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { name, email, company, phone }: NewsletterRequest = req.body;

    // 필수 필드 검증
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: '이름과 이메일은 필수 항목입니다.'
      });
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: '올바른 이메일 형식을 입력해주세요.'
      });
    }

    // Slack 메시지 구성
    const slackMessage: any = {
      text: '🆕 새로운 뉴스레터 신청이 도착했습니다!',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '📧 뉴스레터 신청'
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*이름:*\n${name}`
            },
            {
              type: 'mrkdwn',
              text: `*이메일:*\n${email}`
            }
          ]
        }
      ]
    };

    // 선택적 필드 추가
    if (company || phone) {
      const fields: any[] = [];
      if (company) {
        fields.push({
          type: 'mrkdwn',
          text: `*회사/소속:*\n${company}`
        });
      }
      if (phone) {
        fields.push({
          type: 'mrkdwn',
          text: `*연락처:*\n${phone}`
        });
      }
      
      slackMessage.blocks.push({
        type: 'section',
        fields: fields
      });
    }



    // 구분선과 시간 추가
    slackMessage.blocks.push({
      type: 'divider'
    });
    
    slackMessage.blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `신청 시간: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`
        }
      ]
    });

    // Firestore에 뉴스레터 신청 정보 저장
    const newsletterData = {
      name,
      email,
      company: company || '',
      phone: phone || '',
      createdAt: serverTimestamp(),
      status: 'active' // 구독 상태
    };

    let firestoreSuccess = false;
    try {
      // 이메일 중복 확인 (기존 newsletter-recipients.ts와 동일한 컬렉션명 사용)
      const newsletterRef = collection(db, 'newsletter');
      const q = query(newsletterRef, where('email', '==', email));
      const existingSubscriber = await getDocs(q);

      if (!existingSubscriber.empty) {
        // 이미 구독자가 있는 경우 정보 업데이트
        const docId = existingSubscriber.docs[0].id;
        const docRef = doc(db, 'newsletter', docId);
        await updateDoc(docRef, {
          name,
          company: company || '',
          phone: phone || '',
          updatedAt: serverTimestamp(),
          status: 'active'
        });
        console.log('✅ 기존 구독자 정보 업데이트 완료');
      } else {
        // 새로운 구독자 추가
        await addDoc(newsletterRef, newsletterData);
        console.log('✅ 새로운 구독자 추가 완료');
      }
      firestoreSuccess = true;
    } catch (firestoreError) {
      console.error('❌ Firestore 저장 실패:', firestoreError);
      // Firestore 저장 실패해도 Slack 전송은 계속 진행
    }

    // Slack으로 메시지 전송
    let slackSuccess = false;
    if (SLACK_WEBHOOK_URL) {
      try {
        const response = await fetch(SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(slackMessage),
        });

        if (!response.ok) {
          console.error('Slack 전송 실패:', response.status, response.statusText);
          throw new Error('Slack 메시지 전송에 실패했습니다.');
        }

        console.log('✅ Slack 메시지 전송 성공');
        slackSuccess = true;
      } catch (slackError) {
        console.error('❌ Slack 전송 오류:', slackError);
        // Slack 전송 실패해도 Firestore 저장이 성공했다면 부분 성공으로 처리
      }
    } else {
      console.warn('⚠️ SLACK_WEBHOOK_URL이 설정되지 않았습니다.');
    }

    // 성공 응답 (최소 하나라도 성공하면 성공으로 처리)
    if (firestoreSuccess || slackSuccess) {
      const messages = [];
      if (firestoreSuccess) messages.push('구독자 정보 저장');
      if (slackSuccess) messages.push('Slack 알림 전송');
      
      res.status(200).json({
        success: true,
        message: `뉴스레터 신청이 성공적으로 처리되었습니다. (${messages.join(', ')} 완료)`
      });
    } else {
      throw new Error('모든 처리가 실패했습니다.');
    }

  } catch (error) {
    console.error('❌ 뉴스레터 신청 처리 오류:', error);
    
    res.status(500).json({
      success: false,
      error: '뉴스레터 신청 처리 중 오류가 발생했습니다.'
    });
  }
} 