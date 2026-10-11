import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Send,
  User,
  Hash,
  School,
  Phone,
  Mail
} from 'lucide-react';
import api from '../services/api';

export default function ResetPasswordModal({ isOpen, onClose, student, onPasswordResetSuccess }) {
  if (!isOpen || !student) return null;

  const [step, setStep] = useState(1); // 1 = Konfirmasi, 2 = Hasil Password Sementara
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setErrorMsg('');
      setTempPassword('');
      setCopied(false);
    }
  }, [isOpen, student]);

  const handleGenerateReset = async () => {
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await api.resetStudentPassword(student.id);
      if (res.status === 'success' && res.tempPassword) {
        setTempPassword(res.tempPassword);
        setStep(2); // Lanjut ke halaman popup berikutnya!
        if (onPasswordResetSuccess) {
          onPasswordResetSuccess(student, res.tempPassword);
        }
      } else {
        setErrorMsg(res.message || 'Gagal mereset password siswa.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem saat mereset password.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!tempPassword) return;
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const cleanPhone = (phoneStr) => {
    if (!phoneStr) return '';
    let p = phoneStr.replace(/\D/g, '');
    if (p.startsWith('0')) {
      p = '62' + p.slice(1);
    }
    return p;
  };

  const waNumber = cleanPhone(student.phone);
  const waMessage = encodeURIComponent(
    `Halo ${student.name},\n\nGuru BK telah mereset password akun LUNA LMS Anda.\n\n` +
    `🔑 *Password Sementara (OTP)*: ${tempPassword}\n` +
    `👤 *Login menggunakan*: ${student.email || student.nisn}\n\n` +
    `Silakan login di http://localhost:5173/login dan segera perbarui password Anda di menu profil siswa.\n\nTerima kasih.`
  );
  const waUrl = waNumber ? `https://wa.me/${waNumber}?text=${waMessage}` : null;

  return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        padding: '16px',
        margin: 0,
        boxSizing: 'border-box'
      }}
    >
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90vh',
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          margin: 'auto'
        }}
      >
        {/* Step 1: Konfirmasi Reset Password */}
        {step === 1 && (
          <div>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 24px',
              background: '#FEF3C7',
              borderBottom: '1px solid #FDE68A'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#F59E0B',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <KeyRound size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#92400E', margin: 0 }}>
                    Reset Password Siswa
                  </h3>
                  <p style={{ fontSize: '12px', color: '#B45309', margin: 0 }}>
                    Tahap 1: Konfirmasi Pembuatan Password Baru
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                style={{ background: 'none', border: 'none', color: '#92400E', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '24px' }}>
              {errorMsg && (
                <div style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#991B1B',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  marginBottom: '16px'
                }}>
                  {errorMsg}
                </div>
              )}

              {/* Info Card Siswa */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <User size={15} style={{ color: '#4F46E5' }} />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                    {student.name}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: '#475569' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Hash size={13} style={{ color: '#94A3B8' }} />
                    <span>NISN: <strong>{student.nisn}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <School size={13} style={{ color: '#94A3B8' }} />
                    <span>Kelas: <strong>{student.class_name}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Mail size={13} style={{ color: '#94A3B8' }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {student.email || '—'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Phone size={13} style={{ color: '#94A3B8' }} />
                    <span>{student.phone || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Warning Notice */}
              <div style={{
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '10px',
                padding: '12px 14px',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start'
              }}>
                <AlertTriangle size={18} style={{ color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '12.5px', color: '#92400E', margin: 0, lineHeight: '1.45' }}>
                  Tindakan ini akan <strong>menonaktifkan password lama</strong> siswa dan menghasilkan <strong>Password Sementara (One-Time Password)</strong> baru yang akan langsung ditampilkan pada popup berikutnya.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              padding: '16px 24px',
              background: '#F8FAFC',
              borderTop: '1px solid #E2E8F0'
            }}>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#475569',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleGenerateReset}
                disabled={loading}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#D97706',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(217, 119, 6, 0.3)'
                }}
              >
                <KeyRound size={15} />
                {loading ? 'Memproses Reset...' : 'Buat Password Sementara'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Halaman Popup Selanjutnya (Hasil Password Sementara) */}
        {step === 2 && (
          <div>
            {/* Header Sukses */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 24px',
              background: '#ECFDF5',
              borderBottom: '1px solid #A7F3D0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#059669',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#065F46', margin: 0 }}>
                    Password Sementara Dibuat!
                  </h3>
                  <p style={{ fontSize: '12px', color: '#047857', margin: 0 }}>
                    Tahap 2: Salin atau Kirim ke WhatsApp Siswa
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                style={{ background: 'none', border: 'none', color: '#065F46', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '24px' }}>
              <p style={{ fontSize: '13px', color: '#334155', margin: '0 0 16px 0', lineHeight: '1.45' }}>
                Password untuk siswa <strong>{student.name}</strong> (NISN: {student.nisn}) telah berhasil diperbarui ke password sementara berikut:
              </p>

              {/* Large Display Box Password Sementara */}
              <div style={{
                background: '#F8FAFC',
                border: '2px dashed #818CF8',
                borderRadius: '12px',
                padding: '20px 16px',
                textAlign: 'center',
                marginBottom: '16px',
                position: 'relative'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                  PASSWORD SEMENTARA (TEMPORARY OTP)
                </div>
                <div style={{
                  fontSize: '26px',
                  fontFamily: 'monospace',
                  fontWeight: 900,
                  color: '#1E1B4B',
                  letterSpacing: '0.12em',
                  userSelect: 'all'
                }}>
                  {tempPassword}
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '6px' }}>
                  (Siswa dapat masuk menggunakan NISN atau Email &amp; password ini)
                </div>
              </div>

              {/* Action Buttons: Salin & WhatsApp */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <button
                  type="button"
                  onClick={handleCopy}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '11px 16px',
                    borderRadius: '8px',
                    border: '1.5px solid #4F46E5',
                    background: copied ? '#EEF2FF' : '#FFFFFF',
                    color: '#4F46E5',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Password'}</span>
                </button>

                {waUrl ? (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '11px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#22C55E',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '13px',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)'
                    }}
                  >
                    <Send size={15} />
                    <span>Kirim via WA</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    title="Nomor HP siswa belum terdaftar"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '11px 16px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      background: '#F1F5F9',
                      color: '#94A3B8',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'not-allowed'
                    }}
                  >
                    <Phone size={15} />
                    <span>No. WA Kosong</span>
                  </button>
                )}
              </div>

              {/* Info Note */}
              <div style={{
                background: '#F0F9FF',
                border: '1px solid #BAE6FD',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '12px',
                color: '#0369A1'
              }}>
                💡 <em>Saran:</em> Beritahukan kepada siswa untuk segera mengganti password sementara ini di menu <strong>Profil Akun</strong> setelah berhasil login.
              </div>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '16px 24px',
              background: '#F8FAFC',
              borderTop: '1px solid #E2E8F0'
            }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '9px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#0F172A',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Selesai &amp; Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
