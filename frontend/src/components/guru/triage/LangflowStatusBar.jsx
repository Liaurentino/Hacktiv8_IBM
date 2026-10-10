import React, { useState } from 'react';
import { Network, ChevronDown, ChevronUp, Cpu, ShieldCheck, FileCode } from 'lucide-react';

export default function LangflowStatusBar({ onOpenFlowModal }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        color: '#1E1B4B',
        borderRadius: '16px',
        border: '1.5px solid #E8E5F7',
        marginTop: '36px',
        marginBottom: '24px',
        boxShadow: '0 2px 10px rgba(47, 51, 102, 0.04)',
        overflow: 'hidden'
      }}
    >
      {/* Collapsible Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '14px 20px',
          background: isExpanded ? '#FAF9FF' : '#FFFFFF',
          borderBottom: isExpanded ? '1px solid #E8E5F7' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          flexWrap: 'wrap',
          gap: '12px',
          transition: 'background 0.15s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#F4F1FE',
              border: '1px solid #DDD6FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7C69EF'
            }}
          >
            <ShieldCheck size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '14px', color: '#1E1B4B' }}>
                Prinsip Kerja &amp; Etika Pendampingan LUNA
              </span>
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  background: '#EEF2FF',
                  color: '#4338CA',
                  border: '1px solid #C7D2FE',
                  borderRadius: '6px',
                  fontWeight: 700
                }}
              >
                Etika Konseling &amp; Privasi
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
              Pendampingan Holistik Siswa • Tanpa Diagnosis Medis • Guru sebagai Penentu
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, color: '#166534', background: '#DCFCE7', padding: '3px 8px', borderRadius: '999px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16A34A' }}></span>
              Asisten Aktif
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, color: '#4338CA', background: '#EEF2FF', padding: '3px 8px', borderRadius: '999px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366F1' }}></span>
              Terenkripsi UU PDP
            </span>
          </div>

          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              fontWeight: 600,
              padding: '4px 8px'
            }}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expanded Technical Details */}
      {isExpanded && (
        <div style={{ padding: '18px 22px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '14px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
                Perlindungan Identitas Siswa
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
                Penyamaran PII Otomatis
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                Seluruh data nama, kontak, dan NISN disamarkan menjadi kode acak sebelum proses analisis untuk menjaga kerahasiaan siswa.
              </div>
            </div>

            <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '14px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
                Etika &amp; Kepatuhan Regulasi
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={15} />
                <span>UU PDP No. 27/2022 &amp; Non-Klinis</span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                Sistem tidak pernah menerbitkan label atau diagnosis medis/psikiatri. Semua rekomendasi berbasis bimbingan pedagogis.
              </div>
            </div>

            <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '14px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
                Prinsip Operasional
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#4338CA' }}>
                Human-in-the-Loop (Guru sebagai Penentu)
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                Seluruh rekomendasi bersifat saran pendamping (*decision support*), keputusan bimbingan tetap sepenuhnya di tangan Guru.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
