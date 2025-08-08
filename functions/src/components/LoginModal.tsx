'use client';

import { useState } from 'react';

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
}

export default function LoginModal({ show, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: 실제 로그인 API 호출
      console.log('로그인 시도:', { email, password });
      
      // 임시로 1초 후 성공 처리
      setTimeout(() => {
        alert('로그인 성공!');
        onClose();
        setEmail('');
        setPassword('');
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다.');
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>로그인</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">이메일 주소</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </div>
          
          <div className="form-footer">
            <a href="#" className="forgot-password">비밀번호를 잊으셨나요?</a>
            <div className="signup-link">
              계정이 없으신가요? <a href="#" className="signup-btn">회원가입</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 