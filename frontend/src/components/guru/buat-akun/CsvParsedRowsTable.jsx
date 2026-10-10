import React from 'react';
import { RotateCcw, CheckCircle, RefreshCw } from 'lucide-react';

export default function CsvParsedRowsTable({
  csvParsedRows,
  onResetCsv,
  loading,
  onBatchCreate
}) {
  if (!csvParsedRows || csvParsedRows.length === 0) return null;

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--slate-900)' }}>
          Daftar Murid Terdeteksi dari CSV ({csvParsedRows.length} Calon Akun)
        </div>
        <button
          type="button"
          onClick={onResetCsv}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--slate-500)',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <RotateCcw size={12} />
          <span>Hapus Data</span>
        </button>
      </div>

      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', border: '1px solid var(--border)', borderRadius: '6px' }}>
        <table className="tbl-students" style={{ width: '100%', minWidth: '700px', background: '#FFFFFF', margin: 0 }}>
          <thead>
            <tr>
              <th style={{ width: '40px' }}>NO</th>
              <th>NAMA LENGKAP</th>
              <th>NISN</th>
              <th>NO. HP</th>
              <th>EMAIL LOGIN</th>
              <th>KELAS</th>
              <th>JK</th>
              <th>NILAI AWAL</th>
            </tr>
          </thead>
          <tbody>
            {csvParsedRows.map((row, idx) => (
              <tr key={idx}>
                <td style={{ textAlign: 'center', fontSize: '11px', color: 'var(--slate-500)' }}>{idx + 1}</td>
                <td style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{row.name}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{row.nisn}</td>
                <td style={{ fontSize: '12px', color: 'var(--slate-600)' }}>{row.phone || '-'}</td>
                <td style={{ fontSize: '12px', color: 'var(--brand)' }}>{row.email}</td>
                <td><span className="badge-class">{row.className}</span></td>
                <td style={{ fontSize: '12px' }}>{row.gender === 'P' ? 'P' : 'L'}</td>
                <td style={{ fontSize: '12px', fontWeight: 600 }}>{row.academicScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <button
          type="button"
          disabled={loading}
          onClick={onBatchCreate}
          className="btn-luna-primary"
          style={{ fontSize: '14px', padding: '10px 20px', gap: '8px' }}
        >
          {loading ? (
            <>
              <RefreshCw size={16} className="spin-anim" />
              <span>Menerbitkan Akun Siswa...</span>
            </>
          ) : (
            <>
              <CheckCircle size={16} />
              <span>Buat {csvParsedRows.length} Akun Otomatis dari CSV</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
