const { onRequest } = require('firebase-functions/v2/https');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { join } = require('path');
const next = require('next');
const admin = require('firebase-admin');
const axios = require('axios');
const fs = require('fs').promises;

// Firebase Admin SDK 초기화
admin.initializeApp();

// Slack Webhook URL 직접 설정 (임시)
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

// Next.js 앱 설정
const dev = false;
const nextApp = next({ 
  dev, 
  dir: __dirname,
  conf: {
    output: 'standalone'
  }
});

let handle;

// Next.js 초기화 함수
async function initializeNextApp() {
  if (!handle) {
    try {
      console.log('🔧 Next.js 앱 준비 중...');
      await nextApp.prepare();
      handle = nextApp.getRequestHandler();
      console.log('✅ Next.js 앱 초기화 완료');
    } catch (error) {
      console.error('❌ Next.js 앱 초기화 실패:', error);
      throw error;
    }
  }
  return handle;
}

// Slack 메시지 전송 함수
async function sendSlackMessage(message) {
  // Slack webhook URL이 설정되지 않은 경우 건너뛰기
  if (!SLACK_WEBHOOK_URL) {
    console.warn('⚠️ SLACK_WEBHOOK_URL이 설정되지 않았습니다. Slack 알림을 건너뜁니다.');
    return;
  }

  try {
    await axios.post(SLACK_WEBHOOK_URL, {
      text: message
    });
    console.log('✅ Slack 메시지 전송 성공');
  } catch (error) {
    console.error('❌ Slack 메시지 전송 실패:', error.message);
  }
}

// RSS 피드 자동 수집 함수
async function collectRSSFeeds() {
  try {
    console.log('🔍 RSS 피드 자동 수집 시작');
    
    // Next.js API 호출하여 RSS 수집 실행
    const response = await axios.post('https://logbase-blog-83db6.web.app/api/rss-collect', {}, {
      timeout: 300000, // 5분 타임아웃
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Firebase-Functions-RSS-Collector'
      }
    });
    
    const result = response.data;
    console.log('📊 RSS 수집 결과:', result);
    
    // Slack으로 결과 알림 전송
    const slackMessage = `🤖 **RSS 자동 수집 완료**
    
📊 **수집 결과:**
• 전체 피드: ${result.totalFeeds}개
• 성공한 피드: ${result.successfulFeeds}개  
• 실패한 피드: ${result.failedFeeds}개
• 수집된 전체 글: ${result.totalArticles}개
• 키워드 필터링된 글: ${result.totalFilteredArticles}개
• 새로 저장된 글: ${result.savedArticles}개
• 중복으로 건너뛴 글: ${result.skippedArticles}개

⏱️ **소요 시간:** ${result.durationSeconds}초
📅 **수집 시간:** ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}

${result.message}`;

    await sendSlackMessage(slackMessage);
    console.log('✅ RSS 자동 수집 및 Slack 알림 완료');
    
  } catch (error) {
    console.error('❌ RSS 자동 수집 실패:', error);
    
    // 에러 발생 시에도 Slack으로 알림
    const errorMessage = `🚨 **RSS 자동 수집 실패**
    
❌ **오류 내용:** ${error.message}
📅 **실패 시간:** ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}

관리자가 확인이 필요합니다.`;

    await sendSlackMessage(errorMessage);
  }
}



// Firebase Functions 핸들러 - asia-northeast3 리전 설정
exports.nextjsFunc = onRequest({
  region: 'asia-northeast3',
  timeoutSeconds: 540,
  memory: '2GiB'
}, async (req, res) => {
  console.log('🔍 Firebase Functions 요청 수신:', {
    url: req.url,
    method: req.method
  });
  
  try {
    // Next.js 앱 초기화
    const requestHandler = await initializeNextApp();
    
    // Next.js로 요청 전달
    console.log('🔧 Next.js로 요청 전달');
    return requestHandler(req, res);
    
  } catch (error) {
    console.error('❌ Next.js 함수 실행 오류:', error);
    
    // 오류 응답
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// RSS 수집 함수 (별도 엔드포인트) - asia-northeast3 리전 설정
exports.collectRSS = onRequest({
  region: 'asia-northeast3',
  timeoutSeconds: 540,
  memory: '2GiB'
}, async (req, res) => {
  try {
    console.log('📡 RSS 수집 요청 수신');
    await collectRSSFeeds();
    res.json({ success: true, message: 'RSS 피드 수집 완료' });
  } catch (error) {
    console.error('❌ RSS 수집 실패:', error);
    res.status(500).json({ error: error.message });
  }
});

// RSS 자동 수집 스케줄러 - 매일 오전 6시 실행
exports.scheduledRSSCollection = onSchedule({
  schedule: '0 6 * * *', // 매일 오전 6시 (한국 시간 기준)
  timeZone: 'Asia/Seoul',
  region: 'asia-northeast3',
  timeoutSeconds: 540,
  memory: '1GiB'
}, async (event) => {
  console.log('⏰ RSS 자동 수집 스케줄러 실행:', new Date().toLocaleString('ko-KR'));
  await collectRSSFeeds();
});


// RSS 수동 수집 함수 (HTTP 트리거)
exports.manualRSSCollection = onRequest({
  region: 'asia-northeast3',
  timeoutSeconds: 540,
  memory: '1GiB'
}, async (req, res) => {
  try {
    console.log('🔧 RSS 수동 수집 요청 수신');
    await collectRSSFeeds();
    res.json({ 
      success: true, 
      message: 'RSS 피드 수집이 완료되었습니다. Slack에서 결과를 확인하세요.' 
    });
  } catch (error) {
    console.error('❌ RSS 수동 수집 실패:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Slack 연동 함수 - asia-northeast3 리전 설정
exports.contactToSlack = onRequest({
  region: 'asia-northeast3'
}, async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
    }
    
    const slackMessage = `새로운 문의가 도착했습니다!\n\n이름: ${name}\n이메일: ${email}\n메시지: ${message}`;
    
    await sendSlackMessage(slackMessage);
    
    res.json({ success: true, message: '메시지가 성공적으로 전송되었습니다.' });
  } catch (error) {
    console.error('❌ Slack 연동 실패:', error);
    res.status(500).json({ error: '메시지 전송에 실패했습니다.' });
  }
});