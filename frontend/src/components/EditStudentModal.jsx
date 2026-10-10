import React, { useState, useEffect } from 'react';
import { X, Edit3, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function EditStudentModal({ isOpen, onClose, student, onStudentUpdated }) {
  if (!isOpen || !student) return null;

  const [formData, setFormData] = useState({
    name: student.name || '',
    nisn: student.nisn || '',
    email: student.email || '',
    phone: student.phone || '',
    className: student.class_name || 'XI IPA 2',
    gender: student.gender || 'L',
    academicScore: student.academic_score || 80,
    counselingStatus: student.counseling_status || 'Normal',
    triageLevel: student.triage_level || 'HIJAU',
    riasecCode: student.riasec_code || 'I - S - A',
    careerTitle: student.career_title || '',
    careerDesc: student.career_desc || '',
    notes: student.notes || ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        nisn: student.nisn || '',
        email: student.email || '',
        phone: student.phone || '',
        className: student.class_name || 'XI IPA 2',
        gender: student.gender || 'L',
        academicScore: student.academic_score || 80,
        counselingStatus: student.counseling_status || 'Normal',
        triageLevel: student.triage_level || 'HIJAU',
        riasecCode: student.riasec_code || 'I - S - A',
        careerTitle: student.career_title || '',
        careerDesc: student.career_desc || '',
        notes: student.notes || ''
      });
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
      const res = await api.updateStudent(student.id, formData);
      if (res.status === 'success') {
        onStudentUpdated(res.student);
        onClose();
      } else {
        setErrorMsg(res.message || 'Gagal memperbarui data siswa.');
      }
    } catch (err) {
      setErrorMsg('Data siswa belum dapat disimpan. Silakan coba beberapa saat lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        {/* Header */}
        <div className="modal-header-luna" style={{ background: '#FAF9FE' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#E0E7FF',
              color: '#3730A3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Edit3 size={18} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>
                Edit Akun & Data Siswa
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Perbarui data siswa #{student.nisn} ({student.name})
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body-luna" style={{ maxHeight: '68vh', overflowY: 'auto' }}>
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
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="modal-grid-2">
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                  NISN / Nomor Induk *
                </label>
                <input
                  type="text"
                  required
                  name="nisn"
                  value={formData.nisn}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '13px' }}
                />
              </div>
            </div>

            <div className="modal-grid-2">
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                  Email Siswa
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                  Nomor HP / WhatsApp
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '13px' }}
                />
              </div>
            </div>

            <div className="modal-grid-2">
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                  Kelas
                </label>
                <select
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '13px', background: '#FFF' }}
                >
                  <option value="XI IPA 2">XI IPA 2</option>
                  <option value="XI IPA 1">XI IPA 1</option>
                  <option value="XI IPS 1">XI IPS 1</option>
                  <option value="X IPA 1">X IPA 1</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
                  Jenis Kelamin
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '13px', background: '#FFF' }}
                >
                  <option value="L">Laki-laki (L)</option>
                  <option value="P">Perempuan (P)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer-luna">
            <button type="button" onClick={onClose} className="btn-luna-secondary">
              Batal
            </button>
            <button type="submit" disabled={loading} className="btn-luna-primary">
              {loading ? 'Menyimpan Perubahan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
