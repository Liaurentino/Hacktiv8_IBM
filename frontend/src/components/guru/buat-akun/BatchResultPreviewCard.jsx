import React from 'react';
import { CheckCircle, X, Copy, Check, Download, AlertTriangle } from 'lucide-react';

export default function BatchResultPreviewCard({
  batchResult,
  onClose,
  onCopyAllBatchCredentials,
  copiedBatch,
  onExportBatchCredentialsCsv
}) {
  if (!batchResult) return null;

  return (
    <div
      className="card"
      style={{
        background: '#F8FAFC',
        border: '1.5px solid #CBD5E1',
        borderRadius: '10px',
        padding: '20px',
        position: 'relative'
      }}
    >
      <button
        type="button"
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'none',
          border: 'none',
          color: 'var(--slate-500)',
          cursor: 'pointer',
          padding: '4px'
        }}
        title="Tutup Hasil"
      >
        <X size={18} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#DCFCE7',
            color: '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CheckCircle size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            Pratinjau Kredensial Akun Siswa dari CSV
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--slate-600)', margin: '2px 0 0' }}>
            {batchResult.successCount} akun murid berhasil dibuat &amp; {batchResult.failedCount} data dilewati.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={onCopyAllBatchCredentials}
          className="btn-luna-secondary"
          style={{ fontSize: '12.5px', padding: '7px 14px' }}
        >
          {copiedBatch ? <Check size={14} style={{ color: '#16A34A' }} /> : <Copy size={14} />}
          <span>{copiedBatch ? 'Semua Kredensial Tersalin!' : 'Salin Semua Kredensial (Format WA)'}</span>
        </button>

        <button
          type="button"
          onClick={onExportBatchCredentialsCsv}
          className="btn-luna-secondary"
          style={{ fontSize: '12.5px', padding: '7px 14px' }}
        >
          <Download size={14} />
          <span>Unduh Rekap Akun (.CSV)</span>
        </button>
      </div>

      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', maxHeight: '300px' }}>
        <table className="tbl-students" style={{ width: '100%', minWidth: '600px', background: '#FFFFFF' }}>
          <thead>
            <tr>
              <th style={{ width: '40px' }}>NO</th>
              <th>NAMA SISWA</th>
              <th>NISN</th>
              <th>KELAS</th>
              <th>EMAIL LOGIN</th>
              <th>PASSWORD (8 CHAR)</th>
            </tr>
          </thead>
          <tbody>
            {batchResult.created?.map((item, idx) => (
              <tr key={idx}>
                <td style={{ textAlign: 'center', fontSize: '11px', color: 'var(--slate-500)' }}>{idx + 1}</td>
                <td style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{item.credentials?.name}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{item.credentials?.nisn}</td>
                <td><span className="badge-class">{item.credentials?.className}</span></td>
                <td style={{ fontSize: '12px', color: 'var(--slate-700)' }}>{item.credentials?.email}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, color: '#16A34A' }}>
                  {item.credentials?.password}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {batchResult.errors && batchResult.errors.length > 0 && (
        <div style={{ marginTop: '14px', background: '#FFFBEB', border: '1px solid #FDE68A', padding: '12px', borderRadius: '6px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#92400E', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={14} />
            <span>{batchResult.errors.length} Data Dilewati / Sudah Terdaftar:</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11.5px', color: '#B45309' }}>
            {batchResult.errors.map((err, i) => (
              <li key={i}>{err.name || err.nisn}: {err.reason}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
