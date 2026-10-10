# 📘 Panduan Setup & Integrasi Neon PostgreSQL — LUNA (*Lentera untuk Nilai dan Asa*)

Panduan ini disusun untuk memandu anggota tim atau developer baru dalam menyiapkan database cloud serverless **Neon PostgreSQL** dari awal, mengintegrasikannya dengan backend LUNA, dan menjalankan skrip inisialisasi tabel serta pengisian data demo (*seeding*).

---

## 1. Mengenal Arsitektur Database LUNA

LUNA menggunakan **Neon Serverless PostgreSQL** untuk menyimpan seluruh data master sekolah:
* **Tabel `users`**: Otentikasi guru mata pelajaran, konselor BK, dan siswa.
* **Tabel `students`**: Profil holistik siswa (NISN, kelas, skor akademik, status bimbingan, RIASEC).
* **Tabel `grades`**: Rekap nilai 15 pertemuan (`p1–p7`, `uts`, `p8–p14`) per mata pelajaran.
* **Tabel `counseling_flags`**: Sistem deteksi dini *early warning* krisis/kerentanan siswa.
* **Tabel `chat_messages`**: Riwayat interaksi curhat siswa dengan asisten konseling LUNA AI.

---

## 2. Langkah Cepat: Membuat Database di Neon (Gratis)

