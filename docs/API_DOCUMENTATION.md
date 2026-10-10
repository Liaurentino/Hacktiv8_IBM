# 📡 Dokumentasi REST API — LUNA (*Lentera untuk Nilai dan Asa*)

Dokumentasi resmi untuk seluruh endpoint backend REST API platform LUNA.

* **Base URL Pengembangan**: `http://localhost:3001/api`
* **Format Payload**: `application/json`
* **Otentikasi**: JSON Web Token (JWT) dikirim via Header HTTP:
  ```http
  Authorization: Bearer <token>
  ```

---

## 1. Otentikasi & Akun (`/api/auth`)

### 1.1 Login Pengguna
* **Endpoint**: `POST /api/auth/login`
* **Deskripsi**: Masuk ke sistem menggunakan email sekolah dan kata sandi.
* **Request Body**:
  ```json
  {
    "email": "gurubk@sekolah.sch.id",
    "password": "password123"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": {
      "id": 1,
      "email": "gurubk@sekolah.sch.id",
      "name": "Bu Ratna Dewi, M.Pd",
      "role": "guru_bk",
      "avatar": "BK",
      "subjectKey": null
    }
  }
  ```

### 1.2 Profil Pengguna Aktif
* **Endpoint**: `GET /api/auth/me`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**: Mengembalikan informasi sesi pengguna yang sedang login.

### 1.3 Ubah Profil & Avatar
* **Endpoint**: `PUT /api/auth/profile`
* **Headers**: `Authorization: Bearer <token>`
* **Request Body**: `{ "name": "...", "avatar": "..." }`

### 1.4 Ganti Kata Sandi
* **Endpoint**: `PUT /api/auth/change-password`
* **Headers**: `Authorization: Bearer <token>`
* **Request Body**: `{ "oldPassword": "...", "newPassword": "..." }`

---

## 2. Manajemen Siswa (`/api/students`)

### 2.1 Ambil Semua Data Siswa
* **Endpoint**: `GET /api/students`
* **Response (200 OK)**: Daftar siswa dengan skor rata-rata, tingkat triage, kode RIASEC, dan status konseling.

### 2.2 Profil Siswa Saya (Portal Siswa)
* **Endpoint**: `GET /api/students/me`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**: Data profil lengkap siswa pemilik akun yang sedang login.

### 2.3 Detail Siswa Berdasarkan ID
* **Endpoint**: `GET /api/students/:id`
* **Response (200 OK)**: Objek data detail siswa spesifik.

### 2.4 Tambah / Impor Siswa Massal
* **Endpoint**: `POST /api/students/batch`
* **Headers**: `Authorization: Bearer <token>`
* **Request Body**: Array objek data siswa baru untuk dimasukkan ke database.

---

## 3. Manajemen Nilai & Mata Pelajaran (`/api/grades`)

### 3.1 Daftar Semua Mata Pelajaran
* **Endpoint**: `GET /api/grades/subjects`
* **Response (200 OK)**: Daftar 12 mata pelajaran resmi kurikulum LUNA.

### 3.2 Rekap Nilai Siswa (Semua Mapel)
* **Endpoint**: `GET /api/grades/student/:studentId`
* **Response (200 OK)**: Rekap 15 nilai pertemuan (`p1–p7`, `uts`, `p8–p14`) untuk seluruh mata pelajaran siswa tersebut.

### 3.3 Nilai Kelas per Mata Pelajaran (Portal Guru Mapel)
* **Endpoint**: `GET /api/grades/subject/:subjectKey`
* **Contoh**: `GET /api/grades/subject/mtk`
* **Response (200 OK)**: Matriks nilai seluruh siswa kelas untuk mata pelajaran yang dipilih.

### 3.4 Perbarui Satu Baris Nilai Siswa
* **Endpoint**: `PUT /api/grades/:studentId/:subjectKey`
* **Request Body**:
  ```json
  {
    "scores": [85, 88, 90, 87, 86, 88, 90, 88, 86, 89, 90, 92, 88, 90, 92]
  }
  ```

### 3.5 Perbarui Nilai Kelas Massal (Hasil Impor Excel / Sheets)
* **Endpoint**: `POST /api/grades/batch/:subjectKey`
* **Request Body**:
  ```json
  {
    "updates": [
      {
        "studentId": 1,
        "nisn": "20240042",
        "scores": [88, 90, 85, 92, 87, 89, 91, 90, 88, 86, 89, 92, 90, 91, 94]
      }
    ]
  }
  ```

---

## 4. Sistem Deteksi Dini & Triage Kerentanan (`/api/flags`)

### 4.1 Ambil Semua Indikator Peringatan Dini
* **Endpoint**: `GET /api/flags`
* **Response (200 OK)**: Daftar seluruh catatan alert triage (Kuning, Merah, Hitam) beserta bukti pemicu (*trigger*), sumber deteksi, dan status penanganan.

### 4.2 Perbarui Status Penanganan Flag
* **Endpoint**: `PATCH /api/flags/:id`
* **Request Body**:
  ```json
  {
    "status": "in_progress" // "unhandled" | "in_progress" | "resolved"
  }
  ```

---

## 5. Curhat AI Konselor Siswa (`/api/chat`)

### 5.1 Riwayat Percakapan Siswa
* **Endpoint**: `GET /api/chat/:studentId`
* **Response (200 OK)**: Riwayat chat antara siswa dan AI Konselor LUNA.

### 5.2 Kirim Pesan Curhat (Diproteksi PII & Safety Guardrail)
* **Endpoint**: `POST /api/chat`
* **Middleware Otomatis**:
  1. `privacyMaskerMiddleware`: Mengaburkan nama, NISN, nomor telepon menjadi token anonim.
  2. `safetyGuardrailMiddleware`: Memeriksa kata kunci darurat. Jika terdeteksi indikasi menyakiti diri, langsung menghasilkan respons krisis darurat (Hotline 119 ext 8).
* **Request Body**:
  ```json
  {
    "studentId": 1,
    "message": "Saya merasa sangat cemas menghadapi ujian minggu depan.",
    "role": "siswa"
  }
  ```

---

## 6. FastMCP Langflow Agent Engine (`/api/mcp`)

* **Endpoint**: `POST /api/mcp/process`
* **Deskripsi**: Menjalankan alur inferensi Langflow untuk menghasilkan analisis risiko holistik, pemetaan RIASEC, dan pembuatan *Counseling Brief* satu-klik untuk guru BK.
