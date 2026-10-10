import React from 'react';
import { CheckCircle2, X, Copy, Check, ArrowRight } from 'lucide-react';

export default function SingleAccountPreviewCard({
  createdStudent,
  onClose,
  onCopyCredentials,
  copiedManual,
  onSelectStudentDetail
}) {
  if (!createdStudent) return null;

  return (
    <div
      className="card"
      style={{
        background: '#F0FDF4',
        border: '1.5px solid #86EFAC',
        borderRadius: '10px',
        padding: '20px',
        position: 'relative',
        boxShadow: '0 4px 14px rgba(22, 163, 74, 0.08)'
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
          color: '#166534',
          cursor: 'pointer',
          padding: '4px'
        }}
        title="Tutup Pratinjau"
      >
        <X size={18} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#DCFCE7',
            color: '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CheckCircle2 size={18} />
        </div>
        <div>
          <h3 style={{ fontSize: '15.5px', fontWeight: 800, color: '#14532D', margin: 0 }}>
            Pratinjau Kredensial Akun: Akun Siswa Berhasil Diterbitkan
          </h3>
          <p style={{ fontSize: '12px', color: '#166534', margin: '2px 0 0' }}>
            Akun telah aktif di portal. Silakan salin kredensial untuk dibagikan ke siswa atau wali murid.
          </p>
        </div>
      </div>

      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #BBF7D0',
          borderRadius: '8px',
          padding: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          fontSize: '13px'
        }}
      >
        <div>
          <div style={{ color: 'var(--slate-500)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
            Nama Lengkap Siswa
          </div>
          <div style={{ fontWeight: 700, color: 'var(--slate-900)', marginTop: '2px', fontSize: '14px' }}>
            {createdStudent.name}
          </div>
        </div>

        <div>
          <div style={{ color: 'var(--slate-500)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
            NISN &amp; Kelas
          </div>
          <div style={{ fontWeight: 600, color: 'var(--slate-900)', marginTop: '2px', fontFamily: 'monospace' }}>
            {createdStudent.nisn} &middot; <span style={{ fontFamily: 'inherit', fontWeight: 700 }}>{createdStudent.class_name}</span>
          </div>
        </div>

        <div>
          <div style={{ color: 'var(--slate-500)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
            Email Login Siswa
          </div>
          <div style={{ fontWeight: 600, color: 'var(--brand)', marginTop: '2px', wordBreak: 'break-all' }}>
            {createdStudent.credentials?.email}
          </div>
        </div>

        <div>
          <div style={{ color: 'var(--slate-500)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
            Kata Sandi Awal (8 Karakter Otomatis)
          </div>
          <div
            style={{
              fontWeight: 800,
              color: '#15803D',
              marginTop: '2px',
              fontFamily: 'monospace',
              fontSize: '14px',
              background: '#F0FDF4',
              padding: '2px 8px',
              borderRadius: '4px',
              display: 'inline-block'
            }}
          >
            {createdStudent.credentials?.password}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
        <button
          type="button"
          onClick={() => onCopyCredentials(createdStudent)}
          className="btn-luna-secondary"
          style={{
            fontSize: '13px',
            padding: '8px 14px',
            background: '#FFFFFF',
            borderColor: '#86EFAC',
            color: '#15803D'
          }}
        >
          {copiedManual ? <Check size={15} style={{ color: '#16A34A' }} /> : <Copy size={15} />}
          <span>{copiedManual ? 'Kredensial Tersalin!' : 'Salin Kredensial (Format Pesan WhatsApp)'}</span>
        </button>

        {onSelectStudentDetail && (
          <button
            type="button"
            onClick={() => onSelectStudentDetail(createdStudent)}
            style={{
              background: '#16A34A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Buka Profil Akademik Siswa</span>
            <ArrowRight size={15} />
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="btn-luna-secondary"
          style={{ fontSize: '13px', padding: '8px 14px' }}
        >
          Tutup Pratinjau
        </button>
      </div>
    </div>
  );
}
