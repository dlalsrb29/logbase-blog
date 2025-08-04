'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Recipient {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
}

interface FormData {
  title: string;
  content: string;
  url: string;
  sentDate: string;
  recipients: Recipient[];
}

export default function NewsletterWritePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    url: '',
    sentDate: new Date().toISOString().slice(0, 10),
    recipients: []
  });
  const [loading, setLoading] = useState(false);
  const [showRecipientsModal, setShowRecipientsModal] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.sentDate) {
      alert('제목, 내용, 발송일은 필수 항목입니다.');
      return;
    }

    if (formData.recipients.length === 0) {
      alert('수신자를 한 명 이상 선택하세요.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/newsletter-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('뉴스레터가 성공적으로 생성되었습니다!');
        router.push('/newsletter');
      } else {
        throw new Error(result.message || '뉴스레터 생성에 실패했습니다.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`오류: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loadRecipients = async () => {
    setLoadingRecipients(true);
    try {
      const response = await fetch('/api/newsletter-recipients');
      if (response.ok) {
        const data = await response.json();
        setRecipients(data.recipients || []);
      } else {
        console.error('수신자 목록을 불러오지 못했습니다.');
      }
    } catch (error) {
      console.error('수신자 목록 로드 오류:', error);
    } finally {
      setLoadingRecipients(false);
    }
  };

  const handleRecipientsModalOpen = () => {
    setShowRecipientsModal(true);
    loadRecipients();
  };

  const handleRecipientsModalClose = () => {
    setShowRecipientsModal(false);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setFormData(prev => ({
        ...prev,
        recipients: [...recipients]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        recipients: []
      }));
    }
  };

  const handleRecipientSelect = (recipient: Recipient, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        recipients: [...prev.recipients, recipient]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        recipients: prev.recipients.filter(r => r.id !== recipient.id)
      }));
    }
  };

  const handleRecipientsConfirm = () => {
    setShowRecipientsModal(false);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>뉴스레터 작성</h1>
        <Link href="/newsletter">
          <button type="button" className="btn-back">목록으로 돌아가기</button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">제목 *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="뉴스레터 제목을 입력하세요"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">내용 *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={10}
            placeholder="뉴스레터 내용을 입력하세요"
          />
        </div>

        <div className="form-group">
          <label htmlFor="url">URL</label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="관련 URL을 입력하세요 (선택사항)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="sentDate">발송일 *</label>
          <input
            type="date"
            id="sentDate"
            name="sentDate"
            value={formData.sentDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>수신자 선택 *</label>
          <div className="recipients-summary">
            <div className="recipients-count">
              <span>{formData.recipients.length}명 선택됨</span>
              <button 
                type="button" 
                className="btn-select-recipients"
                onClick={handleRecipientsModalOpen}
              >
                수신자 선택
              </button>
            </div>
            {formData.recipients.length > 0 && (
              <div className="selected-recipients">
                <h4>선택된 수신자:</h4>
                <div className="recipients-grid">
                  {formData.recipients.map((recipient) => (
                    <div key={recipient.id} className="selected-recipient-item">
                      <div className="recipient-info">
                        <div className="recipient-info-line">
                          <span className="recipient-name">{recipient.name}</span>
                          <span className="recipient-company">({recipient.company})</span>
                        </div>
                        <div className="recipient-info-line">
                          <span className="recipient-email">{recipient.email}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-remove-recipient"
                        onClick={() => handleRecipientSelect(recipient, false)}
                        title={`${recipient.name} 제거`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? '생성 중...' : '뉴스레터 생성'}
          </button>
        </div>
      </form>

      {/* 수신자 선택 모달 */}
      {showRecipientsModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>수신자 선택</h3>
              <button 
                type="button" 
                className="btn-close"
                onClick={handleRecipientsModalClose}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {/* 전체 선택 */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333'
                }}>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      margin: '0'
                    }}
                  />
                  <span>전체 선택 ({recipients.length}명)</span>
                </label>
              </div>
              
              {/* 수신자 목록 */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  maxHeight: '240px',
                  overflowY: 'auto',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  background: 'white',
                  padding: '8px'
                }}
              >
                {loadingRecipients ? (
                  <div style={{ 
                    gridColumn: '1 / -1',
                    padding: '20px', 
                    textAlign: 'center', 
                    color: '#666' 
                  }}>
                    수신자 목록을 불러오는 중...
                  </div>
                ) : (
                  recipients.map((recipient) => (
                    <div 
                      key={recipient.id}
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        padding: '10px',
                        background: '#f9fafb',
                        fontSize: '13px'
                      }}
                    >
                      <label style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        cursor: 'pointer',
                        margin: '0',
                        padding: '0',
                        width: '100%'
                      }}>
                        <input
                          type="checkbox"
                          checked={formData.recipients.some(r => r.id === recipient.id)}
                          onChange={(e) => handleRecipientSelect(recipient, e.target.checked)}
                          style={{ 
                            width: '16px',
                            height: '16px',
                            margin: '0',
                            marginTop: '2px',
                            flexShrink: '0'
                          }}
                        />
                        <div style={{ flex: '1', minWidth: '0' }}>
                          <div style={{ marginBottom: '3px' }}>
                            <span style={{ fontWeight: 'bold', marginRight: '4px' }}>
                              {recipient.name}
                            </span>
                            <span style={{ color: '#666' }}>
                              ({recipient.company})
                            </span>
                          </div>
                          <div style={{ 
                            color: '#888', 
                            fontSize: '11px',
                            wordBreak: 'break-all'
                          }}>
                            {recipient.email}
                          </div>
                        </div>
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn-confirm"
                onClick={handleRecipientsConfirm}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 