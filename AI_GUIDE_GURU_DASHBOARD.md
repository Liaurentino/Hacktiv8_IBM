# Panduan UI Dashboard Guru & Asisten AI LUNA

Dokumen ini menjadi acuan untuk merapikan dashboard Guru BK, dashboard Guru Mata Pelajaran, dan pengalaman chat AI. Tujuannya: antarmuka konsisten, fokus pada pekerjaan guru, dan AI diposisikan sebagai alat bantu—bukan pengambil keputusan.

## 1. Tujuan

- Pertahankan identitas visual LUNA dan komponen design system yang sudah ada.
- Buat dashboard mudah dipindai: informasi utama lebih menonjol daripada detail teknis.
- Kurangi status layanan teknis yang tidak membantu tugas harian guru.
- Sediakan pemilihan konteks siswa yang jelas pada chat AI, untuk satu atau beberapa siswa.
- Tampilkan keterbatasan AI secara konsisten, tanpa membuat guru mengabaikan jawabannya.

## 2. Rapikan informasi Langflow dan AI di dashboard

Dashboard guru harus memprioritaskan ringkasan siswa dan tindakan yang perlu dilakukan. Jangan menampilkan panel besar seperti “Langflow Visual Graph + LUNA Agent”, protokol MCP, detail JSON-RPC, nama engine, atau status server sebagai konten utama dashboard.

### Tampilkan di dashboard

- Ringkasan jumlah siswa dan indikator yang relevan bagi peran guru.
- Daftar tugas atau tindak lanjut yang perlu diperhatikan.
- Status AI cukup satu indikator ringkas jika status itu benar-benar berguna untuk memahami ketersediaan fitur.

### Pindahkan ke tempat yang sesuai

- Status Langflow/MCP, nama model, detail koneksi, dan diagnostics: halaman **Pengaturan / Status Layanan** atau panel teknis yang hanya dibuka saat diperlukan.
- Flow JSON dan konfigurasi agent: halaman developer/admin, bukan dashboard penggunaan harian.
- Jika layanan AI tidak tersedia, tampilkan pesan kontekstual dekat fitur chat: “Asisten AI sementara tidak tersedia. Anda masih dapat membuka data siswa secara manual.” Jangan tampilkan detail teknis internal.

Jangan mengklaim layanan “terhubung” hanya berdasarkan status statis atau indikator dekoratif. Status harus berasal dari health check aktual dan diberi waktu pembaruan jika memang ditampilkan.

## 3. Konsistensi design system guru

Pakai token dan komponen yang sudah tersedia di proyek. Jangan membuat variasi warna, radius, bayangan, atau ukuran tombol baru tanpa alasan yang terdokumentasi.

- Samakan header halaman, judul, deskripsi, jarak antarbagian, card, tabel, badge, tombol, dan empty state di dashboard Guru BK maupun Guru Mapel.
- Gunakan pola card yang sama untuk informasi sejenis; perbedaan konten tidak perlu menghasilkan gaya visual berbeda.
- Pertahankan warna semantik yang konsisten: status prioritas harus punya teks/ikon selain warna.
- Hierarki visual: judul halaman → ringkasan penting → pekerjaan utama → informasi tambahan.
- Gunakan tabel untuk data tabular, bukan deretan card yang sulit dibandingkan; untuk layar sempit, tabel dapat scroll di dalam container-nya.
- Jangan memperlihatkan metrik yang tidak punya definisi jelas. Beri label, periode, dan sumber data untuk angka ringkasan.
- Dashboard responsif: desktop memanfaatkan ruang lebar; pada mobile komponen tersusun satu kolom dan tidak menyebabkan halaman scroll horizontal.

### Perbedaan peran

- **Guru BK:** ringkasan kebutuhan pendampingan, triase, catatan/tindak lanjut, serta akses ke profil siswa sesuai hak akses.
- **Guru Mapel:** ringkasan kelas/mapel yang diampu, input dan rekap nilai untuk mapel tersebut.
- Komponen boleh sama, tetapi data, tindakan, dan izin harus tetap mengikuti role dari backend.

