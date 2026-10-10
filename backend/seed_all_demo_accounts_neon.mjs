import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error('❌ ERROR: DATABASE_URL tidak ditemukan di file .env.');
  console.error('Silakan set DATABASE_URL=postgresql://... di file .env Anda.');
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const DEFAULT_PASSWORD = 'password123';
const salt = bcrypt.genSaltSync(10);
const passwordHash = bcrypt.hashSync(DEFAULT_PASSWORD, salt);

// 12 Mata Pelajaran Kurikulum LUNA
const MAPEL_LIST = [
  { key: 'mtk', name: 'Matematika' },
  { key: 'biologi', name: 'Biologi' },
  { key: 'kimia', name: 'Kimia' },
  { key: 'bindo', name: 'Bahasa Indonesia' },
  { key: 'bing', name: 'Bahasa Inggris' },
  { key: 'ekonomi', name: 'Ekonomi' },
  { key: 'sosiologi', name: 'Sosiologi' },
  { key: 'geografi', name: 'Geografi' },
  { key: 'seni', name: 'Seni Budaya' },
  { key: 'olahraga', name: 'PJOK / Olahraga' },
  { key: 'informatika', name: 'Informatika & Komputer' }
];

function calculateGrade(val) {
  if (val >= 95) return 'A';
  if (val >= 85) return 'B';
  if (val >= 75) return 'C';
  if (val >= 65) return 'D';
  if (val >= 25) return 'E';
  return 'X';
}

const DEMO_TEACHERS = [
  {
    name: 'Bu Ratna Dewi, M.Pd (Guru BK Demo)',
    email: 'gurubk@sekolah.sch.id',
    role: 'guru_bk',
    avatar: 'BK',
    subjectKey: null,
    subjectName: null
  },
  {
    name: 'Pak Budi Hartono, S.Pd (Guru Matematika Demo)',
    email: 'guru@sekolah.sch.id',
    role: 'guru_mapel',
    avatar: 'GD',
    subjectKey: 'mtk',
    subjectName: 'Matematika'
  },
  {
    name: 'Pak Ahmad Fauzi, S.Si (Guru Biologi Demo)',
    email: 'biologi@sekolah.sch.id',
    role: 'guru_mapel',
    avatar: 'AF',
    subjectKey: 'biologi',
    subjectName: 'Biologi'
  }
];

