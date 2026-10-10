import { useState, useEffect, useRef, useCallback } from 'react';
import { convertUrlToCsvExportUrl, parseMapelCsvText } from '../components/guru/mapel/mapelCsvHelpers';
import api from '../services/api';

/**
 * Custom Hook untuk Polling Berkala Google Spreadsheet
 * Menyimpan tautan spreadsheet di localStorage per mata pelajaran dan
 * melakukan background auto-sync secara otomatis setiap interval tertentu.
 */
export function useGoogleSheetSync({
  subjectKey,
  students = [],
  onSyncSuccess,
  intervalSeconds = 20,
  showToast
}) {
  const storageKey = `luna_gsheet_url_${subjectKey}`;
  const enabledKey = `luna_gsheet_enabled_${subjectKey}`;

  // State utama
  const [sheetUrl, setSheetUrl] = useState(() => {
    return localStorage.getItem(storageKey) || '';
  });
  const [isEnabled, setIsEnabled] = useState(() => {
    const saved = localStorage.getItem(enabledKey);
    return saved !== null ? saved === 'true' : true;
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'checking' | 'synced' | 'error' | 'paused'
  const [lastCheckTime, setLastCheckTime] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [syncedCount, setSyncedCount] = useState(0);

  // Simpan data terakhir untuk deteksi perubahan teks
  const lastCsvTextRef = useRef('');
  const studentsRef = useRef(students);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    studentsRef.current = students;
  }, [students]);

  // Update sheetUrl jika subjectKey berganti
  useEffect(() => {
    const savedUrl = localStorage.getItem(`luna_gsheet_url_${subjectKey}`) || '';
    const savedEnabled = localStorage.getItem(`luna_gsheet_enabled_${subjectKey}`);
    setSheetUrl(savedUrl);
    setIsEnabled(savedEnabled !== null ? savedEnabled === 'true' : true);
    lastCsvTextRef.current = '';
    setErrorMessage('');
    setSyncStatus('idle');
  }, [subjectKey]);

  // Fungsi eksekusi sinkronisasi tunggal
  const executeSync = useCallback(async (isManualTrigger = false) => {
    if (!sheetUrl || isSyncingRef.current) return;
    if (!isEnabled && !isManualTrigger) return;

    isSyncingRef.current = true;
    setIsSyncing(true);
    setSyncStatus('checking');
    setErrorMessage('');

    try {
      const baseExportUrl = convertUrlToCsvExportUrl(sheetUrl);
      if (!baseExportUrl) {
        throw new Error('Format tautan Google Spreadsheet tidak valid.');
      }

      // Tambahkan parameter anti-cache agar Google CDN mengembalikan versi terbaru
      const cacheBuster = `_t=${Date.now()}`;
      const fetchUrl = baseExportUrl.includes('?')
        ? `${baseExportUrl}&${cacheBuster}`
        : `${baseExportUrl}?${cacheBuster}`;

      const res = await fetch(fetchUrl);
      if (!res.ok) {
        throw new Error(`Gagal mengunduh spreadsheet (HTTP ${res.status}). Pastikan akses disetel ke "Siapa saja yang memiliki link".`);
      }

      const csvText = await res.text();
      setLastCheckTime(Date.now());

      // Jika isi CSV tidak berubah dari sinkronisasi sebelumnya dan bukan manual trigger, lewati penulisan database
      if (!isManualTrigger && lastCsvTextRef.current && lastCsvTextRef.current.trim() === csvText.trim()) {
        setSyncStatus('idle');
        return;
      }

      // Parsing baris CSV terhadap data murid
      const parsed = parseMapelCsvText(csvText, studentsRef.current);
      if (parsed.error && parsed.rows.length === 0) {
        throw new Error(parsed.error);
      }

      const validRows = parsed.rows.filter(
        (r) => (r.nisn && r.nisn !== '-') || r.studentId
      );

      if (validRows.length === 0) {
        throw new Error('Tidak ada baris data nilai murid yang valid pada spreadsheet.');
      }

      const items = validRows.map((r) => ({
        studentId: r.studentId || undefined,
        nisn: r.nisn,
        studentName: r.studentName,
        className: r.className || 'XI IPA 2',
        scores: r.scores
      }));

      // Kirim pembaruan batch ke backend
      const batchRes = await api.batchUpdateGrades(subjectKey, items);
      if (batchRes.status === 'success') {
        lastCsvTextRef.current = csvText;
        setLastSyncTime(Date.now());
        setSyncedCount(validRows.length);
        setSyncStatus('synced');

        if (onSyncSuccess) {
          onSyncSuccess(batchRes.data);
        }

        if (showToast && isManualTrigger) {
          showToast({
            type: 'success',
            title: 'Sinkronisasi Spreadsheet Berhasil',
            message: `Nilai ${validRows.length} murid berhasil disinkronkan dari Google Spreadsheet.`
          });
        }
      } else {
        throw new Error(batchRes.message || 'Gagal menyimpan nilai ke basis data.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Terjadi galat sinkronisasi spreadsheet.');
      setSyncStatus('error');
      if (showToast && isManualTrigger) {
        showToast({
          type: 'error',
          title: 'Gagal Sinkronisasi Spreadsheet',
          message: err.message || 'Gagal mengambil data terbaru.'
        });
      }
    } finally {
      isSyncingRef.current = false;
      setIsSyncing(false);
    }
  }, [sheetUrl, isEnabled, subjectKey, onSyncSuccess, showToast]);

  // Efek interval polling berkala
  useEffect(() => {
    if (!sheetUrl || !isEnabled) {
      if (!isEnabled && sheetUrl) {
        setSyncStatus('paused');
      }
      return;
    }

    // Jalankan satu kali saat mount atau ketika url baru diaktifkan
    executeSync(false);

    const intervalMs = Math.max(10, intervalSeconds) * 1000;
    const timerId = setInterval(() => {
      executeSync(false);
    }, intervalMs);

    // Auto-revalidate saat pengguna kembali membuka tab peramban
    const handleWindowFocus = () => {
      executeSync(false);
    };
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      clearInterval(timerId);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [sheetUrl, isEnabled, intervalSeconds, executeSync]);

  // Method penghubung sheet
  const connectSheet = (url) => {
    const trimmed = (url || '').trim();
    if (!trimmed) return;
    localStorage.setItem(storageKey, trimmed);
    localStorage.setItem(enabledKey, 'true');
    setSheetUrl(trimmed);
    setIsEnabled(true);
    lastCsvTextRef.current = '';
    setErrorMessage('');
  };

  // Method pemutus tautan sheet
  const disconnectSheet = () => {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(enabledKey);
    setSheetUrl('');
    setIsEnabled(true);
    lastCsvTextRef.current = '';
    setLastCheckTime(null);
    setLastSyncTime(null);
    setErrorMessage('');
    setSyncStatus('idle');
  };

  // Toggle jeda / lanjutkan polling
  const toggleAutoSync = () => {
    const nextState = !isEnabled;
    localStorage.setItem(enabledKey, String(nextState));
    setIsEnabled(nextState);
    if (!nextState) {
      setSyncStatus('paused');
    } else {
      setSyncStatus('idle');
    }
  };

  // Trigger manual langsung
  const triggerManualSync = () => {
    executeSync(true);
  };

  return {
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
  };
}