## 4. Pemilih siswa pada chat AI

Tambahkan kontrol konteks yang eksplisit di area chat. Rekomendasi: tombol **Pilih siswa** membuka dialog/modal pencarian dan pemilihan.

### Perilaku pemilih

- Mendukung mode **Umum / tanpa siswa**, **satu siswa**, dan **beberapa siswa** jika skenario serta izin role mengizinkan.
- Sediakan pencarian berdasarkan nama atau identitas sekolah yang memang boleh dilihat role tersebut.
- Pada mode multi-select, tampilkan checkbox, jumlah siswa terpilih, tombol **Pilih**, dan **Batal**.
- Tampilkan pilihan aktif di dekat composer sebagai chip yang bisa dihapus; jangan hanya mengandalkan state tersembunyi.
- Batasi opsi siswa berdasarkan role dan otorisasi backend. Jangan menganggap filter frontend sebagai kontrol keamanan.
- Tampilkan konteks yang jelas sebelum pesan dikirim, misalnya “Konteks: 2 siswa dipilih”. Minta konfirmasi ekstra bila permintaan akan merangkum data beberapa siswa.
- Jika data siswa tidak tersedia atau akses ditolak, tampilkan pesan aman dan jangan mengirim prompt dengan konteks kosong/sebagian tanpa memberi tahu guru.

### Privasi untuk beberapa siswa

- Gunakan data minimum yang dibutuhkan untuk pertanyaan.
- Jangan mencampur atau menampilkan percakapan pribadi siswa satu kepada siswa lain.
- Ringkasan multi-siswa hanya untuk pengguna staf berwenang dan harus bersifat agregat bila identitas individual tidak diperlukan.
- Catat audit akses sesuai kebijakan aplikasi, terutama untuk permintaan lintas banyak siswa.
- Sebelum request, backend harus memverifikasi setiap ID siswa dan kewenangan pengguna.

### Tampilan dialog

- Judul: **Pilih siswa untuk konteks chat**.
- Field pencarian dengan label yang terlihat dan tombol hapus pencarian.
- Daftar hasil dengan nama, kelas, serta identitas minimum yang diperlukan.
- Checkbox hanya muncul jika role dan fitur mengizinkan multi-select.
- Footer melekat pada dialog: jumlah terpilih, **Batal**, **Gunakan pilihan**.
- Di mobile, dialog berubah menjadi sheet/layar penuh yang mudah ditutup dan tidak meluap dari viewport.

## 5. Panduan jawaban AI

AI dapat salah, melewatkan konteks, atau menghasilkan kesimpulan yang terdengar meyakinkan tetapi tidak didukung data. Karena itu:

- Labeli jawaban sebagai **saran/ringkasan AI**, bukan keputusan profesional atau fakta terverifikasi.
- Bedakan fakta dari data sistem, interpretasi, dan saran. Jika memungkinkan, sebut sumber data dan periode yang dipakai.
- Jika konteks kurang atau data bertentangan, minta klarifikasi atau nyatakan ketidakpastian; jangan mengarang.
- Jangan mendiagnosis gangguan psikologis, memberi label karakter siswa, atau membuat prediksi pasti mengenai masa depan.
- Untuk isu kesejahteraan, keselamatan, atau risiko serius, arahkan guru untuk menilai langsung dan mengikuti prosedur sekolah; AI tidak menggantikan guru BK atau layanan darurat.
- Berikan saran yang dapat diperiksa dan langkah tindak lanjut konkret. Hindari rekomendasi berisiko tinggi berdasarkan satu skor, satu pesan, atau satu indikator.
- Data nilai, minat, dan catatan konseling adalah data sensitif: tampilkan hanya sesuai role, gunakan seperlunya, dan jangan memasukkan informasi yang tidak dibutuhkan ke prompt.

### Teks disclaimer di bawah chat

