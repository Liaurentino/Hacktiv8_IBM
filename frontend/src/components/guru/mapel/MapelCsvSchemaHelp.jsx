import React from 'react';

export default function MapelCsvSchemaHelp({ showSchemaHelp, setShowSchemaHelp }) {
  if (!showSchemaHelp) return null;

  const copyHeader = () => {
    navigator.clipboard.writeText('nisn,nama,p1,p2,p3,uts,p5,p6,uas');
    alert('Header CSV berhasil disalin ke clipboard!');
  };

  return (
    <div
      style={{
        background: '#FAF9FE',
        border: '1.5px solid #DDD6FE',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '20px',
        fontSize: '12.5px'
      }}
    >
      <div style={{ fontWeight: 800, color: '#312E81', marginBottom: '8px', fontSize: '13.5px' }}>
        📋 Format Kolom File Nilai (7 Pertemuan / Sesuai Excel Kelas):
      </div>
      <div style={{ color: '#4B5563', marginBottom: '10px', lineHeight: 1.5 }}>
        Header baris pertama harus memuat nama-nama kolom berikut (huruf kecil atau besar didukung):
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280' }}>HEADER FORMAT STANDAR:</span>
        <button
          type="button"
          onClick={copyHeader}
          style={{
            background: '#EEF2FF',
            border: '1px solid #C7D2FE',
            color: '#4338CA',
            padding: '3px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          📋 Salin Header ke Clipboard
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
          overflowX: 'auto',
          marginBottom: '12px'
        }}
      >
        nisn,nama,p1,p2,p3,uts,p5,p6,uas
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', color: '#475569', marginBottom: '10px' }}>
        <div>• <strong>nisn</strong>: NISN siswa (kunci pencocokan utama)</div>
        <div>• <strong>nama</strong>: Nama lengkap (opsional verifikasi)</div>
        <div>• <strong>p1, p2, p3</strong>: Nilai tugas/kuis P1–P3 (0–100)</div>
        <div>• <strong>uts</strong>: Nilai evaluasi tengah semester (0–100)</div>
        <div>• <strong>p5, p6</strong>: Nilai tugas/kuis P5–P6 (0–100)</div>
        <div>• <strong>uas</strong>: Nilai evaluasi akhir semester (0–100)</div>
      </div>
      <div style={{ fontSize: '11.5px', color: '#6B7280', borderTop: '1px solid #E5E7EB', paddingTop: '8px' }}>
        💡 <strong>Tips Delimiter:</strong> Mendukung koma (<code>,</code>) maupun titik-koma (<code>;</code>) standar Excel Indonesia. Untuk Google Sheets, cukup bagikan dengan akses <em>"Anyone with link can view"</em> lalu tempel tautan spreadsheet.
      </div>
    </div>
  );
}
