/**
 * Helper & Parser CSV / Excel (.xlsx, .xls) Khusus Guru Mata Pelajaran (LUNA System)
 * 
 * Skema Baku 7 Pertemuan:
 * nisn, nama, p1, p2, p3, uts, p5, p6, uas
 */
import * as XLSX from 'xlsx';

export const MAPEL_CSV_SCHEMA = {
  columns: [
    { key: 'nisn', label: 'NISN', required: true, desc: 'Nomor Induk Siswa Nasional (kunci pencocokan murid)' },
    { key: 'nama', label: 'Nama Murid', required: false, desc: 'Nama lengkap murid (opsional untuk verifikasi visual)' },
    { key: 'p1', label: 'Pertemuan 1', required: false, desc: 'Nilai tugas/kuis P1 (0 - 100)' },
    { key: 'p2', label: 'Pertemuan 2', required: false, desc: 'Nilai tugas/kuis P2 (0 - 100)' },
    { key: 'p3', label: 'Pertemuan 3', required: false, desc: 'Nilai tugas/kuis P3 (0 - 100)' },
    { key: 'uts', label: 'UTS', required: false, desc: 'Nilai Ujian Tengah Semester (0 - 100)' },
    { key: 'p5', label: 'Pertemuan 5', required: false, desc: 'Nilai tugas/kuis P5 (0 - 100)' },
    { key: 'p6', label: 'Pertemuan 6', required: false, desc: 'Nilai tugas/kuis P6 (0 - 100)' },
    { key: 'uas', label: 'UAS', required: false, desc: 'Nilai Ujian Akhir Semester (0 - 100)' }
  ],
  totalScoresCount: 7
};

/**
 * Konversi URL Google Sheets biasa menjadi Direct CSV Export URL
 */
