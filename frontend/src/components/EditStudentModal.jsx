import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Edit3,
  AlertCircle,
  Mail,
  Phone,
  User,
  Hash,
  School,
  Lock,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import api from '../services/api';

export default function EditStudentModal({
  isOpen,
  onClose,
  student,
  onStudentUpdated,
  onOpenResetPassword
}) {
  if (!isOpen || !student) return null;

  const [formData, setFormData] = useState({
    email: student.email || '',
    phone: student.phone || ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
        email: student.email || '',
        phone: student.phone || ''
      });
      setErrorMsg('');
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // Hanya mengirimkan perubahan email (Gmail) dan phone (No. WA)
      const res = await api.updateStudent(student.id, {
        email: formData.email.trim(),
        phone: formData.phone.trim()
      });

      if (res.status === 'success') {
        onStudentUpdated(res.student);
        onClose();
      } else {
        setErrorMsg(res.message || 'Gagal memperbarui data kontak siswa.');
      }
    } catch (err) {
      setErrorMsg('Data belum dapat disimpan. Silakan periksa koneksi dan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

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
          maxWidth: '520px',
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
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          background: '#FAF9FE',
          borderBottom: '1px solid #E2E8F0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#EEF2FF',
              color: '#4F46E5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Edit3 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Edit Kontak Akun Siswa
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                Perbarui No. WhatsApp &amp; Gmail login siswa #{student.nisn}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '24px' }}>
            {errorMsg && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#991B1B',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Readonly Identity Card (Terkunci dari Dapodik) */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '14px 16px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Identitas Siswa (Dapodik Terkunci)
                </span>
                <span style={{
                  fontSize: '11px',
                  background: '#E2E8F0',
                  color: '#475569',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Lock size={11} />
                  Terkunci
                </span>
              </div>

              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                {student.name}
              </div>

              <div style={{ display: 'flex', gap: '14px', fontSize: '12.5px', color: '#64748B' }}>
                <span>NISN: <strong style={{ color: '#1E293B' }}>{student.nisn}</strong></span>
                <span>•</span>
                <span>Kelas: <strong style={{ color: '#1E293B' }}>{student.class_name}</strong></span>
                <span>•</span>
                <span>JK: <strong style={{ color: '#1E293B' }}>{student.gender === 'P' ? 'Perempuan' : 'Laki-laki'}</strong></span>
              </div>
            </div>

            {/* Editable Field 1: Gmail / Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Email / Gmail Siswa
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contoh: nama.siswa@gmail.com atau @siswa.sch.id"
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    background: '#FFFFFF',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <span style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px', display: 'block' }}>
                Digunakan siswa untuk login ke portal dan menerima konfirmasi konseling.
              </span>
            </div>

            {/* Editable Field 2: No. WhatsApp / HP */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Nomor WhatsApp / HP Siswa
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="contoh: 081234567890"
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    background: '#FFFFFF',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <span style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px', display: 'block' }}>
                Nomor aktif untuk pengiriman One-Time Password (OTP) darurat atau konseling.
              </span>
            </div>

            {/* Quick Action: Reset Password Button */}
            {onOpenResetPassword && (
              <div style={{
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '10px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#92400E' }}>
                    Siswa Lupa Password?
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#B45309' }}>
                    Guru BK dapat membuat password sementara langsung via popup.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenResetPassword(student);
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D97706',
                    background: '#FFFFFF',
                    color: '#B45309',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <KeyRound size={13} />
                  <span>Reset Sandi</span>
                </button>
              </div>
            )}
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
              type="submit"
              disabled={loading}
              style={{
                padding: '9px 20px',
                borderRadius: '8px',
                border: 'none',
                background: '#4F46E5',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)'
              }}
            >
              {loading ? 'Menyimpan...' : 'Simpan Kontak'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
