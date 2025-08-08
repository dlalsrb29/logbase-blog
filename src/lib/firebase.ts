import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA6kCmSqaBH5SUPb4PkHU1hwe0l5Ppqw2w",
  authDomain: "logbase-blog-83db6.firebaseapp.com",
  projectId: "logbase-blog-83db6",
  storageBucket: "logbase-blog-83db6.firebasestorage.app",
  messagingSenderId: "938632982963",
  appId: "1:938632982963:web:6159f776e4466bf74bdbc6"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth }; 