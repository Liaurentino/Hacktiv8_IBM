import React, { useState, useEffect } from 'react';
import { UserPlus, GraduationCap, FileSpreadsheet, AlertCircle } from 'lucide-react';
import api from '../services/api';
import SingleAccountPreviewCard from './guru/buat-akun/SingleAccountPreviewCard';
import BatchResultPreviewCard from './guru/buat-akun/BatchResultPreviewCard';
import CsvBatchUploader from './guru/buat-akun/CsvBatchUploader';
import ManualAccountForm from './guru/buat-akun/ManualAccountForm';
import RecentCreatedAccountsTable from './guru/buat-akun/RecentCreatedAccountsTable';
import { exportBatchToCsv } from './guru/buat-akun/csvImportHelpers';
import { generateLocal8CharPassword, submitNewStudentAccount, formatCredentialsWhatsApp } from './guru/buat-akun/accountCreationService';
import PageHeader from './common/PageHeader';

export default function GuruBuatAkunSiswa({ onNavigateToStudents, onSelectStudentDetail }) {
  const [activeTab, setActiveTab] = useState('csv');
  const [formData, setFormData] = useState({
    name: '',
    nisn: '',
    email: '',
    password: '',
    phone: '',
    parentPhone: '',
    className: 'XI IPA 2',
    gender: 'L',
    academicScore: 82,
    counselingStatus: 'Normal',
    triageLevel: 'HIJAU',
    riasecCode: 'I - S - A',
    careerTitle: 'Eksplorasi Karir Terbimbing',
    careerDesc: 'Program pendampingan akademik terpadu.',
    notes: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedManual, setCopiedManual] = useState(false);
  const [copiedBatch, setCopiedBatch] = useState(false);

  const [createdStudent, setCreatedStudent] = useState(null);
  const [batchResult, setBatchResult] = useState(null);
  const [recentAccounts, setRecentAccounts] = useState([]);
  const [csvDefaultClass, setCsvDefaultClass] = useState('XI IPA 2');

  const fetchServerPassword = async () => {
    setLoadingPassword(true);
    try {
      const res = await api.generatePassword();
      setFormData((prev) => ({ ...prev, password: res?.status === 'success' && res.password ? res.password : generateLocal8CharPassword() }));
    } catch {
      setFormData((prev) => ({ ...prev, password: generateLocal8CharPassword() }));
    } finally {
      setLoadingPassword(false);
    }
  };

  useEffect(() => {
    fetchServerPassword();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'nisn' && (!prev.email || prev.email.includes('@siswa.sch.id'))) {
        updated.email = value.trim() ? `${value.trim()}@siswa.sch.id` : '';
      }
      return updated;
    });
  };

  const handleAutoGenerateEmail = () => {
    if (!formData.nisn.trim()) {
      setErrorMsg('Harap isi NISN siswa terlebih dahulu untuk membuat email otomatis.');
      return;
    }
    setErrorMsg('');
    setFormData((prev) => ({ ...prev, email: `${prev.nisn.trim()}@siswa.sch.id` }));
  };

  const handleSubmitManual = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.name.trim() || !formData.nisn.trim()) {
      setErrorMsg('Nama lengkap dan NISN siswa wajib diisi.');
      return;
    }
    setLoading(true);
    try {
      const res = await submitNewStudentAccount(formData);
      if (res.success) {
        setCreatedStudent(res.record);
        setRecentAccounts((prev) => [res.record, ...prev]);
        setFormData((prev) => ({ ...prev, name: '', nisn: '', email: '', phone: '', parentPhone: '', academicScore: 82, notes: '' }));
        fetchServerPassword();
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCredentials = (account) => {
    const acc = account || createdStudent;
    if (!acc?.credentials) return;
    navigator.clipboard.writeText(formatCredentialsWhatsApp(acc.credentials));
    setCopiedManual(true);
    setTimeout(() => setCopiedManual(false), 2500);
  };

  const handleBatchSuccess = (res) => {
    setBatchResult(res);
    if (Array.isArray(res.created) && res.created.length > 0) {
      const formatted = res.created.map((item) => ({
        ...item.student,
        credentials: item.credentials,
        createdAtTime: item.createdAtTime || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }));
      setRecentAccounts((prev) => [...formatted, ...prev]);
    }
  };

  const handleCopyAllBatchCredentials = () => {
    if (!batchResult?.created?.length) return;
    let text = `*REKAP KREDENSIAL AKUN SISWA BARU (${batchResult.created.length} SISWA)*\nPortal Siswa: http://localhost:5173\n\n`;
    batchResult.created.forEach((item, idx) => {
      const c = item.credentials;
      text += `${idx + 1}. ${c.name} (${c.nisn})\n   Kelas: ${c.className}\n   Email: ${c.email}\n   Password: ${c.password}\n\n`;
    });
    navigator.clipboard.writeText(text);
    setCopiedBatch(true);
    setTimeout(() => setCopiedBatch(false), 2500);
  };

  return (
    <div className="preview-guru-buat-akun page-standard-container">
      <PageHeader
        icon={UserPlus}
        moduleTag="Portal Bimbingan Konseling • LUNA Education System"
        title="Pendaftaran Akun Siswa Baru"
        description="Pendaftaran akun portal murid melalui import otomatis CSV atau pengisian formulir manual untuk akses pendampingan."
        metadata={[
          { label: 'Metode Registrasi', value: 'Import CSV Batch & Input Manual' },
          { label: 'Domain Email Default', value: '@siswa.sch.id' },
          { label: 'Target Kelas Default', value: csvDefaultClass }
        ]}
        actions={
          <button
            type="button"
            onClick={onNavigateToStudents}
            className="btn-luna-secondary"
            style={{ fontSize: '13px', padding: '8px 14px' }}
          >
            <GraduationCap size={15} />
            <span>Daftar Siswa Terdaftar</span>
          </button>
        }
      />

      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('csv')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '8px',
            fontSize: '13.5px',
            fontWeight: 700,
            cursor: 'pointer',
            border: activeTab === 'csv' ? '1px solid var(--brand)' : '1px solid var(--border)',
            background: activeTab === 'csv' ? 'var(--brand)' : '#FFFFFF',
            color: activeTab === 'csv' ? '#FFFFFF' : 'var(--slate-700)',
            boxShadow: activeTab === 'csv' ? '0 2px 6px rgba(67, 56, 202, 0.25)' : 'none'
          }}
        >
          <FileSpreadsheet size={16} />
          <span>Buat Akun Otomatis dari CSV</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('manual')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '8px',
            fontSize: '13.5px',
            fontWeight: 700,
            cursor: 'pointer',
            border: activeTab === 'manual' ? '1px solid var(--brand)' : '1px solid var(--border)',
            background: activeTab === 'manual' ? 'var(--brand)' : '#FFFFFF',
            color: activeTab === 'manual' ? '#FFFFFF' : 'var(--slate-700)'
          }}
        >
          <UserPlus size={16} />
          <span>Tambah Siswa Manual</span>
        </button>
      </div>

      {errorMsg && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderLeft: '4px solid #DC2626', color: '#991B1B', padding: '12px 16px', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={16} style={{ flexShrink: 0, color: '#DC2626' }} />
          <span style={{ fontWeight: 500 }}>{errorMsg}</span>
        </div>
      )}

      <SingleAccountPreviewCard
        createdStudent={createdStudent}
        onClose={() => setCreatedStudent(null)}
        onCopyCredentials={handleCopyCredentials}
        copiedManual={copiedManual}
        onSelectStudentDetail={onSelectStudentDetail}
      />

      <BatchResultPreviewCard
        batchResult={batchResult}
        onClose={() => setBatchResult(null)}
        onCopyAllBatchCredentials={handleCopyAllBatchCredentials}
        copiedBatch={copiedBatch}
        onExportBatchCredentialsCsv={() => exportBatchToCsv(batchResult)}
      />

      {activeTab === 'csv' && (
        <CsvBatchUploader
          csvDefaultClass={csvDefaultClass}
          setCsvDefaultClass={setCsvDefaultClass}
          onBatchSuccess={handleBatchSuccess}
        />
      )}

      {activeTab === 'manual' && (
        <ManualAccountForm
          formData={formData}
          onChange={handleChange}
          onAutoGenerateEmail={handleAutoGenerateEmail}
          onFetchServerPassword={fetchServerPassword}
          loadingPassword={loadingPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          onSubmit={handleSubmitManual}
          onReset={() => {
            setFormData({
              name: '',
              nisn: '',
              email: '',
              password: '',
              phone: '',
              parentPhone: '',
              className: 'XI IPA 2',
              gender: 'L',
              academicScore: 82,
              counselingStatus: 'Normal',
              triageLevel: 'HIJAU',
              riasecCode: 'I - S - A',
              careerTitle: 'Eksplorasi Karir Terbimbing',
              careerDesc: 'Program pendampingan akademik terpadu.',
              notes: ''
            });
            fetchServerPassword();
            setErrorMsg('');
          }}
          loading={loading}
        />
      )}

      <RecentCreatedAccountsTable
        recentAccounts={recentAccounts}
        onCopyCredentials={handleCopyCredentials}
        onSelectStudentDetail={onSelectStudentDetail}
      />
    </div>
  );
}
