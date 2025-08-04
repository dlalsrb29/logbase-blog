'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface KeywordManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeywordManager({ isOpen, onClose }: KeywordManagerProps) {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [editingKeyword, setEditingKeyword] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // 컴포넌트 마운트 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 키워드 목록 로드
  const loadKeywords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/keywords');
      const result = await response.json();
      
      if (result.success) {
        setKeywords(result.keywords);
      } else {
        setError('키워드 목록을 불러올 수 없습니다.');
      }
    } catch (error) {
      setError('키워드 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 키워드 추가
  const handleAddKeyword = async () => {
    if (!newKeyword.trim()) {
      setError('키워드를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: newKeyword.trim() })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setKeywords(result.keywords);
        setNewKeyword('');
        setSuccess('키워드가 추가되었습니다.');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('키워드 추가 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 키워드 수정 시작
  const startEdit = (keyword: string) => {
    setEditingKeyword(keyword);
    setEditValue(keyword);
  };

  // 키워드 수정 완료
  const handleEditKeyword = async () => {
    if (!editingKeyword || !editValue.trim()) {
      setError('키워드를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
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
        setSuccess('키워드가 수정되었습니다.');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('키워드 수정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 키워드 삭제
  const handleDeleteKeyword = async (keyword: string) => {
    if (!window.confirm(`키워드 "${keyword}"을(를) 삭제하시겠습니까?`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/keywords', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setKeywords(result.keywords);
        setSuccess('키워드가 삭제되었습니다.');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('키워드 삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 모달이 열릴 때 키워드 목록 로드
  useEffect(() => {
    if (isOpen && mounted) {
      loadKeywords();
    }
  }, [isOpen, mounted]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // body 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto mx-4"
        style={{
          position: 'relative',
          zIndex: 10000,
          maxHeight: '80vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">RSS 피드 키워드 관리</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              ×
            </button>
          </div>

          {/* 알림 메시지 */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          {/* 새 키워드 추가 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3 text-gray-900">새 키워드 추가</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                placeholder="새 키워드를 입력하세요"
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                onClick={handleAddKeyword}
                disabled={loading || !newKeyword.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                {loading ? '추가 중...' : '추가'}
              </button>
            </div>
          </div>

          {/* 키워드 목록 */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-900">현재 키워드 목록 ({keywords.length}개)</h3>
            
            {loading && keywords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">키워드를 불러오는 중...</div>
            ) : keywords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">등록된 키워드가 없습니다.</div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {keywords.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded bg-white">
                    {editingKeyword === keyword ? (
                      <div className="flex items-center gap-2 flex-1">
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
                          className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={handleEditKeyword}
                          disabled={loading}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:bg-gray-300 font-medium"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => {
                            setEditingKeyword(null);
                            setEditValue('');
                          }}
                          disabled={loading}
                          className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 disabled:bg-gray-300 font-medium"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1 text-gray-900">{keyword}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(keyword)}
                            disabled={loading}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:bg-gray-300 font-medium"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteKeyword(keyword)}
                            disabled={loading}
                            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:bg-gray-300 font-medium"
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

          {/* 닫기 버튼 */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 font-medium"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
} 