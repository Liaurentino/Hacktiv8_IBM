import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Copy,
  Check,
  ThumbsUp,
  AlertTriangle,
  RotateCcw,
  User,
  X
} from 'lucide-react';

export default function ChatViewContainer({
  messages = [],
  loading = false,
  inputText = '',
  setInputText = () => {},
  onSendMessage = () => {},
  quickPrompts = [],
  emergencyAlert = false,
  assistantTitle = 'LUNA BK Advisor',
  assistantSubtitle = 'LUNA Empathy AI Engine • Zero Medical Labeling',
  mascotEmotion = 'senang',
  userInitial = 'B',
  emptyTitle = 'Siap mendengarkan ceritamu',
  emptySubtitle = 'Curhatkan apa pun seputar persiapan ujian, rasa lelah belajar, atau konsultasi minat karir masa depan.',
  selectedStudents = [],
  onRemoveStudentContext,
  onOpenStudentSelector
}) {
  const [copiedId, setCopiedId] = useState(null);
  const [likedIds, setLikedIds] = useState([]);
  const textareaRef = useRef(null);
  const streamRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Auto-resize textarea like modern chat apps
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [inputText]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLike = (id) => {
    if (!likedIds.includes(id)) {
      setLikedIds((prev) => [...prev, id]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim() && !loading) {
        onSendMessage();
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, position: 'relative' }}>
      {/* Stream Messages */}
      <div className="luna-chat-stream" ref={streamRef}>
        {messages.length === 0 ? (
          <div className="luna-chat-empty-state">
            <img
              src={`/assets/mascot/mascot_${mascotEmotion || 'senang'}.png`}
              alt="LUNA Mascot"
              className="luna-chat-empty-mascot"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <h2 className="luna-chat-empty-title">{emptyTitle}</h2>
            <p className="luna-chat-empty-subtitle">{emptySubtitle}</p>

            {quickPrompts.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', maxWidth: '640px' }}>
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSendMessage(p)}
                    className="luna-chat-chip-btn"
                  >
                    ✨ {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          messages.map((m) => {
            const isUser = m.sender === 'user';
            const textContent = m.message || m.text || '';
            const msgId = m.id || m.timestamp;

            return (
              <div key={msgId} className="luna-chat-centered">
                <div className={`luna-chat-msg-row ${isUser ? 'user' : 'assistant'}`}>
                  {isUser ? (
                    <div className="luna-chat-user-bubble">
                      {textContent}
                    </div>
                  ) : (
                    <div className="luna-chat-assistant-wrap">
                      <div className="luna-chat-assistant-avatar">
                        <img
                          src={`/assets/mascot/mascot_${m.emotion || mascotEmotion || 'senang'}.png`}
                          alt="LUNA"
                          style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </div>
                      <div className="luna-chat-assistant-body">
                        <div className="luna-chat-assistant-name">
                          <span>{assistantTitle}</span>
                          <span style={{ fontSize: '10px', background: '#DCFCE7', color: '#166534', padding: '1px 6px', borderRadius: '8px', fontWeight: 700 }}>
                            AI
                          </span>
                        </div>
                        <div className="luna-chat-assistant-content">
                          {textContent}
                        </div>
                        <div className="luna-chat-msg-actions">
                          <button
                            type="button"
                            onClick={() => handleCopy(textContent, msgId)}
                            className="luna-chat-action-btn"
                            title="Salin jawaban"
                          >
                            {copiedId === msgId ? <Check size={13} style={{ color: '#16A34A' }} /> : <Copy size={13} />}
                            <span>{copiedId === msgId ? 'Tersalin' : 'Salin'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLike(msgId)}
                            className="luna-chat-action-btn"
                            title="Membantu"
                            style={{ color: likedIds.includes(msgId) ? 'var(--luna-lavender, #7C69EF)' : undefined }}
                          >
                            <ThumbsUp size={13} />
                            <span>{likedIds.includes(msgId) ? 'Terbantu' : 'Bantu'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {loading && (
          <div className="luna-chat-centered">
            <div className="luna-chat-assistant-wrap" style={{ opacity: 0.85 }}>
              <div className="luna-chat-assistant-avatar">
                <Sparkles size={18} style={{ color: '#7C69EF' }} className="float-anim" />
              </div>
              <div className="luna-chat-assistant-body">
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>LUNA sedang merangkai tanggapan empatik...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sticky Bottom Input Area */}
      <div className="luna-chat-bottom-bar">
        <div className="luna-chat-centered">
          {/* Quick Prompts strip when messages exist */}
          {messages.length > 0 && quickPrompts.length > 0 && (
            <div className="luna-chat-quick-chips">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSendMessage(p)}
                  className="luna-chat-chip-btn"
                >
                  ✨ {p}
                </button>
              ))}
            </div>
          )}

          {/* Emergency Alert Banner */}
          {emergencyAlert && (
            <div style={{ background: '#181926', color: '#FFFFFF', padding: '10px 14px', borderRadius: '12px', borderLeft: '4px solid #DC2626', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <AlertTriangle size={18} style={{ color: '#EF4444', flexShrink: 0 }} />
                <span><strong>Sinyal Krisis Terdeteksi (Flag Hitam):</strong> Kami mendampingimu dengan bantuan segera.</span>
              </div>
              <a href="tel:119" style={{ background: '#DC2626', color: '#FFFFFF', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, textDecoration: 'none' }}>
                Hotline 119 ext 8
              </a>
            </div>
          )}

          {/* Active Student Context Chip (Eksplisit di dekat composer) */}
          {selectedStudents && selectedStudents.length > 0 ? (
            <div
              className="luna-chat-active-context"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                flexWrap: 'wrap',
                padding: '4px 2px'
              }}
            >
              <span style={{ fontSize: '11.5px', color: '#475569', fontWeight: 700 }}>
                Konteks: {selectedStudents.length} siswa dipilih
              </span>
              {selectedStudents.map((st) => (
                <span
                  key={st.id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: '#EEF2FF',
                    color: '#4338CA',
                    border: '1px solid #C7D2FE',
                    borderRadius: '999px',
                    padding: '3px 10px',
                    fontSize: '11.5px',
                    fontWeight: 700
                  }}
                >
                  <span>{st.name} ({st.class_name || 'XI IPA 2'})</span>
                  {onRemoveStudentContext && (
                    <button
                      type="button"
                      onClick={() => onRemoveStudentContext(st.id)}
                      title={`Hapus ${st.name} dari konteks`}
                      aria-label={`Hapus ${st.name} dari konteks`}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '1px',
                        cursor: 'pointer',
                        color: '#4338CA',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <X size={13} />
                    </button>
                  )}
                </span>
              ))}
              {onOpenStudentSelector && (
                <button
                  type="button"
                  onClick={onOpenStudentSelector}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4F46E5',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '2px 4px',
                    textDecoration: 'underline'
                  }}
                >
                  Ubah Siswa
                </button>
              )}
            </div>
          ) : null}

          {/* Centered Floating Pill Input */}
          <div className="luna-chat-input-pill">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                selectedStudents && selectedStudents.length > 0
                  ? `Tanya seputar progres belajar ${selectedStudents.map((s) => s.name.split(' ')[0]).join(', ')}...`
                  : 'Tanya apa saja seputar belajar, konseling, atau karir...'
              }
              className="luna-chat-textarea"
            />
            <button
              type="button"
              onClick={() => onSendMessage()}
              disabled={loading || !inputText.trim()}
              className="luna-chat-send-btn"
              title="Kirim Pesan (Enter)"
            >
              <Send size={15} />
            </button>
          </div>

          {/* AI Responsible Guidance Disclaimer (Subtle, Short, No Card) */}
          <p
            className="luna-chat-disclaimer"
            role="note"
            style={{
              margin: '8px 0 2px',
              padding: '0 8px',
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              fontSize: '11px',
              color: 'var(--text-muted, #6E6D8A)',
              textAlign: 'center',
              lineHeight: 1.4
            }}
          >
            LUNA AI dapat membuat kesalahan. Harap periksa kembali informasi penting.
          </p>
        </div>
      </div>
    </div>
  );
}
