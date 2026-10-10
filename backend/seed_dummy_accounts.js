import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const defaultPassword = 'password123';
const salt = bcrypt.genSaltSync(10);
const passwordHash = bcrypt.hashSync(defaultPassword, salt);
const now = new Date().toISOString();

// Dummy accounts configuration - Hanya 1 Akun Siswa & Akun Demo Guru
const DUMMY_USERS = [
  // 1. Guru Mata Pelajaran (Matematika & Biologi)
  {
    email: 'guru@sekolah.sch.id',
    name: 'Pak Budi Hartono, S.Pd (Guru Matematika Demo)',
    role: 'guru_mapel',
    avatar: 'GD'
  },
  {
    email: 'biologi@sekolah.sch.id',
    name: 'Pak Ahmad Fauzi, S.Si (Guru Biologi Demo)',
    role: 'guru_mapel',
    avatar: 'AF'
  },
  // 2. Guru BK (Konselor)
  {
    email: 'gurubk@sekolah.sch.id',
    name: 'Bu Ratna Dewi, M.Pd (Guru BK Demo)',
    role: 'guru_bk',
    avatar: 'BK'
  },
  // 3. Siswa (Hanya 1 Akun Siswa)
  {
    email: 'siswa@siswa.sch.id',
    name: 'Budi Siswa Demo',
    role: 'siswa',
    avatar: 'BS'
  }
];

const DUMMY_STUDENT = {
  nisn: '20249999',
  name: 'Budi Siswa Demo',
  email: 'siswa@siswa.sch.id',
  phone: '081299998888',
  className: 'XI IPA 2',
  gender: 'L',
  rank: 1,
  score: 88.5,
  letter: 'A',
  status: 'Normal',
  triage: 'HIJAU',
  riasec: 'I - R - C',
  careerTitle: 'Bidang Unggulan: Rekayasa Komputer & Kecerdasan Buatan (AI)',
  careerTag: 'Eksplorasi Karir — Budi Siswa Demo',
  careerDesc: 'Memiliki bakat menonjol di bidang analisis logis, pemrograman, pemecahan masalah algoritma, dan rekayasa data.',
  careerJobs: [
    'AI & Machine Learning Engineer',
    'Full-Stack Software Developer',
    'Data Scientist',
    'Robotics & Embedded Systems Specialist'
  ],
  attendanceTrend: 'Sangat Baik (100% Kehadiran)',
  notes: 'Siswa cerdas, aktif dalam klub coding sains sekolah. Memiliki ketertarikan tinggi pada pengembangan kecerdasan buatan (AI).'
};

const MAPEL_KEYS = ['mtk', 'biologi', 'kimia', 'bindo', 'bing', 'ekonomi', 'sosiologi', 'geografi', 'seni', 'olahraga', 'informatika'];
const MAPEL_NAMES = {
  mtk: 'Matematika', biologi: 'Biologi', kimia: 'Kimia',
  bindo: 'B. Indonesia', bing: 'B. Inggris', ekonomi: 'Ekonomi',
  sosiologi: 'Sosiologi', geografi: 'Geografi', seni: 'Seni Budaya',
  olahraga: 'Olahraga', informatika: 'Informatika'
};

function calculateGrade(val) {
  if (val >= 95) return 'A';
  if (val >= 85) return 'B';
  if (val >= 75) return 'C';
  if (val >= 65) return 'D';
  if (val >= 25) return 'E';
  return 'X';
}

