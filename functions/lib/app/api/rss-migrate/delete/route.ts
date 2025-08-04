import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Firebase Admin SDK 초기화
if (!getApps().length) {
  try {
    initializeApp();
  } catch (error) {
    console.log('Firebase Admin SDK 초기화 에러:', error);
  }
}

const db = getFirestore();

export async function POST(request: NextRequest) {
  try {
    // Request body를 한 번만 읽기
    const body = await request.json();
    const { guid } = body;
    
    if (!guid) {
      return NextResponse.json({ success: false, error: 'Invalid parameters' }, { status: 400 });
    }
    
    console.log('Delete API 호출:', { guid });
    
    const rssCollection = db.collection('rss_items');
    const query = rssCollection.where('guid', '==', guid);
    const docs = await query.get();
    
    if (docs.empty) {
      console.log('RSS 아이템을 찾을 수 없음:', guid);
      return NextResponse.json({ success: false, error: 'RSS item not found' }, { status: 404 });
    }

    const doc = docs.docs[0];
    await doc.ref.delete();
    
    console.log('RSS 아이템 삭제 성공:', guid);
    return NextResponse.json({ success: true, message: 'RSS item deleted successfully' });

  } catch (error) {
    console.error('Delete API 에러:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 