> **LUNA AI dapat keliru atau kehilangan konteks. Gunakan jawabannya sebagai bahan pertimbangan, verifikasi dengan data dan kondisi siswa, dan tetapkan keputusan bersama guru yang berwenang. AI bukan pengganti penilaian profesional atau prosedur perlindungan siswa.**

Tampilkan disclaimer dengan ukuran terbaca di bawah area percakapan/composer. Jangan menyembunyikannya hanya di tooltip, modal pertama kali, atau halaman kebijakan. Pada mobile, disclaimer boleh diringkas secara visual tetapi isi lengkap tetap mudah dibuka.

## 6. Aksesibilitas dan responsive

- Semua tombol, modal, dropdown, checkbox, dan chip dapat dioperasikan dengan keyboard.
- Modal memiliki focus management, label aksesibel, dan dapat ditutup dengan tombol yang jelas.
- Status tidak dibedakan dengan warna saja; sertakan teks dan/atau ikon.
- Jaga kontras teks, ukuran target sentuh, fokus terlihat, dan label input.
- Tidak ada horizontal scroll pada halaman dashboard/chat; daftar yang memang panjang boleh scroll di container yang ditentukan.
- Pada layar kecil, pemilih siswa menjadi mudah digunakan satu tangan dan tombol aksi tetap terlihat.

## 7. Kriteria penerimaan

- Panel teknis Langflow/MCP tidak mendominasi dashboard guru.
- Dashboard BK dan Guru Mapel memakai gaya komponen serta hierarki visual yang konsisten.
- Guru dapat mengirim chat tanpa konteks siswa, dengan satu siswa, atau beberapa siswa jika diizinkan.
- Siswa terpilih terlihat sebelum pesan dikirim dan mudah dihapus/diubah.
- Backend memvalidasi role dan akses ke seluruh siswa yang dipilih.
- Disclaimer AI terlihat di bawah chat dan menyampaikan batas keandalan serta tanggung jawab guru.
- Kondisi loading, kosong, error, akses ditolak, dan AI offline memiliki tampilan yang jelas.
- Build dan tes terkait berhasil; uji manual desktop dan mobile dilakukan.

## 8. Batas implementasi

- Jangan mengubah schema/database atau perilaku backend yang tidak dibutuhkan untuk memenuhi panduan ini.
- Jangan menghapus informasi teknis yang berguna untuk admin; pindahkan ke lokasi yang tepat.
- Jangan menampilkan data siswa yang tidak diizinkan oleh role.
- Jangan mengklaim fitur AI aman/valid hanya karena ada disclaimer. Validasi tetap perlu dilakukan pada alur, data, dan hasilnya.

## Referensi desain yang diberikan

- Gambar 1: panel Langflow dan ringkasan dashboard Guru BK; panel teknis sebaiknya dipindah dari area utama.
- Gambar 2: pemilihan fokus siswa berbentuk deretan chip dengan overflow; ganti dengan pemilih searchable yang rapi dan jelas untuk single/multi-select.
- Gambar 3: disclaimer AI di bawah chat; pertahankan pola ini dengan teks yang lebih jelas dan mudah dibaca.

## 9. Header lintas halaman mengikuti header AI Chat

Terapkan pola header pada gambar referensi **AI Chat LUNA Counselor & Pedagogical Assistant** ke header semua halaman aplikasi, kecuali dashboard siswa. Pengecualian ini disengaja: dashboard siswa mempertahankan header/layout khusus yang sudah ada.

### Cakupan

- Semua halaman Guru BK.
- Semua halaman Guru Mata Pelajaran.
- Halaman siswa selain dashboard siswa, jika halaman tersebut memakai header aplikasi.
- Jangan mengubah header dashboard siswa.
- Jangan mengubah isi utama halaman menjadi tampilan chat; yang diikuti adalah pola shell/header dan tata letak globalnya.

### Struktur dan susunan elemen

Gunakan satu header aplikasi yang konsisten di bagian paling atas area konten:

