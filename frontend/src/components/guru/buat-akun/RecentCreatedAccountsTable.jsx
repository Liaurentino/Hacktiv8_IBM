import React from 'react';
import { Copy } from 'lucide-react';

export default function RecentCreatedAccountsTable({
  recentAccounts,
  onCopyCredentials,
  onSelectStudentDetail
}) {
  if (!recentAccounts || recentAccounts.length === 0) return null;

  return (
    <div className="card" style={{ padding: '18px 20px', marginTop: '6px' }}>
      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--slate-900)', margin: 0 }}>
            Akun Siswa Dibuat Sesi Ini ({recentAccounts.length})
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--slate-500)', margin: '2px 0 0' }}>
            Daftar akun murid yang berhasil diterbitkan selama sesi login saat ini.
          </p>
        </div>
      </div>

      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table className="tbl-students" style={{ width: '100%', minWidth: '640px' }}>
          <thead>
            <tr>
              <th style={{ width: '80px' }}>WAKTU</th>
              <th>NAMA SISWA</th>
              <th>NISN</th>
              <th>KELAS</th>
              <th>EMAIL LOGIN</th>
              <th>PASSWORD</th>
              <th style={{ width: '130px' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {recentAccounts.map((acc, idx) => (
              <tr key={idx}>
                <td style={{ fontSize: '11.5px', color: 'var(--slate-500)' }}>{acc.createdAtTime}</td>
                <td style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{acc.name}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{acc.nisn}</td>
                <td><span className="badge-class">{acc.class_name}</span></td>
                <td style={{ fontSize: '12px', color: 'var(--slate-600)' }}>{acc.credentials?.email}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, color: '#16A34A' }}>
                  {acc.credentials?.password}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => onCopyCredentials(acc)}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '4px',
                        padding: '3px 8px',
                        cursor: 'pointer',
                        fontSize: '11.5px',
                        fontWeight: 500,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: 'var(--slate-700)'
                      }}
                      title="Salin Kredensial"
                    >
                      <Copy size={11} />
                      <span>Salin</span>
                    </button>

                    {onSelectStudentDetail && (
                      <button
                        type="button"
                        onClick={() => onSelectStudentDetail(acc)}
                        style={{
                          background: '#F1F5F9',
                          border: '1px solid #CBD5E1',
                          borderRadius: '4px',
                          padding: '3px 8px',
                          cursor: 'pointer',
                          fontSize: '11.5px',
                          fontWeight: 500,
                          color: 'var(--slate-800)'
                        }}
                      >
                        Detail
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
