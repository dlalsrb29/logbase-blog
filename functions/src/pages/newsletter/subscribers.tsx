'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { SITE_TITLE } from '@/consts';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: string;
  createdAt: Date;
  updatedAt?: Date;
}

export default function NewsletterSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    filterSubscribers();
  }, [subscribers, searchTerm, statusFilter]);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/newsletter-recipients');
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data.recipients || []);
      } else {
        console.error('신청자 목록을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('신청자 목록 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSubscribers = () => {
    let filtered = subscribers;

    // 상태 필터
    if (statusFilter !== 'all') {
      filtered = filtered.filter(subscriber => subscriber.status === statusFilter);
    }

    // 검색어 필터 (이름, 이메일, 회사에서 검색)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(subscriber =>
        subscriber.name.toLowerCase().includes(searchLower) ||
        subscriber.email.toLowerCase().includes(searchLower) ||
        (subscriber.company && subscriber.company.toLowerCase().includes(searchLower))
      );
    }

    setFilteredSubscribers(filtered);
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? '활성화' : '비활성화';
    
    if (!confirm(`이 구독자를 ${action}하시겠습니까?`)) {
      return;
    }

    try {
      const response = await fetch('/api/newsletter-subscriber-update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        await fetchSubscribers(); // 목록 새로고침
      } else {
        throw new Error(result.message || '상태 변경 중 오류가 발생했습니다.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`오류: ${errorMessage}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`'${name}' 구독자를 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      const response = await fetch('/api/newsletter-subscriber-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        await fetchSubscribers(); // 목록 새로고침
      } else {
        throw new Error(result.message || '삭제 중 오류가 발생했습니다.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`오류: ${errorMessage}`);
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>{`뉴스레터 신청자 관리 - ${SITE_TITLE}`}</title>
        </Head>
        <div className="container">
          <div className="loading">신청자 목록을 불러오는 중...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`뉴스레터 신청자 관리 - ${SITE_TITLE}`}</title>
        <meta name="description" content="뉴스레터 신청자 관리" />
      </Head>
      
      <div className="container">
        <div className="header">
          <h1>뉴스레터 신청자 관리</h1>
          <div>
            <Link href="/newsletter">
              <button type="button" className="btn-back">뉴스레터 목록</button>
            </Link>
          </div>
        </div>

        <div className="subscribers-stats">
          <div className="stat-item">
            <span className="stat-label">전체 신청자:</span>
            <span className="stat-value">{subscribers.length}명</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">활성 구독자:</span>
            <span className="stat-value">
              {subscribers.filter(s => s.status === 'active').length}명
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">비활성 구독자:</span>
            <span className="stat-value">
              {subscribers.filter(s => s.status === 'inactive').length}명
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">검색 결과:</span>
            <span className="stat-value">{filteredSubscribers.length}명</span>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="subscribers-controls">
          <div className="search-group">
            <input
              type="text"
              placeholder="이름, 이메일, 회사명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="status-filter"
            >
              <option value="all">전체 상태</option>
              <option value="active">활성 구독자</option>
              <option value="inactive">비활성 구독자</option>
            </select>
          </div>
          {(searchTerm || statusFilter !== 'all') && (
            <button
              type="button"
              className="btn-clear-filters"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
            >
              필터 초기화
            </button>
          )}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>이름</th>
              <th>이메일</th>
              <th>회사/소속</th>
              <th>연락처</th>
              <th>신청일</th>
              <th>상태</th>
              <th style={{ textAlign: 'center' }}>액션</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscribers.length > 0 ? (
              filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td>{subscriber.name}</td>
                  <td>{subscriber.email}</td>
                  <td>{subscriber.company || '-'}</td>
                  <td>{subscriber.phone || '-'}</td>
                  <td>{new Date(subscriber.createdAt).toLocaleDateString('ko-KR')}</td>
                  <td>
                    <span className={`status-badge ${subscriber.status}`}>
                      {subscriber.status === 'active' ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      type="button"
                      className={`btn-status ${subscriber.status === 'active' ? 'btn-deactivate' : 'btn-activate'}`}
                      onClick={() => handleStatusToggle(subscriber.id, subscriber.status)}
                    >
                      {subscriber.status === 'active' ? '비활성화' : '활성화'}
                    </button>
                    <button
                      type="button"
                      className="btn-delete-subscriber"
                      onClick={() => handleDelete(subscriber.id, subscriber.name)}
                      title={`${subscriber.name} 삭제`}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center' }}>
                  {searchTerm || statusFilter !== 'all' ? '검색 결과가 없습니다.' : '신청자가 없습니다.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>


      </div>
    </>
  );
} 