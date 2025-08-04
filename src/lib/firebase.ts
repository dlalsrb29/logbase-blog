import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA6kCmSqaBH5SUPb4PkHU1hwe0l5Ppqw2w",
  authDomain: "logbase-blog-83db6.firebaseapp.com",
  projectId: "logbase-blog-83db6",
  storageBucket: "logbase-blog-83db6.firebasestorage.app",
  messagingSenderId: "938632982963",
  appId: "1:938632982963:web:6159f776e4466bf74bdbc6"
};

// 디버깅: Firebase 설정 확인
console.log('🔥 Firebase 설정 확인:', {
  projectId: firebaseConfig.projectId,
  apiKey: firebaseConfig.apiKey?.substring(0, 10) + '...',
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey,
  hasProjectId: !!firebaseConfig.projectId
});

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { app, db }; 