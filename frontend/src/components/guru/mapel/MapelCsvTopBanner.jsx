import React from 'react';
import { FileSpreadsheet, Download, Upload, X } from 'lucide-react';
import { downloadMapelTemplateFile } from './mapelCsvHelpers';

export default function MapelCsvTopBanner({
  students,
  activeSubjectName,
  isOpen,
  setIsOpen
}) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1.5px solid #E2DFF6',
        padding: '16px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        boxShadow: '0 2px 8px rgba(47, 51, 102, 0.04)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: '#F4F1FE',
            border: '1.5px solid #DDD6FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#5243C2'
          }}
        >
          <FileSpreadsheet size={22} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '15px', color: '#1E1B4B', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Import Nilai dari CSV / Link Spreadsheet</span>
            <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
              Format Resmi
            </span>
          </div>
          <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px' }}>
            Perbarui nilai seluruh kelas sekaligus menggunakan berkas <code>.csv</code> atau tautan Google Sheets publik.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => downloadMapelTemplateFile(students, activeSubjectName)}
          className="pill-tab"
          style={{ fontSize: '12.5px', padding: '7px 14px', background: '#F8FAFC', borderColor: '#CBD5E1', color: '#334155' }}
        >
          <Download size={14} />
          <span>Unduh Template CSV</span>
        </button>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="btn-luna-primary"
          style={{
            borderRadius: '999px',
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {isOpen ? <X size={15} /> : <Upload size={15} />}
          <span>{isOpen ? 'Tutup Panel Import' : 'Buka Import CSV / Link'}</span>
        </button>
      </div>
    </div>
  );
}
