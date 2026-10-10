import React from 'react';
import { BookOpen, TrendingUp, CheckCircle2, AlertCircle, Award } from 'lucide-react';
import PageHeader from '../../common/PageHeader';

export default function MapelHeaderAndMetrics({
  activeSubjectKey,
  setActiveSubjectKey,
  activeSubjectObj,
  subjectsList,
  currentUser,
  KKM,
  classAvg,
  tuntasCount,
  remedialCount,
  highestScore
}) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <PageHeader
        icon={BookOpen}
        moduleTag="Portal Guru Mata Pelajaran • LUNA Education System"
        title={`Penilaian & Rekap Nilai: ${activeSubjectObj.name}`}
        description="Pencatatan dan analisis tren performa akademik P1–P14 untuk pemetaan remedial dan pengayaan bersama wali kelas & Guru BK."
        metadata={[
          { label: 'Guru Pengampu', value: currentUser?.name || 'Pak Budi Hartono, S.Pd' },
          { label: 'Kelas', value: 'XI IPA 2' },
          { label: 'Standar KKM', value: KKM },
          { label: 'Periode', value: 'Semester Genap 2025/2026' }
        ]}
        actions={
          <span
            style={{
              background: '#EEF2FF',
              color: '#4338CA',
              border: '1px solid #C7D2FE',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12.5px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>📚 {activeSubjectObj.name}</span>
          </span>
        }
      />

      {/* 4 Standard White Metric Cards matching Guru BK */}
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
              Rata-rata Kelas
            </span>
            <TrendingUp size={16} style={{ color: '#7C69EF' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--colors-ink)', fontVariantNumeric: 'tabular-nums' }}>
            {classAvg}
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px' }}>
            Standar KKM acuan: {KKM}
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
              Tuntas KKM (≥{KKM})
            </span>
            <CheckCircle2 size={16} style={{ color: '#16A34A' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#16A34A', fontVariantNumeric: 'tabular-nums' }}>
            {tuntasCount} <span style={{ fontSize: '13px', fontWeight: 500, color: '#16A34A' }}>Siswa</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#166534', marginTop: '4px' }}>
            Kondisi belajar tuntas &amp; stabil
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
              Perlu Remedial (&lt;{KKM})
            </span>
            <AlertCircle size={16} style={{ color: '#DC2626' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#DC2626', fontVariantNumeric: 'tabular-nums' }}>
            {remedialCount} <span style={{ fontSize: '13px', fontWeight: 500, color: '#DC2626' }}>Siswa</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#991B1B', marginTop: '4px' }}>
            Prioritas materi penguatan
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
              Nilai Tertinggi
            </span>
            <Award size={16} style={{ color: '#D97706' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#D97706', fontVariantNumeric: 'tabular-nums' }}>
            {highestScore}
          </div>
          <div style={{ fontSize: '11.5px', color: '#92400E', marginTop: '4px' }}>
            Capaian kompetensi optimal
          </div>
        </div>
      </div>
    </div>
  );
}
