import { NextApiRequest, NextApiResponse } from 'next';

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

  if (req.method === 'POST') {
    try {
      const { title, content, name, company, email, phone } = req.body;
      
      if (!name || !email || !content) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
      }

      // Slack webhook URL - 하드코딩으로 통일
      const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

      const slackMessage: any = {
        text: '🆕 새로운 문의의 접수',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '🆕 새로운 문의의 접수'
            }
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*제목:*\n${title || '제목 없음'}`
              },
              {
                type: 'mrkdwn',
                text: `*작성자:*\n${name}`
              },
              {
                type: 'mrkdwn',
                text: `*이메일:*\n${email}`
              },
              {
                type: 'mrkdwn',
                text: `*연락처:*\n${phone || '연락처 없음'}`
              }
            ]
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*문의 내용:*\n${content}`
            }
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `🕐 접수 시간: ${new Date().toLocaleString('ko-KR', { 
                  timeZone: 'Asia/Seoul',
                  year: 'numeric',
                  month: '2-digit', 
                  day: '2-digit',
                  weekday: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                }).replace(/\./g, '. ')}`
              }
            ]
          }
        ]
      };

      const response = await fetch(SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slackMessage)
      });

      if (!response.ok) {
        throw new Error(`Slack API error: ${response.status}`);
      }

      res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
      console.error('Inquiry to Slack 에러:', error);
      res.status(500).json(
        { success: false, error: 'Failed to send message' }
      );
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 