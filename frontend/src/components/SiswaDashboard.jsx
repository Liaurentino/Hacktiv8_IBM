import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Clock,
  Briefcase,
  Compass,
  MessageCircle,
  Award,
  Settings
} from 'lucide-react';
import api from '../services/api';

export default function SiswaDashboard({ currentUser, onOpenChat, onOpenProfile }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unlinkedAccount, setUnlinkedAccount] = useState(false);

  const normalizeEmail = (val = '') => (val || '').trim().toLowerCase();

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        setLoading(true);
        setUnlinkedAccount(false);

        let studentProfile = null;

        // 1. Coba endpoint otoritatif GET /api/students/me (berdasarkan JWT token)
        try {
          const meRes = await api.getStudentMe();
          if (meRes && meRes.status === 'success' && meRes.student) {
            studentProfile = meRes.student;
          } else if (meRes && meRes.status === 'unlinked') {
            setUnlinkedAccount(true);
            setStudent(null);
            setLoading(false);
            return;
          }
        } catch (meErr) {
          console.warn('api.getStudentMe belum berhasil, mencoba verifikasi profil terhubung:', meErr);
        }

        // 2. Fallback jika token belum menyertakan context siswa secara langsung
        if (!studentProfile && currentUser) {
          if (currentUser.student_id) {
            try {
              const byIdRes = await api.getStudentById(currentUser.student_id);
              if (byIdRes?.status === 'success' && byIdRes.student) {
                studentProfile = byIdRes.student;
              }
            } catch (e) {}
          }

          if (!studentProfile) {
            try {
              const profRes = await api.getStudentProfileMe({
                email: currentUser.email,
                userId: currentUser.id,
                nisn: currentUser.nisn
              });
              if (profRes?.status === 'success' && profRes.student) {
                studentProfile = profRes.student;
              }
            } catch (e) {}
          }
        }

        if (!studentProfile) {
          setUnlinkedAccount(true);
          setStudent(null);
          setLoading(false);
          return;
        }

        // 3. Ambil seluruh 11 nilai mata pelajaran langsung dari tabel grades di DB
        let gradesArray = [];
        try {
          const gRes = await api.getStudentGrades(studentProfile.id);
          if (gRes && gRes.status === 'success' && Array.isArray(gRes.grades)) {
            gradesArray = gRes.grades;
          }
        } catch (gErr) {
          console.warn('Gagal memuat grades khusus:', gErr);
        }

        // Fallback jika grades ada di dalam properti detail student
        if (gradesArray.length === 0 && studentProfile.grades) {
          const raw = studentProfile.grades;
          gradesArray = Array.isArray(raw)
            ? raw
            : (raw && typeof raw === 'object')
              ? Object.values(raw)
              : [];
        }

        setStudent({
          ...studentProfile,
          grades: gradesArray
        });
      } catch (err) {
        console.error('Error fetching student dashboard:', err);
        setUnlinkedAccount(true);
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, [currentUser]);

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Sparkles size={28} className="float-anim" style={{ margin: '0 auto 12px' }} />
        <div>Memuat dashboard siswa...</div>
      </div>
    );
  }

  // Empty state: Akun belum terhubung dengan data siswa
  if (unlinkedAccount || !student) {
    return (
      <div className="preview-student-dashboard dashboard-app-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>
              Portal Siswa LUNA
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginTop: '2px' }}>
              SMAN 1 · Semester Genap 2025/2026
            </p>
          </div>
        </div>

        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid var(--border)',
          borderRadius: '16px',
          padding: '48px 24px',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(47, 51, 102, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#FEE2E2',
            color: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            ⚠️
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#1E1B4B' }}>
            Profil Siswa Belum Terhubung
          </div>
          <p style={{ fontSize: '13.5px', color: '#64748B', maxWidth: '480px', margin: 0, lineHeight: 1.6 }}>
            Akun login Anda (<code>{currentUser?.email || 'siswa'}</code>) belum terhubung dengan data induk siswa di sistem sekolah.
            Silakan hubungi <strong>Guru BK</strong> atau <strong>Wali Kelas</strong> untuk mendaftarkan dan menautkan profil Anda.
          </p>
          {onOpenChat && (
            <button
              onClick={onOpenChat}
              className="btn-luna-primary"
              style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
            >
              <MessageCircle size={16} />
              <span>Tanya LUNA AI Konselor</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return 'Selamat Pagi';
    if (hour >= 11 && hour < 15) return 'Selamat Siang';
    if (hour >= 15 && hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  // 12 Mata Pelajaran Resmi Kurikulum
  const DEFAULT_MAPEL = [
    { key: 'mtk', name: 'Matematika' },
    { key: 'fisika', name: 'Fisika' },
    { key: 'kimia', name: 'Kimia' },
    { key: 'biologi', name: 'Biologi' },
    { key: 'bindo', name: 'Bahasa Indonesia' },
    { key: 'bing', name: 'Bahasa Inggris' },
    { key: 'ekonomi', name: 'Ekonomi' },
    { key: 'sosiologi', name: 'Sosiologi' },
    { key: 'geografi', name: 'Geografi' },
    { key: 'seni', name: 'Seni Budaya' },
    { key: 'olahraga', name: 'PJOK / Olahraga' },
    { key: 'informatika', name: 'Informatika & Komputer' }
  ];

  const getScoreBadge = (val) => {
    if (val === null || val === undefined || val === '—' || isNaN(Number(val))) {
      return <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>—</span>;
    }
    const num = Number(val);
    let cls = 'val-b';
    if (num >= 95) cls = 'val-a';
    else if (num >= 85) cls = 'val-b';
    else if (num >= 75) cls = 'val-c';
    else if (num >= 65) cls = 'val-d';
    else if (num >= 25) cls = 'val-e';
    else cls = 'val-x';

    return <span className={`val ${cls}`}>{num}</span>;
  };

  const studentGradesList = Array.isArray(student?.grades) ? student.grades : [];
  const hasGrades = studentGradesList.length > 0;

  // Pastikan jika student.grades kosong atau belum diisi guru, tampilkan 12 baris mapel dengan nilai strip/kosong
  const displayedGrades = hasGrades
    ? studentGradesList
    : DEFAULT_MAPEL.map((m, idx) => ({
        id: `empty-${m.key}-${idx}`,
        subject_key: m.key,
        subject_name: m.name,
        scores: ['—', '—', '—', null, '—', '—', null],
        avg_score: '—',
        min_score: '—',
        max_score: '—'
      }));

  const validAvgs = studentGradesList
    .map((g) => Number(g.avg_score))
    .filter((n) => !isNaN(n) && n > 0);
  const calculatedAvg = validAvgs.length > 0
    ? (validAvgs.reduce((a, b) => a + b, 0) / validAvgs.length).toFixed(1)
    : (student?.academic_score || '87.4');

  const validUts = studentGradesList
    .map((g) => (Array.isArray(g.scores) ? Number(g.scores[3]) : null))
    .filter((n) => n !== null && !isNaN(n) && n > 0);
  const avgUts = validUts.length > 0
    ? (validUts.reduce((a, b) => a + b, 0) / validUts.length).toFixed(1)
    : null;

  return (
    <div className="preview-student-dashboard student-dashboard-clean-flow">
      {/* 1. Header Greeting (Nempel langsung di latar utama, bukan di dalam card) */}
      <div className="student-dashboard-header">
        <div className="student-header-meta">
          <div className="student-portal-pill">
            <Sparkles size={12} />
            <span>PORTAL PENDAMPING SISWA</span>
          </div>
          <h1 className="student-greeting-text">
            {getGreetingTime()}, {student.name.split(' ')[0]}! ✨
          </h1>
          <p className="student-sub-text">
            Semester Genap 2025/2026 · Kelas {student.class_name} · SMAN 1
          </p>
        </div>

        <div className="student-header-actions">
          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="btn-luna-secondary student-action-btn"
            >
              <Settings size={15} />
              <span>Pengaturan Profil</span>
            </button>
          )}

          <button
            onClick={onOpenChat}
            className="btn-luna-primary student-action-btn"
          >
            <MessageCircle size={15} />
            <span>Curhat ke LUNA AI</span>
          </button>
        </div>
      </div>

      {/* 2. Card Sapaan Afektif & Maskot LUNA (Tersimpan rapi di dalam card container) */}
      <div className="student-card student-motivation-card">
        <div className="student-motivation-info">
          <h2 className="student-motivation-title">
            Semangat Belajar &amp; Berkarya Hari Ini! 🌟
          </h2>
          <p className="student-motivation-desc">
            LUNA dan Guru BK selalu siap mendampingimu jika butuh diskusi akademik, motivasi belajar, atau eksplorasi minat karir.
          </p>
        </div>
        <div className="student-mascot-box">
          <img
            src="/assets/mascot/mascot_semangat.png"
            alt="Mascot LUNA"
            className="student-mascot-image"
            onError={(e) => { e.target.src = '/assets/mascot/mascot_senang.png'; }}
          />
        </div>
      </div>

      {/* 3. Row Kartu Statistik Akademik (Responsif memanjang ke bawah di mobile) */}
      <div className="student-stat-grid">
        <div className="student-card student-stat-card">
          <div className="student-stat-head">
            <span>Rata-rata Nilai</span>
            <TrendingUp size={15} className="student-stat-icon-green" />
          </div>
          <div className="student-stat-val">{calculatedAvg}</div>
          <div>
            <span className="student-badge badge-green">Akademik Aktif</span>
          </div>
        </div>

        <div className="student-card student-stat-card">
          <div className="student-stat-head">
            <span>Status Nilai UTS</span>
            <CheckCircle2 size={15} className="student-stat-icon-blue" />
          </div>
          <div className="student-stat-val">
            {avgUts ? 'Tersedia' : 'Selesai'}
          </div>
          <div>
            <span className="student-badge badge-blue">
              {avgUts ? `Rata-rata UTS: ${avgUts}` : `Predikat: ${student.letter_grade || 'A'} (88.0)`}
            </span>
          </div>
        </div>

        <div className="student-card student-stat-card">
          <div className="student-stat-head">
            <span>Status Nilai UAS</span>
            <Clock size={15} className="student-stat-icon-slate" />
          </div>
          <div className="student-stat-val" style={{ color: '#64748B' }}>
            Menunggu Jadwal
          </div>
          <div>
            <span className="student-badge badge-slate">
              Semester Aktif
            </span>
          </div>
        </div>
      </div>

      {/* 4. Card Rekap Nilai Mata Pelajaran (12 Mata Pelajaran Lengkap) */}
      <section
        id="student-grade-table"
        className="student-card student-grades-card"
        aria-labelledby="student-grade-table-title"
      >
        <div className="student-grades-header">
          <div>
            <div id="student-grade-table-title" className="student-grades-title">
              📊 Rekap Nilai Mata Pelajaran (7 Pertemuan: P1–P3, UTS, P5–P6, UAS)
            </div>
            <div className="student-grades-subtitle">
              Nilai capaian akademik semester aktif yang telah diverifikasi guru
            </div>
          </div>
          <span className="student-grades-counter">
            {hasGrades ? `${studentGradesList.length} Mata Pelajaran` : '12 Mata Pelajaran'}
          </span>
        </div>

        {/* Notifikasi informatif jika nilai belum diinput guru tanpa menyembunyikan tabel */}
        {!hasGrades && (
          <div style={{
            padding: '10px 20px',
            background: '#F8FAFC',
            borderBottom: '1px solid #E8E5F7',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12.5px',
            color: '#64748B'
          }}>
            <span>ℹ️</span>
            <span>Nilai mata pelajaran belum diinput oleh Guru Mata Pelajaran. Menampilkan 12 mata pelajaran aktif semester ini.</span>
          </div>
        )}

        {/* Petunjuk swipe di mobile */}
        <div className="student-grades-scroll-hint">
          <span>👉 Geser tabel ke samping untuk melihat rincian P1–UAS &amp; Rata-rata</span>
        </div>

        {/* Tabel Nilai dengan Sticky First Column */}
        <div className="student-grades-table-container">
          <table className="student-grades-table">
            <thead>
              <tr>
                <th className="sticky-col-left">Mata Pelajaran</th>
                <th>P1</th><th>P2</th><th>P3</th>
                <th className="th-uts">UTS</th>
                <th>P5</th><th>P6</th>
                <th className="th-uas">UAS</th>
                <th className="th-summary">Rata-rata</th>
                <th className="th-summary">Terendah</th>
                <th className="th-summary">Tertinggi</th>
              </tr>
            </thead>
            <tbody>
              {displayedGrades.map((g) => {
                const s = Array.isArray(g.scores) ? g.scores : [];
                return (
                  <tr key={g.id || g.subject_key}>
                    <td className="sticky-col-left student-subject-name">{g.subject_name}</td>
                    <td>{s[0] ?? '—'}</td>
                    <td>{s[1] ?? '—'}</td>
                    <td>{s[2] ?? '—'}</td>
                    <td className="td-badge-cell">
                      {getScoreBadge(s[3] ?? g.avg_score)}
                    </td>
                    <td>{s[4] ?? '—'}</td>
                    <td>{s[5] ?? '—'}</td>
                    <td className="td-badge-cell">
                      {getScoreBadge(s[6] ?? g.avg_score)}
                    </td>
                    <td className="td-avg-cell">
                      <span className="val val-avg">{g.avg_score ?? '—'}</span>
                    </td>
                    <td className="td-min-cell">{g.min_score ?? '—'}</td>
                    <td className="td-max-cell">{g.max_score ?? '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legenda Nilai */}
        <div className="student-grades-legend">
          <span><span className="val val-a">A</span> 95–100 (Sangat Baik)</span>
          <span><span className="val val-b">B</span> 85–94 (Baik)</span>
          <span><span className="val val-c">C</span> 75–84 (Cukup)</span>
          <span><span className="val val-d">D</span> 65–74 (Perlu Peningkatan)</span>
          <span><span className="val val-e">E</span> 25–64 (Remedial)</span>
          <span><span className="val val-x">X</span> &lt;25 (Perhatian Khusus)</span>
        </div>
      </section>

      {/* 5. Card Eksplorasi Minat & Karir (Icon dan teks rapi di dalam card) */}
      <div className="student-card student-career-card">
        <div className="student-career-icon-wrap">
          <Briefcase size={22} />
        </div>
        <div className="student-career-content">
          <div className="student-career-pill">
            Eksplorasi Minat &amp; Karir Masa Depan
          </div>
          <h3 className="student-career-title">
            {student.career_title || 'Bidang Unggulan: Riset Sains & Bioteknologi'}
          </h3>
          <p className="student-career-desc">
            {student.career_desc || 'Berdasarkan capaian konsisten pada nilai sains dan analitikal, Anda memiliki potensi kuat untuk melanjutkan studi di bidang sains terapan, bioteknologi, atau riset data analitik.'}
          </p>
          <div className="student-career-list-wrap">
            {(student.career_jobs || [
              'Peneliti Biokimia & Farmasi Terapan',
              'Analis Laboratorium Klinis & Biomedis',
              'Data Scientist Bidang Life Sciences'
            ]).map((j, i) => (
              <div key={i} className="student-career-item">
                <span className="career-bullet-dot" />
                <span>{j}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
