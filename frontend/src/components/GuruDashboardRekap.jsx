import React, { useState, useEffect } from 'react';
import { Search, School } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageHeader from './common/PageHeader';
import RekapTopPodium from './guru/RekapTopPodium';
import RekapSebaranChart from './guru/RekapSebaranChart';
import RekapCareerSection from './guru/RekapCareerSection';
import RekapStatCards from './guru/rekap/RekapStatCards';
import RekapMatrixTable from './guru/rekap/RekapMatrixTable';

export default function GuruDashboardRekap({ onSelectStudent, onOpenFlagSystem }) {
  const { currentUser } = useAuth();
  const isGuruMapel = currentUser?.role === 'guru_mapel' || currentUser?.role === 'guru';
  const defaultSubject = (isGuruMapel && currentUser?.subject_key) ? currentUser.subject_key : 'mtk';

  const [students, setStudents] = useState([]);
  const [flags, setFlags] = useState([]);
  const [selectedClass, setSelectedClass] = useState('XI IPA 2');
  const [viewMode, setViewMode] = useState(isGuruMapel ? 'meetings' : 'mapel'); // 'mapel' | 'meetings'
  const [selectedSubject, setSelectedSubject] = useState(defaultSubject);
  const [searchTerm, setSearchTerm] = useState('');

  const MAPEL_LIST = [
    { key: 'mtk', short: 'MTK', name: 'Matematika' },
    { key: 'biologi', short: 'BIO', name: 'Biologi' },
    { key: 'kimia', short: 'KIM', name: 'Kimia' },
    { key: 'informatika', short: 'INF', name: 'Informatika' },
    { key: 'bindo', short: 'IND', name: 'B. Indonesia' },
    { key: 'bing', short: 'ING', name: 'B. Inggris' },
    { key: 'ekonomi', short: 'EKO', name: 'Ekonomi' },
    { key: 'sosiologi', short: 'SOS', name: 'Sosiologi' },
    { key: 'geografi', short: 'GEO', name: 'Geografi' },
    { key: 'seni', short: 'SENI', name: 'Seni Budaya' },
    { key: 'olahraga', short: 'OR', name: 'Olahraga' }
  ];

  const MEETING_LABELS = [
    'P1', 'P2', 'P3', 'UTS', 'P5', 'P6', 'UAS'
  ];

  useEffect(() => {
    api.getStudents({ className: selectedClass, includeGrades: true })
      .then((res) => {
        if (res.status === 'success') {
          setStudents(res.students || []);
        }
      })
      .catch(() => {});

    api.getFlags()
      .then((res) => {
        if (res.status === 'success') setFlags(res.flags || []);
      })
      .catch(() => {});
  }, [selectedClass]);

  // Derived metrics
  const sortedStudents = [...students].sort((a, b) => (b.academic_score || 0) - (a.academic_score || 0));
  const topStudents = sortedStudents.slice(0, 3);
  const average = students.length
    ? (students.reduce((acc, s) => acc + Number(s.academic_score || 0), 0) / students.length).toFixed(1)
    : '88.5';
  const criticalCount = flags.filter((f) => ['black', 'critical'].includes(f.level)).length;
  const warningCount = flags.filter((f) => f.level === 'warning').length;
  const attentionCount = criticalCount + warningCount;
  const unggulCount = students.filter((s) => (s.academic_score || 0) >= 90).length;

  const filteredStudents = sortedStudents.filter((st) => {
    const q = searchTerm.toLowerCase();
    return !q || st.name.toLowerCase().includes(q) || (st.nisn && st.nisn.includes(q));
  });

  const getScoreBadgeClass = (score) => {
    const num = Number(score) || 0;
    if (num >= 90) return 'val-a';
    if (num >= 80) return 'val-b';
    if (num >= 70) return 'val-c';
    if (num >= 60) return 'val-d';
    if (num >= 25) return 'val-e';
    return 'val-x';
  };

  return (
    <div className="preview-guru-dashboard page-standard-container">
      {/* Page Header */}
      <PageHeader
        icon={School}
        moduleTag={isGuruMapel ? 'Portal Guru Mata Pelajaran • LUNA Education System' : 'Portal Bimbingan Konseling • LUNA Education System'}
        title={isGuruMapel ? `Rekap Capaian Kelas: ${selectedClass}` : `Dashboard Rekap Capaian Kelas: ${selectedClass}`}
        description="Monitoring komprehensif capaian belajar 14 pertemuan harian (P1–P14), UTS, dan 12 mata pelajaran resmi kurikulum sekolah."
        metadata={[
          { label: 'Periode', value: 'Semester Genap 2025/2026' },
          { label: 'Kelas Binaan', value: selectedClass },
          { label: 'Total Siswa', value: `${students.length} Siswa Terdaftar` }
        ]}
        actions={
          <>
            <select
              className="control-select-pill"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: '20px', border: '1.5px solid var(--border)', fontSize: '13px', fontWeight: 700, background: '#FFFFFF' }}
            >
              <option value="XI IPA 2">Kelas: XI IPA 2</option>
              <option value="XI IPA 1">Kelas: XI IPA 1</option>
              <option value="XI IPS 1">Kelas: XI IPS 1</option>
              <option value="X IPA 1">Kelas: X IPA 1</option>
            </select>

            <select
              className="control-select-pill"
              defaultValue="genap"
              style={{ padding: '8px 14px', borderRadius: '20px', border: '1.5px solid var(--border)', fontSize: '13px', fontWeight: 700, background: '#FFFFFF' }}
            >
              <option value="genap">Semester: Genap 2025/2026</option>
              <option value="ganjil">Semester: Ganjil 2024/2025</option>
            </select>
          </>
        }
      />

      {/* 4 Stat Cards */}
      <RekapStatCards
        studentsCount={students.length}
        average={average}
        attentionCount={attentionCount}
        criticalCount={criticalCount}
        warningCount={warningCount}
        unggulCount={unggulCount}
        onOpenFlagSystem={onOpenFlagSystem}
      />

      {/* Top 3 Podium & Early Warning Alerts */}
      <RekapTopPodium
        topStudents={topStudents}
        onSelectStudent={onSelectStudent}
        onOpenFlagSystem={onOpenFlagSystem}
        attentionCount={attentionCount}
        criticalCount={criticalCount}
        warningCount={warningCount}
      />

      {/* Sebaran Nilai Donut & Perbandingan Mapel */}
      <RekapSebaranChart students={students} isGuruMapel={isGuruMapel} currentUser={currentUser} />

      {/* Table Filter Controls */}
      <div className="card" style={{ padding: '14px 20px', borderRadius: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {!isGuruMapel ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tampilan:</span>
              <button
                type="button"
                onClick={() => setViewMode('mapel')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1.5px solid var(--border)',
                  background: viewMode === 'mapel' ? 'var(--primary)' : '#FFF',
                  color: viewMode === 'mapel' ? '#FFF' : 'var(--text)',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  cursor: 'pointer'
                }}
              >
                Rata-rata 11 Mapel
              </button>
              <button
                type="button"
                onClick={() => setViewMode('meetings')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1.5px solid var(--border)',
                  background: viewMode === 'meetings' ? 'var(--primary)' : '#FFF',
                  color: viewMode === 'meetings' ? '#FFF' : 'var(--text)',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  cursor: 'pointer'
                }}
              >
                7 Pertemuan (P1–P3, UTS, P5–P6, UAS)
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--primary)', background: '#EEF2FF', padding: '6px 14px', borderRadius: '20px', border: '1px solid #C7D2FE' }}>
                Matriks Nilai 7 Pertemuan • {currentUser?.subject_name || 'Matematika'}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {!isGuruMapel && viewMode === 'meetings' && (
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '10px', border: '1.5px solid var(--border)', fontSize: '13px', fontWeight: 700, background: '#FFF' }}
              >
                {MAPEL_LIST.map((m) => (
                  <option key={m.key} value={m.key}>Mapel: {m.name}</option>
                ))}
              </select>
            )}

            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
              <input
                type="search"
                placeholder="Cari nama atau NISN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '7px 12px 7px 30px', borderRadius: '10px', border: '1.5px solid var(--border)', fontSize: '12.5px', width: '190px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 15-Meeting / 11-Subject Matrix Table */}
      <RekapMatrixTable
        viewMode={viewMode}
        selectedSubject={selectedSubject}
        selectedClass={selectedClass}
        mapelList={MAPEL_LIST}
        meetingLabels={MEETING_LABELS}
        filteredStudents={filteredStudents}
        onSelectStudent={onSelectStudent}
        getScoreBadgeClass={getScoreBadgeClass}
        isGuruMapel={isGuruMapel}
      />

      {/* Holland RIASEC Career Guidance (Hanya untuk Guru BK) */}
      {!isGuruMapel && <RekapCareerSection />}
    </div>
  );
}
