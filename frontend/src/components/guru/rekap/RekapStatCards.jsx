import React from 'react';
import { Users, TrendingUp, AlertCircle, Award } from 'lucide-react';

export default function RekapStatCards({
  studentsCount,
  average,
  attentionCount,
  criticalCount,
  warningCount,
  unggulCount,
  onOpenFlagSystem
}) {
  return (
    <div className="stat-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
      <div className="visual-stat-card">
        <div className="stat-left">
          <div className="stat-icon-circle" style={{ background: '#F0EDFD', color: '#7C69EF' }}><Users size={18} /></div>
          <span className="stat-text-label">Total Siswa</span>
          <div className="stat-big-number">{studentsCount}</div>
          <span className="stat-sub-text">Siswa Aktif</span>
        </div>
        <img className="stat-mascot-img" src="/assets/mascot/mascot_wink.png" alt="Mascot LUNA" onError={(e) => { e.currentTarget.src = '/assets/mascot/mascot_senang.png'; }} />
      </div>

      <div className="visual-stat-card">
        <div className="stat-left">
          <div className="stat-icon-circle" style={{ background: '#DCFCE7', color: '#16A34A' }}><TrendingUp size={18} /></div>
          <span className="stat-text-label">Rata-rata Kelas</span>
          <div className="stat-big-number" style={{ color: '#0E9F6E' }}>{average}</div>
          <span className="stat-badge badge-green">KKM 70 Terpenuhi</span>
        </div>
        <img className="stat-mascot-img" src="/assets/mascot/mascot_semangat.png" alt="Mascot Semangat" onError={(e) => { e.currentTarget.src = '/assets/mascot/mascot_senang.png'; }} />
      </div>

      <div className="visual-stat-card" onClick={onOpenFlagSystem} style={{ cursor: 'pointer' }}>
        <div className="stat-left">
          <div className="stat-icon-circle" style={{ background: '#FEE2E2', color: '#EF4444' }}><AlertCircle size={18} /></div>
          <span className="stat-text-label">Perlu Perhatian</span>
          <div className="stat-big-number" style={{ color: '#DC2626' }}>{attentionCount} Siswa</div>
          <span className="stat-badge badge-red">{criticalCount} Kritis · {warningCount} Waspada</span>
        </div>
        <img className="stat-mascot-img" src="/assets/mascot/mascot_cemas.png" alt="Mascot Cemas" onError={(e) => { e.currentTarget.src = '/assets/mascot/mascot_senang.png'; }} />
      </div>

      <div className="visual-stat-card">
        <div className="stat-left">
          <div className="stat-icon-circle" style={{ background: '#FEF9C3', color: '#CA8A04' }}><Award size={18} /></div>
          <span className="stat-text-label">Siswa Unggul</span>
          <div className="stat-big-number" style={{ color: '#854D0E' }}>{unggulCount} Siswa</div>
          <span className="stat-badge badge-green" style={{ background: '#FEF3C7', color: '#B45309' }}>Grade A (≥90)</span>
        </div>
        <img className="stat-mascot-img" src="/assets/mascot/mascot_senang.png" alt="Mascot Senang" />
      </div>
    </div>
  );
}
