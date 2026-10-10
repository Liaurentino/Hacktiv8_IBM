import React from 'react';
import { Edit3 } from 'lucide-react';

export default function MapelScoreTable({
  loading,
  filteredStudents,
  activeSubjectName,
  KKM,
  onOpenEdit
}) {
  return (
    <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
        <thead>
          <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 600 }}>
            <th style={{ padding: '14px 16px', width: '50px' }}>No</th>
            <th style={{ padding: '14px 16px' }}>NISN & Nama Murid</th>
            <th style={{ padding: '14px 16px' }}>Sebaran Nilai (7 Pertemuan)</th>
            <th style={{ padding: '14px 16px', textAlign: 'center' }}>Rata-rata</th>
            <th style={{ padding: '14px 16px', textAlign: 'center' }}>Predikat</th>
            <th style={{ padding: '14px 16px', textAlign: 'center' }}>Ketuntasan</th>
            <th style={{ padding: '14px 16px', textAlign: 'center' }}>Aksi Penilaian</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                Memuat data nilai {activeSubjectName}...
              </td>
            </tr>
          ) : filteredStudents.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                Tidak ada data murid yang sesuai kriteria pencarian.
              </td>
            </tr>
          ) : (
            filteredStudents.map((st, idx) => {
              const avgNum = Number(st.avg_score) || 0;
              const isTuntas = avgNum >= KKM;
              const meetingLabels = ['P1', 'P2', 'P3', 'UTS', 'P5', 'P6', 'UAS'];

              return (
                <tr
                  key={st.student_id}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 16px', color: '#94A3B8' }}>{idx + 1}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '14px' }}>{st.student_name}</div>
                    <div style={{ color: '#64748B', fontSize: '11px', marginTop: '2px' }}>
                      NISN: {st.nisn} • {st.class_name || 'XI IPA 2'} ({st.gender === 'P' ? 'Perempuan' : 'Laki-laki'})
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {/* Mini spark/score indicators */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', maxWidth: '320px' }}>
                      {(st.scores || []).slice(0, 7).map((sc, scIdx) => (
                        <span
                          key={scIdx}
                          title={`${meetingLabels[scIdx] || `P${scIdx + 1}`}: ${sc}`}
                          style={{
                            display: 'inline-block',
                            minWidth: '22px',
                            padding: '0 4px',
                            height: '20px',
                            lineHeight: '20px',
                            textAlign: 'center',
                            fontSize: '10px',
                            fontWeight: 700,
                            borderRadius: '4px',
                            background: sc >= KKM ? '#DCFCE7' : '#FEE2E2',
                            color: sc >= KKM ? '#166534' : '#991B1B'
                          }}
                        >
                          {sc}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span
                      style={{
                        fontSize: '15px',
                        fontWeight: 800,
                        color: isTuntas ? '#16A34A' : '#DC2626'
                      }}
                    >
                      {avgNum}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 800,
                        background: '#F1F5F9',
                        color: '#334155'
                      }}
                    >
                      {st.letter_grade || 'B'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    {isTuntas ? (
                      <span
                        style={{
                          background: '#DEF7EC',
                          color: '#03543F',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 700
                        }}
                      >
                        TUNTAS
                      </span>
                    ) : (
                      <span
                        style={{
                          background: '#FDE8E8',
                          color: '#9B1C1C',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 700
                        }}
                      >
                        REMEDIAL
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <button
                      onClick={() => onOpenEdit(st)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#4F46E5',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Edit3 size={13} />
                      <span>Input Nilai</span>
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