1. Buka situs [https://neon.tech](https://neon.tech) lalu klik **Sign Up** (bisa login dengan akun GitHub atau Google).
2. Di dashboard Neon, klik tombol **Create Project**.
3. Beri nama proyek, misalnya: `luna-school-db`.
4. Pilih region terdekat (misal: `AWS us-east-2` atau `ap-southeast-1` Singapura jika tersedia).
5. Klik **Create Project**. Neon akan langsung membuatkan database PostgreSQL dalam hitungan detik.
6. Pada halaman utama proyek Neon, cari bagian **Connection Details**.
7. Pilih dropdown **Connection String** dan pastikan opsi **Pooled connection** dicentang (menggunakan port `ep-...-pooler`).
8. Salin string koneksi tersebut. Formatnya menyerupai:
   ```text
   postgresql://neondb_owner:npg_xxxxxxxxx@ep-sample-b4onkhk7-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

---

## 3. Konfigurasi File Lingkungan (`.env`)

Buat atau sunting file `.env` di folder `backend/` (atau salin dari `.env.example`):

```bash
# Salin template env
cp backend/.env.example backend/.env
```

Isi file `backend/.env` dengan konfigurasi berikut:

```env
PORT=3001
JWT_SECRET=luna_bk_secret_jwt_key_2026
DATABASE_URL=postgresql://neondb_owner:PASSWORD_ANDA@ep-sample-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require
```

> ⚠️ **PENTING:** Ganti `PASSWORD_ANDA` dan host `ep-sample-pooler` sesuai dengan connection string dari dashboard Neon Anda. Pastikan selalu menyertakan parameter `?sslmode=require`.

---

## 4. Menjalankan Setup & Seeder Database (Satu Perintah)

Di folder `database/`, telah disediakan skrip otomatis `run_database_setup.mjs` yang akan:
1. Memvalidasi koneksi ke server Neon Anda.
2. Mengeksekusi `schema.sql` untuk membuat seluruh tabel dengan benar.
3. Menjalankan seeder `seed_all_demo_accounts_neon.mjs` untuk mengisi data akun demo guru, guru BK, dan siswa lengkap beserta nilai & status bimbingan.

Jalankan perintah berikut dari folder root project:

```bash
# Jalankan setup database otomatis
node database/run_database_setup.mjs
```

Atau jika Anda berada di dalam folder `database/`:
```bash
node run_database_setup.mjs
```

Output terminal yang sukses akan menampilkan:
```text
============================================================
🌙 LUNA PLATFORM — AUTOMATED NEON DATABASE SETUP & SEEDER
============================================================

📡 1. Menguji koneksi ke Neon PostgreSQL...
   ✅ Terhubung ke database: "neondb"
📄 2. Menerapkan skema database (schema.sql)...
   ✅ Skema tabel berhasil diverifikasi/dibuat
🌱 3. Menjalankan data seeder lengkap...
 + Created Teacher: Bu Ratna Dewi, M.Pd (Guru BK Demo)
 + Created Teacher: Pak Budi Hartono, S.Pd (Guru Matematika Demo)
 + Created Student: Priya Ramadhani (NISN: 20240042)
 ...
🎉 DATABASE SETUP SELESAI DENGAN SUKSES!
```

---

## 5. Daftar Akun Demo untuk Pengujian

Semua akun hasil seeding menggunakan password default: **`password123`**

| Peran (*Role*) | Email Login | Password | Keterangan & Mata Pelajaran |
|---|---|---|---|
| **Guru BK (Konselor)** | `gurubk@sekolah.sch.id` | `password123` | Portal Bimbingan Konseling, Triage Flags, Rekap Karir |
| **Guru Matematika** | `guru@sekolah.sch.id` | `password123` | Portal Guru Mata Pelajaran (Matematika) |
| **Guru Biologi** | `biologi@sekolah.sch.id` | `password123` | Portal Guru Mata Pelajaran (Biologi) |
| **Siswa 1** | `alisha@siswa.sch.id` | `password123` | Alisha Putri (NISN: `20240199`) |
| **Siswa 2** | `priya@siswa.sch.id` | `password123` | Priya Ramadhani (NISN: `20240042`) |
| **Siswa 3 (Demo Siswa)**| `siswa@siswa.sch.id` | `password123` | Budi Siswa Demo (NISN: `20249999`) |
| **Siswa 4 (Kasus Kuning)** | `budi.santoso@siswa.sch.id` | `password123` | Budi Santoso (NISN: `20240023`) |
| **Siswa 5 (Kasus Merah)** | `farhan@siswa.sch.id` | `password123` | Farhan Maulana (NISN: `20240019`) |

---

## 6. Struktur Skrip di Folder `database/`

* 📄 **`schema.sql`**: Definisi skema SQL PostgreSQL (DDL tabel `users`, `students`, `grades`, `counseling_flags`, `chat_messages`).
* 🚀 **`run_database_setup.mjs`**: Skrip runner utama (uji koneksi -> terapkan skema -> jalankan seeder).
* 🌱 **`seed_all_demo_accounts_neon.mjs`**: Skrip seeding komprehensif data guru, siswa, rekap nilai P1-P14, dan status bimbingan.
* 🔍 **`ensure_student_accounts.js`**: Skrip utilitas untuk memverifikasi relasi data profil siswa ke akun login.
* 🤖 **`langflow_bob_mcp.js`**: Engine integrasi Langflow AI Agent via MCP protocol (PII masking, RIASEC mapping, crisis keywords guardrail).
* 📊 **`dummy_nilai_mapel_sample.csv`**: Berkas contoh CSV nilai siswa format resmi LUNA.
* 📑 **`dummy_nilai_mapel_sample.xlsx`**: Berkas contoh Microsoft Excel `.xlsx` nilai siswa untuk pengujian fitur import guru.

---

## 7. Pemecahan Masalah (*Troubleshooting*)

1. **Error: `self-signed certificate in certificate chain` atau `SSL connection failed`**:
   * Pastikan konfigurasi pool PostgreSQL memiliki opsi `ssl: { rejectUnauthorized: false }`. File `backend/config/db.js` sudah menyertakan opsi ini secara default.
2. **Error: `Connection terminated unexpectedly` saat server idle**:
   * Database serverless Neon dapat mengalami mode tidur (*sleep*) setelah beberapa menit idle. LUNA telah menangani hal ini dengan *auto-reconnect event listener* pada pool koneksi di `backend/config/db.js`.
3. **Data Baru Tidak Muncul di Frontend**:
   * Pastikan backend Node Express aktif (`npm run backend` pada port 3001). Cek log terminal backend untuk memastikan tidak ada kesalahan query.
