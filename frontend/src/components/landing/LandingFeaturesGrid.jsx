import React from 'react';

export default function LandingFeaturesGrid() {
  return (
    <section
      id="fitur"
      style={{
        background: '#FFFFFF',
        padding: '20px 24px 70px',
        width: '100%',
        position: 'relative'
      }}
    >
      {/* Daun Lavender Pojok Kiri Bawah */}
      <div style={{ position: 'absolute', bottom: '15px', left: '16px', pointerEvents: 'none', userSelect: 'none', opacity: 0.85 }}>
        <svg width="70" height="70" viewBox="0 0 100 100" fill="none">
          <path d="M10 90 Q30 70 50 60 Q70 50 80 20 Q50 35 40 55 Q30 75 10 90 Z" fill="#A9A8F5" opacity="0.6" />
          <path d="M25 80 Q45 65 60 40 Q40 50 25 80 Z" fill="#8A8FD9" opacity="0.8" />
          <path d="M15 88 Q35 80 50 75 Q38 85 15 88 Z" fill="#C4B5FD" />
        </svg>
      </div>

      {/* Daun Lavender Pojok Kanan Bawah */}
      <div style={{ position: 'absolute', bottom: '15px', right: '16px', pointerEvents: 'none', userSelect: 'none', opacity: 0.85 }}>
        <svg width="70" height="70" viewBox="0 0 100 100" fill="none" style={{ transform: 'scaleX(-1)' }}>
          <path d="M10 90 Q30 70 50 60 Q70 50 80 20 Q50 35 40 55 Q30 75 10 90 Z" fill="#A9A8F5" opacity="0.6" />
          <path d="M25 80 Q45 65 60 40 Q40 50 25 80 Z" fill="#8A8FD9" opacity="0.8" />
          <path d="M15 88 Q35 80 50 75 Q38 85 15 88 Z" fill="#C4B5FD" />
        </svg>
      </div>

      <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: '24px'
          }}
        >
          {/* Card 1 */}
          <div className="luna-feature-card">
            <div className="luna-feature-icon-circle" style={{ background: '#EDE8FE', color: '#4F46E5' }}>
              <img src="/assets/preview-luna/assets/features/feat_chat_ai.png" alt="" />
            </div>
            <h3>Curhat dengan Aman</h3>
            <p>Sampaikan pikiran dan perasaanmu dengan nyaman, tanpa takut di-judge.</p>
          </div>

          {/* Card 2 */}
          <div className="luna-feature-card">
            <div className="luna-feature-icon-circle" style={{ background: '#FEF3D6', color: '#D97706' }}>
              <img src="/assets/preview-luna/assets/features/feat_professional_support_badge.png" alt="" />
            </div>
            <h3>Dukungan Profesional</h3>
            <p>Didampingi oleh guru BK dan tim yang siap membantu kamu menemukan solusi.</p>
          </div>

          {/* Card 3 */}
          <div className="luna-feature-card">
            <div className="luna-feature-icon-circle" style={{ background: '#E2E8FD', color: '#2563EB' }}>
              <img src="/assets/preview-luna/assets/features/feat_track_progress_badge.png" alt="" />
            </div>
            <h3>Pantau Perkembangan</h3>
            <p>Lihat progres, catatan, dan rencana kamu untuk masa depan yang lebih baik.</p>
          </div>

          {/* Card 4 */}
          <div className="luna-feature-card">
            <div className="luna-feature-icon-circle" style={{ background: '#FEECE2', color: '#E11D48' }}>
              <img src="/assets/preview-luna/assets/features/feat_heart_future_badge.png" alt="" />
            </div>
            <h3>Untuk Masa Depanmu</h3>
            <p>Karena setiap nilai, usaha, dan langkah kecilmu berarti besar.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
