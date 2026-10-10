import React from 'react';
import { Upload, Link as LinkIcon, RefreshCw, ArrowRight } from 'lucide-react';

export default function MapelCsvInputs({
  activeTab,
  fileInputRef,
  handleFileUpload,
  csvFileName,
  linkUrl,
  setLinkUrl,
  handleFetchFromLink,
  fetchingLink
}) {
  return (
    <>
      {/* TAB 1: Upload File Mode */}
      {activeTab === 'upload' && (
        <div
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          style={{
            border: '2px dashed #C4B5FD',
            borderRadius: '12px',
            padding: '28px',
            textAlign: 'center',
            background: '#FAF9FE',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '18px'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7C69EF'; e.currentTarget.style.background = '#F4F1FE'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#C4B5FD'; e.currentTarget.style.background = '#FAF9FE'; }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <Upload size={32} style={{ color: '#7C69EF', margin: '0 auto 10px' }} />
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#1E1B4B' }}>
            {csvFileName ? `File Terpilih: ${csvFileName}` : 'Klik untuk Memilih atau Tarik File .CSV Nilai Murid'}
          </div>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
            Mendukung file teks dipisahkan koma (.csv). Nilai otomatis divalidasi ke skala 0 - 100.
          </div>
        </div>
      )}

      {/* TAB 2: Link Mode */}
      {activeTab === 'link' && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <LinkIcon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Paste URL Google Sheets (contoh: https://docs.google.com/spreadsheets/d/.../edit)..."
              className="text-input"
              style={{ width: '100%', paddingLeft: '38px', height: '42px', fontSize: '13px' }}
            />
          </div>
          <button
            type="button"
            onClick={handleFetchFromLink}
            disabled={fetchingLink || !linkUrl.trim()}
            className="btn-luna-primary"
            style={{ borderRadius: '10px', padding: '0 20px', height: '42px', fontSize: '13px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            {fetchingLink ? <RefreshCw size={15} className="float-anim" /> : <ArrowRight size={15} />}
            <span>{fetchingLink ? 'Mengambil CSV...' : 'Tarik Data Nilai'}</span>
          </button>
        </div>
      )}
    </>
  );
}
