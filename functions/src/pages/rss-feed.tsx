'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { RSSItem } from '@/types/rss';
import { SITE_TITLE } from '@/consts';

export default function RSSFeedPage() {
  const [rssItems, setRssItems] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<string>('all');
  const [migrating, setMigrating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  // 키워드 입력 상태 관리
  const [keywordInputs, setKeywordInputs] = useState<{ [key: string]: string }>({});
  const [localKeywords, setLocalKeywords] = useState<{ [key: string]: string[] }>({});
  const [updatingKeyword, setUpdatingKeyword] = useState<{ [key: string]: boolean }>({});
  const [deletingItem, setDeletingItem] = useState<{ [key: string]: boolean }>({});
  const [blogSearch, setBlogSearch] = useState('');
  const [feedType, setFeedType] = useState('all');
  const [searchTrigger, setSearchTrigger] = useState(0);
  // 뉴스레터 발송일 상태 관리
  const [newsletterDates, setNewsletterDates] = useState<{ [key: string]: string }>({});
  const [savingNewsletterDate, setSavingNewsletterDate] = useState<{ [key: string]: boolean }>({});
  const [showKeywordManager, setShowKeywordManager] = useState(false);
  
  // RSS 수집용 키워드 관리 상태
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordLoading, setKeywordLoading] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [editingKeyword, setEditingKeyword] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [keywordError, setKeywordError] = useState<string | null>(null);
  const [keywordSuccess, setKeywordSuccess] = useState<string | null>(null);

  // RSS 피드 관리 상태
  const [feeds, setFeeds] = useState<any[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [showFeedManager, setShowFeedManager] = useState(false);
  const [newFeed, setNewFeed] = useState({ name: '', url: '', type: 'noncompetitor', status: 'active' });
  const [editingFeed, setEditingFeed] = useState<any | null>(null);
  const [editFeedValue, setEditFeedValue] = useState({ name: '', url: '', type: 'noncompetitor', status: 'active' });
  const [feedError, setFeedError] = useState<string | null>(null);
  const [feedSuccess, setFeedSuccess] = useState<string | null>(null);

  // 서버에서 받아온 rssItems가 이미 page, pageSize, feedType에 맞게 필터링된 데이터임
  const itemsToShow = rssItems;

  // filteredCount를 상태로 관리
  const [filteredCount, setFilteredCount] = useState<number | undefined>(undefined);
  const [totalPages, setTotalPages] = useState(0);

  // RSS 데이터 로드 - 간단한 페이지네이션
  const loadRSSData = async (blogName?: string, page = 1, pageSize = 10, feedTypeParam?: string, searchTextParam?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 RSS 데이터 로딩 시작:', {
        blogName,
        page,
        pageSize,
        feedTypeParam,
        searchTextParam
      });
      
      const params = new URLSearchParams();
      if (blogName && blogName !== 'all') {
        params.append('blogName', blogName);
      }
      params.append('page', String(page));
      params.append('pageSize', String(pageSize));
      if (feedTypeParam && feedTypeParam !== 'all') {
        params.append('feedType', feedTypeParam);
      }
      if (searchTextParam) {
        params.append('searchText', searchTextParam);
      }
      
      const url = `/api/rss-migrate?${params}`;
      console.log('📡 API 요청 URL:', url);
      
      const response = await fetch(url);
      console.log('📡 API 응답 상태:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('📡 API 응답 데이터:', result);
      
      if (result.success) {
        setRssItems(result.data || []);
        setTotalCount(result.totalCount || 0);
        setFilteredCount(result.filteredCount);
        setTotalPages(result.totalPages || Math.ceil((result.filteredCount || result.totalCount) / pageSize));
        
        console.log('✅ RSS 데이터 로딩 완료:', {
          itemsCount: result.data?.length || 0,
          totalCount: result.totalCount || 0,
          filteredCount: result.filteredCount
        });
      } else {
        console.error('❌ API 응답 에러:', result.error);
        setError(result.error || '데이터를 불러오는 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('❌ RSS 데이터 로딩 에러:', err);
      setError('RSS 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // RSS 데이터 마이그레이션
  const migrateRSSData = async () => {
    try {
      setMigrating(true);
      const response = await fetch('/api/rss-migrate', {
        method: 'POST'
      });
      const result = await response.json();
      
      if (result.success) {
        alert('RSS 데이터 마이그레이션이 완료되었습니다!');
        loadRSSData(selectedBlog, currentPage, pageSize);
      } else {
        alert('마이그레이션 중 오류가 발생했습니다: ' + result.error);
      }
    } catch (err) {
      alert('마이그레이션 중 오류가 발생했습니다.');
    } finally {
      setMigrating(false);
    }
  };

  // 블로그 필터 변경
  const handleBlogChange = (blogName: string) => {
    setSelectedBlog(blogName);
    setCurrentPage(1);
    loadRSSData(blogName === 'all' ? undefined : blogName, 1, pageSize);
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadRSSData(selectedBlog === 'all' ? undefined : selectedBlog, page, pageSize, feedType, blogSearch);
  };

  // 페이지 사이즈 변경
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    loadRSSData(selectedBlog === 'all' ? undefined : selectedBlog, 1, size, feedType, blogSearch);
  };

  // 키워드 입력 변경
  const handleKeywordInputChange = (guid: string, value: string) => {
    setKeywordInputs(prev => ({ ...prev, [guid]: value }));
  };

  // Firestore에 키워드 추가
  const handleAddKeyword = async (guid: string) => {
    const newInput = keywordInputs[guid]?.trim();
    if (!newInput) return;
    const newKeywords = newInput
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);
    if (newKeywords.length === 0) return;

    setUpdatingKeyword(prev => ({ ...prev, [guid]: true }));

    // 기존 키워드와 합치고 중복 제거
    const item = rssItems.find(item => item.guid === guid);
    const existing = localKeywords[guid] || item?.matchedKeywords || [];
    const merged = Array.from(new Set([...existing, ...newKeywords]));

    // Firestore에 업데이트
    try {
      const res = await fetch(`/api/rss-migrate/keywords`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guid, matchedKeywords: merged })
      });
      const result = await res.json();
      if (result.success) {
        setLocalKeywords(prev => ({ ...prev, [guid]: merged }));
        setKeywordInputs(prev => ({ ...prev, [guid]: '' }));
      } else {
        alert('키워드 저장 실패: ' + result.error);
      }
    } catch (err) {
      alert('키워드 저장 중 오류 발생');
    } finally {
      setUpdatingKeyword(prev => ({ ...prev, [guid]: false }));
    }
  };

  // Firestore에서 키워드 삭제
  const handleDeleteKeyword = async (guid: string, keyword: string) => {
    if (!window.confirm(`키워드 "${keyword}"을(를) 삭제하시겠습니까?`)) return;
    const item = rssItems.find(item => item.guid === guid);
    const existing = localKeywords[guid] || item?.matchedKeywords || [];
    const updated = existing.filter(k => k !== keyword);
    setUpdatingKeyword(prev => ({ ...prev, [guid]: true }));
    try {
      const res = await fetch(`/api/rss-migrate/keywords`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guid, matchedKeywords: updated })
      });
      const result = await res.json();
      if (result.success) {
        setLocalKeywords(prev => ({ ...prev, [guid]: updated }));
      } else {
        alert('키워드 삭제 실패: ' + result.error);
      }
    } catch (err) {
      alert('키워드 삭제 중 오류 발생');
    } finally {
      setUpdatingKeyword(prev => ({ ...prev, [guid]: false }));
    }
  };

  // Firestore에서 글(문서) 삭제
  const handleDeleteItem = async (guid: string) => {
    if (!window.confirm('이 글을 삭제하시겠습니까?')) return;
    setDeletingItem(prev => ({ ...prev, [guid]: true }));
    try {
      const res = await fetch(`/api/rss-migrate/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guid })
      });
      const result = await res.json();
      if (result.success) {
        setRssItems(prev => prev.filter(item => item.guid !== guid));
        setLocalKeywords(prev => {
          const copy = { ...prev };
          delete copy[guid];
          return copy;
        });
      } else {
        alert('글 삭제 실패: ' + result.error);
      }
    } catch (err) {
      alert('글 삭제 중 오류 발생');
    } finally {
      setDeletingItem(prev => ({ ...prev, [guid]: false }));
    }
  };

  // feedType 변경 시 커서 초기화
  const handleFeedTypeChange = (value: string) => {
    setFeedType(value);
    setCurrentPage(1);
    loadRSSData(selectedBlog, 1, pageSize, value, blogSearch);
  };

  // useEffect에서 커서 초기화
  useEffect(() => {
    loadRSSData(selectedBlog, 1, pageSize);
    // eslint-disable-next-line
  }, []);

  // 고유한 블로그 이름 목록 추출 및 검색/타입 필터링
  const uniqueBlogs = Array.from(new Set(rssItems.map(item => item.blogName))).sort();
  const filteredBlogs = uniqueBlogs.filter(blog => {
    const blogMatch = blogSearch ? blog.toLowerCase().includes(blogSearch.toLowerCase()) : true;
    if (feedType === 'all') return blogMatch;
    const typeMatch = rssItems.find(item => item.blogName === blog)?.feedType === feedType;
    return blogMatch && typeMatch;
  });

  // 서버에서 받아온 rssItems가 이미 필터링된 데이터이므로 그대로 사용
  const filteredItems = rssItems;

  // 검색 버튼 클릭 시 커서 초기화
  const handleSearch = () => {
    setCurrentPage(1);
    loadRSSData(selectedBlog === 'all' ? undefined : selectedBlog, 1, pageSize, feedType, blogSearch);
  };

  // 날짜 포맷팅 - GMT와 KST 모두 표시
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // GMT 시간 표시
    const gmtTime = date.toLocaleString('ko-KR', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    // KST 시간 표시
    const kstTime = date.toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    return `${gmtTime} GMT / ${kstTime} KST`;
  };

  // 페이지네이션 계산
  // const totalPages = Math.ceil((filteredCount ?? totalCount) / pageSize);

  // RSS 수집용 키워드 관리 함수들
  const loadKeywords = async () => {
    try {
      setKeywordLoading(true);
      const response = await fetch('/api/keywords');
      const result = await response.json();
      
      if (result.success) {
        setKeywords(result.keywords);
      } else {
        setKeywordError('키워드 목록을 불러올 수 없습니다.');
      }
    } catch (error) {
      setKeywordError('키워드 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setKeywordLoading(false);
    }
  };

  const handleAddKeywordToManager = async () => {
    if (!newKeyword.trim()) {
      setKeywordError('키워드를 입력해주세요.');
      return;
    }

    try {
      setKeywordLoading(true);
      setKeywordError(null);
      
      const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: newKeyword.trim() })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setKeywords(result.keywords);
        setNewKeyword('');
        setKeywordSuccess('키워드가 추가되었습니다.');
        setTimeout(() => setKeywordSuccess(null), 3000);
      } else {
        setKeywordError(result.error);
      }
    } catch (error) {
      setKeywordError('키워드 추가 중 오류가 발생했습니다.');
    } finally {
      setKeywordLoading(false);
    }
  };

  const startEdit = (keyword: string) => {
    setEditingKeyword(keyword);
    setEditValue(keyword);
  };

  const handleEditKeyword = async () => {
    if (!editingKeyword || !editValue.trim()) {
      setKeywordError('키워드를 입력해주세요.');
      return;
    }

    try {
      setKeywordLoading(true);
      setKeywordError(null);
      
      const response = await fetch('/api/keywords', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          oldKeyword: editingKeyword, 
          newKeyword: editValue.trim() 
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setKeywords(result.keywords);
        setEditingKeyword(null);
        setEditValue('');
        setKeywordSuccess('키워드가 수정되었습니다.');
        setTimeout(() => setKeywordSuccess(null), 3000);
      } else {
        setKeywordError(result.error);
      }
    } catch (error) {
      setKeywordError('키워드 수정 중 오류가 발생했습니다.');
    } finally {
      setKeywordLoading(false);
    }
  };

  const handleDeleteKeywordFromManager = async (keyword: string) => {
    if (!window.confirm(`키워드 "${keyword}"을(를) 삭제하시겠습니까?`)) {
      return;
    }

    try {
      setKeywordLoading(true);
      setKeywordError(null);
      
      const response = await fetch('/api/keywords', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setKeywords(result.keywords);
        setKeywordSuccess('키워드가 삭제되었습니다.');
        setTimeout(() => setKeywordSuccess(null), 3000);
      } else {
        setKeywordError(result.error);
      }
    } catch (error) {
      setKeywordError('키워드 삭제 중 오류가 발생했습니다.');
    } finally {
      setKeywordLoading(false);
    }
  };

  // 키워드 관리가 표시될 때 키워드 로드
  useEffect(() => {
    if (showKeywordManager) {
      loadKeywords();
    }
  }, [showKeywordManager]);

  // RSS 피드 관리 함수들
  const loadFeeds = async () => {
    setFeedLoading(true);
    try {
      const response = await fetch('/api/feeds');
      const result = await response.json();
      if (result.success) {
        setFeeds(result.feeds);
      } else {
        setFeedError(result.error || 'RSS 피드를 불러오는 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setFeedError('RSS 피드를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setFeedLoading(false);
    }
  };

  const handleAddFeedToManager = async () => {
    if (!newFeed.name.trim() || !newFeed.url.trim()) {
      setFeedError('피드 이름과 URL을 입력해주세요.');
      return;
    }

    setFeedLoading(true);
    setFeedError(null);
    setFeedSuccess(null);

    try {
      const response = await fetch('/api/feeds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFeed),
      });

      const result = await response.json();

      if (result.success) {
        setFeeds(result.feeds);
        setFeedSuccess('RSS 피드가 추가되었습니다.');
        setNewFeed({ name: '', url: '', type: 'noncompetitor', status: 'active' });
      } else {
        setFeedError(result.error || 'RSS 피드 추가 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setFeedError('RSS 피드 추가 중 오류가 발생했습니다.');
    } finally {
      setFeedLoading(false);
    }
  };

  const startEditFeed = (feed: any) => {
    setEditingFeed(feed);
    setEditFeedValue({ ...feed });
  };

  const handleEditFeed = async () => {
    if (!editFeedValue.name.trim() || !editFeedValue.url.trim()) {
      setFeedError('피드 이름과 URL을 입력해주세요.');
      return;
    }

    setFeedLoading(true);
    setFeedError(null);
    setFeedSuccess(null);

    try {
      const response = await fetch('/api/feeds', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldName: editingFeed.name,
          ...editFeedValue
        }),
      });

      const result = await response.json();

      if (result.success) {
        setFeeds(result.feeds);
        setFeedSuccess('RSS 피드가 수정되었습니다.');
        setEditingFeed(null);
        setEditFeedValue({ name: '', url: '', type: 'noncompetitor', status: 'active' });
      } else {
        setFeedError(result.error || 'RSS 피드 수정 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setFeedError('RSS 피드 수정 중 오류가 발생했습니다.');
    } finally {
      setFeedLoading(false);
    }
  };

  const handleDeleteFeedFromManager = async (feed: any) => {
    if (!window.confirm(`RSS 피드 "${feed.name}"을(를) 삭제하시겠습니까?`)) {
      return;
    }

    setFeedLoading(true);
    setFeedError(null);
    setFeedSuccess(null);

    try {
      const response = await fetch('/api/feeds', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: feed.name }),
      });

      const result = await response.json();

      if (result.success) {
        setFeeds(result.feeds);
        setFeedSuccess('RSS 피드가 삭제되었습니다.');
      } else {
        setFeedError(result.error || 'RSS 피드 삭제 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setFeedError('RSS 피드 삭제 중 오류가 발생했습니다.');
    } finally {
      setFeedLoading(false);
    }
  };

  // RSS 피드 관리가 표시될 때 피드 로드
  useEffect(() => {
    if (showFeedManager) {
      loadFeeds();
    }
  }, [showFeedManager]);

  return (
    <>
      <Head>
        <title>{`RSS 피드 - ${SITE_TITLE}`}</title>
        <meta name="description" content="RSS 피드 관리 및 뉴스레터 서비스" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      
      <div className="rss-feed-container">
        <div className="rss-header">
          <h1>RSS Feed Collection</h1>
          <div className="rss-controls" style={{ justifyContent: 'center' }}>
            {/* 블로그 검색 input */}
            <input
              type="text"
              value={blogSearch}
              onChange={e => setBlogSearch(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              placeholder="블로그명, 제목, 내용 검색"
              className="blog-search-input"
            />

            {/* feedType 셀렉트 */}
            <select
              value={feedType}
              onChange={e => handleFeedTypeChange(e.target.value)}
              className="blog-filter"
            >
              <option value="all">전체</option>
              <option value="competitor">경쟁사</option>
              <option value="noncompetitor">비경쟁사</option>
            </select>

            {/* 검색 버튼 */}
            <button
              type="button"
              onClick={handleSearch}
              className="migrate-btn"
            >
              검색
            </button>
          </div>
          <br />
          <div className="rss-controls" style={{ justifyContent: 'center' }}>
            {/* RSS 수집용 키워드 관리 버튼 */}
            <button
              type="button"
              onClick={() => setShowKeywordManager(!showKeywordManager)}
              className="migrate-btn"
              style={{ background: showKeywordManager ? '#ef4444' : '#10b981' }}
            >
              {showKeywordManager ? 'RSS 수집 키워드 관리 닫기' : 'RSS 수집 키워드 관리'}
            </button>

            {/* RSS 피드 관리 버튼 */}
            <button
              type="button"
              onClick={() => setShowFeedManager(!showFeedManager)}
              className="migrate-btn"
              style={{ background: showFeedManager ? '#ef4444' : '#3b82f6' }}
            >
              {showFeedManager ? 'RSS FEED URL 관리 닫기' : 'RSS FEED URL 관리'}
            </button>
          </div>
        </div>

        {/* 인라인 키워드 관리 섹션 */}
        {showKeywordManager && (
          <div className="keyword-manager-section">
            <div className="keyword-manager-header">
              <h3>RSS 수집용 키워드 관리</h3>
              <button
                onClick={() => setShowKeywordManager(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>

            <div className="info-box">
              <strong>설명:</strong> 이 키워드들은 RSS 피드 수집 시 필터링에 사용됩니다. 
              경쟁사 블로그의 모든 글은 자동으로 수집되고, 비경쟁사 블로그는 이 키워드가 포함된 글만 수집됩니다.
            </div>

            {/* 알림 메시지 */}
            {keywordError && (
              <div className="error-message">
                {keywordError}
              </div>
            )}
            
            {keywordSuccess && (
              <div className="success-message">
                {keywordSuccess}
              </div>
            )}

            {/* 새 키워드 추가 */}
            <div className="add-keyword-section">
              <h4>새 키워드 추가</h4>
              <div className="keyword-input-group">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddKeywordToManager()}
                  placeholder="새 키워드를 입력하세요"
                  disabled={keywordLoading}
                />
                <button
                  onClick={handleAddKeywordToManager}
                  disabled={keywordLoading || !newKeyword.trim()}
                  className="add-btn"
                >
                  {keywordLoading ? '추가 중...' : '추가'}
                </button>
              </div>
            </div>

            {/* 키워드 목록 */}
            <div className="keyword-list-section">
              <h4>현재 키워드 목록 ({keywords.length}개)</h4>
              
              {keywordLoading && keywords.length === 0 ? (
                <div className="loading-message">키워드를 불러오는 중...</div>
              ) : keywords.length === 0 ? (
                <div className="empty-message">등록된 키워드가 없습니다.</div>
              ) : (
                <div className="keyword-grid">
                  {keywords.map((keyword, index) => (
                    <div key={index} className="keyword-item">
                      {editingKeyword === keyword ? (
                        <div className="keyword-edit-group">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleEditKeyword();
                              if (e.key === 'Escape') {
                                setEditingKeyword(null);
                                setEditValue('');
                              }
                            }}
                            autoFocus
                          />
                          <button
                            onClick={handleEditKeyword}
                            disabled={keywordLoading}
                            className="save-btn"
                          >
                            저장
                          </button>
                          <button
                            onClick={() => {
                              setEditingKeyword(null);
                              setEditValue('');
                            }}
                            disabled={keywordLoading}
                            className="cancel-btn"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="keyword-text">{keyword}</span>
                          <div className="keyword-actions">
                            <button
                              onClick={() => startEdit(keyword)}
                              disabled={keywordLoading}
                              className="edit-btn"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDeleteKeywordFromManager(keyword)}
                              disabled={keywordLoading}
                              className="delete-btn"
                            >
                              삭제
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 인라인 RSS 피드 관리 섹션 */}
        {showFeedManager && (
          <div className="feed-manager-section">
            <div className="feed-manager-header">
              <h3>RSS 피드 관리</h3>
              <button
                onClick={() => setShowFeedManager(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="info-box">
              <strong>설명:</strong> RSS 피드를 추가, 수정, 삭제할 수 있습니다. 
              경쟁사 피드는 키워드 필터 없이 모든 글을 수집하고, 비경쟁사 피드는 키워드가 포함된 글만 수집합니다.
            </div>
            {feedError && (
              <div className="error-message">
                {feedError}
              </div>
            )}
            {feedSuccess && (
              <div className="success-message">
                {feedSuccess}
              </div>
            )}
            <div className="add-feed-section">
              <h4>새 RSS 피드 추가</h4>
              <div className="feed-input-group">
                {/* 첫 번째 줄: 피드 이름과 RSS URL */}
                <div className="feed-input-row">
                  <input
                    type="text"
                    value={newFeed.name}
                    onChange={(e) => setNewFeed({ ...newFeed, name: e.target.value })}
                    placeholder="피드 이름"
                    disabled={feedLoading}
                  />
                  <input
                    type="text"
                    value={newFeed.url}
                    onChange={(e) => setNewFeed({ ...newFeed, url: e.target.value })}
                    placeholder="RSS URL"
                    disabled={feedLoading}
                  />
                </div>
                {/* 두 번째 줄: 타입, 상태, 추가 버튼 */}
                <div className="feed-input-row">
                  <select
                    value={newFeed.type}
                    onChange={(e) => setNewFeed({ ...newFeed, type: e.target.value })}
                    disabled={feedLoading}
                  >
                    <option value="competitor">경쟁사</option>
                    <option value="noncompetitor">비경쟁사</option>
                  </select>
                  <select
                    value={newFeed.status}
                    onChange={(e) => setNewFeed({ ...newFeed, status: e.target.value })}
                    disabled={feedLoading}
                  >
                    <option value="active">활성</option>
                    <option value="error">에러</option>
                  </select>
                  <button
                    onClick={handleAddFeedToManager}
                    disabled={feedLoading || !newFeed.name.trim() || !newFeed.url.trim()}
                    className="add-btn"
                  >
                    {feedLoading ? '추가 중...' : '추가'}
                  </button>
                </div>
              </div>
            </div>
            <div className="feed-list-section">
              <h4>현재 RSS 피드 목록 ({feeds.length}개)</h4>
              {feedLoading && feeds.length === 0 ? (
                <div className="loading-message">RSS 피드를 불러오는 중...</div>
              ) : feeds.length === 0 ? (
                <div className="empty-message">등록된 RSS 피드가 없습니다.</div>
              ) : (
                <div className="feed-grid">
                  {feeds.map((feed, index) => (
                    <div key={index} className="feed-item">
                      {editingFeed?.name === feed.name ? (
                        <div className="feed-edit-group">
                          <div className="feed-edit-row">
                            <input
                              type="text"
                              value={editFeedValue.name}
                              onChange={(e) => setEditFeedValue({ ...editFeedValue, name: e.target.value })}
                              placeholder="이름"
                            />
                            <input
                              type="text"
                              value={editFeedValue.url}
                              onChange={(e) => setEditFeedValue({ ...editFeedValue, url: e.target.value })}
                              placeholder="URL"
                            />
                          </div>
                          <div className="feed-edit-row">
                            <select
                              value={editFeedValue.type}
                              onChange={(e) => setEditFeedValue({ ...editFeedValue, type: e.target.value })}
                            >
                              <option value="competitor">경쟁사</option>
                              <option value="noncompetitor">비경쟁사</option>
                            </select>
                            <select
                              value={editFeedValue.status}
                              onChange={(e) => setEditFeedValue({ ...editFeedValue, status: e.target.value })}
                            >
                              <option value="active">활성</option>
                              <option value="error">에러</option>
                            </select>
                            <button
                              onClick={handleEditFeed}
                              disabled={feedLoading}
                              className="save-btn"
                            >
                              저장
                            </button>
                            <button
                              onClick={() => {
                                setEditingFeed(null);
                                setEditFeedValue({ name: '', url: '', type: 'noncompetitor', status: 'active' });
                              }}
                              disabled={feedLoading}
                              className="cancel-btn"
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="feed-info">
                            <div className="feed-name">{feed.name}</div>
                            <div className="feed-url">{feed.url}</div>
                            <div className="feed-tags">
                              <span className={`feed-type-tag ${feed.type}`}>
                                {feed.type === 'competitor' ? '경쟁' : '비경쟁'}
                              </span>
                              <span className={`feed-status-tag ${feed.status}`}>
                                {feed.status === 'active' ? '활성' : '에러'}
                              </span>
                            </div>
                          </div>
                          <div className="feed-actions">
                            <button
                              onClick={() => startEditFeed(feed)}
                              disabled={feedLoading}
                              className="edit-btn"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDeleteFeedFromManager(feed)}
                              disabled={feedLoading}
                              className="delete-btn"
                            >
                              삭제
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {loading && (
          <div className="loading">
            <p>RSS 데이터를 불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>오류: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="rss-content">
            <div className="info-banner" style={{
              background: '#f0f9ff',
              border: '1px solid #0ea5e9',
              borderRadius: '8px',
              padding: '12px 16px',
              margin: '16px 0',
              fontSize: '14px'
            }}>
              <strong>📅 RSS 수집 정보:</strong> 매일 오전 6시(한국시간)에 <strong>전일 작성된 글</strong>을 자동 수집합니다. 
              작성일은 <strong>GMT(원본 시간) / KST(한국시간)</strong> 순으로 표시됩니다.
            </div>
            
            <div className="stats">
              <p>
                {feedType !== 'all' && (
                  <>
                    {feedType === 'competitor' ? '경쟁사에서 ' : '비경쟁사에서 '}
                  </>
                )}
                {blogSearch
                  ? `"${blogSearch}"로 검색한 결과 총 ${filteredCount ?? totalCount}개의 RSS 아이템`
                  : `총 ${filteredCount ?? totalCount}개의 RSS 아이템`
                }
                (페이지 {currentPage} / {totalPages})
              </p>
              
              {/* 페이지 크기 선택 */}
              <select
                value={pageSize}
                onChange={e => handlePageSizeChange(Number(e.target.value))}
                className="page-size-select"
              >
                <option value={10}>10개씩 보기</option>
                <option value={20}>20개씩 보기</option>
                <option value={30}>30개씩 보기</option>
              </select>
            </div>
            
            <div className="rss-grid">
              {itemsToShow.map((item, index) => {
                const keywords = localKeywords[item.guid] || item.matchedKeywords;
                // 순번 계산: 전체 개수 - (현재 페이지-1) * 페이지 크기 - 현재 인덱스
                const itemNumber = (filteredCount || totalCount) - ((currentPage - 1) * pageSize) - index;
                return (
                  <article key={`${item.guid}-${index}`} className="rss-item">
                    <div className="rss-meta">
                      <span className="item-number">#{itemNumber}</span>
                      <span className="blog-name">{item.blogName}</span>
                      <span className="feed-type">{item.feedType}</span>
                      <span className="date">
                        {item.author ? `${item.author} / ` : ''}{formatDate(item.isoDate)}
                      </span>
                    </div>
                    
                    <h3 className="rss-title">
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        {item.title}
                      </a>
                    </h3>
                    
                    <p className="rss-description">
                      {item.description ? (
                        <>
                          {item.description.replace(/<[^>]*>/g, '').slice(0, 200)}
                          {item.description.replace(/<[^>]*>/g, '').length > 200 && '...'}
                        </>
                      ) : (
                        '설명이 없습니다.'
                      )}
                    </p>
                    
                    {keywords.length > 0 && (
                      <div className="keywords">
                        <strong>키워드:</strong>{' '}
                        {keywords.map((k, i) => (
                          <span key={k} className="keyword-tag">
                            {k}
                            <button
                              type="button"
                              onClick={() => handleDeleteKeyword(item.guid, k)}
                              className="keyword-delete-btn"
                              disabled={!!updatingKeyword[item.guid]}
                              aria-label={`키워드 ${k} 삭제`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    {/* 키워드 입력 및 추가 버튼 */}
                    <div className="keyword-input-row">
                      <input
                        type="text"
                        value={keywordInputs[item.guid] || ''}
                        onChange={e => setKeywordInputs(prev => ({ ...prev, [item.guid]: e.target.value }))}
                        placeholder="키워드 입력 (쉼표로 구분)"
                        disabled={!!updatingKeyword[item.guid]}
                      />
                      <button
                        type="button"
                        onClick={() => handleAddKeyword(item.guid)}
                        className="add-keyword-btn"
                        disabled={!!updatingKeyword[item.guid]}
                      >
                        {updatingKeyword[item.guid] ? '저장중...' : '추가'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.guid)}
                        className="delete-item-btn"
                        disabled={!!deletingItem[item.guid]}
                      >
                        {deletingItem[item.guid] ? '삭제중...' : '글삭제'}
                      </button>
                    </div>
                    
                    {/* {item.categories && item.categories.length > 0 && (
                      <div className="categories">
                        <strong>카테고리:</strong> {item.categories.join(', ')}
                      </div>
                    )} */}
                    {/* 뉴스레터 발송일 입력 */}
                    <div className="newsletter-date-row">
                      <label htmlFor={`newsletter-date-${item.guid}`}>뉴스레터 발송일:</label>
                      <input
                        type="date"
                        id={`newsletter-date-${item.guid}`}
                        value={newsletterDates[item.guid] || item.news_letter_sent_date || ''}
                        onChange={e => setNewsletterDates(prev => ({ ...prev, [item.guid]: e.target.value }))}
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          if (!newsletterDates[item.guid]) return;
                          setSavingNewsletterDate(prev => ({ ...prev, [item.guid]: true }));
                          try {
                            const res = await fetch('/api/rss-migrate/newsletter-date', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ guid: item.guid, news_letter_sent_date: newsletterDates[item.guid] })
                            });
                            const result = await res.json();
                            if (result.success) {
                              setRssItems(prev => prev.map(r => r.guid === item.guid ? { ...r, news_letter_sent_date: newsletterDates[item.guid] } : r));
                              alert('뉴스레터 발송일이 저장되었습니다.');
                            } else {
                              alert('뉴스레터 발송일 저장 실패: ' + (result.error || result.message));
                            }
                          } catch (err) {
                            alert('뉴스레터 발송일 저장 중 오류 발생');
                          } finally {
                            setSavingNewsletterDate(prev => ({ ...prev, [item.guid]: false }));
                          }
                        }}
                        className="save-newsletter-btn"
                        disabled={!newsletterDates[item.guid] || !!savingNewsletterDate[item.guid]}
                      >
                        {savingNewsletterDate[item.guid] ? '저장중...' : '저장'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* 페이지네이션 UI */}
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                이전
              </button>
              {/* 개선된 숫자 페이지네이션 */}
              {(() => {
                const pageButtons = [];
                const maxPagesToShow = 5; // 현재 페이지 기준 앞뒤 2개씩
                const showLeftEllipsis = currentPage > 3;
                const showRightEllipsis = currentPage < totalPages - 2;
                const firstPage = 1;
                const lastPage = totalPages;

                // 항상 첫 페이지
                if (firstPage === currentPage) {
                  pageButtons.push(
                    <button key={firstPage} className="active-page" disabled>{firstPage}</button>
                  );
                } else {
                  pageButtons.push(
                    <button key={firstPage} onClick={() => handlePageChange(firstPage)}>{firstPage}</button>
                  );
                }

                // ... (왼쪽)
                if (showLeftEllipsis) {
                  pageButtons.push(<span key="left-ellipsis">...</span>);
                }

                // 현재 페이지 기준 앞뒤 2개씩
                const start = Math.max(currentPage - 2, 2);
                const end = Math.min(currentPage + 2, totalPages - 1);
                for (let i = start; i <= end; i++) {
                  if (i === firstPage || i === lastPage) continue;
                  if (i === currentPage) {
                    pageButtons.push(
                      <button key={i} className="active-page" disabled>{i}</button>
                    );
                  } else {
                    pageButtons.push(
                      <button key={i} onClick={() => handlePageChange(i)}>{i}</button>
                    );
                  }
                }

                // ... (오른쪽)
                if (showRightEllipsis) {
                  pageButtons.push(<span key="right-ellipsis">...</span>);
                }

                // 항상 마지막 페이지
                if (lastPage !== firstPage) {
                  if (lastPage === currentPage) {
                    pageButtons.push(
                      <button key={lastPage} className="active-page" disabled>{lastPage}</button>
                    );
                  } else {
                    pageButtons.push(
                      <button key={lastPage} onClick={() => handlePageChange(lastPage)}>{lastPage}</button>
                    );
                  }
                }

                return pageButtons;
              })()}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 