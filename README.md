# LUNA — Lentera untuk Nilai dan Asa
*Sistem Asisten Cerdas Guru BK & Deteksi Dini Kerentanan Siswa Berbasis LUNA AI Agent & FastMCP*
*IBM SkillsBuild National Hackathon 2026 · Track: Education & Future of Work / Healthcare & Wellbeing*

---

## 📚 Dokumentasi & Panduan Terkait
* 🔄 [Alur & Flow Proyek](docs/PROJECT_FLOW.md)
* 📡 [Dokumentasi REST API](docs/API_DOCUMENTATION.md)
* 🏛️ [Desain Arsitektur Sistem](docs/SYSTEM_DESIGN.md)
* 🎯 [Rekomendasi Eksplorasi Minat RIASEC](docs/REKOMENDASI_RIASEC.md)
* 💾 [Panduan Setup Neon PostgreSQL](database/PANDUAN_SETUP_NEON_DB.md)
* 📊 [Panduan Format & Sinkronisasi Excel](database/PANDUAN_SETUP_EXCEL.md)

---

## 🌟 Ringkasan Proyek
**LUNA** adalah sistem pendampingan terpadu yang memadukan kekuatan **analisis prediktif akademik (15 titik pertemuan P1–P14 + UTS)** dan **deteksi dini kerentanan afektif (LUNA Empathy AI Engine)** untuk mengatasi krisis rasio Guru Bimbingan & Konseling di Indonesia (1 : 570 siswa).

Sistem ini menganut prinsip fundamental:
> **"AI-Assisted, Human-Decided"** — AI mengidentifikasi sinyal dini, menghitung anomali tren, memetakan minat Holland RIASEC, dan menyusun Lembar Persiapan Konseling 1-Halaman (< 2 menit); keputusan intervensi manusia tetap 100% di tangan Guru BK.

---

## 🏗️ Arsitektur & Teknologi

### Backend (`/backend`)
* **Runtime**: Node.js (Express MVC Architecture)
* **Database**: Serverless Cloud PostgreSQL (Neon DB) dengan koneksi SSL & connection pooling
* **Kecerdasan Buatan**:
  * Integrasi pipeline Langflow Visual Graph & LUNA AI Agent via Model Context Protocol (FastMCP Client)
  * LUNA Empathy AI Engine dengan sentiment & stress classifier
* **Middleware Keamanan & Kepatuhan**:
  * `privacyMaskerMiddleware.js`: Sanitasi PII (UU PDP No. 27/2022) mengubah nama & kontak asli ke token sintetis `SISWA-XX`
  * `safetyGuardrailMiddleware.js`: Intercept kata kunci krisis darurat (Flag Hitam) dan pengalihan ke Hotline Kemenkes 119 ext 8
  * `authMiddleware.js`: JWT token auth & Role-Based Access Control (`siswa`, `guru_bk`, `guru_mapel`)

### Frontend (`/frontend`)
* **Framework**: React 18 + Vite (Production Bundler)
* **Routing**: React Router v7
* **Ikonografi**: Lucide React (`stroke-width: 1.85`)
* **Design System**: Zero "AI Slop" (Clean white cards, border lembut `#E8E5F7`, shadow lavender)

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Inisialisasi Database (Satu Perintah)
```bash
node database/run_database_setup.mjs
```

### 2. Jalankan Server Dev (Backend & Frontend)
```powershell
.\run_dev.ps1
```
Atau via npm:
```bash
npm run dev
```
Script ini akan:
1. Memeriksa dan membebaskan port jika sebelumnya terpakai.
2. Menjalankan Backend Node.js API di `http://localhost:3001` (dengan fallback otomatis jika port terpakai).
3. Menjalankan Frontend React Vite di `http://localhost:5173`.

### 2. Menggunakan npm Scripts (Monorepo)
```bash
# Jalankan backend & frontend secara bersamaan
npm run dev

# Atau jalankan secara terpisah:
npm run backend   # Backend API
npm run frontend  # Frontend React (Vite)

# Build produksi frontend:
npm run build
```

---

## 📊 Fitur-Fitur Utama yang Disempurnakan

1. **Dashboard Rekap Kelas (`GuruRekapPage`)**:
   - 4 Kartu Metrik Stat dengan ilustrasi Maskot LUNA (Total Siswa, Rata-rata Kelas, Perlu Perhatian, Siswa Unggul)
   - Podium Top 3 Siswa Berprestasi (Gold, Silver, Bronze) dengan avatar dan tag keunggulan
   - Banner Peringatan Dini (Quick Alert Chips untuk siswa Flag Hitam & Kritis)
   - Donut Chart Sebaran Nilai (Grade A, B, C, D, E) & Bar Chart Rata-rata 11 Mapel
   - Matriks Nilai 15 Pertemuan (P1–P14 + UTS) dan 11 Mapel Resmi dengan freeze-column nama siswa
   - Bagian Bimbingan Karir Holland RIASEC berbasis data capaian nyata
2. **Papan Triase Deteksi Dini (`GuruTriagePage` / `GuruBKDashboard` di `/guru/triage`)**:
   - Penyaringan 4 Level Triase (Hitam, Merah, Kuning, Hijau) untuk 20 siswa sintetis
   - Integrasi langsung ke Langflow Visual Graph & Bob MCP pipeline
   - One-Click Counseling Prep Sheet dengan 3 pertanyaan pembuka dialog empatik & ekspor Markdown
   - Live FastMCP / Bob Console terpadu
3. **Sistem Pemantauan Flag (`GuruFlagsPage`)**:
   - Riwayat intervensi kronologis
   - Pembaruan status penanganan konseling (Unhandled → In Progress → Resolved)
4. **Portal Siswa (`SiswaDashboardPage` & `SiswaChatPage`)**:
   - Sapaan hangat dan kartu motivasi lentera
   - Rekap 15 pertemuan personal transparan
   - Teman curhat AI LUNA 24/7 dengan pendeteksi emosi live (Senang, Semangat, Berpikir, Cemas)
   - Safety Intercept darurat otomatis (Flag Hitam & Hotline 119 ext 8) jika terdeteksi krisis
5. **Portal Guru Mapel (`GuruMapelNilaiPage`)**:
   - Input dan penyesuaian nilai harian P1–P14 untuk mapel yang diampu
   - Rekalkulasi otomatis predikat KKM

---

## 🔒 Etika & Prinsip Responsible AI
- **Zero Medical Labeling**: Tidak memberikan diagnosa gangguan jiwa (menggunakan terminologi operasional sekolah: *"Memerlukan dialog afektif"*).
- **Explainable Reasoning**: Menampilkan kutipan refleksi siswa sebagai dasar penetapan level flag.
- **Privacy First**: Masking data sensitif sebelum dikirim ke model eksternal.
