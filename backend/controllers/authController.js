import UserModel from '../models/userModel.js';
import StudentModel from '../models/studentModel.js';
import { generateToken } from '../middleware/authMiddleware.js';
export { updateProfile, changePassword } from './profileController.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email atau NISN dan password wajib diisi.'
      });
    }

    const identifier = email.trim().toLowerCase();
    let user = await UserModel.findByEmail(identifier);

    // If not found by email, check if identifier is a student NISN
    if (!user) {
      const student = await StudentModel.getByNisn(identifier);
      if (student) {
        if (student.email) {
          user = await UserModel.findByEmail(student.email.trim().toLowerCase());
        }
        if (!user && student.user_id) {
          user = await UserModel.findById(student.user_id);
        }
      }
    }

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Email atau NISN belum terdaftar di sistem sekolah.'
      });
    }

    const isValid = UserModel.verifyPassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Password yang Anda masukkan salah.'
      });
    }

    const token = generateToken(user);

    let studentId = null;
    let nisn = null;
    let className = null;
    if (user.role === 'siswa') {
      const s = await StudentModel.getByUserId(user.id) || (user.email ? await StudentModel.getByEmail(user.email) : null);
      if (s) {
        studentId = s.id;
        nisn = s.nisn;
        className = s.class_name;
      }
    }

    res.json({
      status: 'success',
      message: 'Login berhasil.',
      token,
      user: {
        id: user.id,
        student_id: studentId,
        nisn,
        class_name: className,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        provider: user.provider,
        subject_key: user.subject_key || null,
        subject_name: user.subject_name || null
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'guru_bk' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Nama, email, dan password wajib diisi.'
      });
    }

    if (role === 'siswa') {
      return res.status(403).json({
        status: 'error',
        message: 'Akun siswa tidak dapat dibuat melalui pendaftaran mandiri. Hubungi Guru BK untuk pembuatan akun.'
      });
    }

    const existing = await UserModel.findByEmail(email.trim().toLowerCase());
    if (existing) {
      return res.status(409).json({
        status: 'error',
        message: 'Email ini sudah terdaftar. Silakan login.'
      });
    }

    const avatar = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
    const newUser = await UserModel.create({
      name,
      email: email.trim().toLowerCase(),
      password,
      role,
      avatar
    });

    const token = generateToken(newUser);
    res.status(201).json({
      status: 'success',
      message: 'Akun berhasil dibuat.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        provider: newUser.provider,
        subject_key: newUser.subject_key || null,
        subject_name: newUser.subject_name || null
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal membuat akun: ' + err.message
    });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { email, name, avatar, googleId, role = 'guru_bk' } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Data email dari Google OAuth tidak valid.'
      });
    }

    if (role === 'siswa') {
      return res.status(403).json({
        status: 'error',
        message: 'Siswa tidak dapat menggunakan Google OAuth. Login menggunakan email/NISN dan password yang diberikan guru.'
      });
    }

    const user = await UserModel.upsertGoogleUser({
      email: email.trim().toLowerCase(),
      name: name || 'Google User',
      avatar: avatar || 'G',
      googleId: googleId || `google_${Date.now()}`,
      role
    });

    const token = generateToken(user);
    res.json({
      status: 'success',
      message: 'Otentikasi Google OAuth berhasil disambungkan ke database.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        provider: user.provider,
        subject_key: user.subject_key || null,
        subject_name: user.subject_name || null
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal memproses Google OAuth: ' + err.message
    });
  }
};

export const getMe = async (req, res) => {
  let studentInfo = {};
  if (req.user && req.user.role === 'siswa') {
    const s = await StudentModel.getByUserId(req.user.id) || (req.user.email ? await StudentModel.getByEmail(req.user.email) : null);
    if (s) {
      studentInfo = {
        student_id: s.id,
        nisn: s.nisn,
        class_name: s.class_name
      };
    }
  }
  res.json({
    status: 'success',
    user: {
      ...req.user,
      ...studentInfo
    }
  });
};

export const logout = (req, res) => {
  res.json({
    status: 'success',
    message: 'Logout berhasil.'
  });
};
