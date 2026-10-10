import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function MapelCsvPreviewTable({
  parsedRows,
  KKM,
  onReset,
  onApplyBatch,
  submitting
}) {
  if (!parsedRows || parsedRows.length === 0) return null;

  const matchedCount = parsedRows.filter((r) => r.isMatched).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
        <div style={{ fontWeight: 800, fontSize: '14px', color: '#1E1B4B' }}>
          Hasil Pembacaan Data: {parsedRows.length} Baris Murid ({matchedCount} Terdaftar, {parsedRows.length - matchedCount} Siswa Baru)
        </div>
        <button
          type="button"
          onClick={onReset}
          style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}
        >
          Bersihkan Data
        </button>
      </div>

      <div style={{ border: '1px solid #E2E8F0', borderRadius: '10px', overflowX: 'auto', maxHeight: '340px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
          <thead style={{ position: 'sticky', top: 0, background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', zIndex: 1 }}>
            <tr style={{ color: '#475569', fontWeight: 700 }}>
              <th style={{ padding: '10px 12px' }}>No</th>
              <th style={{ padding: '10px 12px' }}>NISN</th>
              <th style={{ padding: '10px 12px' }}>Nama Murid</th>
              <th style={{ padding: '10px 12px' }}>Sebaran Nilai (7 Pertemuan)</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Rata-rata</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status Siswa</th>
            </tr>
          </thead>
          <tbody>
            {parsedRows.map((row, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: '1px solid #F1F5F9',
                  background: row.isMatched ? '#FFFFFF' : '#FFFBEB'
                }}
              >
                <td style={{ padding: '8px 12px', color: '#94A3B8' }}>{idx + 1}</td>
                <td style={{ padding: '8px 12px', fontWeight: 600, color: '#1E293B' }}>{row.nisn}</td>
                <td style={{ padding: '8px 12px', fontWeight: 700, color: '#312E81' }}>{row.studentName}</td>
                <td style={{ padding: '8px 12px' }}>
                  <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', maxWidth: '300px' }}>
                    {row.scores.map((sc, sIdx) => (
                      <span
                        key={sIdx}
                        style={{
                          fontSize: '10.5px',
                          padding: '2px 5px',
                          borderRadius: '4px',
                          background: sIdx === 3 ? '#FEF3C7' : sc >= KKM ? '#DCFCE7' : '#FEE2E2',
                          color: sIdx === 3 ? '#92400E' : sc >= KKM ? '#166534' : '#991B1B',
                          fontWeight: 700,
                          border: sIdx === 3 ? '1px solid #FDE68A' : 'none'
                        }}
                      >
                        {sc}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 800, color: row.avgScore >= KKM ? '#16A34A' : '#DC2626' }}>
                  {row.avgScore}
                </td>
                <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                  {row.isMatched ? (
                    <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#166534', padding: '3px 8px', borderRadius: '8px', fontWeight: 700 }}>
                      ✓ Terdaftar di Kelas
                    </span>
                  ) : (
                    <span style={{ fontSize: '11px', background: '#EDE9FE', color: '#5B21B6', padding: '3px 8px', borderRadius: '8px', fontWeight: 700 }}>
                      + Didaftarkan Otomatis
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Apply Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <button
          type="button"
          onClick={onApplyBatch}
          disabled={submitting}
          className="btn-luna-primary"
          style={{
            borderRadius: '10px',
            padding: '10px 24px',
            fontSize: '13.5px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#16A34A',
            borderColor: '#15803D'
          }}
        >
          <CheckCircle size={16} />
          <span>
            {submitting
              ? 'Menyimpan Rekap Nilai...'
              : `Terapkan & Simpan Semua ${parsedRows.length} Nilai ke Kelas`}
          </span>
        </button>
      </div>
    </div>
  );
}
