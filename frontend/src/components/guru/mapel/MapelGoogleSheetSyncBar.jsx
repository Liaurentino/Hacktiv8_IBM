import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Pause,
  Play,
  Unlink,
  FileSpreadsheet,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function MapelGoogleSheetSyncBar({
  syncData,
  activeSubjectName = 'Matematika'
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

  const [inputUrl, setInputUrl] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [now, setNow] = useState(Date.now());

  // Update counter setiap detik untuk format waktu relatif (misal: "5 detik lalu")
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

  const handleConnectSubmit = (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    connectSheet(inputUrl.trim());
    setInputUrl('');
  };

  // KONDISI 1: Belum ada Google Spreadsheet yang terhubung
  if (!sheetUrl) {
    return (
      <div
        style={{
          background: '#FFFFFF',
          border: '1.5px solid #E8E5F7',
          borderRadius: '14px',
          padding: '16px 20px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(47, 51, 102, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E1B4B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Hubungkan Google Spreadsheet (Live Auto-Sync)</span>
                <span style={{ fontSize: '11px', background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0', padding: '1px 8px', borderRadius: '999px', fontWeight: 600 }}>
                  Metode 1: Polling Berkala
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                Nilai {activeSubjectName} akan otomatis terbarui setiap 20 detik saat Anda mengedit spreadsheet tanpa perlu unggah ulang berkas.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: isExpanded ? '#F1F5F9' : '#F4F1FE',
              border: '1px solid',
              borderColor: isExpanded ? '#CBD5E1' : '#E2DFF6',
              color: isExpanded ? '#475569' : '#5243C2',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <span>{isExpanded ? 'Tutup Input Link' : 'Masukkan Link Google Sheet'}</span>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {isExpanded && (
          <form onSubmit={handleConnectSubmit} style={{ display: 'flex', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
            <input
              type="url"
              required
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Tempel tautan Google Spreadsheet (contoh: https://docs.google.com/spreadsheets/d/.../edit)..."
              style={{
                flex: 1,
                minWidth: '280px',
                height: '40px',
                padding: '0 14px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              className="btn-luna-primary"
              style={{
                height: '40px',
                padding: '0 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Zap size={15} />
              <span>Hubungkan & Mulai Auto-Sync</span>
            </button>
          </form>
        )}
      </div>
    );
  }

  // KONDISI 2: Google Spreadsheet Terhubung
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1.5px solid',
        borderColor: errorMessage ? '#FECACA' : (isEnabled ? '#BBF7D0' : '#E2E8F0'),
        borderRadius: '14px',
        padding: '14px 18px',
        marginBottom: '20px',
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
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#1E1B4B' }}>
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
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', display: 'flex', gap: '12px', flexWrap: 'wrap', fontVariantNumeric: 'tabular-nums' }}>
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
              gap: '6px',
              opacity: isSyncing ? 0.7 : 1,
              transition: 'all 0.15s ease'
            }}
            title="Periksa dan sinkronkan sekarang tanpa menunggu interval"
          >
            <RefreshCw size={13} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
          </button>

          <button
            type="button"
            onClick={toggleAutoSync}
            style={{
              background: isEnabled ? '#F8FAFC' : '#ECFDF5',
              border: '1px solid',
              borderColor: isEnabled ? '#CBD5E1' : '#BBF7D0',
              color: isEnabled ? '#475569' : '#059669',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
            title={isEnabled ? 'Jeda polling berkala' : 'Lanjutkan polling berkala'}
          >
            {isEnabled ? <Pause size={13} /> : <Play size={13} />}
            <span>{isEnabled ? 'Jeda' : 'Lanjutkan'}</span>
          </button>

          <a
            href={sheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              color: '#334155',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              textDecoration: 'none'
            }}
            title="Buka Google Spreadsheet di tab baru"
          >
            <ExternalLink size={13} />
            <span>Buka Sheet</span>
          </a>

          <button
            type="button"
            onClick={disconnectSheet}
            style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
            title="Putuskan tautan spreadsheet"
          >
            <Unlink size={13} />
            <span>Putuskan</span>
          </button>
        </div>
      </div>

      {/* Peringatan jika terjadi galat saat polling */}
      {errorMessage && (
        <div
          style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '12px',
            color: '#991B1B',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1 }}>{errorMessage}</span>
          <button
            type="button"
            onClick={triggerManualSync}
            style={{
              background: '#FFFFFF',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              borderRadius: '6px',
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Coba Lagi
          </button>
        </div>
      )}
    </div>
  );
}
