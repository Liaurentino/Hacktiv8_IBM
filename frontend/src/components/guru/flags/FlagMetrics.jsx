import React from 'react';
import { AlertCircle, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

export default function FlagMetrics({
  levelFilter,
  setLevelFilter,
  blackCount,
  criticalCount,
  warningCount,
  infoCount
}) {
  return (
    <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
      {/* 1. Flag Hitam */}
      <div
        onClick={() => setLevelFilter(levelFilter === 'black' ? 'all' : 'black')}
        style={{
          background: '#FFFFFF',
          border: levelFilter === 'black' ? '2px solid #0F172A' : '1px solid #E8E5F7',
          borderLeft: '4px solid #0F172A',
          borderRadius: '12px',
          padding: '14px 16px',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.05)'
        }}
      >
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⬛ Prioritas Krisis</span>
          <AlertCircle size={15} style={{ color: '#EF4444' }} />
        </div>
        <div style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', margin: '4px 0' }}>
          {blackCount} Siswa
        </div>
        <div style={{ fontSize: '11.5px', color: '#64748B' }}>
          Dukungan segera BK &amp; Hotline 119
        </div>
      </div>

      {/* 2. Flag Merah */}
      <div
        onClick={() => setLevelFilter(levelFilter === 'critical' ? 'all' : 'critical')}
        style={{
          background: '#FFFFFF',
          border: levelFilter === 'critical' ? '2px solid #DC2626' : '1px solid #E8E5F7',
          borderLeft: '4px solid #DC2626',
          borderRadius: '12px',
          padding: '14px 16px',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(220, 38, 38, 0.05)'
        }}
      >
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>🔴 Perhatian Khusus</span>
          <AlertTriangle size={15} style={{ color: '#DC2626' }} />
        </div>
        <div style={{ fontSize: '26px', fontWeight: 900, color: '#991B1B', margin: '4px 0' }}>
          {criticalCount} Siswa
        </div>
        <div style={{ fontSize: '11.5px', color: '#64748B' }}>
          Tinjauan prioritas (maks 1 hari)
        </div>
      </div>

      {/* 3. Flag Kuning */}
      <div
        onClick={() => setLevelFilter(levelFilter === 'warning' ? 'all' : 'warning')}
        style={{
          background: '#FFFFFF',
          border: levelFilter === 'warning' ? '2px solid #D97706' : '1px solid #E8E5F7',
          borderLeft: '4px solid #D97706',
          borderRadius: '12px',
          padding: '14px 16px',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(217, 119, 6, 0.05)'
        }}
      >
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>🟡 Pemantauan Berkala</span>
          <Clock size={15} style={{ color: '#D97706' }} />
        </div>
        <div style={{ fontSize: '26px', fontWeight: 900, color: '#B45309', margin: '4px 0' }}>
          {warningCount} Siswa
        </div>
        <div style={{ fontSize: '11.5px', color: '#64748B' }}>
          Observasi berkala (maks 3 hari)
        </div>
      </div>

      {/* 4. Flag Hijau / Info */}
      <div
        onClick={() => setLevelFilter(levelFilter === 'info' ? 'all' : 'info')}
        style={{
          background: '#FFFFFF',
          border: levelFilter === 'info' ? '2px solid #16A34A' : '1px solid #E8E5F7',
          borderLeft: '4px solid #16A34A',
          borderRadius: '12px',
          padding: '14px 16px',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(22, 163, 74, 0.05)'
        }}
      >
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>🟢 Rekomendasi Potensi</span>
          <CheckCircle2 size={15} style={{ color: '#16A34A' }} />
        </div>
        <div style={{ fontSize: '26px', fontWeight: 900, color: '#15803D', margin: '4px 0' }}>
          {infoCount} Siswa
        </div>
        <div style={{ fontSize: '11.5px', color: '#64748B' }}>
          Portofolio SNBP &amp; Minat Terarah
        </div>
      </div>
    </div>
  );
}
