'use client';

import Link from 'next/link';
import { SITE_TITLE } from '@/consts';

export default function Header() {
  const handleRssClick = async () => {
    let isCollecting = false;
    let completeTimeout: ReturnType<typeof setTimeout> | null = null;

    if (isCollecting) {
      console.log('이미 수집 중입니다.');
      return;
    }
    isCollecting = true;

    try {
      // 로딩 화면 표시
      const loadingScreen = document.getElementById('globalLoadingScreen');
      const progressBar = document.getElementById('globalProgressBar');
      const statusMessage = document.getElementById('globalStatusMessage');
      const progressText = document.getElementById('globalProgressText');
      const completeMessage = document.getElementById('globalCompleteMessage');
      const completeText = document.getElementById('globalCompleteText');
      const completeBtn = document.getElementById('globalCompleteBtn');

      if (!loadingScreen || !progressBar || !statusMessage || !progressText || !completeMessage || !completeText || !completeBtn) {
        console.error('필요한 DOM 요소를 찾을 수 없습니다.');
        isCollecting = false;
        return;
      }

      console.log('로딩 화면 표시 시작');
      loadingScreen.style.display = 'flex';
      completeMessage.style.display = 'none';

      // 진행률 애니메이션
      let progress = 0;
      const progressInterval = setInterval(() => {
        if (progress < 90) {
          progress += Math.random() * 10;
          progressBar.style.width = progress + '%';
          progressText.textContent = Math.round(progress) + '%';
        }
      }, 500);

      // 상태 메시지 애니메이션
      const statusMessages = [
        'RSS 피드 목록 확인 중...',
        '네트워크 연결 확인 중...',
        '기존 데이터 확인 중...',
        '데이터 수집 시작...',
        '경쟁사 피드 처리 중...',
        '비경쟁사 피드 처리 중...',
        '키워드 필터링 적용 중...',
        '날짜 필터링 적용 중...',
        'Firestore 저장 중...',
        '완료 처리 중...'
      ];

      let statusIndex = 0;
      const statusInterval = setInterval(() => {
        if (statusIndex < statusMessages.length) {
          statusMessage.textContent = statusMessages[statusIndex];
          statusIndex++;
        }
      }, 1000);

      const closeProgressAndGo = () => {
        loadingScreen.style.display = 'none';
        window.location.href = '/rss-feed';
        isCollecting = false;
      };

      // 기존 데이터 확인
      console.log('기존 데이터 확인 시작');
      statusMessage.textContent = '기존 데이터 확인 중...';
      const check = await fetch('/api/rss-check-today');
      const { exists } = await check.json();
      
      if (exists) {
        if (!confirm('오늘 수집한 데이터가 있습니다. 오늘 수집한 데이터를 삭제하고 다시 수집하시겠습니까?')) {
          clearInterval(progressInterval);
          clearInterval(statusInterval);
          loadingScreen.style.display = 'none';
          isCollecting = false;
          return;
        }
        statusMessage.textContent = '기존 데이터 삭제 중...';
        await fetch('/api/rss-delete-today', { method: 'POST' });
      }

      // RSS 데이터 수집 실행
      statusMessage.textContent = 'RSS 피드 수집 중...';
      const response = await fetch('/api/rss-collect', {
        method: 'POST'
      });
      
      const result = await response.json();
      console.log('수집 완료:', result);
      
      clearInterval(progressInterval);
      clearInterval(statusInterval);
      progressBar.style.width = '100%';
      progressText.textContent = '100%';
      statusMessage.textContent = '수집 완료!';
      
      // 완료 메시지 및 확인 버튼 표시
      completeText.textContent = result.message;
      completeMessage.style.display = 'block';
      
      // 3초 후 자동 닫힘
      if (completeTimeout) clearTimeout(completeTimeout);
      completeTimeout = setTimeout(() => {
        closeProgressAndGo();
      }, 3000);
      
      // 확인 버튼 클릭 시 즉시 닫힘
      completeBtn.onclick = () => {
        if (completeTimeout) clearTimeout(completeTimeout);
        closeProgressAndGo();
      };

    } catch (error) {
      console.error('RSS 수집 중 오류:', error);
      
      // 에러 메시지 표시
      const completeText = document.getElementById('globalCompleteText');
      const completeBtn = document.getElementById('globalCompleteBtn');
      const completeMessage = document.getElementById('globalCompleteMessage');
      
      if (completeText) completeText.textContent = `오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`;
      if (completeMessage) completeMessage.style.display = 'block';
      
      if (completeBtn) {
        completeBtn.onclick = () => {
          const loadingScreen = document.getElementById('globalLoadingScreen');
          if (loadingScreen) loadingScreen.style.display = 'none';
        };
      }
    } finally {
      isCollecting = false;
    }
  };

  return (
    <>
      <header>
        <nav>
          {/* 사이트 로고 (좌측) */}
          <h2><Link href="/">{SITE_TITLE}</Link></h2>
          
          {/* 내부 페이지 이동 링크 (가운데) */}
          <div className="internal-links">
            <Link href="/">Home</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/about">About</Link>
            <Link href="/rss-feed">RSS-FEED</Link>
            <Link href="/newsletter">NEWS-LETTER</Link>
          </div>
          
          {/* 소셜/외부 링크 및 RSS 저장 버튼 (우측) */}
          <div className="social-links">
            {/* RSS 아이콘 버튼 */}
            <button
              type="button"
              id="rssButton"
              aria-label="RSS Feed"
              onClick={handleRssClick}
            >
              <span className="sr-only">RSS Feed</span>
              {/* RSS 아이콘 (SVG) */}
              <svg viewBox="0 0 24 24" aria-hidden="true" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 11a9 9 0 0 1 9 9"/>
                <path d="M4 4a16 16 0 0 1 16 16"/>
                <circle cx="5" cy="19" r="1"/>
              </svg>
            </button>
            
            {/* Mastodon(웹투) 아이콘 링크 */}
            <a href="https://m.webtoo.ls/@astro" target="_blank" rel="noopener noreferrer">
              <span className="sr-only">Follow Astro on Mastodon</span>
              {/* Mastodon 아이콘 (SVG) */}
              <svg viewBox="0 0 16 16" aria-hidden="true" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M11.19 12.195c2.016-.24 3.77-1.475 3.99-2.603.348-1.778.32-4.339.32-4.339 0-3.47-2.286-4.488-2.286-4.488C12.062.238 10.083.017 8.027 0h-.05C5.92.017 3.942.238 2.79.765c0 0-2.285 1.017-2.285 4.488l-.002.662c-.004.64-.007 1.35.011 2.091.083 3.394.626 6.74 3.78 7.57 1.454.383 2.703.463 3.709.408 1.823-.1 2.847-.647 2.847-.647l-.06-1.317s-1.303.41-2.767.36c-1.45-.05-2.98-.156-3.215-1.928a3.614 3.614 0 0 1-.033-.496s1.424.346 3.228.428c1.103.05 2.137-.064 3.188-.189zm1.613-2.47H11.13v-4.08c0-.859-.364-1.295-1.091-1.295-.804 0-1.207.517-1.207 1.541v2.233H7.168V5.89c0-1.024-.403-1.541-1.207-1.541-.727 0-1.091.436-1.091 1.296v4.079H3.197V5.522c0-.859.22-1.541.66-2.046.456-.505 1.052-.764 1.793-.764.856 0 1.504.328 1.933.983L8 4.39l.417-.695c.429-.655 1.077-.983 1.934-.983.74 0 1.336.259 1.791.764.442.505.661 1.187.661 2.046v4.203z"
                />
              </svg>
            </a>
            
            {/* Twitter 아이콘 링크 */}
            <a href="https://twitter.com/astrodotbuild" target="_blank" rel="noopener noreferrer">
              <span className="sr-only">Follow Astro on Twitter</span>
              {/* Twitter 아이콘 (SVG) */}
              <svg viewBox="0 0 16 16" aria-hidden="true" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"
                />
              </svg>
            </a>
            
            {/* GitHub 아이콘 링크 */}
            <a href="https://github.com/withastro/astro" target="_blank" rel="noopener noreferrer">
              <span className="sr-only">Go to Astro&apos;s GitHub repo</span>
              {/* GitHub 아이콘 (SVG) */}
              <svg viewBox="0 0 16 16" aria-hidden="true" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                />
              </svg>
            </a>
          </div>
        </nav>
      </header>

      {/* 전역 로딩 화면 (RSS 수집 시에만 표시) */}
      <div id="globalLoadingScreen" className="global-loading-screen">
        <div className="loading-content">
          <div className="loading-title">📡 RSS 피드 수집 중...</div>
          <div className="loading-description">데이터를 수집하고 있습니다. 잠시만 기다려주세요.</div>
          {/* 프로그레스 바 */}
          <div className="progress-container">
            <div id="globalProgressBar" className="progress-bar"></div>
          </div>
          {/* 상태 메시지 */}
          <div id="globalStatusMessage" className="status-message">
            초기화 중...
          </div>
          {/* 진행률 */}
          <div id="globalProgressText" className="progress-text">
            0%
          </div>
          {/* 수집 완료 메시지 및 확인 버튼 (동적으로 표시) */}
          <div id="globalCompleteMessage" className="complete-message">
            <div id="globalCompleteText" className="complete-text"></div>
            <button id="globalCompleteBtn" className="complete-btn">확인</button>
          </div>
        </div>
      </div>

      {/* ESC 키 이벤트 리스너 */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            let isCollecting = false;
            
            // ESC 키로 로딩 화면 닫기 (긴급 시)
            document.addEventListener('keydown', function(event) {
              if (event.key === 'Escape' && isCollecting) {
                const loadingScreen = document.getElementById('globalLoadingScreen');
                if (loadingScreen) {
                  loadingScreen.style.display = 'none';
                  isCollecting = false;
                }
              }
            });
          `
        }}
      />
    </>
  );
} 