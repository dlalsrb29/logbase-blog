import { NextApiRequest, NextApiResponse } from 'next';
import Parser from 'rss-parser';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import path from 'path';
import fs from 'fs/promises';

// RSS 파싱을 위한 rss-parser 인스턴스 생성
const parser = new Parser({
  customFields: {
    item: ['content:encoded', 'description', 'summary'],
  },
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; RSSReader/1.0)',
  },
  timeout: 10000,
});

// RSS 피드 목록을 JSON 파일에서 로드
let FEEDS: { name: string; url: string; type: 'competitor' | 'noncompetitor'; status: 'active' | 'error' }[] = [];
try {
  const feedsPath = path.resolve(process.cwd(), 'public/feeds.json');
  const feedsContent = await fs.readFile(feedsPath, 'utf-8');
  FEEDS = JSON.parse(feedsContent);
  console.log('[rss-collect] public/feeds.json에서 피드 로드:', FEEDS.length, '개');
} catch (e) {
  console.log('[rss-collect] 피드 로드 오류:', e);
  // 기본 피드 목록 (fallback)
  FEEDS = [
    { name: 'avohq', url: 'https://avohq.io/blog/rss', type: 'competitor', status: 'active' },
    { name: 'segment', url: 'https://segment.com/blog/feed.xml', type: 'competitor', status: 'active' },
    { name: 'openai', url: 'https://openai.com/blog/rss.xml', type: 'competitor', status: 'active' },
    { name: 'pendo', url: 'https://www.pendo.io/pendo-blog/feed', type: 'competitor', status: 'active' },
    { name: 'mixpanel', url: 'https://mixpanel.com/blog/feed', type: 'competitor', status: 'error' },
    { name: 'databricks', url: 'https://www.databricks.com/rss.xml', type: 'competitor', status: 'active' },
    { name: 'freshpaint', url: 'https://rss.app/feeds/0S6b7vLWnGFO3Pbs.xml', type: 'competitor', status: 'active' },
    { name: 'amplitude', url: 'https://rss.app/feeds/Ma06vfcA9qgJA3dZ.xml', type: 'competitor', status: 'active' },
    { name: 'heap', url: 'https://rss.app/feeds/E41H3hZEVRkAB2Xb.xml', type: 'competitor', status: 'active' },
    { name: 'zeotap', url: 'https://rss.app/feeds/YPWdGDZ9EeBq67VJ.xml', type: 'competitor', status: 'active' },
    { name: 'avo', url: 'https://rss.app/feeds/6rBLKkjuHbjxPNub.xml', type: 'competitor', status: 'active' },
    { name: 'posthog', url: 'https://rss.app/feeds/zfIOyXjRZwkRaEzE.xml', type: 'competitor', status: 'active' },
    { name: 'logrocket', url: 'https://blog.logrocket.com/feed/', type: 'noncompetitor', status: 'active' },
    { name: 'otel_collector', url: 'https://github.com/open-telemetry/opentelemetry-collector/releases.atom', type: 'noncompetitor', status: 'active' },
    { name: 'montecarlo', url: 'https://www.montecarlodata.com/feed/', type: 'noncompetitor', status: 'active' },
    { name: 'montecarlo_product', url: 'https://www.montecarlodata.com/category/product/feed/', type: 'noncompetitor', status: 'active' },
    { name: 'towardsdatascience', url: 'https://towardsdatascience.com/feed', type: 'noncompetitor', status: 'active' },
    { name: 'aws_bigdata', url: 'https://aws.amazon.com/blogs/big-data/feed/', type: 'noncompetitor', status: 'active' },
    { name: 'snowplow', url: 'https://rss.app/feeds/xxSHa2H0VG127Q4h.xml', type: 'noncompetitor', status: 'active' },
    { name: 'logrocket_frontend', url: 'https://rss.app/feeds/OQnZqgiK7aZqIv4B.xml', type: 'noncompetitor', status: 'active' },
    { name: 'towardsdatascience_analytics', url: 'https://rss.app/feeds/jHv0SqVEQUa18Eln.xml', type: 'noncompetitor', status: 'active' }
  ];
  console.log('[rss-collect] 기본 하드코딩 피드 사용');
}

