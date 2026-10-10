import React from 'react';

export default function LandingFooter() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        borderTop: '1px solid #E2E0FD',
        padding: '30px 20px',
        textAlign: 'center',
        fontSize: '12.5px',
        color: 'var(--text-muted)',
        background: '#FAF9FF'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--luna-navy)' }}>
          <span>🌙 LUNA: Lentera untuk Nilai dan Asa</span>
          <span>·</span>
          <span>Sistem Bimbingan Konseling &amp; Akademik Terpadu</span>
        </div>
        <p style={{ margin: 0, fontSize: '12px' }}>
          Didukung oleh Asisten AI LUNA · Bimbingan Konseling Berkelanjutan · Pemetaan Minat Bakat RIASEC
        </p>
      </div>
    </footer>
  );
}