async function seedPostgres() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL || (!DATABASE_URL.startsWith('postgres://') && !DATABASE_URL.startsWith('postgresql://'))) {
    console.log('Skipping Postgres (DATABASE_URL not set or not postgres)');
    return;
  }

  console.log('\n🚀 [PostgreSQL / Neon DB] Memulai pembuatan Akun Dummy...');
  const pool = new pg.Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // 1. Insert/Update Dummy Users
    for (const u of DUMMY_USERS) {
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [u.email]);
      if (existing.rows.length === 0) {
        await pool.query(
          `INSERT INTO users (email, password_hash, name, role, avatar, provider, created_at)
           VALUES ($1, $2, $3, $4, $5, 'local', $6)`,
          [u.email, passwordHash, u.name, u.role, u.avatar, now]
        );
        console.log(`  ✅ [Postgres] User dibuat: ${u.email} (${u.role})`);
      } else {
        await pool.query(
          `UPDATE users SET password_hash = $1, name = $2, role = $3, avatar = $4 WHERE email = $5`,
          [passwordHash, u.name, u.role, u.avatar, u.email]
        );
        console.log(`  🔄 [Postgres] User diperbarui: ${u.email} (${u.role})`);
      }
    }

    // 2. Link existing users with students by email
    await pool.query(`
      UPDATE students s
      SET user_id = u.id
      FROM users u
      WHERE LOWER(s.email) = LOWER(u.email) AND s.user_id IS NULL
    `);
    console.log('  🔗 [Postgres] Relasi students.user_id disinkronkan.');

    // 3. Insert or Update Dummy Student
    const siswaUserRes = await pool.query('SELECT id FROM users WHERE email = $1', ['siswa@siswa.sch.id']);
    const siswaUserId = siswaUserRes.rows[0]?.id || null;

    const existingStudent = await pool.query('SELECT id FROM students WHERE nisn = $1', [DUMMY_STUDENT.nisn]);
    let studentId;

    if (existingStudent.rows.length === 0) {
      const insertRes = await pool.query(`
        INSERT INTO students (
          user_id, nisn, name, email, phone, class_name, gender, rank,
          academic_score, avg_grade, letter_grade, counseling_status, triage_level,
          riasec_code, career_title, career_tag, career_desc, career_jobs_json,
          attendance_trend, notes, created_at, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
        RETURNING id
      `, [
        siswaUserId,
        DUMMY_STUDENT.nisn,
        DUMMY_STUDENT.name,
        DUMMY_STUDENT.email,
        DUMMY_STUDENT.phone,
        DUMMY_STUDENT.className,
        DUMMY_STUDENT.gender,
        DUMMY_STUDENT.rank,
        DUMMY_STUDENT.score,
        DUMMY_STUDENT.score,
        DUMMY_STUDENT.letter,
        DUMMY_STUDENT.status,
        DUMMY_STUDENT.triage,
        DUMMY_STUDENT.riasec,
        DUMMY_STUDENT.careerTitle,
        DUMMY_STUDENT.careerTag,
        DUMMY_STUDENT.careerDesc,
        JSON.stringify(DUMMY_STUDENT.careerJobs),
        DUMMY_STUDENT.attendanceTrend,
        DUMMY_STUDENT.notes,
        now, now
      ]);
      studentId = insertRes.rows[0].id;
      console.log(`  ✅ [Postgres] Profil Siswa dibuat: ${DUMMY_STUDENT.name} (NISN: ${DUMMY_STUDENT.nisn}, ID: ${studentId})`);
    } else {
      studentId = existingStudent.rows[0].id;
      await pool.query(`
        UPDATE students SET
          user_id = $1, name = $2, email = $3, phone = $4, class_name = $5,
          gender = $6, rank = $7, academic_score = $8, avg_grade = $9, letter_grade = $10,
          counseling_status = $11, triage_level = $12, riasec_code = $13,
          career_title = $14, career_tag = $15, career_desc = $16,
          career_jobs_json = $17, attendance_trend = $18, notes = $19, updated_at = $20
        WHERE id = $21
      `, [
        siswaUserId,
        DUMMY_STUDENT.name,
        DUMMY_STUDENT.email,
        DUMMY_STUDENT.phone,
        DUMMY_STUDENT.className,
        DUMMY_STUDENT.gender,
        DUMMY_STUDENT.rank,
        DUMMY_STUDENT.score,
        DUMMY_STUDENT.score,
        DUMMY_STUDENT.letter,
        DUMMY_STUDENT.status,
        DUMMY_STUDENT.triage,
        DUMMY_STUDENT.riasec,
        DUMMY_STUDENT.careerTitle,
        DUMMY_STUDENT.careerTag,
        DUMMY_STUDENT.careerDesc,
        JSON.stringify(DUMMY_STUDENT.careerJobs),
        DUMMY_STUDENT.attendanceTrend,
        DUMMY_STUDENT.notes,
        now,
        studentId
      ]);
      console.log(`  🔄 [Postgres] Profil Siswa diperbarui: ${DUMMY_STUDENT.name} (NISN: ${DUMMY_STUDENT.nisn}, ID: ${studentId})`);
    }

    // 4. Insert Grades for Dummy Student
    await pool.query('DELETE FROM grades WHERE student_id = $1', [studentId]);
    for (const key of MAPEL_KEYS) {
      // High, realistic score distribution (82 - 94)
      const baseMapelScore = ['mtk', 'biologi', 'bing'].includes(key) ? 91 : 86;
      const scores = Array.from({ length: 7 }, () => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(78, Math.min(98, baseMapelScore + delta));
      });
      const avg = +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
      const min = Math.min(...scores);
      const max = Math.max(...scores);
      const subGrade = calculateGrade(avg);

      await pool.query(`
        INSERT INTO grades (student_id, subject_key, subject_name, scores_json, avg_score, min_score, max_score, letter_grade)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [studentId, key, MAPEL_NAMES[key], JSON.stringify(scores), avg, min, max, subGrade]);
    }
    console.log(`  📊 [Postgres] 11 Mata Pelajaran (7 Pertemuan) untuk siswa dummy berhasil diisi.`);

    // 5. Initial chat history in chat_messages
    const existingChat = await pool.query('SELECT COUNT(*) as count FROM chat_messages WHERE student_id = $1', [studentId]);
    if (parseInt(existingChat.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO chat_messages (student_id, sender, message, emotion, timestamp)
        VALUES 
        ($1, 'ai', 'Halo Budi! 👋 Selamat datang di LUNA, asisten bimbingan konseling cerdasmu. Nilai matematika dan sains kamu sangat luar biasa! Ada rencana jurusan kuliah atau eksplorasi karir yang ingin kamu diskusikan?', 'senang', $2),
        ($1, 'user', 'Halo Bu LUNA, terima kasih! Saya tertarik mendalami bidang Artificial Intelligence dan Software Engineering, bagaimana peluang SNBP saya?', 'senang', $2),
        ($1, 'ai', 'Peluangmu sangat prospektif, Budi! Dengan rata-rata nilai akademik 88.5 dan konsistensi di P1–P14, kamu berada di peringkat 5 teratas kelas XI IPA 2. Terus pertahankan ritme belajarmu ya! ✨', 'bangga', $2)
      `, [studentId, now]);
      console.log(`  💬 [Postgres] Riwayat percakapan konsultasi konseling LUNA AI ditambahkan.`);
    }

    // 5. Purge all other dummy data in Postgres
    await pool.query('DELETE FROM students WHERE nisn != $1', [DUMMY_STUDENT.nisn]);
    await pool.query("DELETE FROM users WHERE role = 'siswa' AND email != $1", [DUMMY_STUDENT.email]);
    await pool.query("DELETE FROM users WHERE email NOT IN ('guru@sekolah.sch.id', 'biologi@sekolah.sch.id', 'gurubk@sekolah.sch.id', 'siswa@siswa.sch.id')");
    await pool.query('DELETE FROM grades WHERE student_id != $1', [studentId]);
    await pool.query('DELETE FROM counseling_flags WHERE student_id != $1', [studentId]);
    await pool.query('DELETE FROM chat_messages WHERE student_id != $1', [studentId]);
    await pool.query("UPDATE users SET subject_key = 'mtk', subject_name = 'Matematika' WHERE email = 'guru@sekolah.sch.id'");
    await pool.query("UPDATE users SET subject_key = 'biologi', subject_name = 'Biologi' WHERE email = 'biologi@sekolah.sch.id'");
    console.log(`  🧹 [Postgres] Pembersihan tuntas: hanya 1 akun siswa & akun demo utama dipertahankan.`);

    console.log('✅ [Postgres] Selesai menyetel semua akun dummy!');
  } finally {
    await pool.end();
  }
}