// 필터링에 사용할 키워드 목록
let KEYWORDS: string[] = [];
try {
  const keywordsPath = path.resolve(process.cwd(), 'public/keywords.json');
  const keywordsContent = await fs.readFile(keywordsPath, 'utf-8');
  KEYWORDS = JSON.parse(keywordsContent);
  console.log('[rss-collect] public/keywords.json에서 키워드 로드:', KEYWORDS.length, '개');
} catch (e) {
  console.log('[rss-collect] 키워드 로드 오류:', e);
  KEYWORDS = [
    'behavioral data',
    'event log',
    'event data',
    'analytics data',
    'observability',
    'log validation',
    'log enrichment',
    'user journey data',
    'journey data',
    'journey log',
    'journey tracking',
    'mobile tracking',
    'no code tracking',
    'user event stream',
    'behavioral analytics',
    'event instrumentation',
    'AI behavior modeling',
    'predictive behavior analytics',
    'user journey AI',
    'customer behavior AI',
    'data observability',
    'data contract validation',
    'automated logging',
    'analytics event QA',
    'data reliability',
    'A/B test',
    'data metric',
    'Analytics',
    'product analytics',
    'Machine learning in Analytics',
    'LLM in analytics',
    'Behavioral Segmentation',
  ];
  console.log('[rss-collect] 기본 하드코딩 키워드 사용');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = new Date();
  console.log(`🚀 RSS 피드 수집 시작: ${startTime.toLocaleString('ko-KR')}`);
  
  let allItems: any[] = [];
  let successCount = 0;
  let errorCount = 0;
  
  // 각 블로그의 RSS를 순회하며 데이터 수집
  for (const feed of FEEDS) {
    // status가 'error'인 피드는 건너뛰기
    if (feed.status === 'error') {
      console.log(`⏭️ 건너뛰기: ${feed.name} (에러 상태, ${feed.type})`);
      continue;
    }
    
    try {
      // RSS XML 직접 fetch
      const res = await fetch(feed.url);
      let xml = await res.text();
      
      // Astro 프로젝트 방식으로 단순화된 XML 정제
      // 1. 잘못된 &를 &amp;로 치환 (이미 올바른 엔티티는 그대로 둠)
      xml = xml.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[a-fA-F0-9]+;)/g, '&amp;');
      // 2. 2차 치환: 혹시 남아있는 &도 모두 &amp;로
      xml = xml.replace(/&(?![a-zA-Z0-9#]+;)/g, '&amp;');
      
      // 파싱
      const parsed = await parser.parseString(xml);
      
      // 각 글에 blogName(블로그명)과 type(경쟁사/비경쟁사) 추가
      parsed.items.forEach((item: any) => {
        (item as any).blogName = feed.name;
        (item as any).feedType = feed.type;
      });
      // 전체 글 목록에 추가
      allItems = allItems.concat(parsed.items);
      successCount++;
      console.log(`✅ RSS 파싱 성공: ${feed.name} (${parsed.items.length}개 글, ${feed.type})`);
    } catch (e) {
      // 에러 발생 시 메시지 출력
      console.error(`❌ RSS 파싱 에러: ${feed.name} (${feed.type}) - ${feed.url}`, e);
      errorCount++;
    }
    
    // 동시 요청 수를 제한하기 위해 더 긴 지연 추가
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // 경쟁사/비경쟁사별로 다른 필터링 적용
  const competitorItems = allItems.filter((item: any) => (item as any).feedType === 'competitor');
  const nonCompetitorItems = allItems.filter((item: any) => (item as any).feedType === 'noncompetitor');
  
  // 경쟁사: 키워드 매칭만 추출 (수집은 날짜 필터링 후에 결정)
  competitorItems.forEach((item: any) => {
    const text = (item.title + ' ' + (item.content || '') + ' ' + (item.summary || '')).toLowerCase();
    const matchedKeywords = KEYWORDS.filter(keyword => text.includes(keyword.toLowerCase()));
    (item as any).matchedKeywords = matchedKeywords;
  });
  
  // 비경쟁사: 키워드 필터링 적용 및 매칭 키워드 추출
  const filteredNonCompetitor = nonCompetitorItems
    .map((item: any) => {
      const text = (item.title + ' ' + (item.content || '') + ' ' + (item.summary || '')).toLowerCase();
      const matchedKeywords = KEYWORDS.filter(keyword => text.includes(keyword.toLowerCase()));
      (item as any).matchedKeywords = matchedKeywords;
      return item;
    })
    .filter((item: any) => (item as any).matchedKeywords.length > 0);
  
  // 경쟁사 + 비경쟁사(키워드 필터링된 것) 합치기
  const filtered = [...competitorItems, ...filteredNonCompetitor];

  // === 날짜 필터링 기준 설정 ===
  const now = new Date();
  // 오늘 00:00:00 (초기 수집 시 오늘 제외용)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  // 어제 00:00:00
  const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0);
  // 어제 23:59:59.999
  const yesterdayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);

  // Firestore에서 오늘 수집한 데이터 확인 (중복 체크용)
  const rssCollection = collection(db, 'rss_items');
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD 형식
  let todayDocsCount = 0;
  let existingTitles: Set<string> = new Set(); // 중복 체크용 Set
  
  try {
    const todayQuery = query(
      rssCollection,
      where('collectedDate', '==', today)
    );
    const todaySnapshot = await getDocs(todayQuery);
    todayDocsCount = todaySnapshot.size;
    
    // 오늘 저장된 글들의 제목+블로그명을 Set에 저장 (중복 체크용)
    todaySnapshot.docs.forEach(doc => {
      const data = doc.data();
      const key = `${data.title}_${data.blogName}`;
      existingTitles.add(key);
    });
    
    console.log(`[rss-collect] 오늘(${today}) 수집된 문서 개수:`, todayDocsCount);
    console.log(`[rss-collect] 중복 체크용 키 개수:`, existingTitles.size);
  } catch (e) {
    console.log('[rss-collect] 오늘 데이터 조회 오류:', e);
  }
  
  const hasTodayData = todayDocsCount > 0;

  // 항상 어제 날짜만 필터링 (경쟁사/비경쟁사 모두)
  let result: any[] = filtered
    .filter((item: any) => {
      if (!item.pubDate) return false;
      const pubDate = new Date(item.pubDate);
      return pubDate >= yesterdayStart && pubDate <= yesterdayEnd;
    })
    .sort((a: any, b: any) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  console.log(`📊 전체 ${allItems.length}개 글 중 경쟁사 ${competitorItems.length}개, 비경쟁사 키워드 필터링 후 ${filteredNonCompetitor.length}개, 총 ${filtered.length}개, 어제 날짜 필터링 후 ${result.length}개`);

  let savedCount = 0;
  let skippedCount = 0;
  
  // 각 글을 Firestore에 저장 (메모리 기반 중복 방지)
  for (const post of result) {
    try {
      // 메모리 기반 중복 체크: 제목+블로그명으로 키 생성
      const duplicateKey = `${post.title}_${post.blogName}`;
      
      if (existingTitles.has(duplicateKey)) {
        // 이미 저장된 글은 건너뛰기
        skippedCount++;
        continue;
      }
      
      // Firestore에 저장할 데이터 준비
      const rssData = {
        ...post,
        createdAt: new Date(),
        updatedAt: new Date(),
        collectedDate: today, // YYYY-MM-DD 형식
        news_letter_sent_date: null // 뉴스레터 발송일 (나중에 수동으로 설정)
      };
      
      // Firestore에 문서 추가
      await addDoc(rssCollection, rssData);
      savedCount++;
      
      // 중복 체크용 Set에도 추가
      existingTitles.add(duplicateKey);
      
      if (savedCount % 10 === 0) {
        console.log(`[rss-collect] ${savedCount}개 문서 저장 완료`);
      }
    } catch (e) {
      // 저장 에러 로그 (중요한 에러만)
      if (savedCount % 10 === 0) {
        console.error('❌ Firestore 저장 에러:', e);
      }
    }
    
    // Firestore 요청 제한을 방지하기 위해 지연 추가
    if (savedCount % 5 === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // 결과 요약
  const summary = {
    totalFeeds: FEEDS.filter(f => f.status === 'active').length,
    successfulFeeds: successCount,
    failedFeeds: errorCount,
    totalArticles: allItems.length,
    competitorArticles: competitorItems.length,
    nonCompetitorFilteredArticles: filteredNonCompetitor.length,
    totalFilteredArticles: filtered.length,
    savedArticles: savedCount,
    skippedArticles: skippedCount,
    filteredByDateArticles: result.length,
    message: savedCount > 0 
      ? `RSS 최신글 ${savedCount}개가 Firestore에 저장되었습니다! (중복 제외: ${skippedCount}개, 경쟁사: 키워드 필터 없음, 비경쟁사: 키워드 필터 적용)`
      : `키워드에 맞는 글이 없습니다. (전체 ${allItems.length}개 글 중 경쟁사 ${competitorItems.length}개, 비경쟁사 필터링 ${filteredNonCompetitor.length}개)`
  };

  const endTime = new Date();
  const duration = endTime.getTime() - startTime.getTime();
  const durationSeconds = Math.round(duration / 1000);
  
  console.log(`🏁 RSS 피드 수집 완료: ${endTime.toLocaleString('ko-KR')}`);
  console.log(`⏱️ 총 소요 시간: ${durationSeconds}초 (${Math.round(duration)}ms)`);
  console.log('📋 최종 결과:', summary);

  // 저장된 글 개수와 상세 정보 반환
  const responseData = {
    ...summary,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    durationSeconds: durationSeconds,
    durationMs: duration
  };
  
  res.status(200).json(responseData);
} 