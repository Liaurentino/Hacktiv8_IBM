import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import api from '../services/api';

export default function DeleteStudentModal({ isOpen, onClose, student, onStudentDeleted }) {
  if (!isOpen || !student) return null;

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleDelete = async () => {
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await api.deleteStudent(student.id);
      if (res.status === 'success') {
        onStudentDeleted(student.id);
        onClose();
      } else {
        setErrorMsg(res.message || 'Gagal menghapus siswa.');
      }
    } catch (err) {
      setErrorMsg('Data belum dapat dihapus. Silakan coba beberapa saat lagi.');
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
        {/* Header */}
        <div className="modal-header-luna" style={{ background: '#FFF1F2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Trash2 size={18} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#991B1B' }}>
                Hapus Akun Siswa
              </div>
              <div style={{ fontSize: '11.5px', color: '#B91C1C' }}>
                Tindakan ini bersifat permanen
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991B1B' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body-luna">
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
              gap: '8px'
            }}>
              <AlertTriangle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div style={{ fontSize: '13.5px', color: 'var(--text)', lineHeight: 1.6 }}>
            Apakah Anda yakin ingin menghapus akun siswa <strong>{student.name}</strong> (NISN: <code>{student.nisn}</code>) dari kelas <strong>{student.class_name}</strong>?
          </div>

          <div style={{
            background: '#F8FAFC',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '12px 14px',
            fontSize: '12.5px',
            color: 'var(--text-muted)'
          }}>
            ⚠️ Seluruh data rekap capaian belajar, catatan bimbingan, dan riwayat siswa ini akan ikut terhapus dari sistem.
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer-luna">
          <button type="button" onClick={onClose} className="btn-luna-secondary">
            Batal
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="btn-luna-danger"
          >
            {loading ? 'Menghapus...' : 'Ya, Hapus Siswa Ini'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
