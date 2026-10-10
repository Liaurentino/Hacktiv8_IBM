import React, { useRef, useState } from 'react';
import { Sparkles, AlertCircle, CheckCircle, HelpCircle, Upload, Link as LinkIcon } from 'lucide-react';
import {
  parseMapelCsvText,
  convertUrlToCsvExportUrl,
  generateSampleCsvContent
} from './mapelCsvHelpers';
import MapelCsvTopBanner from './MapelCsvTopBanner';
import MapelCsvSchemaHelp from './MapelCsvSchemaHelp';
import MapelCsvInputs from './MapelCsvInputs';
import MapelCsvPreviewTable from './MapelCsvPreviewTable';
import api from '../../../services/api';

export default function MapelCsvGradeUploader({
  activeSubjectKey,
  activeSubjectName,
  students,
  KKM = 75,
  onImportSuccess,
  onConnectSheet
}) {
  const fileInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'link'
  const [csvFileName, setCsvFileName] = useState('');
  const [csvRawText, setCsvRawText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [fetchingLink, setFetchingLink] = useState(false);
  const [parsedRows, setParsedRows] = useState([]);
  const [parsingError, setParsingError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [showSchemaHelp, setShowSchemaHelp] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setCsvFileName(file.name);
    setSubmitResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setCsvRawText(content);
      const res = parseMapelCsvText(content, students);
      setParsingError(res.error);
      setParsedRows(res.rows);
    };
    reader.readAsText(file);
  };

  const handleFetchFromLink = async () => {
    if (!linkUrl.trim()) {
      setParsingError('Masukkan URL Google Sheets atau CSV terlebih dahulu.');
      return;
    }
    setFetchingLink(true);
    setParsingError('');
    setSubmitResult(null);

    try {
      const exportUrl = convertUrlToCsvExportUrl(linkUrl);
      const res = await fetch(exportUrl);
      if (!res.ok) {
        throw new Error(`Gagal mengunduh berkas dari link (Status HTTP: ${res.status}). Pastikan Google Sheets disetel ke "Anyone with the link can view".`);
      }
      const text = await res.text();
      setCsvRawText(text);
      setCsvFileName('google_sheets_import.csv');

      const parsed = parseMapelCsvText(text, students);
      setParsingError(parsed.error);
      setParsedRows(parsed.rows);
    } catch (err) {
      setParsingError('Gagal menarik CSV dari link: ' + err.message);
    } finally {
      setFetchingLink(false);
    }
  };

  const handleLoadSample = () => {
    const sample = generateSampleCsvContent(students);
    setCsvFileName('contoh_nilai_mapel.csv');
    setCsvRawText(sample);
    setSubmitResult(null);
    const res = parseMapelCsvText(sample, students);
    setParsingError(res.error);
    setParsedRows(res.rows);
  };

  const handleReset = () => {
    setParsedRows([]);
    setCsvRawText('');
    setCsvFileName('');
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
        if (activeTab === 'link' && linkUrl && onConnectSheet) {
          onConnectSheet(linkUrl);
        }
        setSubmitResult({
          type: 'success',
          message: res.message || `Berhasil memperbarui nilai ${validRows.length} siswa.`
        });
        if (onImportSuccess) {
          onImportSuccess(res.data);
        }
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
    <div style={{ marginBottom: '20px' }}>
      <MapelCsvTopBanner
        students={students}
        activeSubjectName={activeSubjectName}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      {isOpen && (
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #E2DFF6',
            borderTop: 'none',
            borderRadius: '0 0 16px 16px',
            padding: '24px',
            marginTop: '-4px',
            boxShadow: '0 10px 24px rgba(47, 51, 102, 0.08)'
          }}
        >
          {/* Sub Navigation / Tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '8px', background: '#F4F1FE', padding: '4px', borderRadius: '10px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: activeTab === 'upload' ? 700 : 500,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'upload' ? '#5243C2' : 'transparent',
                  color: activeTab === 'upload' ? '#FFFFFF' : '#4B5563',
                  transition: 'all 0.15s ease'
                }}
              >
                <Upload size={14} />
                <span>Upload File CSV</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('link')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: activeTab === 'link' ? 700 : 500,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'link' ? '#5243C2' : 'transparent',
                  color: activeTab === 'link' ? '#FFFFFF' : '#4B5563',
                  transition: 'all 0.15s ease'
                }}
              >
                <LinkIcon size={14} />
                <span>Pakai Link Spreadsheet</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleLoadSample}
                style={{
                  background: '#FAF5FF',
                  border: '1px solid #E9D5FF',
                  color: '#7E22CE',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Sparkles size={13} />
                <span>Pakai Contoh Nilai Kelas</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSchemaHelp(!showSchemaHelp)}
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  color: '#334155',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <HelpCircle size={13} />
                <span>{showSchemaHelp ? 'Tutup Format Kolom' : 'Lihat Format Kolom'}</span>
              </button>
            </div>
          </div>

          <MapelCsvSchemaHelp showSchemaHelp={showSchemaHelp} setShowSchemaHelp={setShowSchemaHelp} />

          <MapelCsvInputs
            activeTab={activeTab}
            fileInputRef={fileInputRef}
            handleFileUpload={handleFileUpload}
            csvFileName={csvFileName}
            linkUrl={linkUrl}
            setLinkUrl={setLinkUrl}
            handleFetchFromLink={handleFetchFromLink}
            fetchingLink={fetchingLink}
          />

          {parsingError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{parsingError}</span>
            </div>
          )}

          {submitResult && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px' }}>
              <CheckCircle size={18} style={{ flexShrink: 0 }} />
              <span>{submitResult.message}</span>
            </div>
          )}

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
  );
}
