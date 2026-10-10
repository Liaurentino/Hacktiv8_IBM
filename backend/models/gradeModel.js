import { isPostgres, pgPool, sqliteDb, calculateGrade, MAPEL_LIST, MAPEL_MAP } from '../config/db.js';
import { StudentModel } from './studentModel.js';

export const GradeModel = {
  // Ambil daftar 12 mapel resmi
  getAllSubjects() {
    return MAPEL_LIST;
  },

  // Ambil semua murid beserta nilai khusus 1 mapel (untuk Guru Mapel)
  async getGradesBySubject(subjectKey) {
    const subjectName = MAPEL_MAP[subjectKey] || subjectKey;

    if (isPostgres) {
      const res = await pgPool.query(`
        SELECT 
          s.id AS student_id,
          s.name AS student_name,
          s.nisn,
          s.class_name,
          s.gender,
          COALESCE(g.id, 0) AS grade_id,
          COALESCE(g.subject_key, $1) AS subject_key,
          COALESCE(g.subject_name, $2) AS subject_name,
          COALESCE(g.scores_json, '[]') AS scores_json,
          COALESCE(g.avg_score, 0) AS avg_score,
          COALESCE(g.min_score, 0) AS min_score,
          COALESCE(g.max_score, 0) AS max_score,
          COALESCE(g.letter_grade, 'E') AS letter_grade
        FROM students s
        LEFT JOIN grades g ON g.student_id = s.id AND g.subject_key = $1
        ORDER BY s.rank ASC, s.name ASC
      `, [subjectKey, subjectName]);

      return res.rows.map(r => ({
        ...r,
        scores: typeof r.scores_json === 'string' ? JSON.parse(r.scores_json || '[]') : (r.scores_json || [])
      }));
    }

    const rows = sqliteDb.prepare(`
      SELECT 
        s.id AS student_id,
        s.name AS student_name,
        s.nisn,
        s.class_name,
        s.gender,
        COALESCE(g.id, 0) AS grade_id,
        COALESCE(g.subject_key, ?) AS subject_key,
        COALESCE(g.subject_name, ?) AS subject_name,
        COALESCE(g.scores_json, '[]') AS scores_json,
        COALESCE(g.avg_score, 0) AS avg_score,
        COALESCE(g.min_score, 0) AS min_score,
        COALESCE(g.max_score, 0) AS max_score,
        COALESCE(g.letter_grade, 'E') AS letter_grade
      FROM students s
      LEFT JOIN grades g ON g.student_id = s.id AND g.subject_key = ?
      ORDER BY s.rank ASC, s.name ASC
    `).all(subjectKey, subjectName, subjectKey);

    return rows.map(r => ({
      ...r,
      scores: JSON.parse(r.scores_json || '[]')
    }));
  },

  // P5: Validasi subject key ada di daftar resmi
  // P4: Simpan nilai dengan upsert atomik (ON CONFLICT)
  async updateStudentGrade(studentId, subjectKey, scores, teacherSubjectKey = null) {
    // P5: Validasi subject key ada di daftar resmi 11 mapel
    if (!MAPEL_MAP[subjectKey]) {
      throw new Error(`Mata pelajaran '${subjectKey}' tidak dikenal. Gunakan salah satu dari: ${Object.keys(MAPEL_MAP).join(', ')}`);
    }

    // P5: Validasi teacher hanya bisa ubah mapel wewenangnya
    if (teacherSubjectKey && teacherSubjectKey !== subjectKey) {
      throw new Error(`Akses ditolak: Guru mata pelajaran '${MAPEL_MAP[teacherSubjectKey]}' tidak berwenang mengubah nilai '${MAPEL_MAP[subjectKey]}'.`);
    }

    if (!Array.isArray(scores) || scores.length === 0) {
      throw new Error('Nilai harus berupa array angka yang valid.');
    }

    // P5: Terima null sebagai nilai kosong (belum diinput), jangan konversi ke 0
    const cleanScores = scores.map(s => {
      if (s === null || s === undefined || s === '') return null;
      const num = Number(s);
      return isNaN(num) ? null : Math.max(0, Math.min(100, num));
    });

    // P5: Hitung statistik hanya dari skor valid (non-null)
    const validScores = cleanScores.filter(s => s !== null);
    if (validScores.length === 0) {
      throw new Error('Tidak ada nilai valid. Minimal satu nilai harus diisi.');
    }
    const avg = +(validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1);
    const min = Math.min(...validScores);
    const max = Math.max(...validScores);
    const letter = calculateGrade(avg);
    const subjectName = MAPEL_MAP[subjectKey];

    if (isPostgres) {
      // P4: Upsert atomik PostgreSQL
      const res = await pgPool.query(`
        INSERT INTO grades (student_id, subject_key, subject_name, scores_json, avg_score, min_score, max_score, letter_grade)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (student_id, subject_key) DO UPDATE SET
          subject_name  = EXCLUDED.subject_name,
          scores_json   = EXCLUDED.scores_json,
          avg_score     = EXCLUDED.avg_score,
          min_score     = EXCLUDED.min_score,
          max_score     = EXCLUDED.max_score,
          letter_grade  = EXCLUDED.letter_grade
        RETURNING *
      `, [studentId, subjectKey, subjectName, JSON.stringify(cleanScores), avg, min, max, letter]);

      const avgRes = await pgPool.query(
        'SELECT AVG(avg_score) as total_avg FROM grades WHERE student_id = $1',
        [studentId]
      );
      const overallAvg = +(Number(avgRes.rows[0]?.total_avg) || avg).toFixed(1);
      const overallLetter = calculateGrade(overallAvg);
      await pgPool.query(
        'UPDATE students SET academic_score=$1, avg_grade=$1, letter_grade=$2, updated_at=NOW() WHERE id=$3',
        [overallAvg, overallLetter, studentId]
      );

      return { ...res.rows[0], scores: cleanScores, overallAvg, overallLetter };
    }

    // P4: Upsert atomik SQLite dengan ON CONFLICT(student_id, subject_key)
    sqliteDb.prepare(`
      INSERT INTO grades (student_id, subject_key, subject_name, scores_json, avg_score, min_score, max_score, letter_grade)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(student_id, subject_key) DO UPDATE SET
        subject_name = excluded.subject_name,
        scores_json  = excluded.scores_json,
        avg_score    = excluded.avg_score,
        min_score    = excluded.min_score,
        max_score    = excluded.max_score,
        letter_grade = excluded.letter_grade
    `).run(studentId, subjectKey, subjectName, JSON.stringify(cleanScores), avg, min, max, letter);

    const avgRes = sqliteDb.prepare(
      'SELECT AVG(avg_score) as total_avg FROM grades WHERE student_id = ?'
    ).get(studentId);
    const overallAvg = +(Number(avgRes?.total_avg) || avg).toFixed(1);
    const overallLetter = calculateGrade(overallAvg);

    sqliteDb.prepare(
      'UPDATE students SET academic_score=?, avg_grade=?, letter_grade=?, updated_at=? WHERE id=?'
    ).run(overallAvg, overallLetter, new Date().toISOString(), studentId);

    // Baca kembali row yang tersimpan
    const saved = sqliteDb.prepare(
      'SELECT * FROM grades WHERE student_id = ? AND subject_key = ?'
    ).get(studentId, subjectKey);

    return {
      ...saved,
      scores: cleanScores,
      overallAvg,
      overallLetter
    };
  },

  // Batch update nilai mapel untuk banyak murid sekaligus (dari CSV / Link)
  async batchUpdateGrades(subjectKey, items) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Data batch nilai harus berupa array yang tidak kosong.');
    }

    const results = [];
    for (const item of items) {
      let studentId = item.studentId;
      const cleanNisn = item.nisn ? String(item.nisn).trim() : '';

      if (!studentId && cleanNisn) {
        if (isPostgres) {
          const sRes = await pgPool.query('SELECT id FROM students WHERE nisn = $1', [cleanNisn]);
          studentId = sRes.rows[0]?.id;
        } else {
          const sRes = sqliteDb.prepare('SELECT id FROM students WHERE nisn = ?').get(cleanNisn);
          studentId = sRes?.id;
        }
      }

      // Jika murid belum terdaftar di kelas tapi ada NISN dan Nama di file/sheet, daftarkan otomatis ke kelas XI IPA 2
      if (!studentId && cleanNisn && (item.name || item.studentName)) {
        const studentName = item.name || item.studentName;
        const scores = Array.isArray(item.scores) ? item.scores : [];
        const avg = scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : 80;
        const newStudent = await StudentModel.create({
          nisn: cleanNisn,
          name: studentName,
          className: item.className || 'XI IPA 2',
          academicScore: avg,
          triageLevel: avg >= 85 ? 'HIJAU' : (avg >= 70 ? 'KUNING' : 'MERAH'),
          counselingStatus: 'Normal'
        });
        studentId = newStudent.id;
      }

      if (studentId && Array.isArray(item.scores) && item.scores.length > 0) {
        const updated = await this.updateStudentGrade(studentId, subjectKey, item.scores);
        results.push(updated);
      }
    }
    return results;
  },

  // P2: GET hanya membaca — tidak pernah membuat atau mengubah baris nilai
  // Mengembalikan grades: [] jika belum ada nilai untuk siswa ini
  async getGradesByStudent(studentId) {
    const numId = Number(studentId);
    if (isNaN(numId)) return [];

    if (isPostgres) {
      const res = await pgPool.query(
        'SELECT * FROM grades WHERE student_id = $1 ORDER BY id ASC',
        [numId]
      );
      return res.rows.map(g => ({
        ...g,
        scores: typeof g.scores_json === 'string' ? JSON.parse(g.scores_json || '[]') : (g.scores_json || [])
      }));
    }

    const rows = sqliteDb.prepare(
      'SELECT * FROM grades WHERE student_id = ? ORDER BY id ASC'
    ).all(numId);
    return rows.map(g => ({
      ...g,
      scores: JSON.parse(g.scores_json || '[]')
    }));
  }
};

export default GradeModel;
