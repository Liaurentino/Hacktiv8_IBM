import React from 'react';
import { Sparkles, Users, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import PageHeader from '../../common/PageHeader';

export default function TriageMetricCards({
  totalStudents,
  redCount,
  yellowCount,
  greenCount
}) {
  return (
    <div
      style={{
        marginBottom: '28px'
      }}
    >
      <PageHeader
        icon={Sparkles}
        moduleTag="Portal Bimbingan Konseling • LUNA Education System"
        title="Dashboard Deteksi Dini & Minat Bakat Siswa"
        description={<>Mengolah jurnal refleksi mingguan dan angket minat menjadi <strong>1 lembar ringkasan konseling (*Counseling Prep Sheet*)</strong> dalam &lt; 2 menit per siswa dengan prinsip Responsible AI.</>}
        metadata={[
          { label: 'Periode', value: 'Semester Genap 2025/2026' },
          { label: 'Kelas Binaan', value: 'XI IPA 2' },
          { label: 'Total Siswa', value: `${totalStudents || 32} Siswa` }
        ]}
      />

      {/* 4 Standard White Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px'
        }}
      >
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #E8E5F7',
            borderTop: '3px solid #7C69EF',
            padding: '16px 18px',
            borderRadius: '14px',
            boxShadow: '0 2px 8px rgba(47, 51, 102, 0.04)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--colors-steel)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Siswa Terpantau
            </span>
            <Users size={16} style={{ color: '#7C69EF' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--colors-ink)', fontVariantNumeric: 'tabular-nums' }}>
            {totalStudents} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>Siswa</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px' }}>
            Populasi aktif terdaftar kelas
          </div>
        </div>

        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #E8E5F7',
            borderTop: '3px solid #DC2626',
            padding: '16px 18px',
            borderRadius: '14px',
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.04)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: '#DC2626', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Jalur Merah (Prioritas)
            </span>
            <AlertCircle size={16} style={{ color: '#DC2626' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#DC2626', fontVariantNumeric: 'tabular-nums' }}>
            {redCount} <span style={{ fontSize: '13px', fontWeight: 500, color: '#DC2626' }}>Siswa</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#991B1B', marginTop: '4px' }}>
            Perlu dialog afektif segera
          </div>
        </div>

        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #E8E5F7',
            borderTop: '3px solid #D97706',
            padding: '16px 18px',
            borderRadius: '14px',
            boxShadow: '0 2px 8px rgba(217, 119, 6, 0.04)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: '#D97706', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Jalur Kuning (Perhatian)
            </span>
            <AlertCircle size={16} style={{ color: '#D97706' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#D97706', fontVariantNumeric: 'tabular-nums' }}>
            {yellowCount} <span style={{ fontSize: '13px', fontWeight: 500, color: '#D97706' }}>Siswa</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#92400E', marginTop: '4px' }}>
            Perlu observasi berkala
          </div>
        </div>

        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #E8E5F7',
            borderTop: '3px solid #16A34A',
            padding: '16px 18px',
            borderRadius: '14px',
            boxShadow: '0 2px 8px rgba(22, 163, 74, 0.04)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Jalur Hijau (Stabil)
            </span>
            <CheckCircle2 size={16} style={{ color: '#16A34A' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#16A34A', fontVariantNumeric: 'tabular-nums' }}>
            {greenCount} <span style={{ fontSize: '13px', fontWeight: 500, color: '#16A34A' }}>Siswa</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#166534', marginTop: '4px' }}>
            Perkembangan belajar optimal
          </div>
        </div>
      </div>
    </div>
  );
}