1. **Kiri:** nama/identitas produk atau judul halaman yang relevan, rata kiri dan memiliki ruang fleksibel.
2. **Kanan:** kelompok aksi global dengan urutan dan alignment konsisten, misalnya indikator privasi/etika, aksi tambah bila relevan, kontrol panel/sidebar bila tersedia, lalu notifikasi/profil bila memang bagian dari shell aplikasi.
3. Header dipisahkan secara halus dari konten dengan border bawah; gunakan tinggi, padding, dan alignment vertikal konsisten antarhalaman.
4. Konten halaman dimulai di bawah header dengan jarak yang seragam. Judul dan deskripsi spesifik halaman tetap berada di area konten, bukan dimasukkan ke header global kecuali pola AI Chat memang menggunakan judul produk sebagai identitas shell.

### Perilaku dan aturan implementasi

- Audit header yang sudah ada sebelum mengubahnya. Pertahankan fungsi navigasi, tombol, notifikasi, profil, role, dan aksesibilitas yang telah berjalan.
- Satukan header melalui komponen layout bersama jika arsitektur proyek memungkinkan; hindari menyalin markup/CSS header ke setiap halaman.
- Bedakan **header global** dari **toolbar lokal halaman**. Toolbar lokal (filter, pencarian, aksi tabel) tetap di bawah header dan hanya muncul pada halaman yang membutuhkannya.
- Jangan menampilkan kontrol dekoratif atau tombol tanpa fungsi. Jika aksi tidak relevan untuk halaman/role, sembunyikan atau nonaktifkan dengan penjelasan yang aksesibel.
- Indikator privasi/etika tidak boleh sekadar badge dekoratif. Bila diklik, arahkan ke penjelasan kebijakan atau informasi yang nyata; jangan mengklaim status kepatuhan tanpa dasar.
- Pastikan semua kontrol mengikuti role dan otorisasi backend.
- Hindari membuat header menutupi konten saat scroll. Jika header sticky, tetapkan offset, z-index, dan perilaku scroll yang konsisten serta uji pada seluruh layout.

### Responsive

- Desktop: identitas di kiri; aksi global di kanan sebagaimana pola referensi.
- Tablet/mobile: pertahankan identitas dan aksi paling penting; kelompok aksi boleh diringkas ke menu overflow, tetapi fungsi utamanya tetap dapat ditemukan.
- Judul panjang harus membungkus atau dipotong dengan aman tanpa mendorong halaman melebar.
- Jangan biarkan header menyebabkan horizontal scroll pada viewport kecil.
- Tombol memiliki label aksesibel, fokus keyboard terlihat, dan target sentuh yang memadai.

### Batas visual

- Gunakan token warna, font, radius, border, ukuran ikon, dan spacing dari design system proyek.
- Ikuti hierarki visual referensi: identitas sederhana di kiri, aksi global ringkas di kanan, latar bersih, pemisah halus.
- Jangan menyalin teks “LUNA Counselor & Pedagogical Assistant” sebagai judul untuk semua halaman jika identitas/role atau judul halaman seharusnya berbeda. Pertahankan nama produk sebagai identitas global dan gunakan judul halaman sesuai konteks.
- Header dashboard siswa tetap seperti semula; jangan menerapkan komponen/header baru padanya.

### Kriteria penerimaan header

- Semua header dalam cakupan memakai struktur, alignment, spacing, dan perilaku yang sama.
- Dashboard siswa tidak berubah.
- Judul/toolbar spesifik halaman tetap mudah dikenali dan tidak bercampur dengan aksi global.
- Semua tombol yang ditampilkan benar-benar berfungsi dan sesuai role.
- Tidak ada overflow horizontal pada header di mobile.
- Navigasi, notifikasi, dan aksi yang sudah berfungsi tidak hilang setelah refactor.
- Uji minimal satu halaman Guru BK, satu Guru Mapel, satu halaman siswa non-dashboard (jika ada), serta dashboard siswa sebagai pengecekan bahwa pengecualian tetap terjaga.
