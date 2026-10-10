import React from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';

export default function ManualAccountAcademicSection({ formData, onChange }) {
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
          <BookOpen size={14} />
        </div>
        <h2 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--slate-900)', margin: 0 }}>
          2. Data Akademik &amp; Kontak Siswa
        </h2>
      </div>

      <div className="form-grid-3">
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '4px' }}>
            Kelas Siswa
          </label>
          <select
            name="className"
            value={formData.className}
            onChange={onChange}
            style={{
              width: '100%',
              padding: '9px 10px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              fontSize: '13px',
              background: '#FFFFFF'
            }}
          >
            <option value="XI IPA 2">XI IPA 2</option>
            <option value="XI IPA 1">XI IPA 1</option>
            <option value="XI IPS 1">XI IPS 1</option>
            <option value="XI IPS 2">XI IPS 2</option>
            <option value="X IPA 1">X IPA 1</option>
            <option value="XII IPA 1">XII IPA 1</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '4px' }}>
            Jenis Kelamin
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={onChange}
            style={{
              width: '100%',
              padding: '9px 10px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              fontSize: '13px',
              background: '#FFFFFF'
            }}
          >
            <option value="L">Laki-laki (L)</option>
            <option value="P">Perempuan (P)</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '4px' }}>
            Nilai Rata-rata Awal
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            name="academicScore"
            value={formData.academicScore}
            onChange={onChange}
            style={{
              width: '100%',
              padding: '9px 10px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              fontSize: '13px',
              background: '#FFFFFF'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '4px' }}>
            No. Telepon Siswa
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            placeholder="08123456789"
            style={{
              width: '100%',
              padding: '9px 10px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              fontSize: '13px',
              background: '#FFFFFF'
            }}
          />
        </div>

        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '4px' }}>
            No. WhatsApp Orang Tua / Wali
          </label>
          <input
            type="text"
            name="parentPhone"
            value={formData.parentPhone}
            onChange={onChange}
            placeholder="08567890123 (Wali Murid)"
            style={{
              width: '100%',
              padding: '9px 10px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              fontSize: '13px',
              background: '#FFFFFF'
            }}
          />
        </div>
      </div>

      <div
        style={{
          marginTop: '16px',
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: '6px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '12.5px',
          color: '#15803D'
        }}
      >
        <CheckCircle size={16} style={{ flexShrink: 0 }} />
        <div>
          <strong>Parameter Awal BK:</strong> Otomatis disetel <strong>Stabil (Kondisi Normal)</strong> tanpa perlu pengisian manual.
        </div>
      </div>
    </div>
  );
}
