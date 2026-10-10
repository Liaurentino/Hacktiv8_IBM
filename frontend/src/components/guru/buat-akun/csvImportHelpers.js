export function parseCsvText(text, defaultClass) {
  if (!text || !text.trim()) {
    return { error: '', rows: [] };
  }

  try {
    const lines = text.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      return {
        error: 'File CSV minimal harus berisi baris header dan minimal 1 baris data murid.',
        rows: []
      };
    }

    const firstLine = lines[0];
    const delimiter = firstLine.includes(';') ? ';' : ',';
    const rawHeaders = firstLine.split(delimiter).map((h) => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
    const findIndex = (aliases) => rawHeaders.findIndex((h) => aliases.some((a) => h.includes(a)));

    const nameIdx = findIndex(['nama', 'name', 'student_name', 'nama siswa']);
    const nisnIdx = findIndex(['nisn', 'nis', 'no induk', 'nomor induk']);
    const phoneIdx = findIndex(['hp', 'telepon', 'phone', 'no_hp', 'nomor hp', 'whatsapp']);
    const emailIdx = findIndex(['email', 'surel', 'mail']);
    const classIdx = findIndex(['kelas', 'class', 'rombongan']);
    const genderIdx = findIndex(['gender', 'jk', 'jenis kelamin', 'kelamin']);
    const scoreIdx = findIndex(['nilai', 'score', 'rata_rata', 'rata-rata', 'academic']);
    const parentPhoneIdx = findIndex(['wali', 'ortu', 'parent', 'orang tua']);

    if (nameIdx === -1 && nisnIdx === -1) {
      return {
        error: 'Header CSV harus memiliki kolom nama (contoh: "nama") dan nomor induk (contoh: "nisn").',
        rows: []
      };
    }

    const parsed = [];
    for (let i = 1; i < lines.length; i++) {
      const rawLine = lines[i].trim();
      if (!rawLine) continue;
      const cols = rawLine.split(delimiter).map((c) => c.trim().replace(/^["']|["']$/g, ''));

      const name = (cols[nameIdx] || '').trim();
      const nisn = (cols[nisnIdx] || '').trim();
      const phone = phoneIdx !== -1 ? (cols[phoneIdx] || '').trim() : '';
      const email = emailIdx !== -1 && cols[emailIdx] ? cols[emailIdx].trim().toLowerCase() : (nisn ? `${nisn}@siswa.sch.id` : '');
      const className = classIdx !== -1 && cols[classIdx] ? cols[classIdx].trim() : (defaultClass || 'XI IPA 2');
      const rawGender = genderIdx !== -1 && cols[genderIdx] ? cols[genderIdx].trim().toUpperCase() : 'L';
      const gender = rawGender.startsWith('P') ? 'P' : 'L';
      const rawScore = scoreIdx !== -1 ? parseFloat(cols[scoreIdx]) : 80;
      const academicScore = isNaN(rawScore) ? 80 : rawScore;
      const parentPhone = parentPhoneIdx !== -1 ? (cols[parentPhoneIdx] || '').trim() : '';

      if (name && nisn) {
        parsed.push({
          id: i,
          name,
          nisn,
          phone,
          email,
          className,
          gender,
          academicScore,
          parentPhone
        });
      }
    }

    if (parsed.length === 0) {
      return {
        error: 'Tidak ditemukan baris data murid yang valid (Nama dan NISN tidak boleh kosong).',
        rows: []
      };
    }

    return { error: '', rows: parsed };
  } catch (err) {
    return {
      error: 'Gagal memproses struktur CSV: ' + err.message,
      rows: []
    };
  }
}

export function exportBatchToCsv(batchResult) {
  if (!batchResult || !batchResult.created || batchResult.created.length === 0) return;
  let csvContent = 'No,Nama Siswa,NISN,Kelas,Email Login,Password Awal\n';
  batchResult.created.forEach((item, idx) => {
    const c = item.credentials;
    csvContent += `"${idx + 1}","${c.name}","${c.nisn}","${c.className}","${c.email}","${c.password}"\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `rekap_kredensial_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