export function convertUrlToCsvExportUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // Pola Google Sheets: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/...
  const gSheetsMatch = trimmed.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (gSheetsMatch) {
    const sheetId = gSheetsMatch[1];
    const gidMatch = trimmed.match(/[?&#]gid=([0-9]+)/);
    const gidParam = gidMatch ? `&gid=${gidMatch[1]}` : '';
    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv${gidParam}`;
  }

  return trimmed;
}

/**
 * Parsing buffer berkas Excel (.xlsx / .xls) menjadi baris data LUNA
 */
export function parseMapelExcelBuffer(arrayBuffer, existingStudents = []) {
  try {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return { rows: [], error: 'Berkas Excel tidak memiliki sheet data.' };
    }
    const worksheet = workbook.Sheets[firstSheetName];
    const csvText = XLSX.utils.sheet_to_csv(worksheet);
    return parseMapelCsvText(csvText, existingStudents);
  } catch (err) {
    return { rows: [], error: 'Gagal membaca berkas Excel: ' + err.message };
  }
}

/**
 * Parsing teks CSV nilai mapel dan validasi terhadap data murid yang ada
 */
export function parseMapelCsvText(rawText, existingStudents = []) {
  if (!rawText || !rawText.trim()) {
    return { rows: [], error: 'Teks file nilai kosong.', stats: { total: 0, matched: 0, unmatched: 0 } };
  }

  try {
    const lines = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length < 2) {
      return {
        rows: [],
        error: 'File nilai minimal harus memuat 1 baris header kolom dan 1 baris data murid.',
        stats: { total: 0, matched: 0, unmatched: 0 }
      };
    }

    // Parse header
    const rawHeaders = splitCsvLine(lines[0]);
    const headers = rawHeaders.map((h) => h.toLowerCase().trim().replace(/['"]/g, ''));

    const nisnIdx = headers.findIndex((h) => h === 'nisn' || h === 'no_induk' || h === 'id');
    const namaIdx = headers.findIndex((h) => h === 'nama' || h === 'nama_siswa' || h === 'name');

    if (nisnIdx === -1 && namaIdx === -1) {
      return {
        rows: [],
        error: 'Header file wajib memiliki kolom "nisn" atau "nama". Silakan unduh template resmi.',
        stats: { total: 0, matched: 0, unmatched: 0 }
      };
    }

    // Map score headers (p1, p2, p3, uts, p5, p6, uas)
    const scoreSlots = [
      { key: 'p1', label: 'P1', alts: ['pertemuan_1', 'p_1', 'nilai_1', '1'] },
      { key: 'p2', label: 'P2', alts: ['pertemuan_2', 'p_2', 'nilai_2', '2'] },
      { key: 'p3', label: 'P3', alts: ['pertemuan_3', 'p_3', 'nilai_3', '3'] },
      { key: 'uts', label: 'UTS', alts: ['p4', 'pertemuan_4', 'uts_nilai', 'ujian_tengah_semester', 'mid'] },
      { key: 'p5', label: 'P5', alts: ['pertemuan_5', 'p_5', 'nilai_5', '5'] },
      { key: 'p6', label: 'P6', alts: ['pertemuan_6', 'p_6', 'nilai_6', '6'] },
      { key: 'uas', label: 'UAS', alts: ['p7', 'pertemuan_7', 'uas_nilai', 'ujian_akhir_semester', 'final'] }
    ];

    const scoreIndexes = scoreSlots.map((slot, sIdx) => {
      let idx = headers.findIndex((h) => h === slot.key);
      if (idx === -1 && slot.alts) {
        idx = headers.findIndex((h) => slot.alts.includes(h));
      }
      if (idx === -1) {
        idx = headers.findIndex((h) => h === `pertemuan_${sIdx + 1}` || h === `nilai_${sIdx + 1}`);
      }
      return idx;
    });

    const parsedRows = [];
    let matchedCount = 0;
    let unmatchedCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;

      const cols = splitCsvLine(line);
      const rawNisn = nisnIdx !== -1 && cols[nisnIdx] ? cols[nisnIdx].replace(/['"]/g, '').trim() : '';
      const rawNama = namaIdx !== -1 && cols[namaIdx] ? cols[namaIdx].replace(/['"]/g, '').trim() : '';

      if (!rawNisn && !rawNama) continue;

      // Match student from DB
      let matchedStudent = null;
      if (rawNisn && existingStudents.length > 0) {
        matchedStudent = existingStudents.find((st) => String(st.nisn).trim() === rawNisn);
      }
      if (!matchedStudent && rawNama && existingStudents.length > 0) {
        matchedStudent = existingStudents.find(
          (st) => st.student_name && st.student_name.toLowerCase().trim() === rawNama.toLowerCase()
        );
      }

      if (matchedStudent) {
        matchedCount++;
      } else {
        unmatchedCount++;
      }

      // Extract scores (7 slots)
      const scores = scoreIndexes.map((cIdx) => {
        if (cIdx !== -1 && cols[cIdx] !== undefined && cols[cIdx].trim() !== '') {
          const num = Number(cols[cIdx].replace(/['"]/g, '').trim());
          if (!isNaN(num)) {
            return Math.max(0, Math.min(100, Math.round(num)));
          }
        }
        return 75; // Default KKM jika kosong
      });

      const avg = +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);

      parsedRows.push({
        rowNum: i,
        nisn: matchedStudent ? matchedStudent.nisn : (rawNisn || '-'),
        studentName: matchedStudent ? matchedStudent.student_name : (rawNama || 'Murid Tidak Dikenal'),
        studentId: matchedStudent ? matchedStudent.student_id : null,
        className: matchedStudent ? matchedStudent.class_name : 'XI IPA 2',
        scores,
        avgScore: avg,
        isMatched: !!matchedStudent
      });
    }

    return {
      rows: parsedRows,
      error: parsedRows.length === 0 ? 'Tidak ada baris data murid yang dapat diproses.' : '',
      stats: {
        total: parsedRows.length,
        matched: matchedCount,
        unmatched: unmatchedCount
      }
    };
  } catch (err) {
    return {
      rows: [],
      error: 'Terjadi kesalahan format saat membaca file: ' + err.message,
      stats: { total: 0, matched: 0, unmatched: 0 }
    };
  }
}

/**
 * Split baris CSV dengan penanganan koma dan titik-koma
 */
function splitCsvLine(line) {
  let delimiter = ',';
  if (line.includes(';') && (line.match(/;/g) || []).length > (line.match(/,/g) || []).length) {
    delimiter = ';';
  }

  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Buat contoh teks data dari daftar murid yang ada
 */
export function generateSampleCsvContent(existingStudents = []) {
  const header = 'nisn,nama,p1,p2,p3,uts,p5,p6,uas\n';

  if (existingStudents && existingStudents.length > 0) {
    const rows = existingStudents.slice(0, 8).map((st) => {
      const scores = Array.isArray(st.scores) && st.scores.length === 7
        ? st.scores
        : [85, 88, 90, 87, 89, 91, 93];
      return `${st.nisn},"${st.student_name}",${scores.join(',')}`;
    });
    return header + rows.join('\n');
  }

  const sampleRows = [
    '20240023,"Budi Santoso",72,75,70,73,74,70,76',
    '20240042,"Priya Ramadhani",88,90,85,90,89,91,94',
    '20240019,"Farhan Maulana",70,72,68,70,69,72,75',
    '20240089,"Dimas Anggara",80,82,78,82,85,82,86',
    '20240061,"Clara Shinta",92,94,90,93,94,96,98'
  ];
  return header + sampleRows.join('\n');
}

/**
 * Unduh template Excel (.xlsx) resmi
 */
export function downloadMapelTemplateExcel(existingStudents = [], subjectName = 'Mata_Pelajaran') {
  const data = [
    ['nisn', 'nama', 'p1', 'p2', 'p3', 'uts', 'p5', 'p6', 'uas']
  ];

  if (existingStudents && existingStudents.length > 0) {
    existingStudents.slice(0, 10).forEach((st) => {
      const scores = Array.isArray(st.scores) && st.scores.length === 7
        ? st.scores
        : [85, 88, 90, 87, 89, 91, 93];
      data.push([st.nisn, st.student_name, ...scores]);
    });
  } else {
    data.push(
      ['20240023', 'Budi Santoso', 72, 75, 70, 73, 74, 70, 76],
      ['20240042', 'Priya Ramadhani', 88, 90, 85, 90, 89, 91, 94],
      ['20240019', 'Farhan Maulana', 70, 72, 68, 70, 69, 72, 75]
    );
  }

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Nilai_Mapel');
  const safeName = subjectName.toLowerCase().replace(/\s+/g, '_');
  XLSX.writeFile(workbook, `template_nilai_${safeName}.xlsx`);
}

/**
 * Download file template CSV (opsi teks murni)
 */
export function downloadMapelTemplateFile(existingStudents = [], subjectName = 'Mata_Pelajaran') {
  const content = generateSampleCsvContent(existingStudents);
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `template_nilai_${subjectName.toLowerCase().replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
