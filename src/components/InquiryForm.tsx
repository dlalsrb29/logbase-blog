'use client';

import React, { useRef } from 'react';

export default function InquiryForm({ show, onClose }: { show: boolean, onClose: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const data = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      content: (form.elements.namedItem('content') as HTMLTextAreaElement).value,
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      company: (form.elements.namedItem('company') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
    };

    // 이메일 형식 검증
    const emailRegex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(data.email)) {
      alert('올바른 이메일 형식을 입력해 주세요.');
      (form.elements.namedItem('email') as HTMLInputElement).focus();
      return;
    }
    // 휴대폰 형식 검증 (숫자만 추출 후 010으로 시작하고 11자리인지 확인)
    const phoneDigits = data.phone.replace(/\D/g, '');
    if (!/^010\d{8}$/.test(phoneDigits)) {
      alert('올바른 휴대폰 번호 형식(010-xxxx-xxxx 또는 010xxxxxxxx)으로 입력해 주세요.');
      (form.elements.namedItem('phone') as HTMLInputElement).focus();
      return;
    }
    // 슬랙 전송용 010-0000-0000 포맷 변환
    const phoneFormatted = phoneDigits.replace(/(010)(\d{4})(\d{4})/, '$1-$2-$3');
    data.phone = phoneFormatted;

    try {
      const res = await fetch('/api/inquiry-to-slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        alert('문의가 접수되었습니다!');
        onClose();
      } else {
        const err = await res.json();
        alert('전송에 실패했습니다: ' + (err.error || '다시 시도해 주세요.'));
      }
    } catch (err) {
      alert('전송 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="inquiry-modal-overlay">
      <div className="inquiry-modal">
        <button className="inquiry-modal-close" type="button" aria-label="닫기" onClick={onClose}>&times;</button>
        <h2 style={{marginBottom: '0.5rem', fontSize: '2rem', fontWeight: 700, textAlign: 'center', color: '#222', letterSpacing: '-1px'}}>문의하기</h2>
        <p style={{textAlign: 'center', color: '#666', marginBottom: '2rem', fontSize: '1.08rem'}}>서비스 도입, 견적, 기술 문의 등 궁금한 점을 남겨주시면 빠르게 연락드리겠습니다.</p>
        <form ref={formRef} className="inquiry-form" onSubmit={handleSubmit}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <div>
              <label htmlFor="title">제목 <span style={{color:'red'}}>*</span></label>
              <input id="title" name="title" type="text" required className="inquiry-input" style={{width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc', background: '#f9fafb'}} />
            </div>
            <div>
              <label htmlFor="content">내용 <span style={{color:'red'}}>*</span></label>
              <textarea id="content" name="content" rows={4} required className="inquiry-input" style={{width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc', background: '#f9fafb'}}></textarea>
            </div>
            <div className="inquiry-row">
              <div style={{flex:1}}>
                <label htmlFor="name">성함 <span style={{color:'red'}}>*</span></label>
                <input id="name" name="name" type="text" required className="inquiry-input" style={{width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc', background: '#f9fafb'}} />
              </div>
              <div style={{flex:1}}>
                <label htmlFor="company">기업명</label>
                <input id="company" name="company" type="text" className="inquiry-input" style={{width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc', background: '#f9fafb'}} />
              </div>
            </div>
            <div className="inquiry-row">
              <div style={{flex:1}}>
                <label htmlFor="email">이메일 <span style={{color:'red'}}>*</span></label>
                <input id="email" name="email" type="email" required className="inquiry-input" style={{width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc', background: '#f9fafb'}} />
              </div>
              <div style={{flex:1}}>
                <label htmlFor="phone">휴대폰 <span style={{color:'red'}}>*</span></label>
                <input id="phone" name="phone" type="tel" required className="inquiry-input" style={{width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc', background: '#f9fafb'}} 
                  placeholder="ex)01012345678"
                  onChange={e => {
                    // '-' 자동 제거
                    e.currentTarget.value = e.currentTarget.value.replace(/-/g, '');
                  }}
                />
              </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <button type="submit" className="inquiry-btn" style={{marginTop: '1rem', padding: '0.75rem 2.5rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, fontSize: '1.1rem', cursor: 'pointer', fontWeight: 600, letterSpacing: '0.5px'}}>문의 제출</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 