function seedSqlite() {
  console.log('\n📁 [Local SQLite] Memulai pembuatan Akun Dummy...');
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const dbPath = path.join(dataDir, 'bk_luna.db');
  const sqliteDb = new DatabaseSync(dbPath);
  sqliteDb.exec('PRAGMA foreign_keys = ON;');

  try {
    // 1. Insert/Update Dummy Users
    for (const u of DUMMY_USERS) {
      const existing = sqliteDb.prepare('SELECT id FROM users WHERE email = ?').get(u.email);
      if (!existing) {
        sqliteDb.prepare(`
          INSERT INTO users (email, password_hash, name, role, avatar, provider, created_at)
          VALUES (?, ?, ?, ?, ?, 'local', ?)
        `).run(u.email, passwordHash, u.name, u.role, u.avatar, now);
        console.log(`  ✅ [SQLite] User dibuat: ${u.email} (${u.role})`);
      } else {
        sqliteDb.prepare(`
          UPDATE users SET password_hash = ?, name = ?, role = ?, avatar = ? WHERE email = ?
        `).run(passwordHash, u.name, u.role, u.avatar, u.email);
        console.log(`  🔄 [SQLite] User diperbarui: ${u.email} (${u.role})`);
      }
    }

    // 2. Link existing users with students
    sqliteDb.exec(`
      UPDATE students
      SET user_id = (SELECT id FROM users WHERE LOWER(users.email) = LOWER(students.email))
      WHERE user_id IS NULL AND EXISTS (SELECT 1 FROM users WHERE LOWER(users.email) = LOWER(students.email));
    `);
    console.log('  🔗 [SQLite] Relasi students.user_id disinkronkan.');

    // 3. Insert or Update Dummy Student
    const siswaUser = sqliteDb.prepare('SELECT id FROM users WHERE email = ?').get('siswa@siswa.sch.id');
    const siswaUserId = siswaUser ? siswaUser.id : null;

    const existingStudent = sqliteDb.prepare('SELECT id FROM students WHERE nisn = ?').get(DUMMY_STUDENT.nisn);
    let studentId;

    if (!existingStudent) {
      const stmt = sqliteDb.prepare(`
        INSERT INTO students (
          user_id, nisn, name, email, phone, class_name, gender, rank,
          academic_score, avg_grade, letter_grade, counseling_status, triage_level,
          riasec_code, career_title, career_tag, career_desc, career_jobs_json,
          attendance_trend, notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const res = stmt.run(
        siswaUserId,
        DUMMY_STUDENT.nisn,
        DUMMY_STUDENT.name,
        DUMMY_STUDENT.email,
        DUMMY_STUDENT.phone,
        DUMMY_STUDENT.className,
        DUMMY_STUDENT.gender,
        DUMMY_STUDENT.rank,
        DUMMY_STUDENT.score,
        DUMMY_STUDENT.score,
        DUMMY_STUDENT.letter,
        DUMMY_STUDENT.status,
        DUMMY_STUDENT.triage,
        DUMMY_STUDENT.riasec,
        DUMMY_STUDENT.careerTitle,
        DUMMY_STUDENT.careerTag,
        DUMMY_STUDENT.careerDesc,
        JSON.stringify(DUMMY_STUDENT.careerJobs),
        DUMMY_STUDENT.attendanceTrend,
        DUMMY_STUDENT.notes,
        now, now
      );
      studentId = res.lastInsertRowid;
      console.log(`  ✅ [SQLite] Profil Siswa dibuat: ${DUMMY_STUDENT.name} (NISN: ${DUMMY_STUDENT.nisn}, ID: ${studentId})`);
    } else {
      studentId = existingStudent.id;
      sqliteDb.prepare(`
        UPDATE students SET
          user_id = ?, name = ?, email = ?, phone = ?, class_name = ?,
          gender = ?, rank = ?, academic_score = ?, avg_grade = ?, letter_grade = ?,
          counseling_status = ?, triage_level = ?, riasec_code = ?,
          career_title = ?, career_tag = ?, career_desc = ?,
          career_jobs_json = ?, attendance_trend = ?, notes = ?, updated_at = ?
        WHERE id = ?
      `).run(
        siswaUserId,
        DUMMY_STUDENT.name,
        DUMMY_STUDENT.email,
        DUMMY_STUDENT.phone,
        DUMMY_STUDENT.className,
        DUMMY_STUDENT.gender,
        DUMMY_STUDENT.rank,
        DUMMY_STUDENT.score,
        DUMMY_STUDENT.score,
        DUMMY_STUDENT.letter,
        DUMMY_STUDENT.status,
        DUMMY_STUDENT.triage,
        DUMMY_STUDENT.riasec,
        DUMMY_STUDENT.careerTitle,
        DUMMY_STUDENT.careerTag,
        DUMMY_STUDENT.careerDesc,
        JSON.stringify(DUMMY_STUDENT.careerJobs),
        DUMMY_STUDENT.attendanceTrend,
        DUMMY_STUDENT.notes,
        now,
        studentId
      );
      console.log(`  🔄 [SQLite] Profil Siswa diperbarui: ${DUMMY_STUDENT.name} (NISN: ${DUMMY_STUDENT.nisn}, ID: ${studentId})`);
    }

    // 4. Grades
    sqliteDb.prepare('DELETE FROM grades WHERE student_id = ?').run(studentId);
    const insertGrade = sqliteDb.prepare(`
      INSERT INTO grades (student_id, subject_key, subject_name, scores_json, avg_score, min_score, max_score, letter_grade)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const key of MAPEL_KEYS) {
      const baseMapelScore = ['mtk', 'biologi', 'bing'].includes(key) ? 91 : 86;
      const scores = Array.from({ length: 7 }, () => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(78, Math.min(98, baseMapelScore + delta));
      });
      const avg = +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
      const min = Math.min(...scores);
      const max = Math.max(...scores);
      const subGrade = calculateGrade(avg);

      insertGrade.run(studentId, key, MAPEL_NAMES[key], JSON.stringify(scores), avg, min, max, subGrade);
    }
    console.log(`  📊 [SQLite] 11 Mata Pelajaran (7 Pertemuan) untuk siswa dummy berhasil diisi.`);

    // 5. Purge all other dummy data (hanya sisakan 1 akun siswa)
    sqliteDb.prepare('DELETE FROM students WHERE nisn != ?').run(DUMMY_STUDENT.nisn);
    sqliteDb.prepare("DELETE FROM users WHERE role = 'siswa' AND email != ?").run(DUMMY_STUDENT.email);
    sqliteDb.prepare("DELETE FROM users WHERE email NOT IN ('guru@sekolah.sch.id', 'biologi@sekolah.sch.id', 'gurubk@sekolah.sch.id', 'siswa@siswa.sch.id')").run();
    sqliteDb.prepare('DELETE FROM grades WHERE student_id != ?').run(studentId);
    sqliteDb.prepare('DELETE FROM counseling_flags WHERE student_id != ?').run(studentId);
    sqliteDb.prepare('DELETE FROM chat_messages WHERE student_id != ?').run(studentId);
    sqliteDb.prepare("UPDATE users SET subject_key = 'mtk', subject_name = 'Matematika' WHERE email = 'guru@sekolah.sch.id'").run();
    sqliteDb.prepare("UPDATE users SET subject_key = 'biologi', subject_name = 'Biologi' WHERE email = 'biologi@sekolah.sch.id'").run();
    console.log(`  🧹 [SQLite] Pembersihan tuntas: hanya 1 akun siswa & akun demo utama dipertahankan.`);

    // 6. Initial chat history
    const existingChat = sqliteDb.prepare('SELECT COUNT(*) as count FROM chat_messages WHERE student_id = ?').get(studentId).count;
    if (existingChat === 0) {
      const insertChat = sqliteDb.prepare(`
        INSERT INTO chat_messages (student_id, sender, message, emotion, timestamp)
        VALUES (?, ?, ?, ?, ?)
      `);
      insertChat.run(studentId, 'ai', 'Halo Budi! 👋 Selamat datang di LUNA, asisten bimbingan konseling cerdasmu. Nilai matematika dan sains kamu sangat luar biasa! Ada rencana jurusan kuliah atau eksplorasi karir yang ingin kamu diskusikan?', 'senang', now);
      insertChat.run(studentId, 'user', 'Halo Bu LUNA, terima kasih! Saya tertarik mendalami bidang Artificial Intelligence dan Software Engineering, bagaimana peluang SNBP saya?', 'senang', now);
      insertChat.run(studentId, 'ai', 'Peluangmu sangat prospektif, Budi! Dengan rata-rata nilai akademik 88.5 dan konsistensi di P1–P14, kamu berada di peringkat 1 kelas XI IPA 2. Terus pertahankan ritme belajarmu ya! ✨', 'bangga', now);
      console.log(`  💬 [SQLite] Riwayat percakapan konsultasi konseling LUNA AI ditambahkan.`);
    }

    console.log('✅ [SQLite] Selesai menyetel database (1 akun siswa tunggal)!');
  } finally {
    sqliteDb.close();
  }
}

