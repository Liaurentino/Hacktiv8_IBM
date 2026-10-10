# 🏛️ Desain Arsitektur Sistem (System Design) — LUNA (*Lentera untuk Nilai dan Asa*)

Dokumen ini menjelaskan arsitektur teknis, pola rekayasa perangkat lunak, token desain visual, kepatuhan etika AI, dan model data platform LUNA (*Lentera untuk Nilai dan Asa*).

---

## 1. Ikhtisar Arsitektur Perangkat Lunak

LUNA dibangun dengan arsitektur **Modular Monorepo** yang memisahkan tanggung jawab antarmuka pengguna (*Frontend Presentation Layer*), logika bisnis (*Backend Domain Services*), dan penyimpanan persisten cloud (*Database Layer*).

```text
┌────────────────────────────────────────────────────────┐
│               Frontend (React 18 + Vite)               │
│   • Portal Siswa (Mobile-First, Bottom Navigation)     │
│   • Portal Guru Mapel (Freeze Column Grade Matrix)     │
│   • Portal Guru BK (Triage Radar & Counseling Brief)   │
└───────────────────────────▲────────────────────────────┘
                            │ REST API (JSON / JWT)
┌───────────────────────────▼────────────────────────────┐
│               Backend (Node.js + Express)              │
│   • Auth & Role-Based Access Control (RBAC)            │
│   • Privacy Masker Middleware (UU PDP Tokenizer)       │
│   • Emergency Safety Guardrail Interceptor (119 ext 8) │
│   • Langflow FastMCP Agent Integration Engine          │
└───────────────────────────▲────────────────────────────┘
                            │ Connection Pool (SSL Enabled)
┌───────────────────────────▼────────────────────────────┐
│      Database Cloud (Neon Serverless PostgreSQL)       │
│   • users, students, grades, counseling_flags, chat    │
└────────────────────────────────────────────────────────┘
```

---

## 2. Standar Desain Visual & Token Desain (Zero "AI Slop")

Sesuai arahan `DESIGN_SYSTEM.md`, LUNA menerapkan prinsip desain bersih, profesional, dan ramah pengguna:

* **Palet Warna Utama**:
  * Brand Primary: Lavender Royal (`#5243C2` / `#6C5DD3`)
  * Surface Card: Pure White (`#FFFFFF`)
  * Border Card: Soft Subtle Lavender (`#E8E5F7`)
  * Shadow: Soft Elevation `0 4px 16px rgba(108, 93, 211, 0.05)`
  * Triage Status:
    * 🟢 Hijau Aman: `#22C55E` (Background: `#F0FDF4`)
    * 🟡 Kuning Waspada: `#F59E0B` (Background: `#FEFCE8`)
    * 🔴 Merah Kritis: `#EF4444` (Background: `#FEF2F2`)
    * ⚫ Hitam Darurat: `#1E1E2D` (Background: `#F8FAFC`)
* **Tipografi**:
  * Judul & Heading: `Plus Jakarta Sans`, bobot 600/700.
  * Teks Data & Angka: `Inter` dengan varian tabular numerals (`font-feature-settings: "tnum"`).
* **Tata Letak Adaptif Berdasarkan Peran**:
  * **Portal Siswa**: *Mobile-first*, navigasi bawah (*bottom bar*), area sentuh minimal 44×44px, chat layar penuh 100dvh.
  * **Portal Guru & BK**: *Dual-screen adaptive* (sidebar 240px di desktop, laci geser di mobile), tabel data dengan *freeze column* nama dan NISN siswa.

---

## 3. Etika AI & Tata Kelola Privasi Data (Responsible AI)

1. **Zero Medical Labeling**:
   * Sistem secara terprogram melarang pemberian diagnosis medis atau psikiatris (misal: "depresi berat", "bipolar", "skizofrenia").
   * Seluruh temuan dikomunikasikan dalam bahasa bimbingan pedagogis yang konstruktif (misal: *"Siswa mengalami penurunan motivasi belajar dan membutuhkan dialog penguatan afektif"*).
2. **Prinsip Human-in-the-Loop**:
   * Kecerdasan buatan hanya berperan sebagai asisten penyedia sintesis data dan draf rekomendasi awal. Keputusan tindak lanjut, konseling, dan intervensi mutlak berada di tangan guru dan konselor manusia.
3. **Penyelarasan Regulasi UU PDP No. 27/2022**:
   * Modul `privacyMaskerMiddleware` memindai dan menyamarkan informasi pribadi (PII) seperti NISN, nama lengkap, nomor telepon siswa sebelum dikirim ke engine AI.
4. **Emergency Crisis Interceptor**:
   * Modul `safetyGuardrailMiddleware` secara deterministik mengintersepsi kata-kata berisiko tinggi (keinginan menyakiti diri) secara *real-time*, memicu Black Flag, dan menyajikan nomor darurat nasional **Hotline 119 ext 8**.

---

## 4. Model Entitas Data Relasional (ERD)

```text
USERS (id, email, password_hash, name, role, avatar, subject_key, created_at)
  │
  ├── 1:1 ──► STUDENTS (id, user_id, nisn, name, class_name, academic_score, triage_level, riasec_code)
                 │
                 ├── 1:N ──► GRADES (id, student_id, subject_key, scores_json, avg_score, letter_grade)
                 │
                 ├── 1:N ──► COUNSELING_FLAGS (id, student_id, level, category, trigger, status)
                 │
                 └── 1:N ──► CHAT_MESSAGES (id, student_id, sender, message, emotion, timestamp)
```
