import React, { useRef, useState } from 'react';
import { Upload, Sparkles, Download, AlertCircle } from 'lucide-react';
import api from '../../../services/api';
import { parseCsvText } from './csvImportHelpers';
import CsvParsedRowsTable from './CsvParsedRowsTable';

export default function CsvBatchUploader({
  csvDefaultClass,
  setCsvDefaultClass,
  onBatchSuccess
}) {
  const fileInputRef = useRef(null);
  const [csvFileName, setCsvFileName] = useState('');
  const [csvRawText, setCsvRawText] = useState('');
  const [csvParsedRows, setCsvParsedRows] = useState([]);
  const [csvParsingError, setCsvParsingError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setCsvRawText(content);
      const res = parseCsvText(content, csvDefaultClass);
      setCsvParsingError(res.error);
      setCsvParsedRows(res.rows);
    };
    reader.readAsText(file);
  };

  const handleLoadSampleCsv = () => {
    const sample = `nama,nisn,nomor_hp,email,kelas,jenis_kelamin,nilai_rata_rata,no_wa_wali\nAhmad Fadhilah,20240111,08123456781,ahmad.fadhilah@siswa.sch.id,XI IPA 2,L,85.5,08198765431\nNabila Syahrani,20240112,08123456782,nabila.syahrani@siswa.sch.id,XI IPA 2,P,88.0,08198765432\nReyhan Pratama,20240113,08123456783,reyhan.pratama@siswa.sch.id,XI IPA 2,L,82.5,08198765433`;
    setCsvFileName('contoh_daftar_murid.csv');
    setCsvRawText(sample);
    const res = parseCsvText(sample, csvDefaultClass);
    setCsvParsingError(res.error);
    setCsvParsedRows(res.rows);
  };

  const handleDownloadSampleCsv = () => {
    const template = `nama,nisn,nomor_hp,email,kelas,jenis_kelamin,nilai_rata_rata,no_wa_wali\nZahra Aurelia,20240101,08123456701,zahra@siswa.sch.id,XI IPA 2,P,86.5,08190000001\nBintang Pratama,20240102,08123456702,bintang@siswa.sch.id,XI IPA 2,L,84.0,08190000002`;
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_import_murid.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetCsv = () => {
    setCsvParsedRows([]);
    setCsvRawText('');
    setCsvFileName('');
    setCsvParsingError('');
  };

  const handleBatchCreate = async () => {
    if (csvParsedRows.length === 0) {
      setCsvParsingError('Tidak ada data murid yang siap diproses.');
      return;
    }
    setLoading(true);
    setCsvParsingError('');
    try {
      const res = await api.createStudentsBatch(csvParsedRows);
      if (res && res.status === 'success') {
        if (onBatchSuccess) onBatchSuccess(res);
        handleResetCsv();
      } else {
        setCsvParsingError(res.message || 'Gagal membuat akun massal dari CSV.');
      }
    } catch (err) {
      setCsvParsingError('Terjadi kesalahan saat memproses CSV: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="card" style={{ padding: '22px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '12px',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--slate-900)', margin: 0 }}>
              Import &amp; Pembuatan Akun Otomatis dari CSV Murid
            </h2>
            <p style={{ fontSize: '12.5px', color: 'var(--slate-600)', margin: '3px 0 0' }}>
              Format CSV yang didukung: <code>nama, nisn, nomor_hp, email</code> (data akademik opsional: <code>kelas, jenis_kelamin, nilai_rata_rata</code>).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleLoadSampleCsv}
              className="btn-luna-secondary"
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              <Sparkles size={14} style={{ color: 'var(--brand)' }} />
              <span>Gunakan Contoh CSV</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadSampleCsv}
              className="btn-luna-secondary"
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              <Download size={14} />
              <span>Unduh Template CSV</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '18px', alignItems: 'start' }}>
          <div
            style={{
              border: '2px dashed #CBD5E1',
              borderRadius: '10px',
              padding: '24px 20px',
              textAlign: 'center',
              background: '#F8FAFC',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#EEF2FF',
                color: 'var(--brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px'
              }}
            >
              <Upload size={20} />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--slate-900)' }}>
              {csvFileName ? `File Terpilih: ${csvFileName}` : 'Klik untuk Pilih atau Tarik File .CSV Murid'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--slate-500)', marginTop: '4px' }}>
              Sistem otomatis memetakan kolom nama, NISN, no hp, email, dan data akademik murid.
            </div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>
              Kelas Default Siswa:
            </label>
            <select
              value={csvDefaultClass}
              onChange={(e) => {
                setCsvDefaultClass(e.target.value);
                if (csvRawText) {
                  const res = parseCsvText(csvRawText, e.target.value);
                  setCsvParsingError(res.error);
                  setCsvParsedRows(res.rows);
                }
              }}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                background: '#FFFFFF',
                marginBottom: '10px'
              }}
            >
              <option value="XI IPA 2">XI IPA 2</option>
              <option value="XI IPA 1">XI IPA 1</option>
              <option value="XI IPS 1">XI IPS 1</option>
              <option value="XI IPS 2">XI IPS 2</option>
              <option value="X IPA 1">X IPA 1</option>
              <option value="XII IPA 1">XII IPA 1</option>
            </select>

            <div style={{ fontSize: '11px', color: 'var(--slate-600)', lineHeight: 1.5 }}>
              ✓ <strong>Kata Sandi:</strong> Dibuat otomatis oleh sistem (8 karakter acak).<br />
              ✓ <strong>Status BK:</strong> Langsung disetel <strong>Stabil</strong> (Kondisi Normal).
            </div>
          </div>
        </div>

        {csvParsingError && (
          <div
            style={{
              marginTop: '16px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#991B1B',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '12.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertCircle size={16} />
            <span>{csvParsingError}</span>
          </div>
        )}

        <CsvParsedRowsTable
          csvParsedRows={csvParsedRows}
          onResetCsv={handleResetCsv}
          loading={loading}
          onBatchCreate={handleBatchCreate}
        />
      </div>
    </div>
  );
}
