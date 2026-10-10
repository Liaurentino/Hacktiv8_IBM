import React from 'react';
import { Sparkles, Check, Copy } from 'lucide-react';

export default function BriefStartersSection({
  conversationStarters,
  onCopyQuestion,
  copiedQuestionIdx
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--colors-surface-cream-soft)',
        border: '1px solid var(--colors-beige-deep)',
        borderRadius: 'var(--rounded-md)',
        padding: '20px',
        marginBottom: '24px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <Sparkles size={16} color="var(--colors-primary)" />
        <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--colors-ink)' }}>
          3 Rekomendasi Pertanyaan Pembuka Dialog Empatik (Conversation Starters)
        </h4>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {conversationStarters?.map((q, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#ffffff',
              padding: '12px 16px',
              borderRadius: 'var(--rounded-xs)',
              border: '1px solid var(--colors-hairline-soft)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div style={{ fontSize: '13.5px', color: 'var(--colors-ink)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--colors-primary)' }}>Q{idx + 1}:</strong> "{q}"
            </div>
            <button
              onClick={() => onCopyQuestion(q, idx)}
              style={{
                background: '#f8f9fa',
                border: '1px solid #ced4da',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11.5px',
                flexShrink: 0
              }}
            >
              {copiedQuestionIdx === idx ? <Check size={12} color="#2b8a3e" /> : <Copy size={12} />}
              {copiedQuestionIdx === idx ? 'Tersalin' : 'Salin'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
