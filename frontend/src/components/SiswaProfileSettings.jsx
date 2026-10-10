import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mail, Save, RefreshCw, CheckCircle2, AlertCircle, Lock, ShieldCheck, X, Settings } from 'lucide-react';
import api from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import PageHeader from './common/PageHeader';
import { getInitials } from '../utils/formatters';

export default function SiswaProfileSettings({ currentUser, onUpdateCurrentUser, onNavigateToDashboard }) {
  const { showToast } = useNotifications();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [studentData, setStudentData] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [className, setClassName] = useState('XI IPA 2');
  const [gender, setGender] = useState('L');
  const [avatar, setAvatar] = useState('');
  const [careerTitle, setCareerTitle] = useState('');
  const [careerDesc, setCareerDesc] = useState('');
  const [notes, setNotes] = useState('');

  // Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [currentUser]);

  const fetchProfile = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const userEmail = currentUser?.email || 'priya@siswa.sch.id';
      const userId = currentUser?.id || null;
      const res = await api.getStudentProfileMe({ email: userEmail, userId });

      if (res && res.status === 'success' && res.student) {
        const s = res.student;
        setStudentData(s);
        setName(s.name || currentUser?.name || 'Priya Ramadhani');
        setEmail(s.email || currentUser?.email || 'priya@siswa.sch.id');
        setPhone(s.phone || '081299998888');
        setClassName(s.class_name || 'XI IPA 2');
        setGender(s.gender || 'P');
        setNotes(s.notes || '');
        setAvatar(currentUser?.avatar || s.name?.slice(0, 2).toUpperCase() || 'PR');
        setCareerTitle(s.career_title || 'Farmasi & Bioteknologi');
        setCareerDesc(s.career_desc || '');
      } else {
        setName(currentUser?.name || 'Priya Ramadhani');
        setEmail(currentUser?.email || 'priya@siswa.sch.id');
        setPhone('081299998888');
        setAvatar(currentUser?.avatar || 'PR');
      }
    } catch {
      setName(currentUser?.name || 'Priya Ramadhani');
      setEmail(currentUser?.email || 'priya@siswa.sch.id');
      setPhone('081299998888');
      setAvatar(currentUser?.avatar || 'PR');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSaving(true);

    try {
      const payload = {
        userId: currentUser?.id,
        studentId: studentData?.id,
        nisn: studentData?.nisn || '20240002',
        name: studentData?.name || name || 'Priya Ramadhani',
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        className,
        gender,
        notes: notes.trim(),
        avatar: avatar || name.trim().slice(0, 2).toUpperCase(),
        careerTitle: careerTitle.trim(),
        careerDesc: careerDesc.trim(),
        riasecCode: studentData?.riasec_code || 'I - R - C'
      };

      const res = await api.updateProfile(payload);
      if (res && res.status === 'success') {
        setSuccessMsg('Perubahan data profil berhasil disimpan!');
        showToast({
          type: 'success',
          title: 'Profil Berhasil Disimpan',
          message: 'Data profil siswa telah diperbarui.'
        });
        if (res.user && onUpdateCurrentUser) onUpdateCurrentUser(res.user);
        if (res.student) setStudentData(res.student);
      } else {
        setErrorMsg(res?.message || 'Gagal menyimpan profil.');
      }
    } catch (err) {
      setErrorMsg('Data profil belum dapat disimpan. Silakan coba beberapa saat lagi.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast({ type: 'error', title: 'Kata Sandi Lemah', message: 'Password baru minimal 6 karakter.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast({ type: 'error', title: 'Tidak Cocok', message: 'Konfirmasi password baru tidak cocok.' });
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await api.changePassword(oldPassword, newPassword, currentUser?.id, currentUser?.email);
      if (res && res.status === 'success') {
        showToast({
          type: 'success',
          title: 'Kata Sandi Diperbarui',
          message: 'Gunakan kata sandi baru saat login kembali.'
        });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordModal(false);
      } else {
        showToast({ type: 'error', title: 'Gagal Mengubah', message: res?.message || 'Gagal mengubah password.' });
      }
    } catch (err) {
      showToast({ type: 'error', title: 'Koneksi Gagal', message: err.message });
    } finally {
      setPasswordSaving(false);
    }
  };

  const isImageAvatar = avatar && (avatar.startsWith('data:image') || avatar.startsWith('http') || avatar.startsWith('/'));

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
        <RefreshCw size={28} className="spin-anim" style={{ margin: '0 auto 12px', color: '#7C69EF' }} />
        <div>Memuat profil siswa...</div>
      </div>
    );
  }

  return (
    <div className="siswa-profile-page-container page-standard-container">
      {/* Standardized Header */}
      <PageHeader
        title="Pengaturan Akun & Profil Pribadi"
        metadata={[
          { label: 'NISN', value: studentData?.nisn || '20240002' },
          { label: 'Kelas', value: className || 'XI IPA 2' },
          { label: 'Status Akun', value: 'Terverifikasi Aktif' },
          { label: 'Perlindungan Data', value: 'UU PDP No. 27/2022' }
        ]}
        actions={
          onNavigateToDashboard && (
            <button
              type="button"
              onClick={onNavigateToDashboard}
              className="btn-luna-secondary"
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              ← Kembali ke Dashboard
            </button>
          )
        }
      />

      {/* Alerts */}
      {successMsg && (
        <div style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: '12px', padding: '12px 18px', color: '#166534', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', fontWeight: 600 }}>
          <CheckCircle2 size={18} style={{ color: '#166534', flexShrink: 0 }} />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '12px', padding: '12px 18px', color: '#991B1B', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', fontWeight: 600 }}>
          <AlertCircle size={18} style={{ color: '#DC2626', flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ══════════════ KARTU UTAMA TATA LETAK REFERENSI (Card Putih Bersih LUNA) ══════════════ */}
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8E5F7', overflow: 'hidden', boxShadow: '0 2px 12px rgba(47, 51, 102, 0.05)' }}>
        
        <div style={{ padding: '28px' }}>
          
          {/* Profile Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingBottom: '24px', borderBottom: '1px solid #F1F5F9' }}>
            
            {/* Kiri: Avatar Bundar + Edit Foto + Nama */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  background: '#2F3366',
                  color: '#FFFFFF',
                  fontSize: '24px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid #E8E5F7',
                  boxShadow: '0 4px 12px rgba(47, 51, 102, 0.12)',
                  overflow: 'hidden'
                }}>
                  {isImageAvatar ? (
                    <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span>{avatar || getInitials(name, 'PR')}</span>
                  )}
                </div>

                {/* Tombol Kamera Unggah Foto */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Ganti Foto Profil"
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#7C69EF',
                    color: '#FFFFFF',
                    border: '2px solid #FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                  }}
                >
                  <Camera size={14} />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleAvatarFile} accept="image/*" style={{ display: 'none' }} />
              </div>

              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#2F3366', margin: '0 0 4px 0' }}>
                  {name || 'Priya Ramadhani'}
                </h2>
                <div style={{ fontSize: '13.5px', color: '#64748B' }}>
                  {email || 'priya@siswa.sch.id'} · Kelas {className}
                </div>
              </div>
            </div>

            {/* Kanan: Tombol Simpan Profil */}
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={saving}
              className="btn-luna-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 700 }}
            >
              <Save size={15} />
              <span>{saving ? 'Menyimpan...' : 'Simpan Profil'}</span>
            </button>
          </div>

          {/* Form Grid 2 Kolom */}
          <form onSubmit={handleSaveProfile} style={{ marginTop: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px 24px' }}>
              
              {/* Kolom 1: Nama Lengkap (Read-Only Murid) */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#2F3366', marginBottom: '6px' }}>
                  Nama Lengkap <span style={{ color: '#94A3B8', fontWeight: 400 }}>(Dikelola Sekolah)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  disabled
                  className="input-luna"
                  style={{ width: '100%', boxSizing: 'border-box', background: '#F8FAFC', color: '#64748B', cursor: 'not-allowed' }}
                />
              </div>

              {/* Kolom 2: NISN (Read-Only Murid) */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#2F3366', marginBottom: '6px' }}>
                  Nomor Induk Siswa Nasional (NISN) <span style={{ color: '#94A3B8', fontWeight: 400 }}>(Resmi)</span>
                </label>
                <input
                  type="text"
                  value={studentData?.nisn || '20240002'}
                  disabled
                  className="input-luna"
                  style={{ width: '100%', boxSizing: 'border-box', background: '#F8FAFC', color: '#64748B', cursor: 'not-allowed' }}
                />
              </div>

              {/* Kolom 3: Kelas */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#2F3366', marginBottom: '6px' }}>
                  Kelas
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="input-luna"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              {/* Kolom 4: Jenis Kelamin */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#2F3366', marginBottom: '6px' }}>
                  Jenis Kelamin
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="input-luna"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              {/* Kolom 5: Target Cita-cita / Minat Karir */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#2F3366', marginBottom: '6px' }}>
                  Target Cita-cita / Minat Karir
                </label>
                <input
                  type="text"
                  value={careerTitle}
                  onChange={(e) => setCareerTitle(e.target.value)}
                  placeholder="Contoh: Dokter, Data Scientist, Arsitek..."
                  className="input-luna"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              {/* Kolom 6: No. Telepon / WhatsApp */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#2F3366', marginBottom: '6px' }}>
                  No. Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812xxxxxxxx"
                  className="input-luna"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

            </div>

            {/* Minat Belajar atau Tujuan Cita-cita (Textarea Bersih) */}
            <div style={{ marginTop: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#2F3366', marginBottom: '6px' }}>
                Minat Belajar atau Tujuan Cita-cita
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Tuliskan minat belajar, mata pelajaran yang paling disukai, atau tujuan karir yang ingin dicapai..."
                className="input-luna"
                style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
              />
            </div>
          </form>

          {/* Seksi Kontak Email & Keamanan Akun */}
          <div style={{ marginTop: '28px', paddingTop: '22px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            
            {/* Email Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F4F3FB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C69EF' }}>
                <Mail size={19} />
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#2F3366' }}>
                  {email || 'priya@siswa.sch.id'}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  Email resmi siswa LUNA · Status Terverifikasi
                </div>
              </div>
            </div>

            {/* Tombol Pemicu Pop-Up Ganti Password */}
            <button
              type="button"
              onClick={() => {
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setShowPasswordModal(true);
              }}
              className="btn-luna-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', fontSize: '13px', fontWeight: 700 }}
            >
              <Lock size={15} />
              <span>Ganti Password</span>
            </button>
          </div>

        </div>
      </div>

      {/* ══════════════ POP-UP MODAL GANTI PASSWORD ══════════════ */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E8E5F7',
            width: '100%',
            maxWidth: '440px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
            animation: 'fadeIn 0.15s ease-out'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F4F3FB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C69EF' }}>
                  <ShieldCheck size={18} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#2F3366', margin: 0 }}>
                  Ganti Kata Sandi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px', borderRadius: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleChangePassword} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#2F3366', marginBottom: '6px' }}>
                  Kata Sandi Saat Ini
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Masukkan password saat ini"
                  className="input-luna"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#2F3366', marginBottom: '6px' }}>
                  Kata Sandi Baru
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="input-luna"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#2F3366', marginBottom: '6px' }}>
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="input-luna"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="btn-luna-secondary"
                  style={{ padding: '9px 16px', fontSize: '13px' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="btn-luna-primary"
                  style={{ padding: '9px 18px', fontSize: '13px', fontWeight: 700 }}
                >
                  {passwordSaving ? 'Menyimpan...' : 'Perbarui Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
