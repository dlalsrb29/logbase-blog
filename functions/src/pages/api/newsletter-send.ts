import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { readFile } from 'fs/promises';
import path from 'path';

// MailerLite API Key - 하드코딩으로 통일 (실제 API Key로 수정)
const MAILERLITE_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiN2IwNDAwNDFmNmRhZjA0MWJiOWY2MWZhMTk5YmI1YjUyNTZkMjljYTRiZTI1OTkyMzFjOTIxMzU2MjdlNDZiNWZjY2EzYzc1MzY1MTc5ODUiLCJpYXQiOjE3NTM3NTgzMDQuMTM2ODk4LCJuYmYiOjE3NTM3NTgzMDQuMTM2OSwiZXhwIjo0OTA5NDMxOTA0LjEzMjkxOCwic3ViIjoiMTcxMTk4NCIsInNjb3BlcyI6W119.LCqYE-D57xn-4m65pSpiKfSlCoYqzSbRK5gPJoTP9hVWaifxwuQvNWPQdo16IUoZAbb_xb9E6rjHP9eGaGO0ta2r5PJnXafKPjY4n75Zn6BpZElha5X_fs-mcH83kEyyKrZbGZCXTyY8wxnZsbYtxj5ryWCTF6IBrHqE-2wPas--CthBdCCiUDTz4OQ6ga4NeS04DpZ2OYSi2Pg_ttjX6JEaoaf3dEGgOwYlGbMpy3TBcxK5Bji2_Ato-VmLmI9oPAH0q16KcFdrDi5dgzVP86PfQFt-7H2hgUl7abMWgwCMM41ldLPj15VaFGDVbDczm31A09ttQ1umusLQY1N91dEgkNaZZP1_Rp7KQLVJxOois89UyQxK4FNTEnVIHCfq8oVkhz3bp9QdadYYn1wJNdwwZfNAUHAYb1A_hMiHEiWJ1-VJd1e3DgqOZ3rmmr40d15eaz3EJpHVWhT3mn3VAg7SkHl4r1kbEIE950DpiBZ0CVtAWP7-DW0pMgVY6kdtyrS8kTasX7MH01fL0ZVrQm58JEh6R47y715qOMeL3oNk1n8Szt_cTYfOKz75uXf5COPqp1sMxloa6bw42xs3wemqXV5w-mn7Uupj1a7wdoYs39kaIaKZLZvcqExSMo12zYMSkYEDn8-XZFvplQsLCPYfmQQ1MX6OwkLLDas38oY';
const MAILERLITE_BASE_URL = 'https://connect.mailerlite.com/api';

interface Recipient {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
}

interface SendNewsletterRequest {
  filename: string;
  subject: string;
  fromName: string;
  fromEmail: string;
  recipients: Recipient[];
}

// MailerLite API 헤더
const getMailerLiteHeaders = () => ({
  'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
});

// MailerLite에 구독자 추가/업데이트
async function syncSubscriberToMailerLite(recipient: Recipient) {
  try {
    const response = await axios.post(
      `${MAILERLITE_BASE_URL}/subscribers`,
      {
        email: recipient.email,
        fields: {
          name: recipient.name,
          company: recipient.company,
          phone: recipient.phone
        },
        status: 'active'
      },
      { headers: getMailerLiteHeaders() }
    );
    
    console.log(`✅ [MAILERLITE] 구독자 동기화 성공: ${recipient.email}`);
    return response.data.data;
  } catch (error: any) {
    console.error(`❌ [MAILERLITE] 구독자 동기화 실패 ${recipient.email}:`, error.response?.data || error.message);
    throw error;
  }
}

