import React from 'react';

export default function RekapMatrixTable({
  viewMode,
  selectedSubject,
  selectedClass,
  mapelList,
  meetingLabels,
  filteredStudents,
  onSelectStudent,
  getScoreBadgeClass,
  isGuruMapel = false
}) {
  const currentSubjectName = mapelList.find((m) => m.key === selectedSubject)?.name || 'Matematika';

  return (
    <div className="theme-box-card" style={{ padding: '0px', overflow: 'hidden', width: '100%' }}>
      {/* Card Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--primary)' }}>
          {viewMode === 'meetings'
            ? `Matriks Nilai 7 Pertemuan — ${currentSubjectName}`
            : `Matriks Nilai Rata-rata 11 Mata Pelajaran Resmi — ${selectedClass}`}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {isGuruMapel
            ? 'Klik pada nama siswa untuk melihat rincian capaian nilai'
            : 'Klik pada nama siswa untuk membuka Lembar Konseling & RIASEC'}
        </div>
      </div>

      {/* Responsive Stretched Table Wrapper */}
      <div className="table-responsive-clean" style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table className="theme-data-table" style={{ width: '100%', minWidth: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
          <thead>
            <tr>
              <th style={{ width: '42px', minWidth: '42px', textAlign: 'center', padding: '12px 6px' }}>#</th>
              <th style={{ textAlign: 'left', minWidth: '180px', padding: '12px 14px', whiteSpace: 'nowrap' }}>Nama Siswa</th>
              <th style={{ textAlign: 'center', minWidth: '95px', width: '100px', padding: '12px 8px' }}>NISN</th>
              {viewMode === 'meetings' ? (
                meetingLabels.map((p) => (
                  <th
                    key={p}
                    style={{
                      textAlign: 'center',
                      minWidth: '46px',
                      padding: '12px 4px',
                      background: (p === 'UTS' || p === 'UAS') ? '#5B4AE3' : undefined,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {p}
                  </th>
                ))
              ) : (
                mapelList.map((m) => (
                  <th
                    key={m.key}
                    style={{
                      textAlign: 'center',
                      minWidth: '50px',
                      padding: '12px 4px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {m.short}
                  </th>
                ))
              )}
              <th style={{ textAlign: 'center', minWidth: '85px', background: '#4F46E5', padding: '12px 8px', whiteSpace: 'nowrap' }}>
                Rata-rata
              </th>
              <th style={{ textAlign: 'center', minWidth: '75px', padding: '12px 8px', whiteSpace: 'nowrap' }}>
                Predikat
              </th>
              <th style={{ textAlign: 'center', minWidth: '75px', padding: '12px 8px', whiteSpace: 'nowrap' }}>
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td
                  colSpan={viewMode === 'meetings' ? meetingLabels.length + 6 : mapelList.length + 6}
                  style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}
                >
                  Tidak ada data siswa yang cocok dengan kriteria pencarian.
                </td>
              </tr>
            ) : (
              filteredStudents.map((st, idx) => {
                const subGrades = st.grades?.[selectedSubject]?.scores || [];
                return (
                  <tr key={st.id} style={{ transition: 'background-color 150ms ease-out' }}>
                    <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)', padding: '10px 6px' }}>
                      {idx + 1}
                    </td>
                    <td style={{ textAlign: 'left', padding: '10px 14px', whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        onClick={() => onSelectStudent(st)}
                        style={{
                          background: 'none',
                          border: 'none',
                          textAlign: 'left',
                          fontWeight: 700,
                          color: 'var(--brand)',
                          cursor: 'pointer',
                          fontSize: '13px',
                          whiteSpace: 'nowrap',
                          padding: 0
                        }}
                      >
                        {st.name}
                      </button>
                    </td>
                    <td style={{ textAlign: 'center', padding: '10px 8px' }}>
                      <code style={{ fontSize: '12px', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                        {st.nisn}
                      </code>
                    </td>
                    {viewMode === 'meetings' ? (
                      meetingLabels.map((label, pIdx) => {
                        const val = subGrades[pIdx] !== undefined ? subGrades[pIdx] : Math.round(st.academic_score || 80);
                        return (
                          <td key={label} style={{ textAlign: 'center', padding: '8px 4px' }}>
                            <span className={`val ${getScoreBadgeClass(val)}`} style={{ minWidth: '36px', textAlign: 'center' }}>
                              {val}
                            </span>
                          </td>
                        );
                      })
                    ) : (
                      mapelList.map((m) => {
                        const val = st.grades?.[m.key]?.avg_score !== undefined
                          ? st.grades[m.key].avg_score
                          : Math.round(st.academic_score || 80);
                        return (
                          <td key={m.key} style={{ textAlign: 'center', padding: '8px 4px' }}>
                            <span className={`val ${getScoreBadgeClass(val)}`} style={{ minWidth: '36px', textAlign: 'center' }}>
                              {val}
                            </span>
                          </td>
                        );
                      })
                    )}
                    <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--primary)', padding: '10px 8px', fontVariantNumeric: 'tabular-nums' }}>
                      {st.academic_score || '84.0'}
                    </td>
                    <td style={{ textAlign: 'center', padding: '10px 8px' }}>
                      <span className={`val val-${(st.letter_grade || 'b').toLowerCase()}`}>
                        {st.letter_grade || 'B'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', padding: '10px 8px' }}>
                      <button
                        type="button"
                        onClick={() => onSelectStudent(st)}
                        style={{
                          background: '#F1F5F9',
                          border: '1px solid #CBD5E1',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
