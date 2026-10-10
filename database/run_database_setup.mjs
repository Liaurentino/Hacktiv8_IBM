/**
 * ══════════════════════════════════════════════════════════════════════════
 * LUNA - UNIFIED DATABASE SETUP RUNNER (NEON POSTGRESQL)
 * ══════════════════════════════════════════════════════════════════════════
 * Jalankan script ini untuk:
 * 1. Memvalidasi koneksi ke serverless database Neon PostgreSQL
 * 2. Menerapkan skema tabel (schema.sql)
 * 3. Mengisi data awal (seeding) akun demo guru, guru BK, dan siswa
 * 
 * Penggunaan:
 * node run_database_setup.mjs
 * ══════════════════════════════════════════════════════════════════════════
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Coba load .env dari berbagai kemungkinan lokasi
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../backend/.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

console.log('\n============================================================');
console.log('🌙 LUNA PLATFORM — AUTOMATED NEON DATABASE SETUP & SEEDER');
console.log('============================================================\n');

if (!DATABASE_URL) {
  console.error('❌ GAGAL: Variabel DATABASE_URL tidak ditemukan!');
  console.error('Silakan buat file .env di folder backend/ atau database/ dengan isi:');
  console.error('DATABASE_URL=postgresql://neondb_owner:PASSWORD@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require\n');
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000
});

async function run() {
  const client = await pool.connect();
  try {
    console.log('📡 1. Menguji koneksi ke Neon PostgreSQL...');
    const testRes = await client.query('SELECT NOW() as current_time, current_database() as db_name;');
    console.log(`   ✅ Terhubung ke database: "${testRes.rows[0].db_name}" pada ${testRes.rows[0].current_time}`);

    console.log('\n📄 2. Menerapkan skema database (schema.sql)...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`File schema.sql tidak ditemukan di: ${schemaPath}`);
    }
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    console.log('   ✅ Skema tabel berhasil diverifikasi/dibuat:');
    console.log('      - users');
    console.log('      - students');
    console.log('      - grades');
    console.log('      - counseling_flags');
    console.log('      - chat_messages');

    client.release();

    console.log('\n🌱 3. Menjalankan data seeder lengkap...');
    // Jalankan seeder akun demo
    const { seedNeonDatabase } = await import('./seed_all_demo_accounts_neon.mjs');
    if (typeof seedNeonDatabase === 'function') {
      await seedNeonDatabase();
    } else {
      console.log('   ℹ️ Menjalankan module seeder via execution...');
    }

    console.log('\n🎉 DATABASE SETUP SELESAI DENGAN SUKSES!');
    console.log('============================================================');
    console.log('Kredensial Login Demo (Password semua akun: password123):');
    console.log('1. Guru BK:         gurubk@sekolah.sch.id');
    console.log('2. Guru Matematika: guru@sekolah.sch.id');
    console.log('3. Guru Biologi:    biologi@sekolah.sch.id');
    console.log('4. Siswa Alisha:    alisha@siswa.sch.id (NISN: 20240199)');
    console.log('5. Siswa Priya:     priya@siswa.sch.id  (NISN: 20240042)');
    console.log('6. Siswa Andi:      andi@siswa.sch.id   (NISN: 20240015)');
    console.log('============================================================\n');
  } catch (err) {
    console.error('\n❌ Terjadi kesalahan saat migrasi/setup database:', err.message);
    if (client) client.release();
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
