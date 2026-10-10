import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.join(__dirname, '../.env') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL || (!DATABASE_URL.startsWith('postgres://') && !DATABASE_URL.startsWith('postgresql://'))) {
  console.error('❌ FATAL: DATABASE_URL tidak ditemukan atau bukan PostgreSQL.');
  console.error('Aplikasi LUNA sekarang sepenuhnya menggunakan database cloud Neon PostgreSQL.');
  console.error('Pastikan file .env memuat DATABASE_URL yang valid.');
  process.exit(1);
}

console.log('🔗 Connecting to remote PostgreSQL database (Neon DB)...');
const pgPool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

// Handle idle client error to avoid crashing Node.js on serverless Neon disconnects
pgPool.on('error', (err) => {
  console.warn('⚠️ [pgPool] Connection reset or idle client disconnected (auto-recovered):', err.message);
});

export function calculateGrade(val) {
  if (val >= 95) return 'A';
  if (val >= 85) return 'B';
  if (val >= 75) return 'C';
  if (val >= 65) return 'D';
  if (val >= 25) return 'E';
  return 'X';
}

// 12 Mata Pelajaran Kurikulum Terpadu LUNA
export const MAPEL_LIST = [
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

export const MAPEL_MAP = Object.fromEntries(MAPEL_LIST.map(m => [m.key, m.name]));

async function initPostgres() {
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf-8');
    await pgPool.query(schemaSql);

    // Ensure subject_key and subject_name columns exist in users table
    await pgPool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS subject_key VARCHAR(50);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS subject_name VARCHAR(100);
    `);

    // Ensure unique constraint on grades(student_id, subject_key)
    await pgPool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'grades_student_subject_unique'
        ) THEN
          ALTER TABLE grades ADD CONSTRAINT grades_student_subject_unique UNIQUE (student_id, subject_key);
        END IF;
      END $$;
    `);

    console.log('✅ PostgreSQL on Neon DB is ready with 12 subjects & role segregation.');
  } catch (err) {
    console.error('PostgreSQL init error:', err.message);
  }
}

initPostgres();

const isPostgres = true;
const sqliteDb = null;

export { isPostgres, pgPool, sqliteDb };
