'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NewsletterMeta {
  title: string;
  content: string;
  url: string;
  sentDate: string;
  htmlFilePath: string;
  filename: string;
  recipients: Recipient[];
}

interface Recipient {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
}

interface SendFormData {
  subject: string;
  fromName: string;
  fromEmail: string;
  recipients: Recipient[];
}

export default function NewsletterPage() {
  const [newsletters, setNewsletters] = useState<NewsletterMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = useState<NewsletterMeta | null>(null);
  const [sendFormData, setSendFormData] = useState<SendFormData>({
    subject: '',
    fromName: '',
    fromEmail: '',
    recipients: []
  });
  const [allRecipients, setAllRecipients] = useState<Recipient[]>([]);
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      const response = await fetch('/api/newsletter-list');
      if (response.ok) {
        const data = await response.json();
        setNewsletters(data.newsletters || []);
      }
    } catch (error) {
      console.error('뉴스레터 목록을 불러오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecipients = async () => {
    setLoadingRecipients(true);
    try {
      const response = await fetch('/api/newsletter-recipients');
      if (response.ok) {
        const data = await response.json();
        setAllRecipients(data.recipients || []);
      } else {
        console.error('수신자 목록을 불러오지 못했습니다.');
      }
    } catch (error) {
      console.error('수신자 목록 로드 오류:', error);
    } finally {
      setLoadingRecipients(false);
    }
  };

  const handleSendClick = async (newsletter: NewsletterMeta) => {
    setSelectedNewsletter(newsletter);
    setSendFormData({
      subject: newsletter.title,
      fromName: 'LogBase Newsletter',
      fromEmail: 'haesu.hwang@logbase.kr', // TODO: 환경 변수로 관리 고려
      recipients: newsletter.recipients || []
    });
    setShowSendModal(true);
    await loadRecipients();
  };

  const handleSendFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSendFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRecipientToggle = (recipient: Recipient, checked: boolean) => {
    if (checked) {
      setSendFormData(prev => ({
        ...prev,
        recipients: [...prev.recipients, recipient]
      }));
    } else {
      setSendFormData(prev => ({
        ...prev,
        recipients: prev.recipients.filter(r => r.id !== recipient.id)
      }));
    }
  };

  const handleSelectAllRecipients = (checked: boolean) => {
    if (checked) {
      setSendFormData(prev => ({
        ...prev,
        recipients: [...allRecipients]
      }));
    } else {
      setSendFormData(prev => ({
        ...prev,
        recipients: []
      }));
    }
  };

  const handleSendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedNewsletter) return;
    
    if (!sendFormData.subject.trim() || !sendFormData.fromName.trim() || !sendFormData.fromEmail.trim()) {
      alert('제목, 발신자명, 발신자 이메일은 필수 항목입니다.');
      return;
    }

    if (sendFormData.recipients.length === 0) {
      alert('수신자를 한 명 이상 선택해주세요.');
      return;
    }

    if (!confirm(`${sendFormData.recipients.length}명에게 뉴스레터를 발송하시겠습니까?`)) {
      return;
    }

    setSending(true);

    try {
      const response = await fetch('/api/newsletter-send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: selectedNewsletter.filename,
          subject: sendFormData.subject,
          fromName: sendFormData.fromName,
          fromEmail: sendFormData.fromEmail,
          recipients: sendFormData.recipients
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('뉴스레터가 성공적으로 발송되었습니다!');
        setShowSendModal(false);
      } else {
        throw new Error(result.message || '발송에 실패했습니다.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`발송 오류: ${errorMessage}`);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`'${filename}' 뉴스레터를 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      const response = await fetch('/api/newsletter-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        await fetchNewsletters();
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
      <div className="container">
        <div className="loading">뉴스레터 목록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>뉴스레터 목록</h1>
        <div className="header-buttons">
          <button 
            type="button" 
            className="btn-subscribers"
            onClick={() => window.location.href = '/newsletter/subscribers'}
          >
            신청자 관리
          </button>
          <button 
            type="button" 
            className="btn-new"
            onClick={() => window.location.href = '/newsletter/write'}
          >
            새 뉴스레터 작성
          </button>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>제목</th>
            <th>발송일</th>
            <th style={{ textAlign: 'center' }}>액션</th>
          </tr>
        </thead>
        <tbody>
          {newsletters.length > 0 ? (
            newsletters.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.title}</td>
                  <td>{new Date(item.sentDate).toLocaleDateString('ko-KR')}</td>
                  <td className="actions">
                    <button 
                      type="button" 
                      className="btn-preview"
                      onClick={() => window.open(item.htmlFilePath, '_blank')}
                      title="새 창에서 미리보기"
                    >
                      미리보기
                    </button>
                    <button 
                      type="button" 
                      className="btn-send"
                      onClick={() => handleSendClick(item)}
                      title="이메일 발송"
                    >
                      📧 발송
                    </button>
                    <Link href={`/newsletter/edit/${encodeURIComponent(item.filename)}`}>
                      <button type="button" className="btn-edit">편집</button>
                    </Link>
                    <button 
                      type="button" 
                      className="btn-delete"
                      onClick={() => handleDelete(item.filename)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center' }}>
                뉴스레터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 발송 설정 모달 */}
      {showSendModal && selectedNewsletter && (
        <div className="modal-overlay newsletter-send-modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          visibility: 'visible',
          opacity: 1
        }}>
          <div className="newsletter-send-modal" style={{
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '92vh',
            height: 'auto',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            visibility: 'visible',
            opacity: 1,
            margin: 'auto',
            position: 'relative',
            inset: 'auto',
            minHeight: 'auto'
          }}>
            <div className="modal-header">
              <h3>뉴스레터 발송</h3>
              <button 
                type="button" 
                className="btn-close"
                onClick={() => setShowSendModal(false)}
                disabled={sending}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSendSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="subject">이메일 제목</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={sendFormData.subject}
                    onChange={handleSendFormChange}
                    required
                    disabled={sending}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fromName">발신자명</label>
                    <input
                      type="text"
                      id="fromName"
                      name="fromName"
                      value={sendFormData.fromName}
                      onChange={handleSendFormChange}
                      required
                      disabled={sending}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="fromEmail">발신자 이메일</label>
                    <input
                      type="email"
                      id="fromEmail"
                      name="fromEmail"
                      value={sendFormData.fromEmail}
                      onChange={handleSendFormChange}
                      required
                      disabled={sending}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>수신자 선택</label>
                  <div className="recipients-section">
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
                        checked={sendFormData.recipients.length === allRecipients.length && allRecipients.length > 0}
                        onChange={(e) => handleSelectAllRecipients(e.target.checked)}
                        disabled={sending || loadingRecipients}
                        style={{
                          width: '16px',
                          height: '16px',
                          margin: '0'
                        }}
                      />
                      <span>전체 선택 ({allRecipients.length}명)</span>
                    </label>
                  </div>
                    
                                <div 
              className="recipients-list"
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
                        allRecipients.map((recipient) => (
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
                                checked={sendFormData.recipients.some(r => r.id === recipient.id)}
                                onChange={(e) => handleRecipientToggle(recipient, e.target.checked)}
                                disabled={sending}
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
                    
                    <div className="selected-count">
                      선택된 수신자: {sendFormData.recipients.length}명
                    </div>
                  </div>
                </div>

              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowSendModal(false)}
                  disabled={sending}
                >
                  취소
                </button>
                <button 
                  type="submit" 
                  className="btn-send-confirm"
                  disabled={sending || sendFormData.recipients.length === 0}
                >
                  {sending ? '발송 중...' : `${sendFormData.recipients.length}명에게 발송`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .modal {
          background: white;
          border-radius: 8px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .modal-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
        }
        
        .btn-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
          padding: 4px;
          line-height: 1;
        }
        
        .btn-close:hover {
          color: #374151;
        }
        
        .modal-body {
          padding: 24px;
        }
        
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #374151;
        }
        
        .form-group input, .form-group textarea {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 13px;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        
        .form-group input:focus, .form-group textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        
        .form-row .form-group {
          margin-bottom: 16px;
        }
        
        .recipients-section {
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 12px;
          background: #fafafa;
        }
        
        .select-all {
          margin-bottom: 10px;
        }
        
        .select-all label {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .recipients-list {
          max-height: 200px;
          overflow-y: auto;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
        }
        
        .recipient-item {
          padding: 8px 12px;
          border-bottom: 1px solid #eee;
        }
        
        .recipient-item:last-child {
          border-bottom: none;
        }
        
        .recipient-item label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        
        .recipient-name {
          font-weight: bold;
          margin-right: 4px;
        }
        
        .recipient-company {
          color: #666;
          margin-right: 8px;
        }
        
        .recipient-email {
          color: #888;
          font-size: 0.9em;
        }
        
        .selected-count {
          text-align: center;
          padding: 8px;
          background: #e3f2fd;
          border-radius: 4px;
          margin-top: 10px;
          font-weight: bold;
          color: #1976d2;
        }
        
        .loading {
          text-align: center;
          padding: 20px;
          color: #666;
        }
        
        .btn-send {
          background: #10b981;
          color: white;
          padding: 6px 12px;
          margin: 0 4px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9em;
        }
        
        .btn-send:hover {
          background: #059669;
        }
        
        .btn-send-confirm {
          background: #10b981;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        
        .btn-send-confirm:hover:not(:disabled) {
          background: #059669;
        }
        
        .btn-send-confirm:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }
        
        .btn-cancel {
          background: #6b7280;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 12px;
        }
        
        .btn-cancel:hover:not(:disabled) {
          background: #4b5563;
        }
        
        .loading {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 12px;
          grid-column: 1 / -1;
        }
      `}</style>
    </div>
  );
} 