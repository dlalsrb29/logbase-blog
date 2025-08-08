'use client';

import Link from 'next/link';
import { SITE_TITLE } from '@/consts';
import { useState } from 'react';
import InquiryForm from './InquiryForm';
import NewsletterModal from './NewsletterModal';
import LoginModal from './LoginModal';

export default function Header() {
  const [showInquiry, setShowInquiry] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

	<header id="header" data-controller="search" data-search-url-value="tv_search_inspiration" data-search-selected-type-value="inspiration">
		<div className="inner">
			<div className="c-header-main">
				<div className="header-main" data-search-target="headerMain">
					<div className="header-main__overlay " data-search-target="overlay" data-action="click->search#close"></div>
					<div className="header-main__container">
						<div className="header-main__hamburger" data-search-target="hamburger" data-action="click->search#toggleMobile">
							<svg className="ico-svg" viewBox="0 0 20 20" width="16">
								<use xlinkHref="/"></use>
							</svg>
          				</div>
						<a href="/" className="header-main__logo" aria-label="logbase">
							{/* 회사 로고 
							<svg width="30" height="16" viewBox="0 0 30 16"><path d="m18.4 0-2.803 10.855L12.951 0H9.34L6.693 10.855 3.892 0H0l5.012 15.812h3.425l2.708-10.228 2.709 10.228h3.425L22.29 0h-3.892ZM24.77 13.365c0 1.506 1.12 2.635 2.615 2.635C28.879 16 30 14.87 30 13.365c0-1.506-1.12-2.636-2.615-2.636s-2.615 1.13-2.615 2.636Z"></path></svg>
							 회사 로고 */}
							<span style={{
								fontSize: '24px',
								fontWeight: '700',
								fontFamily: 'Inter, sans-serif',
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								backgroundClip: 'text',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								letterSpacing: '-0.5px',
								textTransform: 'uppercase',
								position: 'relative',
								display: 'inline-block'
							}}>
								LOGBASE
							</span>
						</a>
						<nav className="nav-header-main" data-search-target="navHeaderMain">
							<ul className="nav-header-main__list">
								{/*
								<li className="nav-header-main__item has-dropdown">
									<span className="nav-header-main__link" data-search-target="eLinksDD" data-action="click->search#toggleDropdown">
										Explore
										<svg className="ico-svg nav-header-main__arrow" viewBox="0 0 20 20" width="8">
											<use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#arrow-dd"></use>
										</svg>
									</span>
									<div className="nav-header-main__dropdown">
										<div className="nav-header-main__content">
											<div className="search-inspiration">
												<nav className="search-inspiration__nav">
													<ul className="search-inspiration__menu">
														<li>
															<span className="search-inspiration__section" data-section="nav" data-search-target="navAwwards" data-action="click->search#doToogleTab">
																<svg className="ico-svg ico-svg search-inspiration__ico" viewBox="0 0 20 20" width="14">
																	<use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#wheat"></use>
																</svg>
																Awards
																<svg className="ico-svg search-inspiration__arrow" viewBox="0 0 20 20" width="8">
																	<use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#arrow-dd"></use>
																</svg>

															</span>
															<ul className="search-inspiration__list">
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/" data-count="25K">
																		<span>Honor Mentions</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/nominees/" data-count="48K">
																		<span>Nominees</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/sites_of_the_day/" data-count="6060">
																		<span>Sites of the Day</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/sites_of_the_month/" data-count="195">
																		<span>Sites of the Month</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/sites_of_the_year/" data-count="64">
																		<span>Sites of the Year</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/honors/winners" data-count="">
																		<span>Honors
																			<span className="budget-tag budget-tag--solid--black">New</span>
																		</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/winner-list/" data-count="">
																		<span>Most Awarded Profiles</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/jury/2025/" data-count="">
																		<span>Jury 2025</span>
																	</a>
																</li>
															</ul>
														</li>
														<li>
															<span className="search-inspiration__section" data-section="search" data-search-target="navTrending" data-action="click->search#doToogleTab">
																		<svg className="ico-svg ico-svg search-inspiration__ico" viewBox="0 0 20 20" width="14">
																			<use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#flame"></use>
																		</svg>
																			Trending
																		<svg className="ico-svg search-inspiration__arrow" viewBox="0 0 20 20" width="8">
																			<use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#arrow-dd"></use>
																		</svg>
															</span>
															<ul className="search-inspiration__list">
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/portfolio/" data-count="9080">
																		<span>Portfolio Websites</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/awwwards/collections/free-fonts/" data-count="288">
																		<span>Free fonts</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/animation/" data-count="10774">
																		<span>Animated websites</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/" data-count="6560">
																		<span>Sites of the Day</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/scrolling/" data-count="5558">
																		<span>Scrolling</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/single-page/" data-count="5494">
																		<span>One page design</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/ui-design/" data-count="6646">
																		<span>UI design</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/e-commerce/" data-count="6006">
																		<span>E-commerce layouts</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/architecture/" data-count="2806">
																		<span>Architecture websites</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/photography/" data-count="1450">
																		<span>Photography websites</span>
																	</a>
																</li>
															</ul>
														</li>
														<li>
															<span className="search-inspiration__section" data-search-target="eSection" data-action="click->search#doToogleTab">
																<svg className="ico-svg ico-svg search-inspiration__ico" viewBox="0 0 20 20" width="14">
																	<use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#geometric-1"></use>
																</svg>
																By Category
																<svg className="ico-svg search-inspiration__arrow" viewBox="0 0 20 20" width="8">
																	<use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#arrow-dd"></use>
																</svg>
															</span>
															<ul className="search-inspiration__list">
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/e-commerce/" data-count="6006">
																		<span>E-commerce</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/architecture/" data-count="2806">
																		<span>Architecture</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/hotel-restaurant/" data-count="2134">
																		<span>Restaurant & Hotel</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/design-agencies/" data-count="10806">
																		<span>Design Agencies</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/business-corporate/" data-count="10800">
																		<span>Business & Corporate</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/fashion/" data-count="3478">
																		<span>Fashion</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/mobile-apps/" data-count="2902">
																		<span>Mobile & Apps</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/interaction-design/" data-count="3022">
																		<span>Interaction Design</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/illustration/" data-count="3862">
																		<span>Illustration</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/header-design/" data-count="1366">
																		<span>Header Design</span>
																	</a>
																</li>
															</ul>
														</li>
														<li>
															<span className="search-inspiration__section" data-search-target="eSection" data-action="click->search#doToogleTab">
																<svg className="ico-svg ico-svg search-inspiration__ico" viewBox="0 0 20 20" width="14">
																	<use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#geometric-2"></use>
																</svg>
																By Technology
																<svg className="ico-svg search-inspiration__arrow" viewBox="0 0 20 20" width="8">
																	<use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#arrow-dd"></use>
																</svg>
															</span>
															<ul className="search-inspiration__list">
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/awwwards/collections/css-js-animations/" data-count="630">
																		<span>CSS animations</span>
																	</a>
																</li>
																	<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/wordpress/" data-count="10770">
																		<span>Wordpress</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/shopify/" data-count="706">
																		<span>Shopify</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/webgl/" data-count="3286">
																		<span>WebGL sites</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/react/" data-count="2102">
																		<span>React Websites</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/3d/" data-count="3542">
																		<span>3D websites</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/figma/" data-count="1910">
																		<span>Figma</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/gsap-animation/" data-count="4022">
																		<span>Gsap</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/framer-motion/" data-count="96">
																		<span>Framer</span>
																	</a>
																</li>
																<li>
																	<a className="search-inspiration__item" href="https://www.awwwards.com/websites/webflow/" data-count="1302">
																		<span>Webflow</span>
																	</a>
																</li>
															</ul>
														</li>
														<li>
															<a href="https://www.awwwards.com/collections/" className="search-inspiration__section">
																<svg className="ico-svg ico-svg search-inspiration__ico" viewBox="0 0 20 20" width="14">
																	<use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#geometric-3"></use>
																</svg>
																Collections
																<svg className="ico-svg search-inspiration__arrow" viewBox="0 0 20 20" width="8">
																	<use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#arrow-dd"></use>
																</svg>
															</a>
														</li>
														<li>
															<a href="https://www.awwwards.com/blog/" className="search-inspiration__section">
																<svg className="ico-svg ico-svg search-inspiration__ico" viewBox="0 0 20 20" width="14">
																	<use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#geometric-4"></use>
																</svg>
																Blog
															</a>
														</li>
													</ul>
												</nav>
												<div className="search-inspiration__searching" data-search-target="autocompleteView">
													<div data-search-target="autocompleteTagsContainer">
														<ul className="search-inspiration__list" data-search-target="autocompleteTags"></ul>
													</div>
													<div data-search-target="autocompleteUsersContainer">
														<ul className="search-inspiration__list" data-search-target="autocompleteUsers"></ul>
													</div>
												</div>
											</div>
										</div>
									</div>
								</li>*/}
								<li className="nav-header-main__item">
									<a className="nav-header-main__link" href="/">HOME</a>
								</li>
								<li className="nav-header-main__item">
									<a className="nav-header-main__link" href="/rss-feed">DATA INSIGHTS</a>
								</li>
								<li className="nav-header-main__item">
									<a className="nav-header-main__link" href="/newsletter">NEWS LETTER</a>
								</li>
								{/*
								<li className="nav-header-main__item">
									<a className="nav-header-main__link" href="https://www.awwwards.com/academy/">
										Academy<span className="budget-tag budget-tag--small--solid--black anim-shiny"><span>New</span></span>
									</a>
								</li>
								<li className="nav-header-main__item">
									<a className="nav-header-main__link" href="https://www.awwwards.com/jobs/">
										Jobs
									</a>
								</li>
								<li className="nav-header-main__item">
									<a className="nav-header-main__link" href="https://www.awwwards.com/market/">
										Market
									</a>
								</li>
								*/}
							</ul>
							{/*
							<ul className="nav-header-main__social">
								<li>
									<a href="https://www.facebook.com/awwwards" target="_blank">
										<svg className="ico-svg" viewBox="0 0 20 20" width="20">
											<use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#facebook"></use>
										</svg>
									</a>
								</li>
								<li>
									<a href="https://www.instagram.com/awwwards" target="_blank">
										<svg className="ico-svg" viewBox="0 0 20 20" width="20">
											<use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#instagram"></use>
										</svg>
									</a>
								</li>
								<li>
									<a href="https://twitter.com/awwwards" target="_blank">
										<svg className="ico-svg" viewBox="0 0 20 20" width="20">
											<use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#twitter"></use>
              							</svg>
									</a>
								</li>
								<li>
									<a href="https://www.instagram.com/awwwards" target="_blank">
										<svg className="ico-svg" viewBox="0 0 20 20" width="20">
											<use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#instagram"></use>
										</svg>
									</a>
								</li>
								<li>
									<a href="https://www.youtube.com/awwwardstv" target="_blank">
										<svg className="ico-svg" viewBox="0 0 20 20" width="20">
											<use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#youtube"></use>
										</svg>
									</a>
								</li>
								<li>
									<a href="https://www.tiktok.com/@awwwards.com" className="tiktok">
										<svg className="ico-svg" viewBox="0 0 20 20" width="20">
											<use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#tiktok"></use>
										</svg>
									</a>
								</li>
							</ul>
							*/}
						</nav>
						<div className="header-main__search">
							<div className="search-form">
								<div className="search-form__field">
									<button type="submit" className="search-form__button" aria-label="Search">
										<svg className="ico-svg" viewBox="0 0 20 20" width="14">
											<use xlinkHref="/"></use>
										</svg>
									</button>
									<input type="text" placeholder="Search by Inspiration" className="search-form__input " data-action="focus->search#show keyup->search#search" data-search-target="input" />
								</div>
							</div>
						</div>
						<div className="header-main__right">
							<div className="header-main__user">
								<strong className="header-main__link hidden-sm" onClick={() => setShowLogin(true)}>Log in</strong>
								{/*<strong className="header-main__link hidden-sm" data-controller="login" data-action="click->login#register">Sign Up</strong>*/}
								<span className="header-main__ico" onClick={() => setShowLogin(true)}>
									<svg className="ico-svg" viewBox="0 0 20 20" width="20">
										<use xlinkHref="/"></use>
									</svg>
								</span>
								<div id="g_id_onload" data-client_id="67367874134-drekvs51ripc1p92r1hpcntjk1jfmqka.apps.googleusercontent.com" data-login_uri="https://www.awwwards.com/login-google-one-tap" data-_destination="/pro">
								</div>
							</div>

							<div className="header-main__bts">
								<a href="#" className="button button--small--rounded" onClick={() => setShowNewsletter(true)}>뉴스레터 신청</a>
								<a href="#" className="button button--small--outline--rounded" onClick={() => setShowInquiry(true)}>문의하기</a>
								<a href="#" className="button button--small--rounded" onClick={() => handleRssClick()}>RSS 수집</a>
							</div>
						</div>
					</div>
				</div>
			</div>
          </div>
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

      {/* 모달 컴포넌트들 */}
      <NewsletterModal 
        show={showNewsletter} 
        onClose={() => setShowNewsletter(false)} 
      />
      
      <InquiryForm 
        show={showInquiry} 
        onClose={() => setShowInquiry(false)} 
      />
      
      <LoginModal 
        show={showLogin} 
        onClose={() => setShowLogin(false)} 
      />
    </>
  );
} 