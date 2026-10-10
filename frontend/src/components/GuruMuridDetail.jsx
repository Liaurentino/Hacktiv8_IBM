import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import MuridScoresTable from './guru/detail/MuridScoresTable';
import MuridCareerBox from './guru/detail/MuridCareerBox';
import PageHeader from './common/PageHeader';

export default function GuruMuridDetail({ studentId, onBack, onOpenFlagSystem }) {
  const { currentUser } = useAuth();
  const isGuruMapel = currentUser?.role === 'guru_mapel' || currentUser?.role === 'guru';

  const [studentDetail, setStudentDetail] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStudents().then((res) => {
      if (res.status === 'success') {
        setAllStudents(res.students || []);
      }
    });
  }, []);

  const fetchDetail = async (id) => {
    setLoading(true);
    try {
      const res = await api.getStudentById(id);
      if (res.status === 'success') {
        setStudentDetail(res.student);
      }
    } catch (err) {
      console.error('Gagal mengambil detail siswa:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchDetail(studentId);
    }
  }, [studentId]);

  if (loading || !studentDetail) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Sparkles size={28} className="float-anim" style={{ margin: '0 auto 12px' }} />
        <div>Memuat profil akademik siswa...</div>
      </div>
    );
  }

  // Filter grades for Guru Mapel so they ONLY see their own subject
  const displayedGrades = isGuruMapel
    ? (studentDetail.grades || []).filter((g) => g.subject_key === currentUser?.subject_key)
    : (studentDetail.grades || []);

  const displayedStudentDetail = {
    ...studentDetail,
    grades: displayedGrades
  };

  // Calculate highest & lowest scores
  let allScores = [];
  if (displayedGrades.length > 0) {
    displayedGrades.forEach((g) => {
      if (Array.isArray(g.scores)) {
        allScores.push(...g.scores);
      }
    });
  }
  const minScore = allScores.length ? Math.min(...allScores) : 70;
  const maxScore = allScores.length ? Math.max(...allScores) : 98;

  const getScoreBadge = (val) => {
    let cls = 'val-b';
    if (val >= 95) cls = 'val-a';
    else if (val >= 85) cls = 'val-b';
    else if (val >= 75) cls = 'val-c';
    else if (val >= 65) cls = 'val-d';
    else if (val >= 25) cls = 'val-e';
    else cls = 'val-x';

    return <span className={`val ${cls}`}>{val}</span>;
  };

  return (
    <div className="preview-guru-student-detail page-standard-container">
      {/* Standardized Header */}
      <PageHeader
        icon={UserCheck}
        moduleTag={isGuruMapel ? "Portal Guru Mata Pelajaran • LUNA Education System" : "Portal Bimbingan Konseling • LUNA Education System"}
        title={`Profil & Evaluasi Terpadu: ${studentDetail.name}`}
        description="Tinjauan komprehensif capaian akademik per pertemuan (P1–P14), minat bakat RIASEC, serta catatan pendampingan afektif siswa."
        metadata={[
          { label: 'NISN', value: studentDetail.nisn },
          { label: 'Kelas', value: studentDetail.class_name },
          { label: 'Status Siswa', value: studentDetail.counseling_status || 'Normal' },
          { label: 'Periode', value: 'Semester Genap 2025/2026' }
        ]}
        actions={
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onBack}
              className="btn-luna-secondary"
              style={{ fontSize: '13px', padding: '8px 14px' }}
            >
              <ArrowLeft size={15} />
              <span>Kembali ke Daftar</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>Pilih Siswa:</span>
              <select
                value={studentDetail.id}
                onChange={(e) => fetchDetail(Number(e.target.value))}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13px',
                  background: '#FFFFFF',
                  color: '#1E293B',
                  fontWeight: 600
                }}
              >
                {allStudents.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.nisn})
                  </option>
                ))}
              </select>
            </div>
          </div>
        }
      />

      {/* Siswa Header Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #2F3366, #4338CA)',
          color: '#FFFFFF',
          padding: '24px',
          borderRadius: '14px',
          boxShadow: '0 10px 25px -5px rgba(47, 51, 102, 0.4)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: '#FFE7B8',
              color: '#2F3366',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 900,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            {studentDetail.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.01em' }}>
              {studentDetail.name}
            </div>
            <div style={{ fontSize: '13.5px', opacity: 0.85, marginTop: '3px' }}>
              {studentDetail.class_name} · NISN: {studentDetail.nisn} · Semester Genap 2025/2026
            </div>
            <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 700 }}>
                Rata-rata: {studentDetail.academic_score || '87.4'}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 700 }}>
                Peringkat: {studentDetail.rank || 1}
              </span>
              <span style={{ background: '#FFE7B8', color: '#2F3366', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 800 }}>
                Grade: {studentDetail.letter_grade || 'A'}
              </span>
              {!isGuruMapel && (
                <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
                  RIASEC: {studentDetail.riasec_code || 'I - S - A'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Flag Status Banner for this Student */}
      {studentDetail.flags && studentDetail.flags.length > 0 && (
        <div style={{
          background: studentDetail.flags[0].level === 'black' ? '#181926' : studentDetail.flags[0].level === 'critical' ? '#FEF2F2' : '#FFFBEB',
          border: `1.5px solid ${studentDetail.flags[0].level === 'black' ? '#0F172A' : studentDetail.flags[0].level === 'critical' ? '#FECACA' : '#FDE68A'}`,
          color: studentDetail.flags[0].level === 'black' ? '#FFFFFF' : studentDetail.flags[0].level === 'critical' ? '#991B1B' : '#92400E',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={24} style={{ color: studentDetail.flags[0].level === 'black' ? '#EF4444' : studentDetail.flags[0].level === 'critical' ? '#DC2626' : '#D97706' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '14px' }}>
                Flag Early Warning Terdeteksi: {studentDetail.flags[0].category} ({studentDetail.flags[0].level.toUpperCase()})
              </div>
              <div style={{ fontSize: '12.5px', marginTop: '2px', opacity: 0.9 }}>
                {studentDetail.flags[0].trigger}
              </div>
            </div>
          </div>
          {!isGuruMapel && (
            <button
              onClick={onOpenFlagSystem}
              style={{
                background: '#DC2626',
                color: '#FFF',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Buka Tindak Lanjut BK
            </button>
          )}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div className="stat-card">
          <div className="stat-label">Avg Keseluruhan</div>
          <div className="stat-value">{studentDetail.academic_score || '87.4'}</div>
          <div>
            <span className={`stat-badge badge-${(studentDetail.letter_grade || 'A').toLowerCase() === 'a' ? 'green' : 'blue'}`}>
              Grade {studentDetail.letter_grade || 'A'}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Nilai Tertinggi</div>
          <div className="stat-value" style={{ color: '#16A34A' }}>{maxScore}</div>
          <div className="stat-sub">{isGuruMapel ? (currentUser?.subject_name || 'Matematika') : 'B. Inggris / Kimia · Konsisten'}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Nilai Terendah</div>
          <div className="stat-value" style={{ color: minScore < 70 ? '#DC2626' : '#D97706' }}>
            {minScore}
          </div>
          <div className="stat-sub">Titik perhatian evaluasi belajar</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Tren Nilai Pertemuan</div>
          <div className="stat-value" style={{ color: 'var(--green)' }}>↑ Stabil Naik</div>
          <div className="stat-sub">+2.1 dari P1 → UAS</div>
        </div>
      </div>

      {/* Tabel Detail Nilai 7 Pertemuan */}
      <MuridScoresTable
        studentDetail={displayedStudentDetail}
        getScoreBadge={getScoreBadge}
      />

      {/* Career Exploration Card - RIASEC hanya untuk Guru BK */}
      {!isGuruMapel && <MuridCareerBox studentDetail={studentDetail} />}
    </div>
  );
}
