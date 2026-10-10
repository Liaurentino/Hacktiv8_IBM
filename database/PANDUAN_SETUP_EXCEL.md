# 📊 Panduan Format Excel & Sinkronisasi Nilai Siswa — LUNA (*Lentera untuk Nilai dan Asa*)

Panduan ini ditujukan bagi guru mata pelajaran dan tim pengembang untuk mempersiapkan, menyusun, dan mengimpor lembar kerja nilai siswa ke dalam sistem LUNA, baik menggunakan berkas Microsoft Excel (`.xlsx`, `.xls`), berkas CSV (`.csv`), maupun tautan Google Sheets.

---

## 1. Ikhtisar Alur Kerja Guru Mata Pelajaran

Pada portal Guru Mata Pelajaran LUNA, guru dapat memperbarui nilai seluruh kelas secara instan tanpa perlu mengetik manual satu per satu:
1. Guru mengklik tombol **"Sinkronisasi Nilai"** di header halaman kelas.
2. Muncul dialog modal terpadu dengan 2 pilihan:
   * **Unggah Berkas Excel / CSV**: Seret & lepas (*drag and drop*) berkas `.xlsx`, `.xls`, atau `.csv`.
   * **Tautan Google Sheets**: Tempelkan URL Google Sheets publik untuk ditarik secara otomatis.
3. Tombol **"Lihat Format & Panduan Kolom"** atau ikon template dapat diklik kapan saja untuk melihat pratinjau format header yang benar.
4. LUNA memvalidasi NISN terhadap database kelas, menghitung rata-rata serta status KKM (≥75 tuntas, <75 remidi), dan menampilkan tabel pratinjau sebelum disimpan.
5. Guru mengklik **"Terapkan Nilai ke Kelas"** untuk menyimpan pembaruan ke database Neon PostgreSQL.

---

## 2. Struktur Kolom & Header Resmi

Berkas Excel atau CSV wajib memuat header pada baris pertama. Huruf besar atau kecil tidak berpengaruh (*case-insensitive*):

```text
nisn, nama, p1, p2, p3, p4, p5, p6, p7, uts, p8, p9, p10, p11, p12, p13, p14
```

### Rincian Spesifikasi Setiap Kolom:

| Nama Kolom | Status | Tipe Data | Contoh | Deskripsi |
|---|---|---|---|---|
| **`nisn`** | **Wajib** | Teks / Angka | `20240042` | Nomor Induk Siswa Nasional (kunci pencocokan siswa ke database). |
| **`nama`** | Opsional | Teks | `Priya Ramadhani` | Nama siswa untuk verifikasi visual pada layar pratinjau. |
| **`p1` s.d. `p7`** | Opsional | Angka (0–100) | `85` | Nilai pertemuan 1 sampai 7 (tugas harian, kuis formatif pra-UTS). |
| **`uts`** | Opsional | Angka (0–100) | `90` | Nilai Ujian Tengah Semester. |
| **`p8` s.d. `p14`** | Opsional | Angka (0–100) | `88` | Nilai pertemuan 8 sampai 14 (praktikum, proyek, tugas pasca-UTS). |

> 💡 **Fleksibilitas Kolom:** Jika semester baru berjalan sampai UTS, Anda cukup mengisi kolom `p1` hingga `uts`. Kolom `p8` s.d. `p14` boleh dikosongkan.

---

## 3. Berkas Dummy / Contoh Siap Pakai

Di dalam folder `database/`, telah disediakan dua berkas contoh yang dapat langsung diuji coba:
1. 📄 **`database/dummy_nilai_mapel_sample.csv`**: Contoh format CSV (berisi 15 siswa kelas XI IPA 2).
2. 📑 **`database/dummy_nilai_mapel_sample.xlsx`**: Contoh berkas Excel biner asli yang siap dibuka di Microsoft Excel atau langsung diunggah ke aplikasi LUNA.

---

## 4. Panduan Ekspor dari Google Sheets

Jika sekolah mengelola nilai di Google Sheets:
1. Buka spreadsheet nilai kelas di Google Chrome / Browser.
2. Klik tombol **Bagikan (*Share*)** di kanan atas.
3. Ubah hak akses menjadi **"Siapa saja yang memiliki tautan dapat melihat" (*Anyone with the link can view*)**.
4. Salin tautan spreadsheet tersebut (misalnya: `https://docs.google.com/spreadsheets/d/1xxxx.../edit?usp=sharing`).
5. Pada modal import LUNA, pilih tab **"Pakai Link Google Sheets"**, tempel tautan, lalu klik **Tarik & Analisis Data**.
6. LUNA akan otomatis memproses data tanpa perlu mengunduh file fisik.

---

## 5. Aturan Validasi & Tips Menghindari Error

1. **Format Desimal:**
   * Di Excel berbahasa Indonesia yang menggunakan koma (misal: `82,5`), parser LUNA otomatis mengonversinya menjadi angka bulat `83`.
2. **Pengecekan NISN:**
   * Siswa yang NISN-nya tidak terdaftar di kelas akan diberi label `Tidak Terdaftar` dan tidak akan dimasukkan ke database untuk menjaga keamanan data.
3. **Nilai di Luar Batas:**
   * Nilai negatif otomatis dibatasi ke `0`.
   * Nilai di atas 100 otomatis dibatasi ke `100`.
4. **Keamanan Data (Zero PII Leakage):**
   * Berkas nilai yang diunggah hanya diproses di browser dan disimpan ke database relasional terisolasi sekolah; data nilai tidak pernah dikirim ke LLM publik tanpa proteksi token sintetis.
