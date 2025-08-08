'use client';

import { useState } from 'react';

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
}

export default function LoginModal({ show, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // 회원가입 시 비밀번호 확인
    if (isRegisterMode && password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    try {
      // 클라이언트 사이드에서 직접 Firebase Auth 사용
      const { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase');
      
      if (isRegisterMode) {
        // 회원가입
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        if (displayName) {
          await updateProfile(user, { displayName });
        }
        
        alert('회원가입 성공!');
        console.log('✅ 회원가입 성공 - AuthContext가 자동으로 업데이트됩니다.');
      } else {
        // 로그인
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        alert('로그인 성공!');
        console.log('✅ 로그인 성공 - AuthContext가 자동으로 업데이트됩니다.');
      }
      
      onClose();
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setDisplayName('');
      setIsRegisterMode(false);
      
    } catch (error: any) {
      console.error('로그인/회원가입 오류:', error);
      
      let errorMessage = '로그인/회원가입에 실패했습니다.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = '등록되지 않은 이메일입니다.';
          break;
        case 'auth/wrong-password':
          errorMessage = '비밀번호가 올바르지 않습니다.';
          break;
        case 'auth/invalid-email':
          errorMessage = '올바르지 않은 이메일 형식입니다.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = '이미 사용 중인 이메일입니다.';
          break;
        case 'auth/weak-password':
          errorMessage = '비밀번호가 너무 약합니다.';
          break;
        case 'auth/too-many-requests':
          errorMessage = '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
          break;
        case 'auth/user-disabled':
          errorMessage = '비활성화된 계정입니다.';
          break;
        case 'auth/configuration-not-found':
          errorMessage = 'Firebase Authentication이 설정되지 않았습니다. 관리자에게 문의하세요.';
          break;
        default:
          errorMessage = `오류: ${error.message || error.code}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isRegisterMode ? '회원가입' : '로그인'}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          {isRegisterMode && (
            <div className="form-group">
              <label htmlFor="displayName">이름</label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="이름을 입력하세요"
                required
                disabled={isLoading}
              />
            </div>
          )}
          
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
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                    <line x1="2" y1="2" x2="22" y2="22"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {isRegisterMode && (
            <div className="form-group">
              <label htmlFor="confirmPassword">비밀번호 확인</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                      <line x1="2" y1="2" x2="22" y2="22"></line>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading 
                ? (isRegisterMode ? '회원가입 중...' : '로그인 중...') 
                : (isRegisterMode ? '회원가입' : '로그인')
              }
            </button>
          </div>
          
          <div className="form-footer">
            {!isRegisterMode && (
              <a href="#" className="forgot-password">비밀번호를 잊으셨나요?</a>
            )}
            <div className="signup-link">
              {isRegisterMode ? (
                <>
                  이미 계정이 있으신가요? 
                  <a href="#" className="signup-btn" onClick={(e) => {
                    e.preventDefault();
                    setIsRegisterMode(false);
                    setError('');
                    setConfirmPassword('');
                  }}>
                    로그인
                  </a>
                </>
              ) : (
                <>
                  {/* 계정이 없으신가요?  */}
                  <a href="#" className="signup-btn" onClick={(e) => {
                    e.preventDefault();
                    setIsRegisterMode(true);
                    setError('');
                    setConfirmPassword('');
                  }}>
                    {/* 회원가입 */}
                  </a>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 