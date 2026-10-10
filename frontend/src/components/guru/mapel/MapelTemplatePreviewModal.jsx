import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  X,
  HelpCircle,
  Info
} from 'lucide-react';
import {
  downloadMapelTemplateExcel,
  downloadMapelTemplateFile,
  MAPEL_CSV_SCHEMA
} from './mapelCsvHelpers';

export default function MapelTemplatePreviewModal({
  isOpen,
  onClose,
  students = [],
  activeSubjectName = 'Matematika'
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyHeader = () => {
    navigator.clipboard.writeText('nisn,nama,p1,p2,p3,uts,p5,p6,uas');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleRows = students && students.length >= 3
    ? students.slice(0, 3).map((s) => ({
        nisn: s.nisn || '20240001',
        nama: s.name,
        p1: 85,
        p2: 88,
        p3: 82,
        uts: 86,
        p5: 90,
        p6: 92,
        uas: 94
      }))
    : [
        { nisn: '20240023', nama: 'Budi Santoso', p1: 72, p2: 75, p3: 70, uts: 73, p5: 74, p6: 70, uas: 76 },
        { nisn: '20240042', nama: 'Priya Ramadhani', p1: 88, p2: 90, p3: 85, uts: 90, p5: 89, p6: 91, uas: 94 },
        { nisn: '20240019', nama: 'Farhan Maulana', p1: 70, p2: 72, p3: 68, uts: 70, p5: 69, p6: 72, uas: 75 }
      ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          border: '1.5px solid #E8E5F7',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #E8E5F7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#FAF9FE'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#EEF2FF',
                color: '#4F46E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#1E1B4B' }}>
                Panduan &amp; Template Nilai ({activeSubjectName})
              </div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>
                Standar struktur tabel nilai evaluasi 7 pertemuan LUNA Education
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="luna-chat-icon-btn"
            style={{ width: '32px', height: '32px', borderRadius: '8px' }}
            title="Tutup Panduan"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Quick Download Buttons */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '12px',
              background: '#F4F1FE',
              border: '1.5px solid #DDD6FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#312E81' }}>
                Unduh Berkas Template Resmi
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                Gunakan template ini untuk mengisi nilai murid kelas secara langsung.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => downloadMapelTemplateExcel(students, activeSubjectName)}
                className="btn-luna-primary"
                style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Download size={14} />
                <span>Unduh Excel (.xlsx)</span>
              </button>

              <button
                type="button"
                onClick={() => downloadMapelTemplateFile(students, activeSubjectName)}
                className="pill-tab"
                style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#FFFFFF',
                  borderColor: '#CBD5E1',
                  color: '#334155'
                }}
              >
                <Download size={14} />
                <span>Unduh CSV (.csv)</span>
              </button>
            </div>
          </div>

          {/* Header String & Copy Button */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                NAMA KOLOM BARIS PERTAMA (HEADER RESMI):
              </span>
              <button
                type="button"
                onClick={handleCopyHeader}
                style={{
                  background: copied ? '#DCFCE7' : '#EEF2FF',
                  border: '1px solid',
                  borderColor: copied ? '#86EFAC' : '#C7D2FE',
                  color: copied ? '#166534' : '#4338CA',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'Tersalin!' : 'Salin Header'}</span>
              </button>
            </div>

            <div
              style={{
                background: '#1E1B4B',
                color: '#C7D2FE',
                padding: '10px 14px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '12px',
                overflowX: 'auto'
              }}
            >
              nisn,nama,p1,p2,p3,uts,p5,p6,uas
            </div>
          </div>

          {/* Table Preview */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
              CONTOH TAMPILAN TABEL NILAI:
            </div>
            <div style={{ border: '1px solid #E2E8F0', borderRadius: '10px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0' }}>
                  <tr style={{ color: '#475569', fontWeight: 700 }}>
                    <th style={{ padding: '8px 10px' }}>nisn</th>
                    <th style={{ padding: '8px 10px' }}>nama</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>p1</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>p2</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>p3</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', background: '#FEF3C7', color: '#92400E' }}>uts</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>p5</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>p6</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', background: '#FEF3C7', color: '#92400E' }}>uas</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleRows.map((r, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '7px 10px', fontWeight: 600 }}>{r.nisn}</td>
                      <td style={{ padding: '7px 10px', fontWeight: 700, color: '#312E81' }}>{r.nama}</td>
                      <td style={{ padding: '7px 10px', textAlign: 'center' }}>{r.p1}</td>
                      <td style={{ padding: '7px 10px', textAlign: 'center' }}>{r.p2}</td>
                      <td style={{ padding: '7px 10px', textAlign: 'center' }}>{r.p3}</td>
                      <td style={{ padding: '7px 10px', textAlign: 'center', fontWeight: 800, color: '#B45309', background: '#FFFDF5' }}>{r.uts}</td>
                      <td style={{ padding: '7px 10px', textAlign: 'center' }}>{r.p5}</td>
                      <td style={{ padding: '7px 10px', textAlign: 'center' }}>{r.p6}</td>
                      <td style={{ padding: '7px 10px', textAlign: 'center', fontWeight: 800, color: '#B45309', background: '#FFFDF5' }}>{r.uas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Description of Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '11.5px', color: '#475569' }}>
            <div>• <strong>nisn</strong>: Nomor Induk Siswa Nasional (kunci verifikasi murid)</div>
            <div>• <strong>nama</strong>: Nama lengkap siswa (opsional)</div>
            <div>• <strong>p1, p2, p3</strong>: Nilai kuis/tugas Pertemuan 1–3 (0–100)</div>
            <div>• <strong>uts</strong>: Evaluasi Tengah Semester (0–100)</div>
            <div>• <strong>p5, p6</strong>: Nilai kuis/tugas Pertemuan 5–6 (0–100)</div>
            <div>• <strong>uas</strong>: Evaluasi Akhir Semester (0–100)</div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #E8E5F7',
            display: 'flex',
            justifyContent: 'flex-end',
            background: '#FAF9FE'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="pill-tab"
            style={{ padding: '7px 18px', fontSize: '12.5px', fontWeight: 700 }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
