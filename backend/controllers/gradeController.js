import GradeModel from '../models/gradeModel.js';

export const getSubjects = (req, res) => {
  let subjects = GradeModel.getAllSubjects();
  if (req.user && (req.user.role === 'guru_mapel' || req.user.role === 'guru')) {
    if (req.user.subject_key) {
      subjects = subjects.filter((s) => s.key === req.user.subject_key);
    }
  }
  res.json({
    status: 'success',
    subjects
  });
};

export const getStudentGrades = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    if (isNaN(studentId)) {
      return res.status(400).json({ status: 'error', message: 'ID siswa tidak valid.' });
    }

    const grades = await GradeModel.getGradesByStudent(studentId);
    res.json({
      status: 'success',
      studentId,
      count: grades.length,
      grades
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const getGradesBySubject = async (req, res) => {
  try {
    const { subjectKey } = req.params;
    if (!subjectKey) {
      return res.status(400).json({ status: 'error', message: 'Parameter subjectKey wajib diisi.' });
    }

    // Role check: Guru Mapel hanya dapat melihat nilai mata pelajaran yang diampunya
    if (req.user && (req.user.role === 'guru_mapel' || req.user.role === 'guru')) {
      if (req.user.subject_key && req.user.subject_key !== subjectKey) {
        return res.status(403).json({
          status: 'error',
          message: `Akses Ditolak: Anda terdaftar sebagai guru [${req.user.subject_name || req.user.subject_key}]. Anda tidak memiliki wewenang untuk melihat nilai mata pelajaran lain.`
        });
      }
    }

    const students = await GradeModel.getGradesBySubject(subjectKey);
    res.json({
      status: 'success',
      subjectKey,
      count: students.length,
      students
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const updateGrade = async (req, res) => {
  try {
    const { studentId, subjectKey } = req.params;
    const { scores } = req.body;

    // P5: Guru BK tidak bisa edit nilai
    if (req.user && req.user.role === 'guru_bk') {
      return res.status(403).json({
        status: 'error',
        message: 'Akses Ditolak: Guru BK hanya memiliki akses melihat (read-only) nilai untuk konseling.'
      });
    }

    if (!scores || !Array.isArray(scores)) {
      return res.status(400).json({
        status: 'error',
        message: 'Nilai siswa (array) wajib dikirimkan dalam format array.'
      });
    }

    // P5: Teruskan subject_key guru ke model untuk validasi wewenang
    const teacherSubjectKey = (req.user?.role === 'guru_mapel' || req.user?.role === 'guru')
      ? (req.user.subject_key || null)
      : null;

    const updated = await GradeModel.updateStudentGrade(
      Number(studentId),
      subjectKey,
      scores,
      teacherSubjectKey
    );

    res.json({
      status: 'success',
      message: `Nilai ${updated.subject_name || subjectKey} berhasil disimpan!`,
      data: updated
    });
  } catch (err) {
    const status = err.message.startsWith('Akses ditolak') ? 403 :
                   err.message.includes('tidak dikenal') ? 400 : 500;
    res.status(status).json({ status: 'error', message: err.message });
  }
};


export const batchUpdateGrades = async (req, res) => {
  try {
    const { subjectKey } = req.params;
    const { items } = req.body;

    // Check Role: Guru BK TIDAK BISA edit nilai
    if (req.user && req.user.role === 'guru_bk') {
      return res.status(403).json({
        status: 'error',
        message: 'Akses Ditolak: Guru BK hanya memiliki akses melihat (read-only) nilai untuk konseling. Penginputan nilai adalah wewenang Guru Mata Pelajaran.'
      });
    }

    // Check Role: Guru Mapel hanya bisa edit mapel yang diampunya
    if (req.user && (req.user.role === 'guru_mapel' || req.user.role === 'guru')) {
      if (req.user.subject_key && req.user.subject_key !== subjectKey) {
        return res.status(403).json({
          status: 'error',
          message: `Akses Ditolak: Anda terdaftar sebagai guru [${req.user.subject_name || req.user.subject_key}]. Anda tidak memiliki wewenang mengedit nilai mata pelajaran lain.`
        });
      }
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Daftar nilai (items) wajib berupa array yang tidak kosong.'
      });
    }

    const updatedList = await GradeModel.batchUpdateGrades(subjectKey, items);

    res.json({
      status: 'success',
      message: `Berhasil memperbarui ${updatedList.length} nilai murid untuk mapel ${subjectKey.toUpperCase()}!`,
      count: updatedList.length,
      data: updatedList
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
