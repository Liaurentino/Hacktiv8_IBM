# Panduan Audit dan Pengurangan Duplikasi Frontend LUNA

## Tujuan

Audit frontend untuk menemukan komponen, logika, utilitas, style, dan alur UI yang benar-benar redundan. Gabungkan duplikasi yang aman agar lebih mudah dirawat, tanpa mengubah tampilan, perilaku, hak akses, atau alur data yang diharapkan pengguna.

Ini adalah refactor kualitas kode, bukan redesign. Pertahankan UI/UX yang sudah disetujui kecuali perubahan kecil diperlukan untuk menjaga perilaku identik setelah refactor.

## Cakupan audit

- Komponen React yang menyalin markup atau perilaku sama.
- Layout, header, sidebar, navbar, footer, dan page header.
- Card, badge, tombol, modal/dialog, dropdown, tabel, empty/loading/error state.
- Hook, helper, formatter, validator, dan utilitas yang menduplikasi logika.
- Pemanggilan API, state loading/error, parsing respons, dan transformasi data pada frontend.
- CSS/module/style yang mengulang deklarasi atau membuat variasi yang tidak disengaja.
- Fungsi dan state yang tidak terpakai, unreachable code, import mati, serta prop yang tidak digunakan.
- Route/halaman yang memiliki pola sama tetapi berbeda karena role atau konteks.

## Aturan sebelum refactor

1. Baca instruksi repo/`AGENTS.md`, struktur frontend, package scripts, dan design system sebelum mengedit.
2. Petakan kandidat duplikasi beserta semua pemakai dan perbedaan perilakunya.
3. Bedakan **duplikasi implementasi** dari **kesamaan visual yang memang perlu memiliki perilaku berbeda**. Jangan menyatukan komponen hanya karena tampilannya mirip.
4. Verifikasi apakah API, permission, role, atau bentuk data berbeda sebelum membuat abstraksi bersama.
5. Jangan menghapus kode hanya karena tidak terlihat di satu route; cari seluruh referensi, dynamic import, route, test, dan penggunaan berbasis konfigurasi.
6. Mulai dari refactor kecil dengan risiko rendah. Jangan melakukan rewrite besar-besaran atau perubahan menyeluruh dalam satu patch.

## Kapan layak digabung

- Markup dan perilakunya sama di beberapa tempat.
- Aturan bisnisnya identik dan mempunyai satu sumber kebenaran yang jelas.
- Variasi dapat dinyatakan eksplisit melalui props/config kecil dan mudah dipahami.
- Abstraksi membuat pemanggil lebih sederhana tanpa menyembunyikan alur penting.
- Ada test atau cara verifikasi untuk memastikan perilaku tidak berubah.

## Kapan jangan digabung

- Kesamaan hanya kebetulan, tetapi tujuan atau interaksi berbeda.
- Komponen hanya memiliki sedikit kesamaan dan abstraksi akan menambah banyak conditional props.
- Perbedaan role/otorisasi akan sulit terlihat setelah komponen digabung.
- Logika memiliki sumber data, siklus hidup, atau aturan validasi berbeda.
- Penggabungan akan membuat komponen/utilitas generik besar yang lebih sulit dipahami daripada implementasi awal.

## Hal yang wajib dipertahankan

- Tampilan, responsive behavior, dan aksesibilitas.
- Kontrak request/response API, autentikasi, dan otorisasi role.
- Validasi input dan penanganan error/loading/empty state.
- Perilaku khusus dashboard siswa yang memang dikecualikan dari pola halaman lain.
- Data dan fitur yang sudah berjalan; jangan menghapus fitur karena dianggap “redundan” tanpa bukti bahwa tidak dipakai.
- Tidak ada perubahan backend, schema, atau isi database dalam pekerjaan frontend ini.

## Metode kerja

1. Inventarisasi file dan kelompokkan kandidat duplikasi berdasarkan tanggung jawab.
2. Untuk setiap kandidat, catat: lokasi, referensi/pemakai, perilaku sama, perbedaan penting, risiko, dan rekomendasi.
3. Tampilkan ringkasan temuan terlebih dahulu. Prioritaskan duplikasi yang jelas dan berdampak; hindari refactor demi mengurangi jumlah file semata.
4. Refactor kelompok kecil secara bertahap. Pertahankan nama API komponen/props yang jelas dan hindari breaking changes yang tidak diperlukan.
5. Hapus import, state, style, atau kode mati hanya setelah dipastikan tidak digunakan.
6. Tambahkan/perbarui test untuk utilitas atau perilaku bersama yang berubah.
7. Jalankan lint, test, dan build yang tersedia.
8. Periksa diff untuk memastikan tidak ada perubahan visual/fungsional tak disengaja.
9. Cari ulang referensi lama dan pastikan implementasi baru dipakai secara konsisten.

## Kriteria penerimaan

- Duplikasi nyata yang terpilih memiliki satu implementasi bersama atau aturan bersama.
- Tidak muncul abstraksi berlebihan atau komponen dengan banyak flag kondisional yang sulit dipahami.
- Role, permission, API, tampilan, aksesibilitas, responsive behavior, dan state halaman tetap benar.
- Kode yang dihapus terbukti tidak terpakai.
- Test/lint/build yang tersedia berhasil; jika ada yang gagal sebelumnya, laporkan terpisah.
- Diff hanya berisi refactor frontend yang relevan.
- Laporan akhir memuat:
  - Kandidat duplikasi yang ditemukan.
  - Yang digabung/dihapus dan alasan singkatnya.
  - Yang sengaja tidak digabung dan alasannya.
  - File yang berubah dan hasil test/build.
  - Risiko atau pekerjaan lanjutan yang masih tersisa.
