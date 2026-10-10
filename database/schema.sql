-- ══════════════════════════════════════════════════════════════
-- LUNA - SISTEM INFORMASI BIMBINGAN KONSELING & EARLY WARNING
-- SCHEMA FOR NEON DB / POSTGRESQL (CLOUD SERVERLESS)
-- ══════════════════════════════════════════════════════════════

-- 1. Tabel Users (Otentikasi Guru BK, Guru Mapel, dan Siswa)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'siswa', -- 'guru_bk', 'guru_mapel', 'siswa'
  avatar VARCHAR(100),
  provider VARCHAR(50) NOT NULL DEFAULT 'local', -- 'local', 'google'
  google_id VARCHAR(255),
  subject_key VARCHAR(50),
  subject_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Students (Master Data Profil Siswa & Asesmen Holistik)
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  nisn VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  class_name VARCHAR(100) NOT NULL DEFAULT 'XI IPA 2',
  gender VARCHAR(10) DEFAULT 'L',
  rank INTEGER DEFAULT 1,
  academic_score NUMERIC(5,2) DEFAULT 80.0,
  avg_grade NUMERIC(5,2) DEFAULT 80.0,
  letter_grade VARCHAR(5) DEFAULT 'B',
  counseling_status VARCHAR(100) DEFAULT 'Normal',
  triage_level VARCHAR(50) DEFAULT 'HIJAU',
  riasec_code VARCHAR(50) DEFAULT 'I - S - A',
  career_title VARCHAR(255) DEFAULT '',
  career_tag VARCHAR(255) DEFAULT '',
  career_desc TEXT DEFAULT '',
  career_jobs_json TEXT DEFAULT '[]',
  attendance_trend VARCHAR(100) DEFAULT 'Normal',
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Grades (Rekap Nilai 7 Pertemuan [P1-P3, UTS, P5-P6, UAS] Per Mata Pelajaran)
CREATE TABLE IF NOT EXISTS grades (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_key VARCHAR(50) NOT NULL,
  subject_name VARCHAR(100) NOT NULL,
  scores_json TEXT NOT NULL, -- Array JSON 7 nilai: [P1, P2, P3, UTS, P5, P6, UAS]
  avg_score NUMERIC(5,2) NOT NULL,
  min_score NUMERIC(5,2) NOT NULL,
  max_score NUMERIC(5,2) NOT NULL,
  letter_grade VARCHAR(5) NOT NULL,
  UNIQUE(student_id, subject_key)
);

-- 4. Tabel Counseling Flags (Sistem Deteksi Dini & Early Warning)
CREATE TABLE IF NOT EXISTS counseling_flags (
  id VARCHAR(50) PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  nisn VARCHAR(50) NOT NULL,
  level VARCHAR(50) NOT NULL, -- 'black', 'critical', 'warning', 'info'
  category VARCHAR(100) NOT NULL,
  trigger TEXT NOT NULL,
  source VARCHAR(150) NOT NULL,
  date VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'unhandled', -- 'unhandled', 'in_progress', 'resolved'
  history_json TEXT NOT NULL DEFAULT '[]'
);

-- 5. Tabel Chat Messages (Riwayat Curhat AI Konselor LUNA & Granite)
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  sender VARCHAR(20) NOT NULL, -- 'user', 'ai'
  message TEXT NOT NULL,
  emotion VARCHAR(50) DEFAULT 'senang',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
