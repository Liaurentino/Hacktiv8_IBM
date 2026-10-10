import React, { useRef, useState } from 'react';
import {
  Upload,
  Link as LinkIcon,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  X,
  ArrowRight,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import {
  parseMapelCsvText,
  parseMapelExcelBuffer,
  convertUrlToCsvExportUrl,
  generateSampleCsvContent,
  downloadMapelTemplateExcel,
  downloadMapelTemplateFile
} from './mapelCsvHelpers';
import MapelCsvPreviewTable from './MapelCsvPreviewTable';
import api from '../../../services/api';

export default function MapelImportSyncModal({
  isOpen,
  onClose,
  initialMode = 'excel', // 'excel' | 'sheet'
  activeSubjectKey,
  activeSubjectName = 'Matematika',
  students = [],
  KKM = 75,
  onImportSuccess,
  onConnectSheet,
  onOpenTemplateGuide
}) {
  const fileInputRef = useRef(null);
  const [mode, setMode] = useState(initialMode); // 'excel' | 'sheet'
  const [fileName, setFileName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [fetchingLink, setFetchingLink] = useState(false);
  const [parsedRows, setParsedRows] = useState([]);
  const [parsingError, setParsingError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setParsingError('');
      setSubmitResult(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // Handle local file upload (.xlsx, .xls, .csv)
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setSubmitResult(null);
    setParsingError('');

    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const buffer = event.target.result;
        const res = parseMapelExcelBuffer(buffer, students);
        setParsingError(res.error);
        setParsedRows(res.rows);
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        const res = parseMapelCsvText(content, students);
        setParsingError(res.error);
        setParsedRows(res.rows);
      };
      reader.readAsText(file);
    }
  };

  // Handle fetching Google Sheets CSV from link
  const handleFetchFromLink = async () => {
    if (!linkUrl.trim()) {
      setParsingError('Masukkan tautan Google Spreadsheet terlebih dahulu.');
      return;
    }
    setFetchingLink(true);
    setParsingError('');
    setSubmitResult(null);

    try {
      const exportUrl = convertUrlToCsvExportUrl(linkUrl);
      const res = await fetch(exportUrl);
      if (!res.ok) {
        throw new Error(
          `Gagal mengunduh spreadsheet (Status HTTP: ${res.status}). Pastikan hak akses disetel ke "Anyone with the link can view".`
        );
      }
      const text = await res.text();
      setFileName('google_sheets_live.csv');

      const parsed = parseMapelCsvText(text, students);
      setParsingError(parsed.error);
      setParsedRows(parsed.rows);
    } catch (err) {
      setParsingError('Gagal menarik data dari tautan: ' + err.message);
    } finally {
      setFetchingLink(false);
    }
  };

  const handleReset = () => {
    setParsedRows([]);
    setFileName('');
    setLinkUrl('');
    setParsingError('');
    setSubmitResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleApplyBatch = async () => {
    const validRows = parsedRows.filter((r) => (r.nisn && r.nisn !== '-') || r.studentId);
    if (validRows.length === 0) {
      setParsingError('Tidak ada baris data murid yang valid untuk disimpan.');
      return;
    }

    setSubmitting(true);
    setParsingError('');
    try {
      const items = validRows.map((r) => ({
        studentId: r.studentId || undefined,
        nisn: r.nisn,
        studentName: r.studentName,
        className: r.className || 'XI IPA 2',
        scores: r.scores
      }));

      const res = await api.batchUpdateGrades(activeSubjectKey, items);
      if (res.status === 'success') {
        if (mode === 'sheet' && linkUrl && onConnectSheet) {
          onConnectSheet(linkUrl);
        }
        setSubmitResult({
          type: 'success',
          message: res.message || `Berhasil memperbarui nilai ${validRows.length} siswa.`
        });
        if (onImportSuccess) {
          onImportSuccess(res.data);
        }
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setParsingError(res.message || 'Gagal menyimpan nilai massal.');
      }
    } catch (err) {
      setParsingError('Terjadi kesalahan saat menyimpan: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9998,
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
          maxWidth: '820px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#FFFFFF'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#F4F1FE',
                color: '#5243C2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1E1B4B', margin: 0 }}>
                Input &amp; Sinkronisasi Nilai: {activeSubjectName}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
                Pilih metode import berkas lokal atau tautkan tautan Google Spreadsheet
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Tombol Bantuan Template Langsung di Header Pop-up */}
            <button
              type="button"
              onClick={onOpenTemplateGuide}
              style={{
                background: '#FAF5FF',
                border: '1px solid #E9D5FF',
                color: '#7E22CE',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Lihat susunan kolom dan unduh contoh template"
            >
              <HelpCircle size={14} />
              <span>Panduan Template</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Content Scrollable */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Dua Tombol Keputusan (Metode 1 vs Metode 2) */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              Pilih Metode Pengisian Nilai:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
              
              {/* Opsi 1: Import Lokal Excel / CSV */}
              <div
                onClick={() => { setMode('excel'); setParsingError(''); }}
                style={{
                  border: '2px solid',
                  borderColor: mode === 'excel' ? '#7C69EF' : '#E2E8F0',
                  background: mode === 'excel' ? '#FAF9FE' : '#FFFFFF',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.15s ease'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: mode === 'excel' ? '#7C69EF' : '#F1F5F9',
                    color: mode === 'excel' ? '#FFFFFF' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Upload size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1E1B4B' }}>
                    1. Upload Berkas Excel / CSV
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                    Pilih file <code>.xlsx</code> atau <code>.csv</code> dari komputer Anda
                  </div>
                </div>
              </div>

              {/* Opsi 2: Live Sync Google Sheets */}
              <div
                onClick={() => { setMode('sheet'); setParsingError(''); }}
                style={{
                  border: '2px solid',
                  borderColor: mode === 'sheet' ? '#059669' : '#E2E8F0',
                  background: mode === 'sheet' ? '#F0FDF4' : '#FFFFFF',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.15s ease'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: mode === 'sheet' ? '#059669' : '#F1F5F9',
                    color: mode === 'sheet' ? '#FFFFFF' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <LinkIcon size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1E1B4B' }}>
                    2. Tautkan Google Spreadsheet
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                    Sinkronisasi berkala otomatis (live polling tiap 20 detik)
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Area Input Berdasarkan Mode Terpilih */}
          {mode === 'excel' ? (
            /* Upload Box */
            <div
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              style={{
                border: '2px dashed #C4B5FD',
                borderRadius: '12px',
                padding: '28px 20px',
                textAlign: 'center',
                background: '#FAF9FE',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7C69EF'; e.currentTarget.style.background = '#F4F1FE'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#C4B5FD'; e.currentTarget.style.background = '#FAF9FE'; }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <Upload size={32} style={{ color: '#7C69EF', margin: '0 auto 10px' }} />
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#1E1B4B' }}>
                {fileName ? `File Terpilih: ${fileName}` : 'Klik untuk Memilih File Excel (.xlsx / .xls) atau CSV'}
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                Mendukung berkas Excel standar dan CSV. Nilai otomatis disesuaikan ke format 7 pertemuan.
              </div>
            </div>
          ) : (
            /* Input Google Sheet Link */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
                  <LinkIcon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="Tempel tautan Google Sheets (contoh: https://docs.google.com/spreadsheets/d/.../edit)..."
                    className="input-luna"
                    style={{ width: '100%', paddingLeft: '38px', height: '42px', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleFetchFromLink}
                  disabled={fetchingLink || !linkUrl.trim()}
                  className="btn-luna-primary"
                  style={{
                    borderRadius: '10px',
                    padding: '0 20px',
                    height: '42px',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {fetchingLink ? <RefreshCw size={15} className="spin-anim" /> : <ArrowRight size={15} />}
                  <span>{fetchingLink ? 'Mengambil Data...' : 'Tarik & Preview Data'}</span>
                </button>
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                💡 <strong>Catatan:</strong> Pastikan spreadsheet dibagikan dengan hak akses <em>"Anyone with the link can view"</em>.
              </div>
            </div>
          )}

          {/* Alert Error / Success */}
          {parsingError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '10px 14px', color: '#991B1B', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{parsingError}</span>
            </div>
          )}

          {submitResult && (
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '10px 14px', color: '#166534', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} style={{ flexShrink: 0 }} />
              <span>{submitResult.message}</span>
            </div>
          )}

          {/* Preview Tabel Nilai yang Terbaca */}
          {parsedRows.length > 0 && (
            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
              <MapelCsvPreviewTable
                parsedRows={parsedRows}
                KKM={KKM}
                onReset={handleReset}
                onApplyBatch={handleApplyBatch}
                submitting={submitting}
              />
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '14px 24px',
            background: '#F8FAFC',
            borderTop: '1px solid #F1F5F9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => downloadMapelTemplateExcel(students, activeSubjectName)}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                color: '#334155',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: 600
              }}
            >
              <Download size={13} />
              <span>Unduh Template .xlsx</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '7px 16px',
              fontSize: '12.5px',
              background: 'transparent',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              color: '#475569',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
