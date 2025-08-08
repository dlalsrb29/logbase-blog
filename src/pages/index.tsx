import Link from 'next/link';
import Head from 'next/head';
import { SITE_TITLE } from '@/consts';
import { useState } from 'react';

export default function HomePage() {
  const [billingType, setBillingType] = useState<'monthly' | 'yearly'>('yearly');

  return (
    <>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta name="description" content="The ultimate platform for RSS feed collection and newsletter management" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.svg" />
      </Head>
      
      <section id="content">

        {/* 메인 블럭 start */}
        <div className="anchor-section" id="intro">

            {/* main 문구, 이미지, Professional Plans 텍스트 블럭 start */}
            <div className="block">
                <div className="inner">

                    {/* main 문구 */}
                    <div className="c-heading text-center">
                        <div className="c-heading__top">
                            {/* <h2 className="text-default">Business</h2> */}
                        </div>
                        <div className="c-heading__middle">
                            <h3 className="heading-3">
                            Become a Logbase Partner & Join the Community
                            </h3>
                        </div>
                    </div>

                    {/* main 이미지
                    <div className="text-center">
                        <img src="/images/main-bg-1.png" alt="" />
                    </div>
                     */}

                    {/* <div className="box-feature box-feature--s2--right--dark is-double"> */}
                    <div className="box-feature box-feature--s2--dark is-double">
                        <div className="box-feature__info">
                            <h3 className="heading-5 box-feature__title" style={{ color: 'white' }}>행동과 데이터, 그리고 성장을 한 곳에 - Logbase와 나만의 가치를 드러내고 새로운 협업을 경험하세요.</h3>
                            <p>
                                1.나의 기록은 곧 나의 성장 - Logbase와 시작하세요.<br />
                                2.행동데이터로 나의 고객을 이해하고 증명하며, Logbase와 함께 성장하세요.<br />
                                3.ILOG로 시작하는 데이터 여정 - 성과와 가치를 모두 연결합니다.<br />  
                            </p>
                        </div>
                        <div className="box-feature__photo">
                            {/* 메인 비디오 */}
                            <video
                            src="/images/background.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="rounded-xl shadow-lg object-cover object-top"
                            />
                        </div>
                    </div>

                    {/* Professional Plans 텍스트 */}
                    <div className="l-2cols">
                        <div className="l-2cols__col l-2cols__col--large">
                            <div className="c-heading c-heading--small">
                                <div className="c-heading__top">
                                <h2 className="text-default">Professional Plans</h2>
          </div>
                                <div className="c-heading__middle">
                                    <h3 className="heading-5 l-2cols__title">A necessary investment for your studio or your personal brand.</h3>
                                </div>
                            </div>
                        </div>

                        <div className="l-2cols__col">
                            <p className="hidden-lg">&nbsp;</p>
                            <p><strong>Awwwards is the ideal showcase for your business or personal brand, a trusted directory where millions of users visit every year, looking for professionals to make their digital vision become a reality.</strong></p>
                            <p>Your presence in our Directory will get you unparalleled visibility, recognition and leads for your business.<br /></p>
                        </div>
                    </div>

                </div>
            </div>
            {/* main 문구, 이미지, Professional Plans 텍스트 블럭 end */}


            {/* 플랜 테이블 블럭 start
            <div className="block" id="plans-tables">
                <div className="inner">

                    {/* 플랜 테이블 헤더
                    <div className="p-heading">
                        <div className="p-heading__col">
                            <span className="text-medium">Find the best plan for you or your agency</span>
                        </div>
                        <div className="p-heading__col p-heading__col--bottom">
                            <div className="c-toggle">
                                <div className="c-toggle__col">
                                    <strong>Billed monthly</strong>
                                </div>
                                <div className="c-toggle__col">
                                    <div className="check-toggle" data-controller="change-plan">
                                        <input id="be_pro_plan" className="" type="checkbox" defaultChecked={true} data-action="change-&gt;change-plan#change" />
                                        <label className="check-toggle__label" htmlFor="be_pro_plan">
                                            <span className="check-toggle__ball"></span>
                                        </label>
                                    </div>
                                </div>
                                <div className="c-toggle__col">
                                    <strong>Billed annually</strong>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* 플랜 테이블 내용  
                    <div className="plans plans--small">

                        {/* 플랜 테이블 내용 1 BASIC Plan
                        <div className="plan__col">
                            <div className="plan plan--small is-dark">
                                <div className="plan__inner">
                                    <div className="plan__header">
                                        <div className="plan__title">
                                        BASIC Plan
                                        </div>
                                        <div className="plan__amount js-price-plan" data-controller="show-plan" data-show-plan-annually-value="$6.7" data-show-plan-monthly-value="$15" data-show-plan-annually-without-discount-value="$6.7" data-show-plan-monthly-without-discount-value="$15">
                                            <span className="plan__price">
                                                <strong data-show-plan-target="price">6.7</strong>
                                                <sup>
                                                $
                                                <span className="text-red text-strikethrough is-hidden" data-show-plan-target="priceWithoutDiscount"></span>
                                                </sup>
                                            </span>
                                            /
                                            <span data-show-plan-target="period">month</span>
                                            <div className="plan__discounts" data-show-plan-target="discount">
                                                <span>Billed annually you</span>
                                                <div className="plan__budgets">
                                                    <span className="budget-tag budget-tag--solid--red">save $96</span> <span className="budget-tag budget-tag--solid--yellow">-58%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="plan__desc">
                                        Ideal for freelancers, independent professionals and entrepreneurs.
                                    </div>
                                    <div className="plan__footer">
                                        <a href="https://www.awwwards.com/plans/basic-plan" className="button button--medium--outline--white--rounded">Select Basic</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 플랜 테이블 내용 2 PROFESSIONAL Plan
                        <div className="plan__col">
                            <div className="plan plan--small is-dark is-main">
                                <div className="plan__inner">
                                    <div className="plan__budget">
                                        <span className="plan__tag budget-tag uppercase text-uppercase">Recommended</span>
                                    </div>
                                    <div className="plan__header">
                                        <div className="plan__title">
                                            PROFESSIONAL Plan
                                        </div>
                                        <div className="plan__amount js-price-plan" data-controller="show-plan" data-show-plan-annually-value="$13.8" data-show-plan-monthly-value="$26" data-show-plan-annually-without-discount-value="$13.8" data-show-plan-monthly-without-discount-value="$26">
                                            <span className="plan__price">
                                                <strong data-show-plan-target="price">13.8</strong>
                                                <sup>
                                                    $
                                                    <span className="text-red text-strikethrough is-hidden" data-show-plan-target="priceWithoutDiscount">
                                                    </span>
                                                </sup>
                                            </span>
                                            /
                                            <span data-show-plan-target="period">month</span>
                                            <div className="plan__discounts" data-show-plan-target="discount">
                                                <span>Billed annually you</span>
                                                    <div className="plan__budgets">
                                                        <span className="budget-tag budget-tag--solid--red">save $144</span> <span className="budget-tag budget-tag--solid--yellow">-58%</span>
                                                    </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="plan__desc">
                                        The gold standard investment for all agencies and studios.
                                    </div>
                                    <div className="plan__footer">
                                        <a href="https://www.awwwards.com/plans/professional-plan" className="button button--medium--outline--white--rounded">Select Professional</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 플랜 테이블 내용 3 INTERNATIONAL Plan
                        <div className="plan__col">
                            <div className="plan plan--small">
                                <div className="plan__inner">
                                    <div className="plan__header">
                                        <div className="plan__title">
                                            INTERNATIONAL Plan
                                        </div>
                                        <div className="plan__amount js-price-plan" data-controller="show-plan" data-show-plan-annually-value="$324" data-show-plan-monthly-value="$555" data-show-plan-annually-without-discount-value="$324" data-show-plan-monthly-without-discount-value="$555">
                                            <span className="plan__price">
                                                <strong data-show-plan-target="price">324</strong>
                                                <sup>
                                                    $
                                                    <span className="text-red text-strikethrough is-hidden" data-show-plan-target="priceWithoutDiscount">
                                                        
                                                    </span>
                                                </sup>
                                            </span>
                                            /
                                            <span data-show-plan-target="period">month</span>
                                            <div className="plan__discounts" data-show-plan-target="discount">
                                                <span>Billed annually you</span>
                                                <div className="plan__budgets">
                                                    <span className="budget-tag budget-tag--solid--red">save $2772</span> <span className="budget-tag budget-tag--solid--yellow">-58%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="plan__desc">
                                        The crème de la crème - high impact visibility for bold industry leaders.
                                    </div>
                                    <div className="plan__footer">
                                        <a href="https://www.awwwards.com/plans/international-plan" className="button button--medium--outline--rounded">Select International</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>


                    {/* 플랜 테이블 하단 버튼
                    <div className="c-view-all">
                        <div className="c-view-all__row text-medium">
                            <span>Want more info about our plans?</span>
                            <a href="https://www.awwwards.com/pro#price-table" className="bt-ico-left">
                                <svg className="ico-svg" viewBox="0 0 20 20" width="16">
                                <path d="M10 3L17 10L10 17" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <strong className="link-underlined">Compare Plans</strong>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
            플랜 테이블 블럭 end */}

        </div>
        {/* 메인 블럭 end */}



        {/* 피처 블럭 start */}
        <div className="anchor-section" id="features">
            <div className="block">
                <div className="inner">

                    {/* 피처 헤더 */}
                    <div className="c-heading text-center">
                        <div className="c-heading__top">
                            <h2 className="text-default">What you'll get </h2>
                        </div>
                        <div className="c-heading__middle">
                            <h3 className="heading-1">ALL<br />FEATURES</h3>
                        </div>
                        <div className="c-heading__bottom">
                            <div className="c-heading__short-desc">
                                <span>Check out some of the top features you'll enjoy as a Pro Member.</span>
                            </div>
                        </div>
                    </div>

                    {/* 피처 내용 */}
                    <div className="grid-features">
                        {/* 피처 내용 1
                        <div className="box-feature">
                            <div className="box-feature__info">
                                <h3 className="heading-5 box-feature__title">Company Showcase</h3>
                                <p>Add a comprehensive showcase of your work, including projects not submitted, through galleries, videos and photos.</p>
                            </div>
                            <div className="box-feature__photo">
                                <img src="/images/img-2.png" alt="" />
                            </div>
                        </div>
                        */}
                        {/* 피처 내용 2
                        <div className="box-feature">
                            <div className="box-feature__info">
                                <h3 className="heading-5 box-feature__title">Professional Mood boards </h3>
                                <p>A handy tool to curate mood boards of the elements that inspire you and share them with your team and clients.</p>
                            </div>
                            <div className="box-feature__photo">
                                <img src="/images/img-3.png" alt="" />
                            </div>
                        </div>
                        */}
                        {/* 피처 내용 3 */}
                        <div className="box-feature box-feature--s2--right--dark is-double">
                            <div className="box-feature__info">
                                <h3 className="heading-5 box-feature__title">New Improved w. Profile Page.</h3>
                                <p>Make your profile page stand out from the crowd, highlight your submissions and other projects, and encourage even more interactions with your brand.</p>
                            </div>
                            <div className="box-feature__photo">
                                <img src="/images/main-bg-2.png" alt="" />
                            </div>
                        </div>


                        {/* 피처 내용 4
                        <div className="box-feature">
                            <div className="box-feature__info">
                                <h3 className="heading-5 box-feature__title">Reviews of your company (coming soon)</h3>
                                <p>Show off great feedback from your clients or users for your business or profile, by activating the reviews option.</p>
                            </div>
                            <div className="box-feature__photo">
                                <img src="/images/img-4.png" alt="" />
                            </div>
                        </div>
                        */}
                        {/* 피처 내용 5
                        <div className="box-feature">
                            <div className="box-feature__info">
                                <h3 className="heading-5 box-feature__title">Hire Me Button</h3>
                                <p>Available for work? Activate the "Hire Me" button for instant job offers. </p>
                            </div>
                            <div className="box-feature__photo">
                                <img src="/images/img-5.png" alt="" />
                            </div>
                        </div>
                        */}
                        {/* 피처 내용 6
                        <div className="box-feature box-feature--s2--dark--left is-double">
                            <div className="box-feature__info">
                                <h3 className="heading-5 box-feature__title">Access to exclusive content.</h3>
                                <p>Enjoy promotions, exclusive content such as digital books, articles and discounts on conferences and products.</p>
                            </div>
                            <div className="box-feature__photo">
                                <img src="/images/bg-2.png" alt="" />
                            </div>
                        </div>
                        */}
                        {/* 피처 내용 7
                        <div className="box-feature">
                            <div className="box-feature__info">
                                <h3 className="heading-5 box-feature__title">Add Collaborators</h3>
                                <p>Add your team to your submissions, and share recognition for the hard work with all the collaborators.</p>
                            </div>
                            <div className="box-feature__photo">
                                <img src="/images/img-7.png" alt="" />
                            </div>
                        </div>
                        */}
                    </div>

                    {/* 피처 하단 버튼
                    <div className="c-view-all">
                      <div className="c-view-all__row text-medium">
                        <span>Many more improved features are coming soon.</span>
                      </div>
                    </div>
                    */}
                </div>
            </div>
        </div>

        {/* 플랜 테이블 블럭 start
        <div className="anchor-section" id="pro-member">
            <div className="block">
                <div className="inner">
                    <div className="c-heading text-center">
                        <div className="c-heading__top">
                            <h2 className="text-default">Basic Plan</h2>
                        </div>
                        <div className="c-heading__middle">
                            <h3 className="heading-1">BASIC<br />MEMBER</h3>
                        </div>
                        <div className="c-heading__bottom">
                            <div className="c-heading__short-desc">
                                <span>Invest in your personal brand and grow with us and the w.community.</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid-features" id="member-features">
                        <div className="box-feature box-feature--s2--right--dark is-double">
                            <div className="box-feature__info">
                                <h3 className="heading-5 box-feature__title">Plan for individual professionals and freelancers.</h3>
                                <p>If you are a freelance designer, developer or entrepreneur, this is the plan for you.</p>
                            </div>
                            <div className="star-price star-price--large">
                                <div className="star-price__wrap">
                                                                    <div className="star-price__price--large">15<small>$</small></div>
                                    <div className="star-price__label--small text-uppercase">Month</div>
                                </div>
                                <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 37.4911C9.26197 35.3577 17.8554 30.8883 24.4807 24.4808C30.8882 17.8554 35.3578 9.26197 37.4911 0C45.5512 5.04038 54.7831 7.95493 64 8.11268C73.2169 7.95493 82.4488 5.04038 90.5089 0C92.6422 9.26197 97.1117 17.8554 103.519 24.4808C110.145 30.8883 118.738 35.3577 128 37.4911C122.96 45.5512 120.045 54.7831 119.887 64C120.045 73.2169 122.96 82.4488 128 90.5089C118.738 92.6423 110.145 97.1117 103.519 103.519C97.1117 110.145 92.6422 118.738 90.5089 128C82.4488 122.96 73.2169 120.045 64 119.887C54.7831 120.045 45.5512 122.96 37.4911 128C35.3578 118.738 30.8882 110.145 24.4807 103.519C17.8554 97.1117 9.26197 92.6423 0 90.5089C5.04037 82.4488 7.95497 73.2169 8.11271 64C7.95497 54.7831 5.04037 45.5512 0 37.4911Z" fill="#FFF083"></path>
                                </svg>
                            </div>
                            <div className="box-feature__photo">
                                <img src="/images/bg-3.png" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="l-2cols">
                        <div className="l-2cols__col">
                            <div className="l-2cols__desc">
                                <p><strong>YOU are your USP, so make your profile shine bright like a diamond!.</strong></p>
                                <p>As well as an eye-catching profile which showcases your assets, your Pro Plan gives you the following features whether you are a member of a team or a freelancer.</p>
                            </div>
                        </div>
                        <div className="l-2cols__col l-2cols__col--large">
                            <ul className="list-features">
                                    <li>
                                        <div className="list-features__content">
                                            <p>        <svg className="ico-svg" viewBox="0 0 20 20" width="32">
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" fill="currentColor"/>
        </svg>
    </p>
                                            <p><strong>Add Collaborators</strong></p>
                                            <p>Add your team to your submissions, and share recognition for the hard work with all the collaborators.</p>
      </div>
                                    </li>
                                    <li>
                                        <div className="list-features__content">
                                            <p>        <svg className="ico-svg" viewBox="0 0 20 20" width="32">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" fill="currentColor"/>
        </svg>
    </p>
                                            <p><strong>Moodboard Tool (soon)</strong></p>
                                            <p>Access to the new tool for professionals, awwwards moodboards.</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="list-features__content">
                                            <p>        <svg className="ico-svg" viewBox="0 0 20 20" width="32">
            <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#mail"></use>
        </svg>
    </p>
                                            <p><strong>Email assistant</strong></p>
                                            <p>Direct contact with the awwwards team for all your questions.</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="list-features__content">
                                            <p>        <svg className="ico-svg" viewBox="0 0 20 20" width="32">
            <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#discount"></use>
        </svg>
    </p>
                                            <p><strong>Discounts &amp; Exclusive Content</strong></p>
                                            <p>Enjoy discounts, promotions and offers on all our products and conferences, as well as access to exclusive content.</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="list-features__content">
                                            <p>        <svg className="ico-svg" viewBox="0 0 20 20" width="32">
            <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#directory"></use>
        </svg>
    </p>
                                            <p><strong>Professional Directory</strong></p>
                                            <p>Be in our professional Directory, the first place companies come to find employees in the digital design industry.</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="list-features__content">
                                            <p>        <svg className="ico-svg" viewBox="0 0 20 20" width="32">
            <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#eye"></use>
        </svg>
    </p>
                                            <p><strong>Visibility</strong></p>
                                            <p>Be found in the Directory in the category and location of your choice. (i.e. design, development etc.) 1 Category.</p>
                                        </div>
                                    </li>
                                </ul>
                            <div className="box-notice">
                                <div className="box-notice__left">
                                    <div className="box-notice__info">
                                        <p><strong>Basic subscription.</strong></p>
                                        <small>The best solution for professionals, entrepreneurs and agency members to showcase their work, get visibility and invest in their personal brands.</small>
                                    </div>
                                </div>
                                <div className="box-notice__right">
                                    <p><a href="https://www.awwwards.com/plans/basic-plan" className="button button--medium--rounded--extra-pad">Buy Plan</a></p>
                                    <small>Or compare plans <strong><a className="link-underlined" href="https://www.awwwards.com/pro#price-table">here</a></strong></small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        플랜 테이블 블럭 end */}


        {/* 플랜 테이블 블럭 start
        <div className="anchor-section" id="pro-team">
            <div className="block">
                <div className="inner">
                    <div className="c-heading text-center">
                        <div className="c-heading__top">
                            <h2 className="text-default">Professional Plan</h2>
                        </div>
                        <div className="c-heading__middle">
                            <h3 className="heading-1">PROFESSIONAL<br />MEMBER</h3>
                        </div>
                        <div className="c-heading__bottom">
                            <div className="c-heading__short-desc">
                                <span>The plan everyone needs.</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid-features">
                        <div className="box-feature box-feature--s2--right--dark is-double">
                            <div className="box-feature__info">
                                <h3 className="heading-5 box-feature__title">Plan for agencies, studios and profesionals.</h3>
                                <p>For all those who know about the importance of investing in brand, visibility and recognition.</p>
                            </div>
                            <div className="star-price star-price--large">
                                <div className="star-price__wrap">
                                    <div className="star-price__price">26<small>$</small></div>
                                    <div className="star-price__label--small text-uppercase">Month</div>
                                </div>
                                <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 37.4911C9.26197 35.3577 17.8554 30.8883 24.4807 24.4808C30.8882 17.8554 35.3578 9.26197 37.4911 0C45.5512 5.04038 54.7831 7.95493 64 8.11268C73.2169 7.95493 82.4488 5.04038 90.5089 0C92.6422 9.26197 97.1117 17.8554 103.519 24.4808C110.145 30.8883 118.738 35.3577 128 37.4911C122.96 45.5512 120.045 54.7831 119.887 64C120.045 73.2169 122.96 82.4488 128 90.5089C118.738 92.6423 110.145 97.1117 103.519 103.519C97.1117 110.145 92.6422 118.738 90.5089 128C82.4488 122.96 73.2169 120.045 64 119.887C54.7831 120.045 45.5512 122.96 37.4911 128C35.3578 118.738 30.8882 110.145 24.4807 103.519C17.8554 97.1117 9.26197 92.6423 0 90.5089C5.04037 82.4488 7.95497 73.2169 8.11271 64C7.95497 54.7831 5.04037 45.5512 0 37.4911Z" fill="#FFF083"></path>
                                </svg>
                            </div>
                            <div className="box-feature__photo">
                                <img src="/images/bg-3.png" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="l-2cols">
                        <div className="l-2cols__col">
                            <div className="l-2cols__desc">
                                <p><strong>If they don't see you, you don't exist!</strong></p>
                                <p>Choose the best option for your business or brand, a complete package with well-designed features for your business.</p>
                            </div>
                        </div>
                        <div className="l-2cols__col l-2cols__col--large">
                            <ul className="list-features" id="team-features">
                                    <li>
                                        <div className="list-features__content">
                                            <p>        <svg className="ico-svg" viewBox="0 0 20 20" width="32">
            <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#jobs"></use>
        </svg>
    </p>
                                            <p><strong>BASIC Plan Features</strong></p>
                                            <p>All features of the Basic plan are included in this plan..</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="list-features__content">
                                            <p>        <svg className="ico-svg" viewBox="0 0 20 20" width="32">
            <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#submission"></use>
        </svg>
    </p>
                                            <p><strong>Free Submission</strong></p>
                                            <p>A MUST, take advantage and upload your project to w. (only for annual payments).</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="list-features__content">
                                            <p>        <svg className="ico-svg" viewBox="0 0 20 20" width="32">
            <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#video"></use>
        </svg>
    </p>
                                            <p><strong>Promotional video in Profile</strong></p>
                                            <p>Promote your business, your skills and add a personal touch to your profile with the promotional video.</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="list-features__content">
                                            <p>        <svg className="ico-svg" viewBox="0 0 20 20" width="32">
            <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#discount"></use>
        </svg>
    </p>
                                            <p><strong>75% discount on Jobs</strong></p>
                                            <p>Publish new positions in your company on the most effective platform to achieve your goals.</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="list-features__content">
                                            <p>        <svg className="ico-svg" viewBox="0 0 20 20" width="32">
            <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#eye"></use>
        </svg>
    </p>
                                            <p><strong>More Visibility</strong></p>
                                            <p>Be found in the Directory in the categories and location of your choice. (i.e. design, development etc.), 3 categories max.</p>
                                        </div>
                                    </li>
                                </ul>
                            <div className="box-notice">
                                <div className="box-notice__left">
                                    <div className="box-notice__info">
                                        <p><strong>Professional subscription.</strong></p>
                                        <small>A plan that gives you much more than it costs, visibility, tools, discounts, a necessary must.!.</small>
                                    </div>
                                </div>
                                <div className="box-notice__right">
                                    <p><a href="https://www.awwwards.com/plans/professional-plan" className="button button--medium--rounded--extra-pad">Buy Plan</a></p>
                                    <small>Or compare plans <strong><a className="link-underlined" href="https://www.awwwards.com/pro#price-table">here</a></strong></small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        플랜 테이블 블럭 end */}

        {/* 플랜 테이블 블럭 start
        <div className="anchor-section" id="pro-int">
            <div className="block">
                <div className="inner">
                    <div className="c-heading text-center">
                        <div className="c-heading__top">
                            <h2 className="text-default">International Plan</h2>
                        </div>
                        <div className="c-heading__middle">
                            <h3 className="heading-1">INTERNATIONAL<br />MEMBER</h3>
                        </div>
                        <div className="c-heading__bottom">
                            <div className="c-heading__short-desc">
                                <span>The greatest plan of w.</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid-features">
                        <div className="box-feature box-feature--s2--right--dark is-double">
                            <div className="box-feature__info">
                                <h3 className="heading-5 box-feature__title">Plan for big agencies or studios.</h3>
                                <p>Designed only for those large agencies and studios that need maximum visibility.</p>
                            </div>
                            <div className="star-price star-price--large">
                                <div className="star-price__wrap">
                                    <div className="star-price__price">555<small>$</small></div>
                                    <div className="star-price__label--small text-uppercase">Month</div>
                                </div>
                                <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 37.4911C9.26197 35.3577 17.8554 30.8883 24.4807 24.4808C30.8882 17.8554 35.3578 9.26197 37.4911 0C45.5512 5.04038 54.7831 7.95493 64 8.11268C73.2169 7.95493 82.4488 5.04038 90.5089 0C92.6422 9.26197 97.1117 17.8554 103.519 24.4808C110.145 30.8883 118.738 35.3577 128 37.4911C122.96 45.5512 120.045 54.7831 119.887 64C120.045 73.2169 122.96 82.4488 128 90.5089C118.738 92.6423 110.145 97.1117 103.519 103.519C97.1117 110.145 92.6422 118.738 90.5089 128C82.4488 122.96 73.2169 120.045 64 119.887C54.7831 120.045 45.5512 122.96 37.4911 128C35.3578 118.738 30.8882 110.145 24.4807 103.519C17.8554 97.1117 9.26197 92.6423 0 90.5089C5.04037 82.4488 7.95497 73.2169 8.11271 64C7.95497 54.7831 5.04037 45.5512 0 37.4911Z" fill="#FFF083"></path>
                                </svg>
                            </div>
                            <div className="box-feature__photo">
                                <img src="/images/bg-3.png" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="l-2cols">
                        <div className="l-2cols__col">
                            <div className="l-2cols__desc">
                                <p><strong>Make the most of w.directory</strong></p>
                                <p>The most ambitious plan, only for a few who want to make the most of <a className="link-underlined" href="https://www.awwwards.com/directory/">w.directory</a></p>
                            </div>
                        </div>
                        <div className="l-2cols__col l-2cols__col--large">
                            <ul className="list-features">
                                    <li>
                                        <div className="list-features__content">
                                            <p>        <svg className="ico-svg" viewBox="0 0 20 20" width="32">
            <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#collections"></use>
        </svg>
    </p>
                                            <p><strong>PROFESSIONAL Plan Features</strong></p>
                                            <p>All features of the Professional plan are included in this plan...</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="list-features__content">
                                            <p>        <svg className="ico-svg" viewBox="0 0 20 20" width="32">
            <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#user-avatar"></use>
        </svg>
    </p>
                                            <p><strong>Animated Avatar</strong></p>
                                            <p>A very cool option, this superpower can only be had by the biggest.</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="list-features__content">
                                            <p>        <svg className="ico-svg" viewBox="0 0 20 20" width="32">
            <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#comment"></use>
        </svg>
    </p>
                                            <p><strong>Personal assistance</strong></p>
                                            <p>You have at your disposal 24/7 the awwwards team to help you achieve your goals.</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="list-features__content">
                                            <p>        <svg className="ico-svg" viewBox="0 0 20 20" width="32">
            <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#calendar-2"></use>
        </svg>
    </p>
                                            <p><strong>Featured on HOME PAGE &amp; DIRECTORY</strong></p>
                                            <p>The place with the most visits in all w., without a doubt the place where the greatest have to be. (3 slots at each time)</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="list-features__content">
                                            <p>        <svg className="ico-svg" viewBox="0 0 20 20" width="32">
            <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#discount"></use>
        </svg>
    </p>
                                            <p><strong>50% discount on Submissions</strong></p>
                                            <p>Upload a lot more projects, increase the chances of being a winner.</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="list-features__content">
                                            <p>        <svg className="ico-svg" viewBox="0 0 20 20" width="32">
            <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#eye-2"></use>
        </svg>
    </p>
                                            <p><strong>Much More Visibility</strong></p>
                                            <p>You will be listed in our directory in 5 Categories and in all countries ( 3 slots each time ).</p>
                                        </div>
                                    </li>
                                </ul>
                            <div className="box-notice">
                                <div className="box-notice__left">
                                    <div className="box-notice__info">
                                        <p><strong>International susbcription.</strong></p>
                                        <small>Designed for those who know that spending on visibility is the most important for a business..</small>
                                    </div>
                                </div>
                                <div className="box-notice__right">
                                    <p><a href="https://www.awwwards.com/plans/international-plan" className="button button--medium--rounded--extra-pad">Buy Plan</a></p>
                                    <small>Or compare plans <strong><a className="link-underlined" href="https://www.awwwards.com/pro#price-table">here</a></strong></small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        플랜 테이블 블럭 end */}

        {/* 커뮤니티 블럭 start
        <div className="anchor-section" id="community">
            <div className="block">
                <div className="inner">
                    <div className="c-heading text-center">
                        <div className="c-heading__top">
                            <h2 className="text-default">Community</h2>
                        </div>
                        <div className="c-heading__middle">
                            <h3 className="heading-1 text-uppercase">
                                Reasons<br />to be part<br />of w.
                            </h3>
                        </div>
                        <div className="c-heading__bottom">
                            <div className="c-heading__short-desc">
                                <span>A global community of digital creatives, sharing knowledge, inspiration and innovation.</span>
                            </div>
                        </div>
                    </div>
                    <div className="timeline js-timeline">
                        <div className="timeline__step">
                        <div className="timeline__card">
                            <div className="timeline__info">
                                <p><strong>Users</strong></p>
                                <div className="heading-5"><strong>+56K</strong></div>
                                <p>A global community of digital creatives, sharing knowledge, inspiration and innovation.</p>
                            </div>
                            <div className="timeline__img">
                                <img src="/images/1.jpg" alt="" />
                            </div>
                        </div>
                        </div>
                        <div className="timeline__step">
                            <div className="timeline__card">
                                <div className="timeline__info">
                                    <p><strong>Unique Visits</strong></p>
                                    <div className="heading-5"><strong>+578M</strong></div>
                                    <p>The main point of reference for visibility and recognition for the web design industry</p>
                                </div>
                                <div className="timeline__img">
                                    <img src="/images/2.jpg" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="timeline__step">
                            <div className="timeline__card">
                                <div className="timeline__info">
                                    <p><strong>Submissions</strong></p>
                                    <div className="heading-5"><strong>+206K</strong></div>
                                    <p>A continually expanding source of ideas, trends and innovation at your fingertips.</p>
                                </div>
                                <div className="timeline__img">
                                    <img src="/images/3.jpg" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="c-view-all">
                        <div className="c-view-all__row">
                            <strong className="heading-1">+3.780</strong>
                        </div>
                        <div className="c-view-all__row text-medium">
                            <span>Connect with over <strong>6,800</strong> Agencies and Professionals</span>
                            <a href="https://www.awwwards.com/directory/homepage/" className="bt-ico-left">
                            <svg className="ico-svg" viewBox="0 0 20 20" width="16">
                                    <path d="M10 3L17 10L10 17" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <strong className="link-underlined">View Directory</strong>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        커뮤니티 블럭 end */}

        {/* 플랜 테이블 블럭 start 
        <div className="block  is-show " id="price-table">
            <div className="inner">
                <div className="p-heading">
                    <div className="p-heading__col">
                        <div className="p-heading__top">
                            <div className="c-heading c-heading--small">
                                <div className="c-heading__top">
                                    <div>Professional Plans</div>
                                </div>
                                <div className="c-heading__middle">
                                    <h3 className="heading-5">Choose the<br />best plan for you.</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-heading__col p-heading__col--bottom">
                        <div className="c-toggle">
                            <div className="c-toggle__col">
                                <strong>Billed monthly</strong>
                            </div>
                            <div className="c-toggle__col">
                                <div className="check-toggle" data-controller="change-plan">
                                                                          <input id="1607250607" className="" type="checkbox" defaultChecked={true} data-action="change->change-plan#change" />
                                    <label className="check-toggle__label" htmlFor="1607250607">
                                        <span className="check-toggle__ball"></span>
                                    </label>
                                </div>
                            </div>
                            <div className="c-toggle__col">
                                <strong>
                                    Billed annually
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="plans">
                    <div className="plan plan--pro is-dark">
                        <div className="plan__inner">
                            <div className="plan__header">
                                <div className="plan__title">
                                    Basic<br />Plan Member
                                </div>
                                <div className="plan__amount js-price-plan" data-controller="show-plan" data-show-plan-annually-value="$6.7" data-show-plan-monthly-value="$15" data-show-plan-annually-without-discount-value="$666.66" data-show-plan-monthly-without-discount-value="$15">
                                    
        <span className="plan__price">
            <strong data-show-plan-target="price">6.7</strong>
            <sup>
                $
                <span className="text-red text-strikethrough is-hidden" data-show-plan-target="priceWithoutDiscount">
                    
                </span>
            </sup>
        </span>
        /
        <span data-show-plan-target="period">month</span>
        <div className="plan__discounts" data-show-plan-target="discount">
                        <span>Billed annually you</span>
                            <div className="plan__budgets">
                    <span className="budget-tag budget-tag--solid--red">save $96</span> <span className="budget-tag budget-tag--solid--yellow">-58%</span>
                </div>
                            </div>


                                </div>
                                <div>
                                                                        <a href="https://www.awwwards.com/plans/basic-plan" className="button button--large--outline--white--rounded">Select Basic</a>
                                                                </div>
                            </div>
                            <div className="plan__footer">
                                <ul className="plan__list">
                                                                        <li>10% off on website submissions</li>
                                                                        <li>10% off on market products</li>
                                                                        <li>60% discount on courses (excluding MasterclassNamees)</li>
                                                                        <li>Featured in 1 category</li>
                                                                        <li>Directory Listing: Include your profile in our Professional Directory</li>
                                                                        <li>Mood Board Tool (coming soon)</li>
                                                                        <li>Access to exclusive content (videos, books, articles)</li>
                                                                        <li>Receive dedicated email assistance.</li>
                                                                        <li>Professional Profile: Create a standout profile on Awwwards</li>
                                                                        <li>Add a showcase to your profile at no extra cost</li>
                                                                        <li>Add collaborators to websites</li>
                                                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="plan plan--pro is-dark">
                        <div className="plan__inner">
                            <div className="plan__header">
                                <div className="plan__title">
                                    Professional<br />Plan Member
                                </div>
                                <div className="plan__amount js-price-plan" data-controller="show-plan" data-show-plan-annually-value="$13.8" data-show-plan-monthly-value="$26" data-show-plan-annually-without-discount-value="$13.75" data-show-plan-monthly-without-discount-value="$26">
                                    
        <span className="plan__price">
            <strong data-show-plan-target="price">13.8</strong>
            <sup>
                $
                <span className="text-red text-strikethrough is-hidden" data-show-plan-target="priceWithoutDiscount">
                    
                </span>
            </sup>
        </span>
        /
        <span data-show-plan-target="period">month</span>
        <div className="plan__discounts" data-show-plan-target="discount">
                        <span>Billed annually you</span>
                            <div className="plan__budgets">
                    <span className="budget-tag budget-tag--solid--red">save $144</span> <span className="budget-tag budget-tag--solid--yellow">-58%</span>
                </div>
                            </div>


                                </div>
                                <div>
                                                                        <a href="https://www.awwwards.com/plans/professional-plan" className="button button--large--outline--white--rounded">Select Professional</a>
                                                                </div>
                                <div className="plan__tag budget-tag text-uppercase">Recommended</div>
                            </div>
                            <div className="plan__footer">
                                <ul className="plan__list">

                                    <li>All Basic features</li>

                                                                        <li>30% off on website submissions</li>
                                                                        <li>30% off on market products</li>
                                                                        <li>75% discount on courses</li>
                                                                        <li>Annual Free Submission</li>
                                                                        <li>Featured in 3 distinct categories</li>
                                                                        <li>30% discount on job offers</li>
                                                                        <li>Promotional video in profile (Coming Soon)</li>
                                                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="plan plan--pro">
                        <div className="plan__inner">
                            <div className="plan__header">
                                <div className="plan__title">
                                    International<br />Plan Member
                                </div>
                                <div className="plan__amount js-price-plan" data-controller="show-plan" data-show-plan-annually-value="$324" data-show-plan-monthly-value="$555" data-show-plan-annually-without-discount-value="$324" data-show-plan-monthly-without-discount-value="$555">
                                    
        <span className="plan__price">
            <strong data-show-plan-target="price">324</strong>
            <sup>
                $
                <span className="text-red text-strikethrough is-hidden" data-show-plan-target="priceWithoutDiscount">
                    
                </span>
            </sup>
        </span>
        /
        <span data-show-plan-target="period">month</span>
        <div className="plan__discounts" data-show-plan-target="discount">
                        <span>Billed annually you</span>
                            <div className="plan__budgets">
                    <span className="budget-tag budget-tag--solid--red">save $2772</span> <span className="budget-tag budget-tag--solid--yellow">-58%</span>
                </div>
                            </div>


                                </div>
                                <div>
                                                                        <a href="https://www.awwwards.com/plans/international-plan" className="button button--large--outline--rounded">Select International</a>
                                                                </div>
                            </div>
                            <div className="plan__footer">
                                <ul className="plan__list">
                                    <li>All Pro features</li>
                                                                        <li>Featured in 5 distinct categories</li>
                                                                        <li>50% discount on website submissions</li>
                                                                        <li>50% discount for products on market</li>
                                                                        <li>Featured Worldwide in Directory</li>
                                                                        <li>Personal assistance</li>
                                                                        <li>Featured on Directory</li>
                                                                        <li>Featured on homepage</li>
                                                                        <li>One social media mention</li>
                                                                        <li>Animated avatar (Coming Soon)</li>
                                                                        <li>Access to All Courses</li>
                                                                        <li>5+ new courses added each month</li>
                                                                        <li>Streaming supports up to 5 simultaneous IP connections</li>
                                                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="c-view-all">
                    <div className="c-view-all__row  text-medium">
                        <span>Want access to all our Academy courses? </span>
                                            <a href="https://www.awwwards.com/plans/creative-pro-plans" className="bt-ico-left">
                            <svg className="ico-svg" viewBox="0 0 20 20" width="20">
    <path d="M10 3L17 10L10 17" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

                    <strong className="link-underlined">Explore our Plans + Academy options</strong>
                </a>
                    </div>
                </div>
            </div>
        </div>
        플랜 테이블 블럭 end */}

        {/* 플랜 테이블 블럭 start
        <div className="anchor-section" id="LOREM-8">
            <div className="block">
                <div className="inner">
                    {/* 플랜 테이블 헤더 Professional Plans 테이블 
                    <div className="p-heading">
                        <div className="p-heading__col">
                            <div className="p-heading__top">
                                <div className="c-heading c-heading--small">
                                    <div className="c-heading__top">
                                        <div>Professional Plans</div>
                                    </div>
                                    <div className="c-heading__middle">
                                        <h3 className="heading-5">Choose the<br />best plan for you.</h3>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="p-heading__col">
                            <div className="grid-plans">
                                <div className="plan-box">
                                    <p></p><div className="plan-box__title">Basic</div><p></p>
                                    <p className="plan-box__desc"><small>Ideal for freelancers, independent professionals and entrepreneurs.</small></p>
                                    <p><a href="https://www.awwwards.com/plans/basic-plan" className="button button--rounded">Buy Basic</a></p>
                                </div>

                                <div className="plan-box">
                                    <p></p><div className="plan-box__title">Professional</div><p></p>
                                    <p className="plan-box__desc"><small>The gold standard investment for all agencies and studios.</small></p>
                                    <p><a href="https://www.awwwards.com/plans/professional-plan" className="button button--rounded">Buy Professional</a></p>
                                </div>

                                <div className="plan-box">
                                    <p></p><div className="plan-box__title">International</div><p></p>
                                    <p className="plan-box__desc"><small>The crème de la crème - high impact visibility for bold industry leaders.</small></p>
                                    <p><a href="https://www.awwwards.com/plans/international-plan" className="button button--rounded">Buy International</a></p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* 플랜 테이블 내용 Benefits 테이블
                    <div className="plans-compare hidden-lg">
                        <div className="plans-compare__title">Benefits</div>
                        <div className="plans-compare__table">
                            <div className="plans-compare__row plans-compare__row--featured">
                                <div className="plans-compare__col">
                                    <ul className="plans-compare__list">
                                        <li>10% off on website submissions</li>
                                        <li>10% off on market products</li>
                                        <li>60% discount on courses (excluding MasterclassNamees)</li>
                                        <li>Featured in 1 category</li>
                                        <li>Directory Listing: Include your profile in our Professional Directory</li>
                                        <li>Mood Board Tool (coming soon)</li>
                                        <li>Access to exclusive content (videos, books, articles)</li>
                                        <li>Receive dedicated email assistance.</li>
                                        <li>Professional Profile: Create a standout profile on Awwwards</li>
                                        <li>Add a showcase to your profile at no extra cost</li>
                                        <li>Add collaborators to websites</li>
                                    </ul>
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg" viewBox="0 0 20 20" width="20">
                                        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                    </svg>

                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg" viewBox="0 0 20 20" width="20">
                                        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                    </svg>

                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg" viewBox="0 0 20 20" width="20">
                                    <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                </svg>

                                </div>
                            </div>
                            <div className="plans-compare__row">
                                <div className="plans-compare__col">
                                    30% off on website submissions
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
                                    <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                </svg>
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg" viewBox="0 0 20 20" width="28">
                                    <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                </svg>
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg" viewBox="0 0 20 20" width="28">
                                    <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                </svg>
                                </div>
                            </div>
                            <div className="plans-compare__row">
                                <div className="plans-compare__col">
                                    30% off on market products
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
                                    <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                </svg>
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg" viewBox="0 0 20 20" width="28">
                                        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                    </svg>
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg" viewBox="0 0 20 20" width="28">
                                        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                    </svg>
                                </div>
                            </div>
                            <div className="plans-compare__row">
                                <div className="plans-compare__col">
                                    75% discount on courses
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
                                        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                    </svg>
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg" viewBox="0 0 20 20" width="28">
                                        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                    </svg>
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg" viewBox="0 0 20 20" width="28">
                                        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                    </svg>
                                </div>
                            </div>
                            <div className="plans-compare__row">
                                <div className="plans-compare__col">
                                    Annual Free Submission
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
                                    <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                </svg>
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg" viewBox="0 0 20 20" width="28">
                                        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                    </svg>
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg" viewBox="0 0 20 20" width="28">
                                        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                    </svg>
                                </div>
                            </div>
                            <div className="plans-compare__row">
                                <div className="plans-compare__col">
                                    Featured in 3 distinct categories
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
                                        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                    </svg>
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg" viewBox="0 0 20 20" width="28">
                                        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                    </svg>
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg" viewBox="0 0 20 20" width="28">
                                        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                    </svg>
                                </div>
                            </div>
                            <div className="plans-compare__row">
                                <div className="plans-compare__col">
                                    30% discount on job offers
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
                                        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                    </svg>
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg" viewBox="0 0 20 20" width="28">
                                        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                    </svg>
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg" viewBox="0 0 20 20" width="28">
                                        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                    </svg>
                                </div>
                            </div>
                            <div className="plans-compare__row">
                                <div className="plans-compare__col">
                                    Promotional video in profile (Coming Soon)
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
                                        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                    </svg>
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg" viewBox="0 0 20 20" width="28">
                                        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                    </svg>
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg" viewBox="0 0 20 20" width="28">
                                        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                    </svg>
                                </div>
                            </div>
                            <div className="plans-compare__row">
                                <div className="plans-compare__col">
                                    Featured in 5 distinct categories
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
                                        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                    </svg>
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
                                        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                    </svg>
                                </div>
                                <div className="plans-compare__col">
                                    <svg className="ico-svg" viewBox="0 0 20 20" width="28">
                                        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
                                    </svg>
                                </div>
                            </div>
                            <div className="plans-compare__row">
                                <div className="plans-compare__col">
                                    50% discount on website submissions
                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                            </div>
                            <div className="plans-compare__row">
                                <div className="plans-compare__col">
                                    50% discount for products on market
                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                            </div>
                            <div className="plans-compare__row">
                                <div className="plans-compare__col">
                                    Featured Worldwide in Directory
                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                            </div>
                            <div className="plans-compare__row">
                                <div className="plans-compare__col">
                                    Personal assistance
                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                            </div>
                            <div className="plans-compare__row">
                                <div className="plans-compare__col">
                                    Featured on Directory
                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                            </div>
                            <div className="plans-compare__row">
                                <div className="plans-compare__col">
                                    Featured on homepage
                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                            </div>
                            <div className="plans-compare__row">
                                <div className="plans-compare__col">
                                    One social media mention
                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                            </div>
                            <div className="plans-compare__row">
                                <div className="plans-compare__col">
                                    Animated avatar (Coming Soon)
                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                            </div>
                            <div className="plans-compare__row">
                                <div className="plans-compare__col">
                                    Access to All Courses
                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                            </div>
                            <div className="plans-compare__row">
                                <div className="plans-compare__col">
                                    5+ new courses added each month
                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                            </div>
                            <div className="plans-compare__row">
                                <div className="plans-compare__col">
                                    Streaming supports up to 5 simultaneous IP connections
                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg is-disabled" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                                <div className="plans-compare__col">
                                            <svg className="ico-svg" viewBox="0 0 20 20" width="28">
        <use xlinkHref="https://www.awwwards.com/assets/redesign/images/sprite-icons.svg?v=3#check-ok"></use>
    </svg>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        플랜 테이블 블럭 end */}

        {/* 피처 블럭 image start */}
        <div className="anchor-section">
            <div className="block">
                <div className="inner">
                    <div className="grid-features">
                        <div className="box-feature box-feature--s2-low--dark is-double">
                            <div className="box-feature__info">
                                <h3 className="heading-5 box-feature__title">Start now and increase your recognition as a professional.</h3>
                                <p><a href="https://www.awwwards.com/pro#price-table" className="button button--large--outline--white--rounded">Start Pro Membership</a></p>
                            </div>
                            <div className="box-feature__photo">
                                <img src="/images/bg-5.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* 피처 블럭 image end */}

        {/* 메뉴 블럭 start */}
        <div className="menu-float js-menufloat-show is-visible">
            <div className="inner">
                <div className="menu-float__inner">
                    <div className="bt-nav bt-nav--left js-gototop is-hidden">
                        <svg width="18" height="22" viewBox="0 0 18 22">
                            <path fillRule="evenodd" clipRule="evenodd" d="M8.69899 3.08174L7.76441 4.02584L7.75493 4.0258L1.3542 10.4265L0.0117182 9.08405L6.41245 2.68332L8.69707 0.398693L10.0396 1.74118L17.4565 9.15817L16.1159 10.4893L9.66059 4.0339L8.69899 3.08174ZM8.22508 5.69881L10.4911 7.2949L10.5527 21.8672L8.29342 21.8576L8.22508 5.69881Z"></path>
                        </svg>
                    </div>
                    
                    <div className="menu-float__wrapper">
                        <div className="menu-float__top">
                            <div className="menu-float__menu menu-main" id="menu-main">
                                <div className="menu-float__menu-content">
                                    <div className="menu-float__menu--main">
                                        <div className="menu-float__menu-col style-2 ">
                                            <div className="menu-float__menu-section">Awards</div>
                                            <ul className="menu-float__menu-nav">
                                                <li>
                                                    <a href="https://www.awwwards.com/websites/" className="menu-float__sub-item ">Winners
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="https://www.awwwards.com/websites/nominees/" className="menu-float__sub-item ">
                                                        Nominees
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="https://www.awwwards.com/websites/sites_of_the_day/" className="menu-float__sub-item">
                                                        Sites of the Day
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="https://www.awwwards.com/websites/sites_of_the_month/" className="menu-float__sub-item">
                                                        Sites of the Month
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="menu-float__menu-col style-1">
                                            <div className="menu-float__menu-row style-1 ">
                                                <div className="menu-float__menu-section">Inspiration</div>
                                                <ul className="menu-float__menu-nav">
                                                    <li>
                                                        <a href="https://www.awwwards.com/collections/" className="menu-float__sub-item">
                                                            Collections
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="https://www.awwwards.com/elements/" className="menu-float__sub-item">
                                                            Elements
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="menu-float__menu-row style-1">
                                                <div className="menu-float__menu-section">Academy</div>
                                                <ul className="menu-float__menu-nav">

                                                    <li>
                                                        <a href="https://www.awwwards.com/academy/" className="menu-float__sub-item">
                                                            Courses
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="https://www.awwwards.com/masterclassNamees/" className="menu-float__sub-item">
                                                            MasterclassNamees
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="menu-float__menu-col style-1 ">
                                            <div className="menu-float__menu-row style-1 ">
                                                <div className="menu-float__menu-section">Directory</div>
                                                <ul className="menu-float__menu-nav">
                                                    <li>
                                                        <a href="https://www.awwwards.com/directory/homepage/" className="menu-float__sub-item ">
                                                            Professionals
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="https://www.awwwards.com/directory/international/" className="menu-float__sub-item">
                                                            Internationals
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="https://www.awwwards.com/directory/freelance/" className="menu-float__sub-item">
                                                            Freelancers
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="https://www.awwwards.com/directory/agency-studio/" className="menu-float__sub-item ">
                                                            Agencies &amp; Studios
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="menu-float__menu-col style-1 ">
                                            <div className="menu-float__menu-row style-1 ">
                                                <div className="menu-float__menu-section">w.</div>
                                                <ul className="menu-float__menu-nav">
                                                    <li>
                                                        <a href="https://www.awwwards.com/blog/" className="menu-float__sub-item">
                                                            Blog
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="https://www.awwwards.com/jobs/" className="menu-float__sub-item">
                                                            Jobs
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="https://www.awwwards.com/jury/" className="menu-float__sub-item ">
                                                            Jury
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="https://www.awwwards.com/market/" className="menu-float__sub-item ">Products</a>
                                                    </li>
                                                    <li>
                                                        <a href="https://www.awwwards.com/honors/nominees" className="menu-float__sub-item ">
                                                            Awards Honors &nbsp;<span className="budget-tag budget-tag--solid--white">New</span>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="menu-float__menu" id="menu-filters">
                                <div className="menu-float__menu-content"></div>
                            </div>
                        </div>


                        {/* 메뉴 블럭 start logo */}
                        <div className="menu-float__bottom">
                            <div className="menu-float__layout menu-float__layout--primary">
                                <div className="menu-float__content">
                                    <a href="/" className="menu-float__logo" aria-label="logbase home page">
                                        <svg width="30" height="16" viewBox="0 0 30 16">
                                            <path d="m18.4 0-2.803 10.855L12.951 0H9.34L6.693 10.855 3.892 0H0l5.012 15.812h3.425l2.708-10.228 2.709 10.228h3.425L22.29 0h-3.892ZM24.77 13.365c0 1.506 1.12 2.635 2.615 2.635C28.879 16 30 14.87 30 13.365c0-1.506-1.12-2.636-2.615-2.636s-2.615 1.13-2.615 2.636Z"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            <div className="menu-float__layout menu-float__layout--secondary">
                                <div className="menu-float__content">
                                    <div className="menu-float__progress">
                                        <div className="menu-float__bar js-menu-progress"></div>
                                    </div>
                                    <ul className="menu-float__nav">
                                        <li><a className="menu-float__item js-menu-anchor" href="#features">Features</a></li>
                                        <li><a className="menu-float__item js-menu-anchor" href="#Background">Background</a></li>
                                        <li><a className="menu-float__item js-menu-anchor" href="#">Differentiator</a></li>
                                        <li><a className="menu-float__item js-menu-anchor" href="#OurMission">Our Mission</a></li>
                                        <li><a className="menu-float__item js-menu-anchor" href="#AboutUs">About Us</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {/* 메뉴 블럭 end logo */}

                    </div>

                </div>
            </div>
        </div>
        {/* 메뉴 블럭 end */}

      </section>

    </>
  );
} 