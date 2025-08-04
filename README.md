# Logbase Blog - Next.js Version

This is a Next.js version of the Logbase Blog project. The UI has been migrated from Astro to Next.js while maintaining the same design and functionality.

## Features

- 📡 RSS Feed Collection and Migration
- 📧 Newsletter Subscription
- 📝 Contact Form
- 📱 Responsive Design
- 🔥 Firebase Firestore Integration

## RSS Data Migration

This project includes functionality to parse RSS JSON files from the previous Astro project and store them in Firebase Firestore.

### Setup

1. **Firebase Configuration**
   Create a `.env.local` file in the root directory with your Firebase configuration:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
   ```

2. **Slack Incoming Webhook 설정**
   - Slack 워크스페이스에서 "Incoming Webhooks" 앱을 설치
   - 새로운 웹훅 생성 (채널 선택)
   - 생성된 웹훅 URL을 `SLACK_WEBHOOK_URL` 환경변수에 설정

3. **RSS JSON Files**
   Ensure your RSS JSON files are located in `../logbase-blog-astro/public/rss/` directory.

### Usage

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Access the RSS Feed page:**
   Navigate to `/rss-feed` to view the RSS migration interface.

3. **Migrate RSS Data:**
   - Click the "RSS 데이터 마이그레이션" button to parse and store all RSS JSON files in Firestore
   - Use the blog filter to view RSS items from specific blogs
   - View RSS items with their metadata, keywords, and categories

### API Endpoints

#### RSS 관련
- `POST /api/rss-collect` - RSS 피드 수집 및 Firestore 저장
- `GET /api/rss-check-today` - 오늘 수집된 데이터 확인
- `POST /api/rss-delete-today` - 오늘 수집된 데이터 삭제
- `POST /api/rss-migrate` - RSS JSON 파일을 Firestore로 마이그레이션
- `GET /api/rss-migrate` - Firestore에서 RSS 아이템 조회
  - Query parameters:
    - `blogName` (optional) - 특정 블로그 필터
    - `limit` (optional) - 조회할 아이템 수 (기본값: 50)

#### 문의하기
- `POST /api/contact-to-slack` - 문의 폼 데이터를 Slack으로 전송

#### 뉴스레터
- `POST /api/newsletter-to-slack` - 뉴스레터 신청 데이터를 Slack으로 전송 및 Firestore 저장
- `GET /api/newsletter-list` - 뉴스레터 목록 조회
- `POST /api/newsletter-create` - 새 뉴스레터 생성 (HTML + JSON)
- `GET /api/newsletter-get/[filename]` - 특정 뉴스레터 조회
- `PUT /api/newsletter-update/[filename]` - 뉴스레터 수정
- `POST /api/newsletter-delete` - 뉴스레터 삭제
- `GET /api/newsletter-recipients` - 뉴스레터 수신자 목록 조회

### Data Structure

RSS items are stored in Firestore with the following structure:

```typescript
interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  content?: string;
  contentSnippet?: string;
  guid: string;
  isoDate: string;
  blogName: string;
  feedType: 'competitor' | 'noncompetitor';
  matchedKeywords: string[];
  creator?: string;
  categories?: string[];
  news_letter_sent_date?: string;
  collectedDate?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
