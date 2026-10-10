import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';

export default function RekapTopPodium({ topStudents = [], onSelectStudent, onOpenFlagSystem, attentionCount = 0, criticalCount = 0, warningCount = 0 }) {
  return (
    <div className="theme-box-card" style={{ marginBottom: '20px' }}>
      <div className="theme-box-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>🏆 Top 3 Capaian Tertinggi — XI IPA 2</span>
        <span style={{ fontSize: '11.5px', color: 'var(--theme-text-muted)', fontWeight: 600 }}>Semester Genap</span>
      </div>

      <div className="top3-cards-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        {topStudents[0] && (
          <div className="top3-item-card rank-gold" onClick={() => onSelectStudent(topStudents[0])} style={{ cursor: 'pointer' }}>
            <div className="rank-badge-circle" style={{ background: '#F59E0B' }}>1</div>
            <img className="top3-avatar" src="/assets/avatars/avatar_siswa.png" alt={topStudents[0].name} style={{ borderColor: '#F59E0B' }} />
            <div className="top3-info">
              <span className="top3-name">{topStudents[0].name}</span>
              <span className="top3-score" style={{ color: '#92400E' }}>{topStudents[0].academic_score || '94.9'}</span>
              <span className="top3-desc">{topStudents[0].career_title || 'Unggulan: B. Inggris, Kimia'}</span>
            </div>
          </div>
        )}

        {topStudents[1] && (
          <div className="top3-item-card rank-silver" onClick={() => onSelectStudent(topStudents[1])} style={{ cursor: 'pointer' }}>
            <div className="rank-badge-circle" style={{ background: '#64748B' }}>2</div>
            <img className="top3-avatar" src="/assets/avatars/avatar_guru.png" alt={topStudents[1].name} style={{ borderColor: '#94A3B8' }} />
            <div className="top3-info">
              <span className="top3-name">{topStudents[1].name}</span>
              <span className="top3-score" style={{ color: '#334155' }}>{topStudents[1].academic_score || '91.3'}</span>
              <span className="top3-desc">{topStudents[1].career_title || 'Unggulan: Matematika, Fisika'}</span>
            </div>
          </div>
        )}

        {topStudents[2] && (
          <div className="top3-item-card rank-bronze" onClick={() => onSelectStudent(topStudents[2])} style={{ cursor: 'pointer' }}>
            <div className="rank-badge-circle" style={{ background: '#EA580C' }}>3</div>
            <img className="top3-avatar" src="/assets/avatars/avatar_guru_bk.png" alt={topStudents[2].name} style={{ borderColor: '#FB923C' }} />
            <div className="top3-info">
              <span className="top3-name">{topStudents[2].name}</span>
              <span className="top3-score" style={{ color: '#9A3412' }}>{topStudents[2].academic_score || '89.7'}</span>
              <span className="top3-desc">{topStudents[2].career_title || 'Unggulan: B. Indo, Seni'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Early Warning Banner */}
      <div className="early-warning-banner" style={{ borderLeftColor: attentionCount > 0 ? '#DC2626' : '#16A34A' }}>
        <div className="ew-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: attentionCount > 0 ? '10px' : '0' }}>
          <div className="ew-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} color={attentionCount > 0 ? '#DC2626' : '#16A34A'} />
            <span style={{ fontWeight: 800, color: attentionCount > 0 ? '#B91C1C' : '#15803D' }}>
              {attentionCount > 0 ? `Peringatan Dini: ${attentionCount} Siswa Perlu Perhatian` : 'Status Kelas: Kondisi Belajar Optimal & Aman'}
            </span>
            <span className="stat-badge" style={{ fontSize: '10.5px', background: attentionCount > 0 ? '#FEE2E2' : '#DCFCE7', color: attentionCount > 0 ? '#991B1B' : '#166534' }}>
              {attentionCount > 0 ? 'LUNA AI Early Alert' : 'Semua Siswa Terkendali'}
            </span>
          </div>
          {attentionCount > 0 && (
            <button
              type="button"
              onClick={onOpenFlagSystem}
              className="ew-link-btn"
              style={{ background: 'none', border: 'none', color: '#DC2626', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              Lihat Semua Flag &amp; Intervensi <ArrowRight size={14} />
            </button>
          )}
        </div>

        {attentionCount > 0 ? (
          <div className="ew-chips-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div className="ew-chip" onClick={onOpenFlagSystem} title="Deteksi Sinyal Kerentanan">
              <div className="ew-avatar" style={{ background: '#DC2626' }}>⚠️</div>
              <div className="ew-info">
                <span className="ew-name">Siswa Teridentifikasi <span className="ew-badge" style={{ background: '#FEE2E2', color: '#991B1B' }}>Perhatian</span></span>
                <span className="ew-desc">{criticalCount} Kritis · {warningCount} Waspada</span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '12.5px', color: '#166534', marginTop: '6px' }}>
            Tidak ada indikasi krisis darurat, penurunan nilai ekstrem, maupun absensi berulang pada kelas ini.
          </div>
        )}
      </div>
    </div>
  );
}
