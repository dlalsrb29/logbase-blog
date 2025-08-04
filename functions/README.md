# RSS 자동 수집 기능

## 개요
Firebase Cloud Functions를 사용하여 RSS 피드를 자동으로 수집하는 기능입니다.

## 기능
- **자동 스케줄링**: 매일 오전 6시에 자동 실행 (한국시간 기준)
- **Slack 알림**: 수집 완료 시 Slack으로 결과 알림
- **수동 실행**: HTTP API를 통한 수동 실행 가능
- **중복 방지**: 같은 날 이미 수집된 데이터는 건너뛰기

## 설정 방법

### 1. 환경 변수 설정
Firebase Functions에 다음 환경 변수를 설정하세요:

```bash
# Slack Webhook URL 설정
firebase functions:config:set slack.webhook_url="https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"

# RSS 수집 API 키 설정 (선택사항)
firebase functions:config:set rss.api_key="your-secret-api-key-here"
```

### 2. Slack Webhook 설정
1. Slack 워크스페이스에서 앱 생성
2. Incoming Webhooks 활성화
3. Webhook URL 복사하여 환경 변수에 설정

### 3. 배포
```bash
# Functions 배포
firebase deploy --only functions

# 또는 전체 배포
npm run deploy
```

## 사용 방법

### 자동 실행
- 매일 오전 6시에 자동으로 실행됩니다 (한국시간 기준)
- 실행 결과는 Slack으로 알림이 전송됩니다

### 수동 실행
HTTP API를 통해 수동으로 실행할 수 있습니다:

```bash
# Firebase Functions 직접 호출
curl -X POST https://asia-northeast3-logbase-blog-83db6.cloudfunctions.net/collectRSS \
  -H "Content-Type: application/json"

# 또는 Next.js API 호출  
curl -X POST https://logbase-blog-83db6.web.app/api/rss-collect \
  -H "Content-Type: application/json"
```

## 모니터링
- Firebase Console > Functions에서 실행 로그 확인
- Slack 알림으로 수집 결과 확인
- 에러 발생 시 Slack으로 에러 알림 전송

## 스케줄 변경
`index.js` 파일에서 cron 표현식을 수정하여 스케줄을 변경할 수 있습니다:

```javascript
// 현재: 매일 오전 6시 (한국시간)
schedule: '0 6 * * *'

// 예시:
// 매일 오후 6시: '0 18 * * *'
// 매주 월요일 오전 6시: '0 6 * * 1'
// 매시간: '0 * * * *'
``` 