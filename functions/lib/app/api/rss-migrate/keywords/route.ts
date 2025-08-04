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
    // Pages Router에서는 req.body가 이미 파싱된 객체
    let body;
    
    // Request body가 이미 객체인지 확인
    if (request.body && typeof request.body === 'object') {
      body = request.body;
    } else {
      // JSON 문자열인 경우에만 파싱 시도
      try {
        body = await request.json();
      } catch (parseError) {
        console.error('Request body 파싱 오류:', parseError);
        return NextResponse.json(
          { success: false, error: 'Invalid JSON in request body' }, 
          { status: 400 }
        );
      }
    }
    
    const { guid, matchedKeywords } = body;
    
    if (!guid || !Array.isArray(matchedKeywords)) {
      return NextResponse.json({ success: false, error: 'Invalid parameters' }, { status: 400 });
    }

    console.log('Keywords API 호출:', { guid, matchedKeywords });

    const rssCollection = db.collection('rss_items');
    const query = rssCollection.where('guid', '==', guid);
    const docs = await query.get();
    
    if (docs.empty) {
      console.log('RSS 아이템을 찾을 수 없음:', guid);
      return NextResponse.json({ success: false, error: 'RSS item not found' }, { status: 404 });
    }

    const doc = docs.docs[0];
    await doc.ref.update({
      matchedKeywords: matchedKeywords,
      updatedAt: new Date()
    });

    console.log('키워드 업데이트 성공:', { guid, matchedKeywords });
    return NextResponse.json({ success: true, message: 'Keywords updated successfully' });

  } catch (error) {
    console.error('Keywords API 에러:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 