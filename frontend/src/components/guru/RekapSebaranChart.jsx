import React, { useState } from 'react';

export default function RekapSebaranChart({ students = [], isGuruMapel = false, currentUser = null }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Compute grade distributions from actual students
  const gradeCounts = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  students.forEach((st) => {
    const letter = (st.letter_grade || 'B').toUpperCase();
    if (gradeCounts[letter] !== undefined) {
      gradeCounts[letter]++;
    } else {
      gradeCounts['C']++;
    }
  });

  const total = students.length || 1;
  const gradeColors = {
    A: { fill: '#10B981', label: 'Grade A (≥90)', bg: '#DCFCE7', text: '#166534' },
    B: { fill: '#3B82F6', label: 'Grade B (80-89.9)', bg: '#DBEAFE', text: '#1D4ED8' },
    C: { fill: '#F59E0B', label: 'Grade C (70-79.9 / KKM)', bg: '#FEF9C3', text: '#854D0E' },
    D: { fill: '#F97316', label: 'Grade D (60-69.9)', bg: '#FED7AA', text: '#9A3412' },
    E: { fill: '#EF4444', label: 'Grade E (<60)', bg: '#FEE2E2', text: '#991B1B' }
  };

  const subjectStats = [
    { name: 'B. Inggris', avg: 90.1, grad: 'linear-gradient(90deg, #7C69EF, #9686FA)' },
    { name: 'Kimia', avg: 87.4, grad: 'linear-gradient(90deg, #6C5DD3, #8272EC)' },
    { name: 'Matematika', avg: 85.2, grad: 'linear-gradient(90deg, #3B82F6, #60A5FA)' },
    { name: 'B. Indonesia', avg: 84.9, grad: 'linear-gradient(90deg, #F43F5E, #FB7185)' },
    { name: 'Seni Budaya', avg: 83.5, grad: 'linear-gradient(90deg, #06B6D4, #22D3EE)' },
    { name: 'Olahraga', avg: 82.8, grad: 'linear-gradient(90deg, #7C69EF, #A78BFA)' },
    { name: 'Ekonomi', avg: 82.1, grad: 'linear-gradient(90deg, #8B5CF6, #C084FC)' },
    { name: 'Informatika', avg: 86.3, grad: 'linear-gradient(90deg, #0EA5E9, #38BDF8)' },
    { name: 'Biologi', avg: 82.6, grad: 'linear-gradient(90deg, #6366F1, #818CF8)' },
    { name: 'Geografi', avg: 77.9, grad: 'linear-gradient(90deg, #64748B, #94A3B8)' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '22px' }}>
      {/* Sebaran Nilai Siswa (Donut & Legenda) */}
      <div className="theme-box-card">
        <div className="theme-box-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⚙️ Sebaran Predikat Akademik</span>
          <span style={{ fontSize: '11px', color: 'var(--theme-text-muted)' }}>Standar KKM 70</span>
        </div>

        <div className="sebaran-chart-layout" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div className="pie-container" style={{ position: 'relative', width: '150px', height: '150px', flexShrink: 0 }}>
            <svg width="150" height="150" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#EAE6FA" strokeWidth="18" />
              {/* Segmen Donut Sederhana */}
              <circle
                cx="50" cy="50" r="38"
                fill="none" stroke="#10B981" strokeWidth="18"
                strokeDasharray={`${(gradeCounts.A / total) * 238} 238`}
                strokeDashoffset="0"
                style={{ transition: 'all 0.5s ease' }}
              />
              <circle
                cx="50" cy="50" r="38"
                fill="none" stroke="#3B82F6" strokeWidth="18"
                strokeDasharray={`${(gradeCounts.B / total) * 238} 238`}
                strokeDashoffset={`-${(gradeCounts.A / total) * 238}`}
                style={{ transition: 'all 0.5s ease' }}
              />
              <circle
                cx="50" cy="50" r="38"
                fill="none" stroke="#F59E0B" strokeWidth="18"
                strokeDasharray={`${(gradeCounts.C / total) * 238} 238`}
                strokeDashoffset={`-${((gradeCounts.A + gradeCounts.B) / total) * 238}`}
                style={{ transition: 'all 0.5s ease' }}
              />
              <circle
                cx="50" cy="50" r="38"
                fill="none" stroke="#EF4444" strokeWidth="18"
                strokeDasharray={`${((gradeCounts.D + gradeCounts.E) / total) * 238} 238`}
                strokeDashoffset={`-${((gradeCounts.A + gradeCounts.B + gradeCounts.C) / total) * 238}`}
                style={{ transition: 'all 0.5s ease' }}
              />
              {/* Center hole text */}
              <text x="50" y="47" textAnchor="middle" style={{ fontSize: '13px', fontWeight: 800, fill: '#23214A' }}>
                {students.length}
              </text>
              <text x="50" y="60" textAnchor="middle" style={{ fontSize: '7px', fontWeight: 600, fill: '#6E6D8A' }}>
                Siswa
              </text>
            </svg>
          </div>

          <div className="pie-legend-clean" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {Object.entries(gradeColors).map(([letter, conf]) => (
              <div
                key={letter}
                className="pie-legend-clean-item"
                onClick={() => setSelectedCategory(selectedCategory === letter ? null : letter)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  background: selectedCategory === letter ? '#ECE9FD' : '#FAF9FE',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: conf.fill }}></span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--theme-text-dark)' }}>{conf.label}</span>
                </div>
                <span className={`val val-${letter.toLowerCase()}`} style={{ fontSize: '11px', padding: '1px 6px' }}>
                  {gradeCounts[letter]} ({Math.round((gradeCounts[letter] / total) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar Chart: Rata-rata per Mapel (Hanya untuk Guru BK / Umum) */}
      {!isGuruMapel ? (
        <div className="theme-box-card">
          <div className="theme-box-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>📊 Capaian Rata-rata 11 Mapel</span>
            <span style={{ fontSize: '11px', color: 'var(--theme-text-muted)' }}>Urutan Tertinggi</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px 16px', maxHeight: '170px', overflowY: 'auto' }}>
            {subjectStats.map((sub) => (
              <div key={sub.name} className="bar-item-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '70px', fontSize: '11.5px', fontWeight: 600, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {sub.name}
                </div>
                <div className="bar-track-wrap" style={{ flex: 1, height: '8px', background: '#ECEAF8', borderRadius: '8px', overflow: 'hidden' }}>
                  <div className="bar-fill-gradient" style={{ width: `${sub.avg}%`, height: '100%', background: sub.grad, borderRadius: '8px' }}></div>
                </div>
                <div style={{ width: '32px', fontSize: '11.5px', fontWeight: 800, textAlign: 'right', color: 'var(--theme-text-dark)' }}>
                  {sub.avg}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="theme-box-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="theme-box-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>📘 Fokus Penilaian Guru Pengampu</span>
            <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700, background: '#DCFCE7', padding: '2px 8px', borderRadius: '6px' }}>TERKUNCI</span>
          </div>
          <div style={{ marginTop: '14px' }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>
              {currentUser?.subject_name || 'Matematika'}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
              Hak akses data dibatasi hanya pada mata pelajaran yang Anda ampu. Data mata pelajaran lain dan asesmen konseling RIASEC diisolasi untuk privasi siswa.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
