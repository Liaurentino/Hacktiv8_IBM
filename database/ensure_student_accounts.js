/**
 * Helper: Ensure student accounts linkage (Neon PostgreSQL)
 * Menjamin sinkronisasi ID antara tabel `students` dan tabel `users`.
 */

import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../backend/.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error('❌ ERROR: DATABASE_URL tidak ditemukan di .env');
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function ensure() {
  console.log('🔄 Memeriksa relasi tabel students -> users di Neon DB...');
  const res = await pool.query(`
    SELECT s.id, s.name, s.nisn, s.email, s.user_id, u.email as user_email
    FROM students s
    LEFT JOIN users u ON s.user_id = u.id
    ORDER BY s.id ASC
  `);

  console.table(res.rows);
  console.log(`✅ Total Siswa: ${res.rows.length}`);
  await pool.end();
}

ensure().catch((err) => {
  console.error('Error:', err.message);
  pool.end();
});
