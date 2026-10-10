import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Link as LinkIcon,
  Download,
  HelpCircle,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  Pause,
  Play,
  Unlink,
  Zap
} from 'lucide-react';
import MapelImportModal from './MapelImportModal';
import MapelTemplatePreviewModal from './MapelTemplatePreviewModal';

export default function MapelGradeSyncManager({
  syncData,
  activeSubjectKey,
  activeSubjectName = 'Matematika',
  students = [],
  KKM = 75,
  onImportSuccess
}) {
  const {
    sheetUrl,
    isEnabled,
    isSyncing,
    syncStatus,
    lastCheckTime,
    lastSyncTime,
    errorMessage,
    syncedCount,
    connectSheet,
    disconnectSheet,
    toggleAutoSync,
    triggerManualSync
  } = syncData;

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importInitialTab, setImportInitialTab] = useState('excel'); // 'excel' | 'sheet'
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [now, setNow] = useState(Date.now());

  // Update relative time timer
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Belum pernah';
    const diffSec = Math.max(0, Math.floor((now - timestamp) / 1000));
    if (diffSec < 5) return 'Baru saja';
    if (diffSec < 60) return `${diffSec} detik lalu`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} menit lalu`;
    return `${Math.floor(diffMin / 60)} jam lalu`;
  };

  const openImportExcel = () => {
    setImportInitialTab('excel');
    setIsImportModalOpen(true);
  };

  const openConnectSheet = () => {
    setImportInitialTab('sheet');
    setIsImportModalOpen(true);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* ─────────────────────────────────────────────────────────────────────────────
          KONDISI 1: Google Spreadsheet Sedang Terhubung (Live Auto-Sync Aktif)
          ───────────────────────────────────────────────────────────────────────────── */}
      {sheetUrl ? (
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid',
            borderColor: errorMessage ? '#FECACA' : (isEnabled ? '#BBF7D0' : '#E2E8F0'),
            borderRadius: '14px',
            padding: '14px 18px',
            boxShadow: '0 2px 10px rgba(47, 51, 102, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            transition: 'border-color 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            {/* Kolom Kiri: Status & Identitas Sheet */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
              <div
                style={{
                  position: 'relative',
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: isEnabled ? '#ECFDF5' : '#F1F5F9',
                  color: isEnabled ? '#059669' : '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <FileSpreadsheet size={20} />
                {isEnabled && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: isSyncing ? '#F59E0B' : '#10B981',
                      border: '2px solid #FFFFFF'
                    }}
                  />
                )}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1E1B4B' }}>
                    Google Spreadsheet Terhubung ({activeSubjectName})
                  </span>

                  {/* Status Badge */}
                  {isSyncing ? (
                    <span style={{ fontSize: '11px', background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A', padding: '1px 8px', borderRadius: '999px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <RefreshCw size={11} className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Memeriksa Perubahan...</span>
                    </span>
                  ) : isEnabled ? (
                    <span style={{ fontSize: '11px', background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0', padding: '1px 8px', borderRadius: '999px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={11} />
                      <span>Auto-Sync Aktif (20 dtk)</span>
                    </span>
                  ) : (
                    <span style={{ fontSize: '11px', background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', padding: '1px 8px', borderRadius: '999px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Pause size={11} />
                      <span>Auto-Sync Dijeda</span>
                    </span>
                  )}

                  {syncedCount > 0 && (
                    <span style={{ fontSize: '11px', color: '#64748B', fontVariantNumeric: 'tabular-nums' }}>
                      ({syncedCount} siswa)
                    </span>
                  )}
                </div>

                {/* Subteks Waktu Relatif */}
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', display: 'flex', gap: '10px', flexWrap: 'wrap', fontVariantNumeric: 'tabular-nums' }}>
                  <span>Diperiksa: <strong>{formatRelativeTime(lastCheckTime)}</strong></span>
                  <span>•</span>
                  <span>Disinkronkan: <strong>{formatRelativeTime(lastSyncTime)}</strong></span>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Tombol Aksi Kontrol */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={triggerManualSync}
                disabled={isSyncing}
                style={{
                  background: '#F4F1FE',
                  border: '1px solid #E2DFF6',
                  color: '#5243C2',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: isSyncing ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Periksa dan sinkronkan perubahan sekarang"
              >
                <RefreshCw size={13} className={isSyncing ? 'spin-animation' : ''} style={isSyncing ? { animation: 'spin 1s linear infinite' } : {}} />
                <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan'}</span>
              </button>

              <button
                type="button"
                onClick={toggleAutoSync}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#334155',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title={isEnabled ? 'Jeda sinkronisasi otomatis' : 'Lanjutkan sinkronisasi otomatis'}
              >
                {isEnabled ? <Pause size={13} /> : <Play size={13} />}
                <span>{isEnabled ? 'Jeda' : 'Lanjutkan'}</span>
              </button>

              <a
                href={sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#334155',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Buka Spreadsheet di Google Drive"
              >
                <ExternalLink size={13} />
                <span>Buka Sheet</span>
              </a>

              <button
                type="button"
                onClick={openImportExcel}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #DDD6FE',
                  color: '#4F46E5',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Import file Excel/CSV manual tanpa memutus link"
              >
                <Upload size={13} />
                <span>Import Excel</span>
              </button>

              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6366F1',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '4px 6px',
                  textDecoration: 'underline'
                }}
                title="Lihat format kolom dan unduh template"
              >
                Template
              </button>

              <button
                type="button"
                onClick={disconnectSheet}
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#DC2626',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Putuskan sambungan Google Spreadsheet"
              >
                <Unlink size={13} />
                <span>Putuskan</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────────────────────
           KONDISI 2: Belum Terhubung (Satu Bar Tunggal Bersih dengan 2 Tombol Pilihan)
           ───────────────────────────────────────────────────────────────────────────── */
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '14px',
            border: '1.5px solid #E2DFF6',
            padding: '14px 20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(47, 51, 102, 0.04)'
          }}
        >
          {/* Kolom Kiri: Ikon & Penjelasan */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#F4F1FE',
                border: '1.5px solid #DDD6FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5243C2',
                flexShrink: 0
              }}
            >
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#1E1B4B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Sinkronisasi &amp; Import Nilai ({activeSubjectName})</span>
                <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#166534', padding: '1px 8px', borderRadius: '10px', fontWeight: 700 }}>
                  Format Resmi 7 Pertemuan
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                Pilih metode: Unggah berkas Excel (.xlsx/.csv) lokal atau hubungkan tautan Google Sheets publik.
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Dua Tombol Keputusan + Tombol Template */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Tombol 1: Import Local Excel */}
            <button
              type="button"
              onClick={openImportExcel}
              className="btn-luna-primary"
              style={{
                borderRadius: '10px',
                padding: '7px 16px',
                fontSize: '12.5px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(82, 67, 194, 0.2)'
              }}
              title="Unggah berkas Excel (.xlsx) atau CSV dari komputer"
            >
              <Upload size={14} />
              <span>Import Excel / CSV</span>
            </button>

            {/* Tombol 2: Link Google Sheet */}
            <button
              type="button"
              onClick={openConnectSheet}
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #C7D2FE',
                color: '#4338CA',
                borderRadius: '10px',
                padding: '7px 16px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
              title="Hubungkan Google Sheets untuk Live Auto-Sync berkala"
            >
              <LinkIcon size={14} />
              <span>Link Google Sheet</span>
            </button>

            {/* Tombol 3: Panduan & Unduh Template */}
            <button
              type="button"
              onClick={() => setIsTemplateModalOpen(true)}
              className="pill-tab"
              style={{
                fontSize: '12px',
                padding: '7px 14px',
                background: '#F8FAFC',
                borderColor: '#CBD5E1',
                color: '#334155',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Lihat format kolom dan unduh template resmi"
            >
              <Download size={13} />
              <span>Template Excel</span>
            </button>
          </div>
        </div>
      )}

      {/* Pop-up Modal Import Nilai (Excel / Google Sheet) */}
      <MapelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        activeSubjectKey={activeSubjectKey}
        activeSubjectName={activeSubjectName}
        students={students}
        KKM={KKM}
        initialTab={importInitialTab}
        onImportSuccess={onImportSuccess}
        onConnectSheet={connectSheet}
      />

      {/* Pop-up Modal Panduan & Template Preview */}
      <MapelTemplatePreviewModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        students={students}
        activeSubjectName={activeSubjectName}
      />
    </div>
  );
}