const DEMO_STUDENTS = [
  {
    nisn: '20240042',
    name: 'Priya Ramadhani',
    email: 'priya@siswa.sch.id',
    className: 'XI IPA 2',
    gender: 'P',
    score: 89.5,
    counselingStatus: 'Normal',
    triageLevel: 'HIJAU',
    careerTitle: 'Bidang Unggulan: Riset Sains & Bioteknologi',
    notes: 'Siswa berprestasi tinggi dalam riset sains dan matematika terapan.'
  },
  {
    nisn: '20249999',
    name: 'Budi Siswa Demo',
    email: 'siswa@siswa.sch.id',
    className: 'XI IPA 2',
    gender: 'L',
    score: 88.0,
    counselingStatus: 'Normal',
    triageLevel: 'HIJAU',
    careerTitle: 'Bidang Unggulan: Rekayasa Komputer & Kecerdasan Buatan (AI)',
    notes: 'Siswa aktif di lab komputer dan teknologi.'
  },
  {
    nisn: '20240023',
    name: 'Budi Santoso',
    email: 'budi.santoso@siswa.sch.id',
    className: 'XI IPA 2',
    gender: 'L',
    score: 72.5,
    counselingStatus: 'Dalam Bimbingan',
    triageLevel: 'KUNING',
    careerTitle: 'Eksplorasi Minat: Desain Grafis & Multimedia',
    notes: 'Menunjukkan penurunan konsentrasi saat UTS, memerlukan motivasi belajar.'
  },
  {
    nisn: '20240019',
    name: 'Farhan Maulana',
    email: 'farhan@siswa.sch.id',
    className: 'XI IPA 2',
    gender: 'L',
    score: 68.0,
    counselingStatus: 'Perlu Perhatian',
    triageLevel: 'MERAH',
    careerTitle: 'Eksplorasi Minat: Vokasi Teknik Otomotif & Mesin',
    notes: 'Beban belajar tinggi, perlu bimbingan afektif dan dialog konseling BK.'
  },
  {
    nisn: '20240089',
    name: 'Dimas Anggara',
    email: 'dimas@siswa.sch.id',
    className: 'XI IPA 2',
    gender: 'L',
    score: 83.2,
    counselingStatus: 'Normal',
    triageLevel: 'HIJAU',
    careerTitle: 'Bidang Unggulan: Manajemen Bisnis & Ekonomi Digital',
    notes: 'Tertarik di bidang kewirausahaan dan analisis data.'
  },
  {
    nisn: '20240061',
    name: 'Clara Shinta',
    email: 'clara@siswa.sch.id',
    className: 'XI IPA 2',
    gender: 'P',
    score: 94.8,
    counselingStatus: 'Normal',
    triageLevel: 'HIJAU',
    careerTitle: 'Bidang Unggulan: Kedokteran & Bedah Molekuler',
    notes: 'Kandidat olimpiade biologi dan sains tingkat provinsi.'
  },
  {
    nisn: '20240078',
    name: 'Siti Nuraini',
    email: 'siti@siswa.sch.id',
    className: 'XI IPA 2',
    gender: 'P',
    score: 85.0,
    counselingStatus: 'Normal',
    triageLevel: 'HIJAU',
    careerTitle: 'Bidang Unggulan: Psikologi Terapan & Pendidikan',
    notes: 'Aktif dalam organisasi kesiswaan.'
  },
  {
    nisn: '20240034',
    name: 'Dewi Puspita',
    email: 'dewi@siswa.sch.id',
    className: 'XI IPA 2',
    gender: 'P',
    score: 80.5,
    counselingStatus: 'Normal',
    triageLevel: 'HIJAU',
    careerTitle: 'Eksplorasi Minat: Arsitektur & Perencanaan Tata Kota',
    notes: 'Menunjukkan kemampuan spasial dan visual yang unggul.'
  },
  {
    nisn: '20240056',
    name: 'Rian Hidayat',
    email: 'rian@siswa.sch.id',
    className: 'XI IPA 2',
    gender: 'L',
    score: 77.0,
    counselingStatus: 'Normal',
    triageLevel: 'HIJAU',
    careerTitle: 'Eksplorasi Minat: Ilmu Komunikasi & Media Kreatif',
    notes: 'Komunikatif dan percaya diri dalam presentasi.'
  },
  {
    nisn: '20240015',
    name: 'Andi Wirawan',
    email: 'andi@siswa.sch.id',
    className: 'XI IPA 2',
    gender: 'L',
    score: 79.0,
    counselingStatus: 'Normal',
    triageLevel: 'HIJAU',
    careerTitle: 'Eksplorasi Minat: Hukum & Kebijakan Publik',
    notes: 'Tertarik pada debat dan penalaran logis.'
  },
  {
    nisn: '20240011',
    name: 'Ahmad Fauzi',
    email: 'ahmad@siswa.sch.id',
    className: 'XI IPA 2',
    gender: 'L',
    score: 76.5,
    counselingStatus: 'Normal',
    triageLevel: 'HIJAU',
    careerTitle: 'Eksplorasi Minat: Teknik Lingkungan & Geologi',
    notes: 'Aktif di klub pecinta alam dan sains lingkungan.'
  },
  {
    nisn: '20240012',
    name: 'Siti Nurhaliza',
    email: 'nurhaliza@siswa.sch.id',
    className: 'XI IPA 2',
    gender: 'P',
    score: 86.4,
    counselingStatus: 'Normal',
    triageLevel: 'HIJAU',
    careerTitle: 'Bidang Unggulan: Sastra & Hubungan Internasional',
    notes: 'Kemampuan bahasa asing dan literasi yang sangat baik.'
  },
  {
    nisn: '20240014',
    name: 'Dewi Lestari',
    email: 'lestari@siswa.sch.id',
    className: 'XI IPA 2',
    gender: 'P',
    score: 80.0,
    counselingStatus: 'Normal',
    triageLevel: 'HIJAU',
    careerTitle: 'Eksplorasi Minat: Ilmu Gizi & Kesehatan Masyarakat',
    notes: 'Konsisten dan rapi dalam pengerjaan tugas.'
  },
  {
    nisn: '20240025',
    name: 'Eko Prasetyo',
    email: 'eko@siswa.sch.id',
    className: 'XI IPA 2',
    gender: 'L',
    score: 84.5,
    counselingStatus: 'Normal',
    triageLevel: 'HIJAU',
    careerTitle: 'Bidang Unggulan: Statistika Terapan & Aktuaria',
    notes: 'Kuat dalam pengolahan data dan matematika.'
  },
  {
    nisn: '20240016',
    name: 'Gita Gutawa',
    email: 'gita@siswa.sch.id',
    className: 'XI IPA 2',
    gender: 'P',
    score: 88.2,
    counselingStatus: 'Normal',
    triageLevel: 'HIJAU',
    careerTitle: 'Bidang Unggulan: Seni Musik & Desain Akustik',
    notes: 'Kreatif dan aktif dalam kegiatan seni budaya.'
  },
  {
    nisn: '20240018',
    name: 'Indah Permata',
    email: 'indah@siswa.sch.id',
    className: 'XI IPA 2',
    gender: 'P',
    score: 83.8,
    counselingStatus: 'Normal',
    triageLevel: 'HIJAU',
    careerTitle: 'Bidang Unggulan: Farmasi & Kimia Industri',
    notes: 'Teliti dalam praktikum kimia dan sains terapan.'
  }
];

