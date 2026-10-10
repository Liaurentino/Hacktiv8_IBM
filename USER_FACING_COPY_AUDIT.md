# Instruksi Audit dan Pembersihan Teks Teknis di UI LUNA

## Tujuan

Audit seluruh antarmuka web LUNA dan hapus atau ubah teks teknis/internal yang terlihat oleh pengguna akhir. UI harus berbicara dalam bahasa pengguna—siswa, Guru BK, dan Guru Mata Pelajaran—bukan menjelaskan detail implementasi sistem.

Contoh teks yang tidak boleh tampil di UI:

- `Sumber Data: Nilai Guru Mapel & Database Neon`
- `Neon`, `Neon.tech`, `PostgreSQL`, `Postgres`, `SQLite`, atau nama vendor database lainnya
- `Gemini`, nama model AI/vendor, nama provider, atau detail model internal
- `backend`, `frontend`, `API`, `endpoint`, `server`, `database`, `schema`, `JSON`, `MCP`, `Langflow`, `JSON-RPC`, dan istilah implementasi sejenis
- URL, nama tabel, nama field, environment variable, alamat server, atau detail konfigurasi
- Label teknis seperti “AI Engine Connected” jika tidak bermakna bagi pengguna dan hanya menunjukkan status internal

## Cakupan audit

Periksa semua teks yang dapat muncul pada halaman, bukan hanya teks statis yang tampak pada kondisi awal:

- Semua halaman Siswa, Guru BK, dan Guru Mata Pelajaran.
- Header, judul, subtitle, metadata, footer, navbar, sidebar, badge, tooltip, dan label tombol.
- Card, tabel, grafik, empty state, skeleton/loading state, error state, toast, modal, dialog konfirmasi, dan notifikasi.
- Chat AI: disclaimer, jawaban, suggested prompt, fallback, status koneksi, serta pesan error.
- Teks yang berasal dari data API, konfigurasi, template, atau kondisi runtime.
- Tampilan responsive desktop dan mobile.

Gunakan pencarian kode untuk kata/frasa seperti `Sumber Data`, `Neon`, `Postgres`, `PostgreSQL`, `SQLite`, `Gemini`, `backend`, `frontend`, `API`, `endpoint`, `server`, `database`, `schema`, `MCP`, `Langflow`, `JSON-RPC`, `model`, `provider`, `connected`, dan padanan Indonesianya. Periksa setiap hasil dan pastikan memang merupakan teks UI sebelum mengubahnya.

## Aturan keputusan

1. **Hapus metadata teknis yang tidak dibutuhkan pengguna.** Contoh: `Sumber Data: Nilai Guru Mapel & Database Neon` cukup dihapus jika informasi sumber bukan bagian penting dari tugas pengguna.
2. **Pertahankan informasi yang menjelaskan konteks kerja pengguna.** Contoh: periode semester, kelas, mata pelajaran, tanggal pembaruan nilai, atau status tindak lanjut boleh ditampilkan jika relevan.
3. **Jika pengguna perlu tahu adanya keterlambatan atau gangguan, gunakan bahasa yang berorientasi tindakan**, bukan nama teknologi. Contoh: `Nilai belum dapat dimuat. Coba lagi beberapa saat.`
4. **Untuk AI, gunakan istilah yang jujur dan mudah dipahami.** Sebut `Asisten AI LUNA` bila memang perlu, tetapi jangan tampilkan nama model/vendor atau klaim bahwa AI selalu benar.
5. **Jangan menghapus detail dari kode operasional, log, dokumentasi developer/admin, komentar, konfigurasi, atau README internal.** Permintaan ini hanya untuk teks yang benar-benar terlihat pengguna akhir.
6. **Jangan mengubah API, alur data, database, label field internal, telemetry, atau kontrak backend.** Ubah hanya salinan UI/presentation kecuali ada kebutuhan eksplisit terpisah.
7. **Jangan mengganti istilah teknis dengan klaim yang tidak benar.** Bila penyebab gangguan belum diketahui, gunakan pesan netral; jangan menebak penyebab.

## Contoh transformasi copy

| Hindari di UI | Gunakan bila konteksnya diperlukan |
|---|---|
| `Sumber Data: Nilai Guru Mapel & Database Neon` | Hapus; atau `Nilai diperbarui pada [tanggal]` jika tanggal tersedia dan bermanfaat. |
| `Gemini AI sedang memproses` | `Asisten sedang menyiapkan jawaban…` |
| `Backend/API tidak merespons` | `Data belum dapat dimuat. Coba lagi.` |
| `Database Neon tidak terhubung` | `Layanan sedang mengalami kendala. Silakan coba kembali nanti.` |
| `Langflow MCP Connected` | Hapus dari UI pengguna; bila AI tidak tersedia, tampilkan status yang relevan dekat fitur AI. |
| `JSON/schema tidak valid` | `Terjadi kesalahan saat memproses permintaan.` |

Jangan menampilkan tanggal pembaruan atau status berhasil jika aplikasi tidak mempunyai data yang mendukungnya.

## Prosedur kerja

1. Inventarisasi semua teks UI di seluruh role dan route.
2. Kelompokkan temuan menjadi: teknis/internal, konteks pengguna yang relevan, dan tidak jelas/perlu ditinjau.
3. Hapus atau ubah hanya teks teknis yang tampil kepada pengguna; jangan lakukan penggantian global membabi buta karena istilah yang sama bisa muncul pada kode/log internal.
4. Pastikan struktur visual tetap rapi setelah metadata dihapus: perbaiki spacing/alignment jika ada ruang kosong, tanpa menambahkan card atau teks pengganti yang tidak perlu.
5. Periksa teks dinamis dari API serta status error/loading, bukan hanya halaman normal.
6. Uji seluruh role dan halaman utama pada desktop dan mobile.
7. Jalankan build dan tes frontend yang tersedia.
8. Lakukan pencarian ulang untuk memastikan tidak ada istilah teknis yang masih bocor ke UI; dokumentasikan pengecualian yang memang disengaja.

## Kriteria penerimaan

- Tidak ada teks UI pengguna yang menyebut Neon/Neon.tech, PostgreSQL/Postgres, SQLite, Gemini/nama provider/model, backend/frontend, API/endpoint, schema/JSON, MCP, Langflow, atau detail teknis internal lainnya.
- Tidak ada label `Sumber Data:` yang membocorkan implementasi atau vendor.
- Metadata produk yang berguna seperti kelas, semester, mata pelajaran, dan waktu pembaruan tetap ada bila relevan dan didukung data.
- Pesan loading, error, dan status AI tetap jelas serta dapat ditindaklanjuti tanpa menjelaskan implementasi internal.
- Tidak ada perubahan pada logika autentikasi, akses role, API, database, atau alur nilai/chat.
- Layout tidak meninggalkan celah visual setelah teks teknis dihapus.
- Build dan tes terkait berhasil.
- Laporan akhir menyebut halaman/komponen yang diperiksa, teks UI yang dihapus/diubah, pengecualian yang dipertahankan, dan hasil verifikasi.
