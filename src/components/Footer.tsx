'use client';

import React, { useState } from 'react';
import InquiryForm from './InquiryForm';
import NewsletterModal from './NewsletterModal';

export default function Footer() {
  const [showInquiry, setShowInquiry] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const today = new Date();
  
  return (
    <footer id="footer">
        <div className="inner">
            <div className="footer__top">
                <p className="footer__logo footer__logo--small">
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
                </p>
                <div className="footer__wrapper">
                    <div className="footer__grid">
                        <ul className="footer__menu">
                            <li><a href="https://www.awwwards.com/websites/">Websites</a></li>
                            <li><a href="https://www.awwwards.com/collections/search/">Collections</a></li>
                            <li><a href="https://www.awwwards.com/elements/">Elements</a></li>
                        </ul>
                        <ul className="footer__menu">
                            <li><a href="https://www.awwwards.com/academy/">Academy</a></li>
                            <li><a href="https://www.awwwards.com/jobs/search/">Jobs</a></li>
                            <li><a href="https://www.awwwards.com/market/">Market</a></li>
                        </ul>
                        <ul className="footer__menu">
                            <li><a href="https://www.awwwards.com/directory/search/">Directory</a></li>
                            <li><a href="https://conference.awwwards.com/">Conferences</a></li>
                        </ul>
                        <ul className="footer__menu">
                            <li><a rel="nofollow" href="https://www.awwwards.com/faqs/">FAQs</a></li>
                            <li><a rel="nofollow" href="https://www.awwwards.com/about-us/">About Us</a></li>
                            <li><a rel="nofollow" href="https://www.awwwards.com/contact-us/">Contact Us</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer__bottom">
                <div className="footer__left">
                    <ul className="footer__nav">
                        <li><a rel="nofollow" href="https://www.awwwards.com/cookies-policy/">Cookies Policy</a></li>
                        <li><a rel="nofollow" href="https://www.awwwards.com/terms/">Legal Terms</a></li>
                        <li><a rel="nofollow" href="https://www.awwwards.com/privacy-policy/">Privacy Policy</a></li>
                    </ul>
                </div>
                <div className="footer__right">
                    <ul className="footer__nav">
                        <li><strong>Connect:</strong></li>
                        <li><a href="https://www.instagram.com/awwwards">Instagram</a></li>
                        <li><a href="https://www.linkedin.com/company/awwwards">LinkedIn</a></li>
                        <li><a href="https://twitter.com/awwwards">Twitter</a></li>
                        <li><a href="https://www.facebook.com/awwwards">Facebook</a></li>
                        <li><a href="https://www.youtube.com/awwwardstv">YouTube</a></li>
                        <li><a href="https://www.tiktok.com/@awwwards.com">TikTok</a></li>
                        <li><a href="https://www.pinterest.es/awwwards/">Pinterest</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
  );
} 