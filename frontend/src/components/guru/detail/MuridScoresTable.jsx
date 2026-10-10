import React from 'react';

export default function MuridScoresTable({ studentDetail, getScoreBadge }) {
  return (
    <div className="card" style={{ padding: '0px', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--primary)' }}>
          Rekap Nilai Detail Per Pertemuan — {studentDetail.name}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          7 Pertemuan (P1–P3, UTS, P5–P6, UAS)
        </div>
      </div>

      <div className="table-scroll-hint" style={{ padding: '8px 16px 0' }}>
        <span>👉 Tabel sebaran nilai 7 pertemuan (P1–P3, UTS, P5–P6, UAS)</span>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th className="sticky-col-left" style={{ minWidth: '130px' }}>Mata Pelajaran</th>
              <th>P1</th><th>P2</th><th>P3</th>
              <th style={{ background: '#3D3F7A', color: '#FFF' }}>UTS</th>
              <th>P5</th><th>P6</th>
              <th style={{ background: '#3D3F7A', color: '#FFF' }}>UAS</th>
              <th style={{ background: '#2F3366', color: '#FFF' }}>Avg</th>
              <th style={{ background: '#2F3366', color: '#FFF' }}>Min</th>
              <th style={{ background: '#2F3366', color: '#FFF' }}>Max</th>
            </tr>
          </thead>
          <tbody>
            {studentDetail.grades && studentDetail.grades.length > 0 ? (
              studentDetail.grades.map((g) => {
                const s = g.scores || [];
                return (
                  <tr key={g.id}>
                    <td className="sticky-col-left" style={{ fontWeight: 700, color: 'var(--text)' }}>{g.subject_name}</td>
                    <td>{s[0] ?? '—'}</td>
                    <td>{s[1] ?? '—'}</td>
                    <td>{s[2] ?? '—'}</td>
                    <td style={{ background: '#F8FAFC', textAlign: 'center' }}>
                      {getScoreBadge(s[3] ?? g.avg_score)}
                    </td>
                    <td>{s[4] ?? '—'}</td>
                    <td>{s[5] ?? '—'}</td>
                    <td style={{ background: '#F8FAFC', textAlign: 'center' }}>
                      {getScoreBadge(s[6] ?? g.avg_score)}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--primary)' }}>
                      {g.avg_score}
                    </td>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{g.min_score}</td>
                    <td style={{ textAlign: 'center', color: '#166534', fontWeight: 700 }}>{g.max_score}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={11} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  Data nilai detail sedang dikalkulasi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
