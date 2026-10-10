import React from 'react';
import { Key, User, Mail, Eye, EyeOff, RefreshCw } from 'lucide-react';

export default function ManualAccountCredentialsSection({
  formData,
  onChange,
  onAutoGenerateEmail,
  onFetchServerPassword,
  loadingPassword,
  showPassword,
  setShowPassword
}) {
  return (
    <div className="card" style={{ padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '10px'
        }}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            background: '#F1F5F9',
            color: 'var(--slate-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Key size={14} />
        </div>
        <h2 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--slate-900)', margin: 0 }}>
          1. Kredensial &amp; Akses Login Siswa
        </h2>
      </div>

      <div className="form-grid-2">
        {/* Nama Lengkap */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '4px' }}>
            Nama Lengkap Siswa <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <User size={15} style={{ position: 'absolute', left: '11px', top: '12px', color: 'var(--slate-400)' }} />
            <input
              type="text"
              required
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="Contoh: Zahra Aurelia Rahma"
              style={{
                width: '100%',
                padding: '9px 12px 9px 34px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                background: '#FFFFFF'
              }}
            />
          </div>
        </div>

        {/* NISN */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '4px' }}>
            NISN (Nomor Induk Siswa Nasional) <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <input
            type="text"
            required
            name="nisn"
            value={formData.nisn}
            onChange={onChange}
            placeholder="Contoh: 20240099"
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              fontSize: '13px',
              background: '#FFFFFF'
            }}
          />
        </div>

        {/* Email Siswa */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate-700)' }}>
              Email Siswa (Login)
            </label>
            <button
              type="button"
              onClick={onAutoGenerateEmail}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--brand)',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0
              }}
            >
              Generate dari NISN
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            <Mail size={15} style={{ position: 'absolute', left: '11px', top: '12px', color: 'var(--slate-400)' }} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              placeholder="20240099@siswa.sch.id"
              style={{
                width: '100%',
                padding: '9px 12px 9px 34px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                background: '#FFFFFF'
              }}
            />
          </div>
        </div>

        {/* Password Awal Siswa */}
        <div style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate-700)' }}>
              Kata Sandi Awal Siswa (Dibuat Otomatis 8 Karakter) <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <button
              type="button"
              onClick={onFetchServerPassword}
              disabled={loadingPassword}
              style={{
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
                color: 'var(--slate-700)',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '3px 10px',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <RefreshCw size={12} className={loadingPassword ? 'spin-anim' : ''} />
              <span>Acak Ulang 8 Karakter</span>
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <Key size={15} style={{ position: 'absolute', left: '11px', top: '12px', color: 'var(--slate-400)' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={onChange}
              placeholder="Membuat kata sandi 8 karakter..."
              style={{
                width: '100%',
                padding: '9px 38px 9px 34px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                fontFamily: 'monospace',
                fontWeight: 600,
                background: '#FFFFFF'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '9px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--slate-400)',
                padding: '4px'
              }}
              title={showPassword ? 'Sembunyikan Sandi' : 'Tampilkan Sandi'}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--slate-500)', marginTop: '4px' }}>
            Kata sandi awal dibuat otomatis oleh sistem dan tersimpan aman dengan enkripsi akun.
          </div>
        </div>
      </div>
    </div>
  );
}
