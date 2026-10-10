import React from 'react';
import { Compass } from 'lucide-react';

export default function RekapCareerSection() {
  const careers = [
    {
      icon: '💻',
      title: 'Software & AI Engineer',
      code: 'RIASEC: I-R-C',
      desc: 'Matematika & Sains Unggul',
      students: 'Budi Siswa Demo'
    },
    {
      icon: '🔬',
      title: 'Ilmuwan & Peneliti Sains',
      code: 'RIASEC: I-R-A',
      desc: 'Biologi & Kimia Tinggi',
      students: 'Eksplorasi Minat Riset'
    },
    {
      icon: '🎨',
      title: 'Creative & UI/UX Director',
      code: 'RIASEC: A-S-E',
      desc: 'Seni Budaya & Bahasa Unggul',
      students: 'Eksplorasi Minat Desain'
    },
    {
      icon: '📊',
      title: 'Financial & Data Analyst',
      code: 'RIASEC: C-E-I',
      desc: 'Ekonomi & Logika Analitis',
      students: 'Eksplorasi Minat Data'
    },
    {
      icon: '🏃',
      title: 'Sports & Health Scientist',
      code: 'RIASEC: R-S-I',
      desc: 'PJOK & Kesehatan Fisik',
      students: 'Eksplorasi Minat Terapan'
    },
    {
      icon: '🩺',
      title: 'Dokter & Tenaga Biomedis',
      code: 'RIASEC: I-S-R',
      desc: 'Biologi & Kimia Terapan',
      students: 'Eksplorasi Minat Medis'
    }
  ];

  return (
    <div
      className="career-bottom-card"
      style={{
        marginTop: '22px',
        background: '#FFFFFF',
        border: '1px solid #E8E5F7',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(47, 51, 102, 0.03), 0 6px 16px rgba(47, 51, 102, 0.04)',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        flexWrap: 'wrap',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Left Column: Mascot & Info */}
      <div
        className="career-mascot-col"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flex: '0 0 320px',
          maxWidth: '340px',
          minWidth: '260px'
        }}
      >
        <img
          src="/assets/mascot/career_luna_book.png"
          alt="Mascot LUNA Karir"
          style={{ height: '96px', width: 'auto', objectFit: 'contain', flexShrink: 0 }}
          onError={(e) => { e.target.src = '/assets/mascot/mascot_senang.png'; }}
        />
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
            <Compass size={18} color="#7C69EF" />
            <span>Pemetaan Minat Karir (Holland RIASEC)</span>
          </h3>
          <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand)', marginTop: '4px', marginBottom: 0 }}>
            Rekomendasi Program Studi Berdasarkan Nilai Akademik P1–P14
          </p>
          <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px', marginBottom: 0, lineHeight: 1.45 }}>
            Membantu Guru BK memberikan arahan persiapan SNBP/SNBT tanpa stereotip jurusan.
          </p>
        </div>
      </div>

      {/* Right Column: 6 Career Cards stretched in a 3-column grid */}
      <div
        className="career-grid-items"
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '12px',
          minWidth: '280px',
          width: '100%'
        }}
      >
        {careers.map((c, idx) => (
          <div
            key={idx}
            className="career-item-box"
            style={{
              background: '#FAF9FE',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease'
            }}
          >
            <span style={{ fontSize: '26px', flexShrink: 0 }}>{c.icon}</span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {c.title}
              </div>
              <div style={{ fontSize: '11px', color: '#7C69EF', fontWeight: 700, marginTop: '2px' }}>
                {c.code}
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Siswa: <strong style={{ color: 'var(--text)' }}>{c.students}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
