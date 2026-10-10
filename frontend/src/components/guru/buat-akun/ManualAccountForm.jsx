import React from 'react';
import { RefreshCw, UserPlus } from 'lucide-react';
import ManualAccountCredentialsSection from './ManualAccountCredentialsSection';
import ManualAccountAcademicSection from './ManualAccountAcademicSection';

export default function ManualAccountForm({
  formData,
  onChange,
  onAutoGenerateEmail,
  onFetchServerPassword,
  loadingPassword,
  showPassword,
  setShowPassword,
  onSubmit,
  onReset,
  loading
}) {
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Section 1: Informasi Kredensial & Akses Login */}
      <ManualAccountCredentialsSection
        formData={formData}
        onChange={onChange}
        onAutoGenerateEmail={onAutoGenerateEmail}
        onFetchServerPassword={onFetchServerPassword}
        loadingPassword={loadingPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      {/* Section 2: Data Akademik & Kontak Siswa */}
      <ManualAccountAcademicSection
        formData={formData}
        onChange={onChange}
      />

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button type="button" onClick={onReset} className="btn-luna-secondary">
          Reset Formulir
        </button>

        <button type="submit" disabled={loading} className="btn-luna-primary">
          {loading ? (
            <>
              <RefreshCw size={15} className="spin-anim" />
              <span>Menerbitkan Akun...</span>
            </>
          ) : (
            <>
              <UserPlus size={16} />
              <span>Simpan &amp; Terbitkan Akun Siswa</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