async function main() {
  console.log('====================================================');
  console.log('⚙️  PEMBUATAN AKUN DUMMY SISWA & GURU (LUNA)');
  console.log('====================================================');
  try {
    await seedPostgres();
  } catch (err) {
    console.error('❌ Error seeding Postgres:', err);
  }

  try {
    seedSqlite();
  } catch (err) {
    console.error('❌ Error seeding SQLite:', err);
  }

  console.log('\n====================================================');
  console.log('🎉 SEMUA AKUN DUMMY BERHASIL DIBUAT!');
  console.log('----------------------------------------------------');
  console.log('1. AKUN GURU (MATA PELAJARAN):');
  console.log('   • Email:    guru@sekolah.sch.id (atau guru.dummy@sekolah.sch.id)');
  console.log('   • Password: password123');
  console.log('   • Role:     guru');
  console.log('');
  console.log('2. AKUN GURU BK (KONSELOR):');
  console.log('   • Email:    gurubk@sekolah.sch.id (atau ratna@sekolah.sch.id)');
  console.log('   • Password: password123');
  console.log('   • Role:     guru_bk');
  console.log('');
  console.log('3. AKUN SISWA DUMMY:');
  console.log('   • Email:    siswa@siswa.sch.id (atau siswa.dummy@siswa.sch.id)');
  console.log('   • NISN:     20249999 (bisa login menggunakan NISN langsung)');
  console.log('   • Password: password123');
  console.log('   • Role:     siswa');
  console.log('====================================================\n');
}

main();
