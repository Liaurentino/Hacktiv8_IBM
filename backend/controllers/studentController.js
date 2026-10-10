import StudentModel from '../models/studentModel.js';
import UserModel from '../models/userModel.js';
import { verifyTokenOptional } from '../middleware/authMiddleware.js';
import {
  generateStudentPassword,
  createStudentAccount,
  processBatchStudents,
  filterStudentForTeacher
} from '../services/studentService.js';

export const getAllStudents = async (req, res) => {
  try {
    const { search, className, status, triage, includeGrades } = req.query;
    let students = await StudentModel.getAll({
      search, className, status, triage,
      includeGrades: includeGrades === 'true' || includeGrades === true
    });
    if (req.user && (req.user.role === 'guru_mapel' || req.user.role === 'guru')) {
      students = students.map((s) => filterStudentForTeacher(s, req.user.subject_key));
    }
    res.json({ status: 'success', count: students.length, students });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const generatePassword = (req, res) => {
  res.json({ status: 'success', password: generateStudentPassword(8) });
};

export const getStudentById = async (req, res) => {
  try {
    const studentId = Number(req.params.id);
    if (isNaN(studentId)) {
      return res.status(400).json({ status: 'error', message: 'ID siswa tidak valid.' });
    }
    let student = await StudentModel.getById(studentId);
    if (!student) {
      return res.status(404).json({ status: 'error', message: 'Siswa tidak ditemukan.' });
    }
    if (req.user && (req.user.role === 'guru_mapel' || req.user.role === 'guru') && req.query.forPortal !== 'siswa' && req.query.allGrades !== 'true') {
      student = filterStudentForTeacher(student, req.user.subject_key);
    }
    res.json({ status: 'success', student });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const decoded = verifyTokenOptional(authHeader);
      if (decoded && ['guru_mapel', 'guru', 'siswa'].includes(decoded.role)) {
        return res.status(403).json({
          status: 'error',
          message: 'Akses Ditolak: Hanya Guru BK yang memiliki wewenang untuk membuat akun siswa.'
        });
      }
    }

    const { student, credentials } = await createStudentAccount(req.body);

    res.status(201).json({
      status: 'success',
      message: `Akun siswa ${credentials.name} (${credentials.nisn}) berhasil dibuat dan terdaftar di database!`,
      student,
      credentials
    });
  } catch (err) {
    if (err.message && (err.message.includes('UNIQUE') || err.message.includes('duplicate key'))) {
      return res.status(409).json({
        status: 'error',
        message: 'NISN atau Email ini sudah terdaftar dalam database sekolah.'
      });
    }
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const batchCreateStudents = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const decoded = verifyTokenOptional(authHeader);
      if (decoded && ['guru_mapel', 'guru', 'siswa'].includes(decoded.role)) {
        return res.status(403).json({
          status: 'error',
          message: 'Akses Ditolak: Hanya Guru BK yang memiliki wewenang untuk import batch akun siswa.'
        });
      }
    }

    const { students } = req.body;
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Daftar data siswa (array) tidak ditemukan atau kosong.'
      });
    }

    const { successList, failedList } = await processBatchStudents(students);

    res.status(200).json({
      status: 'success',
      message: `Selesai memproses ${students.length} data murid: ${successList.length} berhasil dibuat, ${failedList.length} dilewati.`,
      total: students.length,
      successCount: successList.length,
      failedCount: failedList.length,
      created: successList,
      errors: failedList
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updated = await StudentModel.update(id, req.body);
    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Siswa tidak ditemukan.' });
    }
    res.json({
      status: 'success',
      message: `Data siswa ${updated.name} berhasil diperbarui di database!`,
      student: updated
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const decoded = verifyTokenOptional(authHeader);
      if (decoded && ['guru_mapel', 'guru', 'siswa'].includes(decoded.role)) {
        return res.status(403).json({
          status: 'error',
          message: 'Akses Ditolak: Hanya Guru BK yang memiliki wewenang untuk menghapus akun siswa.'
        });
      }
    }
    const id = Number(req.params.id);
    const success = await StudentModel.delete(id);
    if (!success) {
      return res.status(404).json({ status: 'error', message: 'Siswa tidak ditemukan.' });
    }
    res.json({
      status: 'success',
      message: 'Akun siswa berhasil dihapus dari database.'
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// P1 + P3: GET /api/students/me — endpoint otoritatif untuk profil siswa yang login
// Urutan: user.student_id (dari JWT) → students.user_id → students.email
export const getStudentMe = async (req, res) => {
  try {
    let student = null;

    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Token autentikasi wajib diisi.' });
    }
    if (req.user.role !== 'siswa') {
      return res.status(403).json({ status: 'error', message: 'Endpoint ini hanya untuk akun siswa.' });
    }

    // 1. Cari via user_id (paling otoritatif)
    student = await StudentModel.getByUserId(req.user.id);

    // 2. Fallback via email ternormalisasi (kompatibilitas lama)
    if (!student && req.user.email) {
      student = await StudentModel.getByEmail(req.user.email.trim().toLowerCase());
    }

    if (!student) {
      return res.status(404).json({
        status: 'unlinked',
        message: 'Akun belum terhubung dengan profil siswa. Hubungi Guru BK.'
      });
    }

    // Ambil detail lengkap dengan grades
    const detail = await StudentModel.getById(student.id);
    return res.json({ status: 'success', student: detail });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Legacy profile/me endpoint (tetap ada untuk backward compatibility)
export const getMyProfile = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    let user = null;
    if (authHeader) {
      const decoded = verifyTokenOptional(authHeader);
      if (decoded) user = await UserModel.findById(decoded.id);
    }
    const email = req.query.email || user?.email;
    const userId = user?.id || req.query.userId;

    let student = null;
    if (userId) student = await StudentModel.getByUserId(Number(userId));
    if (!student && email) student = await StudentModel.getByEmail(email);
    if (!student && req.query.nisn) student = await StudentModel.getByNisn(req.query.nisn);

    if (!student) {
      const all = await StudentModel.getAll();
      student = all.find((s) => s.email === email) || all[0] || null;
      if (student) student = await StudentModel.getById(student.id);
    } else {
      student = await StudentModel.getById(student.id);
    }

    res.json({ status: 'success', user, student });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

