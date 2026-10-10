import React from 'react';
import { FileSpreadsheet, Download, X, Copy, Check, Info } from 'lucide-react';
import { downloadMapelTemplateExcel, downloadMapelTemplateFile } from './mapelCsvHelpers';

export default function MapelTemplateModal({
  isOpen,
  onClose,
  students = [],
  activeSubjectName = 'Matematika'
}) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyHeader = () => {
    navigator.clipboard.writeText('nisn,nama,p1,p2,p3,uts,p5,p6,uas');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleRows = students && students.length > 0
    ? students.slice(0, 5)
    : [
        { nisn: '20240023', student_name: 'Budi Santoso', scores: [72, 75, 70, 73, 74, 70, 76] },
        { nisn: '20240042', student_name: 'Priya Ramadhani', scores: [88, 90, 85, 90, 89, 91, 94] },
        { nisn: '20240019', student_name: 'Farhan Maulana', scores: [70, 72, 68, 70, 69, 72, 75] }
      ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E8E5F7',
          width: '100%',
          maxWidth: '680px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1E1B4B', margin: 0 }}>
                Panduan &amp; Template Nilai {activeSubjectName}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
                Format standar 7 pertemuan kurikulum (P1–P3, UTS, P5–P6, UAS)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', maxHeight: '75vh', overflowY: 'auto' }}>
          
          {/* Header Format Code Snippet */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#2F3366' }}>Susunan Kolom Header (Wajib):</span>
              <button
                type="button"
                onClick={handleCopyHeader}
                style={{
                  background: copied ? '#DCFCE7' : '#F4F1FE',
                  border: '1px solid',
                  borderColor: copied ? '#86EFAC' : '#DDD6FE',
                  color: copied ? '#166534' : '#5243C2',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? 'Tersalin!' : 'Salin Header'}</span>
              </button>
            </div>

            <div style={{ background: '#1E1B4B', color: '#C7D2FE', padding: '10px 14px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12.5px', overflowX: 'auto' }}>
              nisn,nama,p1,p2,p3,uts,p5,p6,uas
            </div>
          </div>

          {/* Tabel Contoh */}
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#2F3366', marginBottom: '8px' }}>
              Contoh Isi Data Tabel:
            </div>
            <div style={{ border: '1px solid #E2E8F0', borderRadius: '10px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead style={{ background: '#F8FAFC', color: '#475569', borderBottom: '1px solid #E2E8F0' }}>
                  <tr>
                    <th style={{ padding: '8px 10px' }}>nisn</th>
                    <th style={{ padding: '8px 10px' }}>nama</th>
                    <th style={{ padding: '8px 10px' }}>p1</th>
                    <th style={{ padding: '8px 10px' }}>p2</th>
                    <th style={{ padding: '8px 10px' }}>p3</th>
                    <th style={{ padding: '8px 10px', background: '#FEF3C7', color: '#92400E' }}>uts</th>
                    <th style={{ padding: '8px 10px' }}>p5</th>
                    <th style={{ padding: '8px 10px' }}>p6</th>
                    <th style={{ padding: '8px 10px', background: '#DBEAFE', color: '#1E40AF' }}>uas</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleRows.map((s, idx) => {
                    const sc = s.scores || [80, 85, 82, 84, 86, 88, 90];
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '8px 10px', fontFamily: 'monospace', color: '#334155' }}>{s.nisn}</td>
                        <td style={{ padding: '8px 10px', fontWeight: 600, color: '#1E1B4B' }}>{s.student_name}</td>
                        <td style={{ padding: '8px 10px' }}>{sc[0]}</td>
                        <td style={{ padding: '8px 10px' }}>{sc[1]}</td>
                        <td style={{ padding: '8px 10px' }}>{sc[2]}</td>
                        <td style={{ padding: '8px 10px', fontWeight: 700, color: '#B45309' }}>{sc[3]}</td>
                        <td style={{ padding: '8px 10px' }}>{sc[4]}</td>
                        <td style={{ padding: '8px 10px' }}>{sc[5]}</td>
                        <td style={{ padding: '8px 10px', fontWeight: 700, color: '#1D4ED8' }}>{sc[6]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Petunjuk */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '12px 14px', fontSize: '12px', color: '#64748B', display: 'flex', gap: '8px' }}>
            <Info size={16} style={{ color: '#7C69EF', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Kunci Pencocokan:</strong> Kolom <code>nisn</code> digunakan sebagai pengenal unik siswa di sistem. Nilai yang kosong akan otomatis terisi dengan nilai KKM (75).
            </div>
          </div>
        </div>

        {/* Modal Footer dengan Tombol Unduh */}
        <div style={{ padding: '16px 24px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => downloadMapelTemplateExcel(students, activeSubjectName)}
              className="btn-luna-primary"
              style={{ padding: '8px 16px', fontSize: '12.5px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} />
              <span>Unduh Template Excel (.xlsx)</span>
            </button>

            <button
              type="button"
              onClick={() => downloadMapelTemplateFile(students, activeSubjectName)}
              className="btn-luna-secondary"
              style={{ padding: '8px 14px', fontSize: '12.5px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} />
              <span>Unduh Versi CSV (.csv)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ padding: '8px 16px', fontSize: '12.5px', background: 'transparent', border: '1px solid #CBD5E1', borderRadius: '8px', color: '#475569', cursor: 'pointer', fontWeight: 600 }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
