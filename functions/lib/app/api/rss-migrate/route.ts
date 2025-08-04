import { NextRequest, NextResponse } from 'next/server';
import { RSSParser } from '@/lib/rss-parser';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { RSSItem } from '@/types/rss';

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
    const parser = new RSSParser();
    // RSS 데이터 마이그레이션 실행
    await parser.migrateAllRSSData();
    return NextResponse.json({ 
      success: true, 
      message: 'RSS 데이터 마이그레이션이 완료되었습니다.' 
    });
  } catch (error) {
    console.error('RSS 마이그레이션 에러:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'RSS 데이터 마이그레이션 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blogName = searchParams.get('blogName');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const feedType = searchParams.get('feedType');
    const startAfterIsoDate = searchParams.get('startAfterIsoDate');
    const searchText = searchParams.get('searchText')?.toLowerCase() || '';
    const page = parseInt(searchParams.get('page') || '1');
    const parser = new RSSParser();

    const rssCollection = db.collection('rss_items');
    let items: RSSItem[] = [];
    let totalCount = 0;
    let filteredCount = 0;
    let lastIsoDate = null;

    if (searchText) {
      // 검색어가 있을 때는 전체 데이터 받아서 서버에서 필터링
      const allDocs = await rssCollection.orderBy('isoDate', 'desc').get();
      const allItems = allDocs.docs.map(doc => doc.data() as RSSItem);
      totalCount = allItems.length;
      items = allItems.filter(item =>
        (item.blogName && item.blogName.toLowerCase().includes(searchText)) ||
        (item.title && item.title.toLowerCase().includes(searchText)) ||
        (item.description && item.description.toLowerCase().includes(searchText))
      );
      // feedType 추가 필터
      if (feedType && feedType !== 'all') {
        items = items.filter(item => item.feedType === feedType);
      }
      filteredCount = items.length;
      // 페이지네이션 (프론트에서 slice)
      const startIdx = (page - 1) * pageSize;
      const pagedItems = items.slice(startIdx, startIdx + pageSize);
      // 마지막 커서 값(isoDate)
      lastIsoDate = pagedItems.length > 0 ? pagedItems[pagedItems.length - 1].isoDate : null;
      return NextResponse.json({
        success: true,
        data: pagedItems,
        count: pagedItems.length,
        totalCount,
        filteredCount,
        lastIsoDate
      });
    }

    // 검색어가 없을 때는 기존 커서 기반 페이지네이션
    let query = rssCollection.orderBy('isoDate', 'desc').limit(pageSize);
    
    if (blogName) {
      query = query.where('blogName', '==', blogName);
    }
    if (feedType && feedType !== 'all') {
      query = query.where('feedType', '==', feedType);
    }
    if (startAfterIsoDate) {
      // Firebase Admin SDK에서는 startAfter를 다르게 처리해야 함
      const startAfterDoc = await rssCollection.where('isoDate', '==', startAfterIsoDate).limit(1).get();
      if (!startAfterDoc.empty) {
        query = query.startAfter(startAfterDoc.docs[0]);
      }
    }
    
    const docsSnap = await query.get();
    items = docsSnap.docs.map(doc => doc.data() as RSSItem);
    
    // 전체 개수(필터 적용 전 전체 개수)
    const totalCountSnap = await rssCollection.orderBy('isoDate', 'desc').count().get();
    totalCount = totalCountSnap.data().count;
    
    // 필터링된 전체 개수
    filteredCount = totalCount;
    if (feedType && feedType !== 'all') {
      const filteredCountSnap = await rssCollection.where('feedType', '==', feedType).count().get();
      filteredCount = filteredCountSnap.data().count;
    }
    
    // 마지막 커서 값(isoDate)
    const lastDoc = docsSnap.docs[docsSnap.docs.length - 1];
    lastIsoDate = lastDoc ? lastDoc.get('isoDate') : null;

    return NextResponse.json({
      success: true,
      data: items,
      count: items.length,
      totalCount,
      filteredCount,
      lastIsoDate
    });
  } catch (error) {
    console.error('RSS 조회 에러:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'RSS 데이터 조회 중 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
} 