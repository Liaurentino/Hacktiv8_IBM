import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Link as LinkIcon,
  RefreshCw,
  FileSpreadsheet,
  Download,
  HelpCircle,
  X,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Zap
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
import MapelCsvSchemaHelp from './MapelCsvSchemaHelp';
import api from '../../../services/api';

export default function MapelImportModal({
  isOpen,
  onClose,
  activeSubjectKey,
  activeSubjectName = 'Matematika',
  students = [],
  KKM = 75,
  initialTab = 'excel', // 'excel' | 'sheet'
  onImportSuccess,
  onConnectSheet
}) {
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [fileName, setFileName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [fetchingLink, setFetchingLink] = useState(false);
  const [parsedRows, setParsedRows] = useState([]);
  const [parsingError, setParsingError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [showSchemaHelp, setShowSchemaHelp] = useState(false);

  // Sync active tab whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setParsingError('');
      setSubmitResult(null);
    }
  }, [isOpen, initialTab]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
        setParsingError(res.error || '');
        setParsedRows(res.rows || []);
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const res = parseMapelCsvText(text, students);
        setParsingError(res.error || '');
        setParsedRows(res.rows || []);
      };
      reader.readAsText(file);
    }
  };

  const handleFetchFromLink = async () => {
    if (!linkUrl.trim()) {
      setParsingError('Masukkan tautan Google Sheets terlebih dahulu.');
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
          `Gagal mengunduh berkas dari link (HTTP ${res.status}). Pastikan akses Google Sheets disetel ke "Anyone with the link can view".`
        );
      }
      const text = await res.text();
      setFileName('google_sheets_import.csv');

      const parsed = parseMapelCsvText(text, students);
      setParsingError(parsed.error || '');
      setParsedRows(parsed.rows || []);
    } catch (err) {
      setParsingError('Gagal menarik data dari link: ' + err.message);
    } finally {
      setFetchingLink(false);
    }
  };

  const handleLoadSample = () => {
    const sample = generateSampleCsvContent(students);
    setFileName('contoh_nilai_5_siswa.csv');
    setSubmitResult(null);
    const res = parseMapelCsvText(sample, students);
    setParsingError(res.error || '');
    setParsedRows(res.rows || []);
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
        if (activeTab === 'sheet' && linkUrl && autoSyncEnabled && onConnectSheet) {
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
        }, 1200);
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
          maxWidth: '860px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.16)',
          border: '1.5px solid #E8E5F7',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid #E8E5F7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#FAF9FE'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#EEF2FF',
                color: '#4F46E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#1E1B4B' }}>
                Import &amp; Sinkronisasi Nilai — {activeSubjectName}
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                Perbarui nilai evaluasi 7 pertemuan (P1–P3, UTS, P5–P6, UAS) secara massal
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="luna-chat-icon-btn"
            style={{ width: '32px', height: '32px', borderRadius: '8px' }}
            title="Tutup Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Dua Tombol Pilihan Mode */}
          <div
            style={{
              display: 'flex',
              background: '#F1F5F9',
              padding: '4px',
              borderRadius: '12px',
              gap: '6px'
            }}
          >
            <button
              type="button"
              onClick={() => { setActiveTab('excel'); setParsingError(''); }}
              style={{
                flex: 1,
                padding: '9px 16px',
                borderRadius: '9px',
                fontSize: '13px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: activeTab === 'excel' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'excel' ? '#4F46E5' : '#64748B',
                boxShadow: activeTab === 'excel' ? '0 2px 6px rgba(0, 0, 0, 0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Upload size={16} />
              <span>Import File Excel / CSV Lokal</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('sheet'); setParsingError(''); }}
              style={{
                flex: 1,
                padding: '9px 16px',
                borderRadius: '9px',
                fontSize: '13px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: activeTab === 'sheet' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'sheet' ? '#4F46E5' : '#64748B',
                boxShadow: activeTab === 'sheet' ? '0 2px 6px rgba(0, 0, 0, 0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <LinkIcon size={16} />
              <span>Tautan Google Sheets (Live Auto-Sync)</span>
            </button>
          </div>

          {/* Banner Bantuan Template (Selalu Terpampang Jelas) */}
          <div
            style={{
              background: '#FAF9FE',
              border: '1.5px solid #DDD6FE',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#312E81', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Format Resmi Template Nilai</span>
                <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#166534', padding: '1px 6px', borderRadius: '6px', fontWeight: 700 }}>
                  Standar LUNA
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                Kolom wajib: <code>nisn, nama, p1, p2, p3, uts, p5, p6, uas</code>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => downloadMapelTemplateExcel(students, activeSubjectName)}
                className="pill-tab"
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: '#FFFFFF',
                  color: '#4F46E5',
                  borderColor: '#C7D2FE'
                }}
              >
                <Download size={13} />
                <span>Unduh Excel (.xlsx)</span>
              </button>

              <button
                type="button"
                onClick={() => downloadMapelTemplateFile(students, activeSubjectName)}
                className="pill-tab"
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: '#FFFFFF',
                  color: '#475569',
                  borderColor: '#CBD5E1'
                }}
              >
                <Download size={13} />
                <span>Unduh CSV</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSchemaHelp(!showSchemaHelp)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6366F1',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '4px 6px',
                  textDecoration: 'underline'
                }}
              >
                {showSchemaHelp ? 'Tutup Panduan' : 'Lihat Format Kolom'}
              </button>
            </div>
          </div>

          {/* Collapsible Schema Help */}
          <MapelCsvSchemaHelp
            showSchemaHelp={showSchemaHelp}
            setShowSchemaHelp={setShowSchemaHelp}
          />

          {/* TAB 1: Upload File Excel / CSV */}
          {activeTab === 'excel' && (
            <div>
              <div
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                style={{
                  border: '2px dashed #C4B5FD',
                  borderRadius: '12px',
                  padding: '28px 20px',
                  textAlign: 'center',
                  background: '#FAF9FE',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginBottom: '10px'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7C69EF'; e.currentTarget.style.background = '#F4F1FE'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#C4B5FD'; e.currentTarget.style.background = '#FAF9FE'; }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <Upload size={32} style={{ color: '#7C69EF', margin: '0 auto 8px' }} />
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#1E1B4B' }}>
                  {fileName ? `File Terpilih: ${fileName}` : 'Klik untuk Memilih atau Tarik Berkas Excel (.xlsx, .xls) / CSV'}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                  Mendukung berkas Microsoft Excel (.xlsx, .xls) dan CSV teks dipisahkan koma/titik-koma.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6366F1',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  🧪 Muat Data Contoh (5 Siswa XI IPA 2)
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Tautan Google Sheets */}
          {activeTab === 'sheet' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
                  <LinkIcon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="Tempelkan tautan Google Sheets (contoh: https://docs.google.com/spreadsheets/d/...)..."
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
                  {fetchingLink ? <RefreshCw size={15} className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowRight size={15} />}
                  <span>{fetchingLink ? 'Mengambil Data...' : 'Tarik Data Nilai'}</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: '12px', color: '#64748B' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600, color: '#334155' }}>
                  <input
                    type="checkbox"
                    checked={autoSyncEnabled}
                    onChange={(e) => setAutoSyncEnabled(e.target.checked)}
                    style={{ accentColor: '#4F46E5', cursor: 'pointer' }}
                  />
                  <span>Aktifkan Live Auto-Sync berkala (20 detik) setelah import berhasil</span>
                </label>
                <span>💡 Setel izin spreadsheet ke <em>"Anyone with link can view"</em></span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {parsingError && (
            <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: '#991B1B', fontSize: '12.5px' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{parsingError}</span>
            </div>
          )}

          {/* Success Message */}
          {submitResult && submitResult.type === 'success' && (
            <div style={{ padding: '12px 16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontSize: '12.5px' }}>
              <CheckCircle size={16} style={{ flexShrink: 0 }} />
              <span>{submitResult.message}</span>
            </div>
          )}

          {/* Preview Table */}
          {parsedRows && parsedRows.length > 0 && (
            <MapelCsvPreviewTable
              parsedRows={parsedRows}
              KKM={KKM}
              onReset={handleReset}
              onApplyBatch={handleApplyBatch}
              submitting={submitting}
            />
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '12px 22px',
            borderTop: '1px solid #E8E5F7',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#FAF9FE'
          }}
        >
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            {parsedRows.length > 0 ? `${parsedRows.length} siswa siap disimpan ke kelas` : 'Pilih berkas atau tempel link untuk memulai'}
          </div>

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