async function seed() {
  console.log('=== SEEDING ALL DEMO ACCOUNTS TO NEON POSTGRESQL ===');
  try {
    const now = new Date().toISOString();

    // 1. Seed Teacher Accounts
    console.log('\n1. Seeding / Updating Teachers in Neon DB...');
    for (const t of DEMO_TEACHERS) {
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [t.email]);
      if (existing.rows.length === 0) {
        await pool.query(`
          INSERT INTO users (email, password_hash, name, role, avatar, provider, subject_key, subject_name, created_at)
          VALUES ($1, $2, $3, $4, $5, 'local', $6, $7, $8)
        `, [t.email, passwordHash, t.name, t.role, t.avatar, t.subjectKey, t.subjectName, now]);
        console.log(` + Created Teacher: ${t.name} (${t.email})`);
      } else {
        await pool.query(`
          UPDATE users
          SET password_hash = $1, name = $2, role = $3, subject_key = $4, subject_name = $5
          WHERE email = $6
        `, [passwordHash, t.name, t.role, t.subjectKey, t.subjectName, t.email]);
        console.log(` ✔ Updated Teacher: ${t.name} (${t.email})`);
      }
    }

    // 2. Seed Student Accounts & Linked Profiles
    console.log('\n2. Seeding / Updating Students in Neon DB...');
    for (const s of DEMO_STUDENTS) {
      // 2a. Ensure User Account exists
      let userId = null;
      const userRes = await pool.query('SELECT id FROM users WHERE email = $1', [s.email]);
      if (userRes.rows.length === 0) {
        const uIns = await pool.query(`
          INSERT INTO users (email, password_hash, name, role, avatar, provider, created_at)
          VALUES ($1, $2, $3, 'siswa', 'ST', 'local', $4)
          RETURNING id
        `, [s.email, passwordHash, s.name, now]);
        userId = uIns.rows[0].id;
        console.log(` + Created User: ${s.name} (${s.email})`);
      } else {
        userId = userRes.rows[0].id;
        await pool.query(`
          UPDATE users SET password_hash = $1, name = $2 WHERE id = $3
        `, [passwordHash, s.name, userId]);
      }

      // 2b. Ensure Student profile exists and linked to user_id
      let studentId = null;
      const stRes = await pool.query('SELECT id FROM students WHERE nisn = $1', [s.nisn]);
      if (stRes.rows.length === 0) {
        const letter = calculateGrade(s.score);
        const stIns = await pool.query(`
          INSERT INTO students (
            user_id, nisn, name, email, phone, class_name, gender, rank,
            academic_score, avg_grade, letter_grade, counseling_status, triage_level,
            riasec_code, career_title, career_tag, career_desc, career_jobs_json,
            attendance_trend, notes, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, '081234567890', $5, $6, 1,
            $7, $7, $8, $9, $10,
            'I - R - C', $11, 'Eksplorasi Karir', 'Rekomendasi peminatan berbasis analisis akademik LUNA AI.',
            '["Studi Lanjut Perguruan Tinggi", "Pengembangan Keahlian Spesifik"]',
            'Sangat Baik (100% Kehadiran)', $12, $13, $13
          ) RETURNING id
        `, [
          userId, s.nisn, s.name, s.email, s.className, s.gender,
          s.score, letter, s.counselingStatus, s.triageLevel,
          s.careerTitle, s.notes, now
        ]);
        studentId = stIns.rows[0].id;
        console.log(` + Created Student: ${s.name} (NISN: ${s.nisn}) [ID: ${studentId}]`);
      } else {
        studentId = stRes.rows[0].id;
        await pool.query(`
          UPDATE students
          SET user_id = $1, email = $2, name = $3, academic_score = $4, updated_at = $5
          WHERE id = $6
        `, [userId, s.email, s.name, s.score, now, studentId]);
        console.log(` ✔ Linked Student: ${s.name} (NISN: ${s.nisn}) -> User ID: ${userId}`);
      }

      // 2c. Ensure all 11 Subjects exist in grades table with atomic upsert
      for (const m of MAPEL_LIST) {
        // Sample standard scores
        const base = Math.max(70, Math.min(95, Math.round(s.score + (Math.random() * 6 - 3))));
        const p1 = base;
        const p2 = base + 1;
        const p3 = base - 1;
        const uts = base;
        const p5 = base + 2;
        const p6 = base;
        const uas = null; // belum UAS
        const cleanScores = [p1, p2, p3, uts, p5, p6, uas];
        const valid = cleanScores.filter(x => x !== null);
        const avg = +(valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1);
        const min = Math.min(...valid);
        const max = Math.max(...valid);
        const letter = calculateGrade(avg);

        await pool.query(`
          INSERT INTO grades (student_id, subject_key, subject_name, scores_json, avg_score, min_score, max_score, letter_grade)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (student_id, subject_key) DO UPDATE SET
            subject_name = EXCLUDED.subject_name
        `, [studentId, m.key, m.name, JSON.stringify(cleanScores), avg, min, max, letter]);
      }
    }

    console.log('\n=== SEEDING COMPLETED SUCCESSFULLY! ===');
    console.log('Semua akun guru dan murid demo telah aktif di Neon PostgreSQL dengan password: "password123".');
  } catch (err) {
    console.error('Seeding Error:', err.message);
  } finally {
    await pool.end();
  }
}

seed();