// MailerLite에서 캠페인 생성 및 발송
async function createAndSendCampaign(
  subject: string,
  fromName: string,
  fromEmail: string,
  htmlContent: string,
  recipients: Recipient[]
) {
  try {
    // 1. 캠페인 생성
    const campaignData = {
      name: `Newsletter: ${subject} - ${new Date().toISOString().slice(0, 10)}`,
      type: 'regular',
      emails: [{
        subject: subject,
        from_name: fromName,
        from: fromEmail,
        content: htmlContent
      }]
    };

    console.log('📧 [MAILERLITE] 캠페인 생성 중...');
    const campaignResponse = await axios.post(
      `${MAILERLITE_BASE_URL}/campaigns`,
      campaignData,
      { headers: getMailerLiteHeaders() }
    );

    const campaignId = campaignResponse.data.data.id;
    console.log(`✅ [MAILERLITE] 캠페인 생성 완료. ID: ${campaignId}`);

    // 2. 캠페인 발송 (즉시 발송)
    const scheduleData = {
      delivery: 'instant' // 즉시 발송
    };

    console.log('🚀 [MAILERLITE] 캠페인 발송 중...');
    await axios.post(
      `${MAILERLITE_BASE_URL}/campaigns/${campaignId}/schedule`,
      scheduleData,
      { headers: getMailerLiteHeaders() }
    );

    console.log('✅ [MAILERLITE] 캠페인 발송 완료!');
    
    return {
      campaignId,
      campaignName: campaignData.name,
      recipientCount: recipients.length
    };

  } catch (error: any) {
    console.error('❌ [MAILERLITE] 캠페인 생성/발송 실패:', error.response?.data || error.message);
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { filename, subject, fromName, fromEmail, recipients }: SendNewsletterRequest = req.body;

    console.log('🎯 [NEWSLETTER SEND] 요청 받음:', { filename, subject, fromName, fromEmail, recipientCount: recipients?.length });

    // 입력 검증
    if (!filename || !subject || !fromName || !fromEmail || !recipients || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: '필수 정보가 누락되었습니다. (filename, subject, fromName, fromEmail, recipients)'
      });
    }

    // 테스트 모드 체크 (MailerLite 계정이 비활성화된 경우 사용)
    const isTestMode = process.env.NEWSLETTER_TEST_MODE === 'true';
    
    if (!MAILERLITE_API_KEY && !isTestMode) {
      return res.status(500).json({
        success: false,
        message: 'MailerLite API 키가 설정되지 않았습니다. 환경 변수를 확인해주세요.'
      });
    }

    // HTML 파일 읽기
    const htmlFilePath = path.resolve(process.cwd(), `public/newsletters/${filename}.html`);
    let htmlContent: string;
    
    try {
      htmlContent = await readFile(htmlFilePath, 'utf-8');
      console.log('📄 [NEWSLETTER SEND] HTML 파일 로드 완료');
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: `뉴스레터 HTML 파일을 찾을 수 없습니다: ${filename}.html`
      });
    }

    // 테스트 모드인 경우 실제 발송하지 않고 로그만 출력
    if (isTestMode) {
      console.log('🧪 [TEST MODE] 뉴스레터 발송 시뮬레이션');
      console.log('📧 제목:', subject);
      console.log('👤 발신자:', `${fromName} <${fromEmail}>`);
      console.log('👥 수신자 수:', recipients.length);
      console.log('📝 HTML 길이:', htmlContent.length);
      
      return res.status(200).json({
        success: true,
        message: `테스트 모드: ${recipients.length}명에게 "${subject}" 뉴스레터 발송 시뮬레이션 완료`,
        campaignId: 'test-campaign-' + Date.now(),
        testMode: true
      });
    }

    // MailerLite에 구독자들 동기화
    console.log('👥 [NEWSLETTER SEND] 구독자 동기화 시작...');
    const syncPromises = recipients.map(recipient => syncSubscriberToMailerLite(recipient));
    
    try {
      await Promise.all(syncPromises);
      console.log(`✅ [NEWSLETTER SEND] ${recipients.length}명 구독자 동기화 완료`);
    } catch (syncError) {
      console.warn('⚠️ [NEWSLETTER SEND] 일부 구독자 동기화 실패, 계속 진행...');
    }

    // 캠페인 생성 및 발송
    const campaignResult = await createAndSendCampaign(
      subject,
      fromName,
      fromEmail,
      htmlContent,
      recipients
    );

    // 발송 결과 기록 (나중에 데이터베이스에 저장 가능)
    const sendResult = {
      filename,
      subject,
      fromName,
      fromEmail,
      recipientCount: recipients.length,
      campaignId: campaignResult.campaignId,
      campaignName: campaignResult.campaignName,
      sentAt: new Date().toISOString(),
      status: 'sent'
    };

    console.log('🎉 [NEWSLETTER SEND] 발송 완료!', sendResult);

    return res.status(200).json({
      success: true,
      message: '뉴스레터가 성공적으로 발송되었습니다!',
      data: sendResult
    });

  } catch (error) {
    console.error('💥 [NEWSLETTER SEND] 발송 실패:', error);
    
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    
    return res.status(500).json({
      success: false,
      message: `뉴스레터 발송에 실패했습니다: ${errorMessage}`,
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
} 