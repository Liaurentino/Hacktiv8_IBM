import React from 'react';
import { Briefcase } from 'lucide-react';

export default function MuridCareerBox({ studentDetail }) {
  return (
    <div className="career-box" style={{ background: '#FFFFFF', border: '1px solid #E8E5F7', borderRadius: '16px', boxShadow: '0 2px 12px rgba(47, 51, 102, 0.05)' }}>
      <div className="career-icon" style={{ background: '#EDE9FE', color: '#5B21B6' }}>
        <Briefcase size={28} />
      </div>
      <div>
        <div className="career-tag" style={{ color: '#6B21A8' }}>
          {studentDetail.career_tag || `Eksplorasi Karir — ${studentDetail.name}`}
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)', margin: '4px 0 8px' }}>
          {studentDetail.career_title || 'Bidang Unggulan: Riset Sains & Bioteknologi'}
        </h3>
        <p style={{ fontSize: '13.5px', color: 'var(--text)', lineHeight: 1.6 }}>
          {studentDetail.career_desc || 'Konsistensi tinggi pada mapel sains dan bahasa menjadi landasan ideal untuk jalur studi riset dan beasiswa.'}
        </p>

        <div style={{ marginTop: '14px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Rekomendasi Profesi &amp; Jalur Studi Lanjut:
          </div>
          <ul className="career-list">
            {(studentDetail.career_jobs || [
              'Peneliti Biokimia & Farmasi Terapan',
              'Analis Laboratorium Biomedis',
              'Data Scientist Bidang Life Sciences'
            ]).map((job, idx) => (
              <li key={idx} style={{ fontSize: '13px' }}>{job}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
