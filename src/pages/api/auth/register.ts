import { NextApiRequest, NextApiResponse } from 'next';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: '비밀번호는 최소 6자 이상이어야 합니다.' });
    }

    // Firebase Authentication으로 회원가입
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 사용자 프로필 업데이트 (displayName이 있는 경우)
    if (displayName) {
      await updateProfile(user, {
        displayName: displayName
      });
    }

    // 성공 응답
    res.status(200).json({
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || displayName,
        photoURL: user.photoURL
      },
      message: '회원가입 성공!'
    });

  } catch (error: any) {
    console.error('회원가입 오류:', error);
    
    // Firebase 오류 코드에 따른 메시지
    let errorMessage = '회원가입에 실패했습니다.';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = '이미 사용 중인 이메일입니다.';
        break;
      case 'auth/invalid-email':
        errorMessage = '올바르지 않은 이메일 형식입니다.';
        break;
      case 'auth/weak-password':
        errorMessage = '비밀번호가 너무 약합니다.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = '이메일/비밀번호 로그인이 비활성화되어 있습니다.';
        break;
      case 'auth/configuration-not-found':
        errorMessage = 'Firebase Authentication이 설정되지 않았습니다. 관리자에게 문의하세요.';
        break;
      default:
        errorMessage = `회원가입 오류: ${error.message || error.code}`;
    }

    res.status(400).json({
      success: false,
      error: errorMessage
    });
  }
} 