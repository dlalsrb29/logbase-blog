import { collection, addDoc, getDocs, query, where, orderBy, limit, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { RSSItem, RSSCollection } from '@/types/rss';
import fs from 'fs';
import path from 'path';

export class RSSParser {
  private rssDirectory: string;

  constructor(rssDirectory: string = '../logbase-blog-astro/public/rss') {
    this.rssDirectory = rssDirectory;
  }

  /**
   * RSS JSON 파일들을 읽어서 파싱
   */
  async parseRSSFiles(): Promise<RSSItem[]> {
    try {
      const files = await this.getRSSFiles();
      const allItems: RSSItem[] = [];

      for (const file of files) {
        try {
          const filePath = path.join(this.rssDirectory, file);
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const rssItem: RSSItem = JSON.parse(fileContent);
          
          // 파일명에서 날짜 정보 추출
          const fileName = path.basename(file, '.json');
          const dateMatch = fileName.match(/(\d{8})/);
          if (dateMatch) {
            rssItem.collectedDate = dateMatch[1];
          }
          
          allItems.push(rssItem);
        } catch (error) {
          console.error(`Error parsing file ${file}:`, error);
        }
      }

      return allItems;
    } catch (error) {
      console.error('Error parsing RSS files:', error);
      throw error;
    }
  }

  /**
   * RSS 디렉토리에서 JSON 파일 목록 가져오기
   */
  private async getRSSFiles(): Promise<string[]> {
    try {
      const files = fs.readdirSync(this.rssDirectory);
      return files.filter(file => file.endsWith('.json'));
    } catch (error) {
      console.error('Error reading RSS directory:', error);
      return [];
    }
  }

  /**
   * RSS 아이템을 Firestore에 저장
   */
  async saveToFirestore(items: RSSItem[]): Promise<void> {
    try {
      console.log('🔥 Firestore 연결 테스트 중...');
      
      // Firestore 연결 테스트
      const rssCollection = collection(db, 'rss_items');
      const testQuery = query(rssCollection, limit(1));
      try {
        await getDocs(testQuery);
        console.log('✅ Firestore 연결 성공');
      } catch (connectionError) {
        console.error('❌ Firestore 연결 실패:', connectionError);
        throw new Error(`Firestore 연결 실패: ${connectionError}`);
      }

      let savedCount = 0;
      let skippedCount = 0;
      let errorCount = 0;

      console.log(`📝 ${items.length}개 아이템 저장 시작...`);

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        console.log(`🔄 처리 중 (${i + 1}/${items.length}): ${item.blogName} - ${item.title?.substring(0, 30)}...`);
        
        try {
          // 매우 간단한 데이터만 저장 (문제가 될 수 있는 필드 제외)
          const simpleItem = {
            title: item.title?.substring(0, 1000) || '',
            link: item.link?.substring(0, 500) || '',
            pubDate: item.pubDate?.substring(0, 100) || '',
            description: item.description?.substring(0, 2000) || '',
            guid: item.guid?.substring(0, 500) || '',
            isoDate: item.isoDate?.substring(0, 100) || '',
            blogName: item.blogName?.substring(0, 100) || '',
            feedType: item.feedType || 'noncompetitor',
            matchedKeywords: Array.isArray(item.matchedKeywords) ? 
              item.matchedKeywords.slice(0, 10).map(k => k.substring(0, 100)) : [],
            collectedDate: item.collectedDate?.substring(0, 20) || '',
            createdAt: new Date(),
            updatedAt: new Date()
          };

          console.log(`📋 데이터 준비 완료: ${item.blogName}`);

          // 중복 체크 (guid 기준)
          const existingQuery = query(
            rssCollection,
            where('guid', '==', item.guid)
          );
          
          console.log(`🔍 중복 체크 중: ${item.guid}`);
          const existingDocs = await getDocs(existingQuery);

          if (existingDocs.empty) {
            // 새 아이템 저장
            console.log(`💾 새 문서 저장 중: ${item.blogName}`);
            await addDoc(rssCollection, simpleItem);
            savedCount++;
            console.log(`✅ 저장됨: ${item.blogName} - ${item.title?.substring(0, 50)}...`);
          } else {
            // 기존 아이템 업데이트
            console.log(`🔄 기존 문서 업데이트 중: ${item.blogName}`);
            const docRef = doc(db, 'rss_items', existingDocs.docs[0].id);
            await updateDoc(docRef, {
              ...simpleItem,
              updatedAt: new Date()
            });
            skippedCount++;
            console.log(`⏭️ 건너뜀: ${item.blogName} - ${item.title?.substring(0, 50)}...`);
          }
        } catch (error) {
          console.error(`❌ 에러 발생: ${item.blogName} - ${item.guid}`, error);
          errorCount++;
          
          // 에러 발생 시 즉시 중단
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new Error(`RSS 저장 중 에러 발생: ${item.blogName} - ${item.guid} - ${errorMessage}`);
        }
        
        // 각 아이템 간 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      console.log(`🎉 RSS 저장 완료: ${savedCount}개 새로 저장, ${skippedCount}개 업데이트, ${errorCount}개 에러`);
    } catch (error) {
      console.error('💥 Error saving to Firestore:', error);
      throw error;
    }
  }

  /**
   * Firestore에 안전한 데이터 형식으로 변환
   */
  private sanitizeForFirestore(item: RSSItem): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};

    // 각 필드를 안전하게 변환
    for (const [key, value] of Object.entries(item)) {
      if (value !== undefined && value !== null) {
        // 문자열 길이 제한 (Firestore는 1MB 제한)
        if (typeof value === 'string' && value.length > 1000000) {
          sanitized[key] = value.substring(0, 1000000) + '... [truncated]';
        }
        // Date 객체 처리
        else if (key === 'isoDate' && typeof value === 'string') {
          try {
            sanitized[key] = new Date(value);
          } catch {
            sanitized[key] = value;
          }
        }
        // 배열 처리
        else if (Array.isArray(value)) {
          sanitized[key] = value.map(v => 
            typeof v === 'string' && v.length > 1000 ? v.substring(0, 1000) : v
          );
        }
        // 일반 값
        else {
          sanitized[key] = value;
        }
      }
    }

    return sanitized;
  }

  /**
   * Firestore에서 RSS 아이템 조회
   */
  async getFromFirestore(limitCount: number = 50): Promise<RSSItem[]> {
    try {
      const rssCollection = collection(db, 'rss_items');
      const q = query(
        rssCollection,
        orderBy('isoDate', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const items: RSSItem[] = [];
      
      querySnapshot.forEach((doc) => {
        items.push(doc.data() as RSSItem);
      });

      return items;
    } catch (error) {
      console.error('Error getting from Firestore:', error);
      throw error;
    }
  }

  /**
   * 특정 블로그의 RSS 아이템 조회
   */
  async getByBlogName(blogName: string, limitCount: number = 20): Promise<RSSItem[]> {
    try {
      const rssCollection = collection(db, 'rss_items');
      const q = query(
        rssCollection,
        where('blogName', '==', blogName),
        orderBy('isoDate', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const items: RSSItem[] = [];
      
      querySnapshot.forEach((doc) => {
        items.push(doc.data() as RSSItem);
      });

      return items;
    } catch (error) {
      console.error('Error getting by blog name:', error);
      throw error;
    }
  }

  /**
   * 전체 RSS 데이터 마이그레이션 실행
   */
  async migrateAllRSSData(): Promise<void> {
    try {
      console.log('RSS 데이터 마이그레이션 시작...');
      
      const items = await this.parseRSSFiles();
      console.log(`총 ${items.length}개의 RSS 아이템을 파싱했습니다.`);
      
      await this.saveToFirestore(items);
      
      console.log('RSS 데이터 마이그레이션 완료!');
    } catch (error) {
      console.error('RSS 데이터 마이그레이션 실패:', error);
      throw error;
    }
  }
} 