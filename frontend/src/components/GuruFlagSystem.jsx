import React, { useState, useEffect } from 'react';
import { CheckCircle2, Flag } from 'lucide-react';
import api from '../services/api';
import PageHeader from './common/PageHeader';
import FlagMetrics from './guru/flags/FlagMetrics';
import FlagTable from './guru/flags/FlagTable';
import FlagScheduleModal from './guru/flags/FlagScheduleModal';
import FlagInterventionModal from './guru/flags/FlagInterventionModal';
import { useNotifications } from '../context/NotificationContext';

export default function GuruFlagSystem({ onOpenStudentDetail }) {
  const { showToast } = useNotifications();
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [successBanner, setSuccessBanner] = useState('');

  // Interactive Modals
  const [scheduleTarget, setScheduleTarget] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('2026-10-09');
  const [scheduleTime, setScheduleTime] = useState('09:30');
  const [scheduleLocation, setScheduleLocation] = useState('Ruang Konseling BK (Tatap Muka)');
  const [scheduleTopic, setScheduleTopic] = useState('');

  const [interventionTarget, setInterventionTarget] = useState(null);
  const [interventionType, setInterventionType] = useState('Konseling Individu 1-on-1');
  const [interventionNote, setInterventionNote] = useState('');
  const [interventionOutcome, setInterventionOutcome] = useState('in_progress');

  const fetchFlags = async () => {
    setLoading(true);
    try {
      const res = await api.getFlags();
      if (res.status === 'success') {
        setFlags(res.flags || []);
      }
    } catch (err) {
      console.error('Gagal mengambil data flag:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const handleUpdateStatus = async (flagId, newStatus, actionName) => {
    try {
      const res = await api.updateFlagStatus(flagId, newStatus, actionName, 'Ditindaklanjuti langsung oleh Guru BK.');
      if (res.status === 'success') {
        setSuccessBanner(`Flag ${flagId} berhasil diperbarui menjadi ${newStatus.toUpperCase()}`);
        showToast({
          type: 'success',
          title: 'Status Flag Diperbarui',
          message: `Flag ${flagId} (${actionName || newStatus}) berhasil diproses.`
        });
        setTimeout(() => setSuccessBanner(''), 3500);
        fetchFlags();
      }
    } catch (err) {
      alert('Gagal mengupdate flag: ' + err.message);
    }
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    if (!scheduleTarget) return;
    const actionDesc = `Sesi Konseling: ${scheduleLocation} (${scheduleDate} ${scheduleTime} WIB) - Topik: ${scheduleTopic || 'Evaluasi Belajar'}`;
    await handleUpdateStatus(scheduleTarget.id, 'in_progress', actionDesc);
    setScheduleTarget(null);
    setScheduleTopic('');
  };

  const handleSaveIntervention = async (e) => {
    e.preventDefault();
    if (!interventionTarget) return;
    const actionDesc = `${interventionType}: ${interventionNote}`;
    await handleUpdateStatus(interventionTarget.id, interventionOutcome, actionDesc);
    setInterventionTarget(null);
    setInterventionNote('');
  };

  // Filter flags
  const filteredFlags = flags.filter((f) => {
    const matchLevel = levelFilter === 'all' || f.level === levelFilter;
    const q = search.toLowerCase().trim();
    const matchSearch = !q ||
      f.student_name.toLowerCase().includes(q) ||
      f.nisn.includes(q) ||
      f.trigger.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q);

    return matchLevel && matchSearch;
  });

  const blackCount = flags.filter((f) => f.level === 'black').length;
  const criticalCount = flags.filter((f) => f.level === 'critical').length;
  const warningCount = flags.filter((f) => f.level === 'warning').length;
  const infoCount = flags.filter((f) => f.level === 'info').length;

  return (
    <div className="preview-guru-flags page-standard-container">
      {/* Page Header */}
      <PageHeader
        icon={Flag}
        moduleTag="Sistem Peringatan Dini • LUNA Education System"
        title="Pendampingan Siswa & Sistem Flag (Early Warning)"
        description={<>Pemantauan indikator risiko akademik, afektif, dan sosial siswa. Evaluasi dan keputusan intervensi konseling sepenuhnya berada pada wewenang Guru BK (<em>Human-in-the-Loop</em>).</>}
        metadata={[
          { label: 'Periode', value: 'Semester Genap 2025/2026' },
          { label: 'Kelas Binaan', value: 'XI IPA 2' },
          { label: 'Kategori Pemantauan', value: 'Akademik, Afektif, & Krisis' },
          { label: 'Protokol Etika', value: 'UU PDP No. 27/2022 Terlindungi' }
        ]}
      />

      {successBanner && (
        <div style={{
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          color: '#166534',
          padding: '12px 18px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Quick Metrics Counters */}
      <FlagMetrics
        levelFilter={levelFilter}
        setLevelFilter={setLevelFilter}
        blackCount={blackCount}
        criticalCount={criticalCount}
        warningCount={warningCount}
        infoCount={infoCount}
      />

      {/* Main Flag Management Card */}
      <FlagTable
        flags={flags}
        filteredFlags={filteredFlags}
        search={search}
        setSearch={setSearch}
        handleUpdateStatus={handleUpdateStatus}
        setScheduleTarget={setScheduleTarget}
        setScheduleTopic={setScheduleTopic}
        setInterventionTarget={setInterventionTarget}
        setInterventionNote={setInterventionNote}
      />

      {/* Modal 1: Jadwal Sesi Konseling BK */}
      <FlagScheduleModal
        scheduleTarget={scheduleTarget}
        onClose={() => setScheduleTarget(null)}
        handleSaveSchedule={handleSaveSchedule}
        scheduleDate={scheduleDate}
        setScheduleDate={setScheduleDate}
        scheduleTime={scheduleTime}
        setScheduleTime={setScheduleTime}
        scheduleLocation={scheduleLocation}
        setScheduleLocation={setScheduleLocation}
        scheduleTopic={scheduleTopic}
        setScheduleTopic={setScheduleTopic}
      />

      {/* Modal 2: Catat Hasil Intervensi BK */}
      <FlagInterventionModal
        interventionTarget={interventionTarget}
        onClose={() => setInterventionTarget(null)}
        handleSaveIntervention={handleSaveIntervention}
        interventionType={interventionType}
        setInterventionType={setInterventionType}
        interventionNote={interventionNote}
        setInterventionNote={setInterventionNote}
        interventionOutcome={interventionOutcome}
        setInterventionOutcome={setInterventionOutcome}
      />
    </div>
  );
}
