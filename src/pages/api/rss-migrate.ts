import { NextApiRequest, NextApiResponse } from 'next';
import { RSSParser } from '@/lib/rss-parser';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, where, getDocs, getCountFromServer } from 'firebase/firestore';
import { RSSItem } from '@/types/rss';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const parser = new RSSParser();
      // RSS 데이터 마이그레이션 실행
      await parser.migrateAllRSSData();
      res.status(200).json({ 
        success: true, 
        message: 'RSS 데이터 마이그레이션이 완료되었습니다.' 
      });
    } catch (error) {
      console.error('RSS 마이그레이션 에러:', error);
      res.status(500).json({ 
        success: false, 
        error: 'RSS 데이터 마이그레이션 중 오류가 발생했습니다.' 
      });
    }
  } else if (req.method === 'GET') {
    try {
      const { blogName, pageSize = '10', feedType, searchText = '', page = '1' } = req.query;
      const pageSizeNum = parseInt(pageSize as string);
      const pageNum = parseInt(page as string);
      const searchTextLower = (searchText as string).toLowerCase();

      const rssCollection = collection(db, 'rss_items');
      let items: RSSItem[] = [];
      let totalCount = 0;
      let filteredCount = 0;

      // 전체 데이터를 가져와서 메모리에서 필터링 및 페이지네이션 처리
      // (Firestore의 OFFSET 제한 때문에 이 방식 사용)
      let baseQuery = query(rssCollection, orderBy('isoDate', 'desc'));
      
      // 필터 조건 추가
      if (blogName && blogName !== 'all') {
        baseQuery = query(rssCollection, where('blogName', '==', blogName), orderBy('isoDate', 'desc'));
      }
      if (feedType && feedType !== 'all') {
        if (blogName && blogName !== 'all') {
          baseQuery = query(rssCollection, 
            where('blogName', '==', blogName),
            where('feedType', '==', feedType),
            orderBy('isoDate', 'desc')
          );
        } else {
          baseQuery = query(rssCollection, 
            where('feedType', '==', feedType),
            orderBy('isoDate', 'desc')
          );
        }
      }

      console.log('🔍 쿼리 조건:', { blogName, feedType, searchText, page, pageSize });

      const docsSnap = await getDocs(baseQuery);
      let allItems = docsSnap.docs.map(doc => doc.data() as RSSItem);
      
      console.log('📊 전체 데이터 수:', allItems.length);

      // 검색어 필터링
      if (searchTextLower) {
        allItems = allItems.filter(item =>
          (item.blogName && item.blogName.toLowerCase().includes(searchTextLower)) ||
          (item.title && item.title.toLowerCase().includes(searchTextLower)) ||
          (item.description && item.description.toLowerCase().includes(searchTextLower))
        );
        console.log('🔍 검색 필터 후 데이터 수:', allItems.length);
      }

      filteredCount = allItems.length;
      
      // OFFSET 기반 페이지네이션
      const startIdx = (pageNum - 1) * pageSizeNum;
      const endIdx = startIdx + pageSizeNum;
      items = allItems.slice(startIdx, endIdx);

      console.log('📄 페이지네이션:', {
        page: pageNum,
        pageSize: pageSizeNum,
        startIdx,
        endIdx,
        resultCount: items.length,
        filteredCount
      });

      // 전체 개수 (필터링 전)
      const totalCountSnap = await getCountFromServer(rssCollection);
      totalCount = totalCountSnap.data().count;

      // 마지막 아이템의 isoDate (호환성을 위해 유지)
      const lastIsoDate = items.length > 0 ? items[items.length - 1].isoDate : null;

      res.status(200).json({
        success: true,
        data: items,
        count: items.length,
        totalCount,
        filteredCount,
        lastIsoDate,
        currentPage: pageNum,
        totalPages: Math.ceil(filteredCount / pageSizeNum)
      });

    } catch (error) {
      console.error('RSS 조회 에러:', error);
      res.status(500).json({
        success: false,
        error: 'RSS 데이터 조회 중 오류가 발생했습니다.'
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 