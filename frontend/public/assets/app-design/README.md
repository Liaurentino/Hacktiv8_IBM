# LUNA High-Quality Asset & Icon Library
*Pustaka Aset Visual, Ikon Semantik, dan Maskot Resmi LUNA*  
*Hackathon IBM 2026 · Solusi Konseling Sekolah & Deteksi Dini Berbasis IBM watsonx.ai Granite*

---

## 1. Ikhtisar & Standar Kualitas Tinggi
Pustaka ini adalah sumber aset digital resmi berstandar **Best Practice** industri grafis modern:
- **Format Bersih Transparan**: Seluruh file PNG diekspor dengan saluran Alpha transparan murni (RGBA) tanpa background kotak abu-abu atau artifak cropping.
- **Render Vektor Presisi Tinggi**: Seluruh ikon bersumber dari SVG dan dirender menggunakan mesin rasterisasi presisi tinggi (*geometric precision & anti-aliasing* via `resvg`).
- **Multi-Resolusi Terstruktur**:
  1. **`512x512/`** — Resolusi Master HD untuk Figma, presentasi pitch deck, banner, dokumen cetak, dan App Icon.
  2. **`256x256/`** — Resolusi Retina Display (@2x/@3x) untuk antarmuka web modern & mobile.
  3. **`64x64/`** — Resolusi standar UI (@1x) untuk tombol, tabel, dan avatar kecil.
  4. **`svgs/`** — File vektor asli (*lossless source of truth*).
  5. **`mascot-illustrations/`** — Ilustrasi karakter dan maskot beresolusi tinggi.

---

## 2. Struktur Direktori

```text
asset-app-design/
├── index.html                   # Showcase interaktif (dapat langsung dibuka di browser)
├── README.md                    # Dokumentasi ini
│
├── 512x512/                     # Master High-Resolution HD (512x512 px)
│   ├── brand/                   # Emblem LUNA, bulan sabit, bintang, app icon
│   ├── feature-clouds/          # 4 Pilar Fitur (Awan Pastel Mockup Asli)
│   ├── features/                # Fitur Utama & watsonx AI Granite
│   ├── subjects/                # 11 Mata pelajaran resmi & Karir RIASEC
│   ├── ui-actions/              # Aksi cari, kalender, tren, notifikasi, profil, settings
│   ├── badges/                  # Status statistik & Predikat Nilai (A, B, C, D, E, X)
│   ├── decorations/             # Ornamen bintang jatuh, kucing di buku, tempat pensil, awan lilac
│   ├── roles/                   # Peran Siswa, Guru, Guru BK
│   └── triage-flags/            # Flag konseling BK (Hijau, Kuning, Merah, Hitam)
│
├── 256x256/                     # Retina @2x (Struktur folder sama)
├── 64x64/                       # Standard UI @1x (Struktur folder sama)
│
├── svgs/                        # File SVG vektor asli
└── mascot-illustrations/        # Maskot & ilustrasi karakter HQ
```

---

## 3. Integrasi ke Frontend / Web App
Semua aset di `luna-app-unified` dan `preview-luna` telah disinkronkan secara otomatis sehingga seluruh ikon, kartu 4 pilar fitur, dan ornamen dekorasi di landing page tampil tajam tanpa gambar pecah.
