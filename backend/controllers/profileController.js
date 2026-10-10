import UserModel from '../models/userModel.js';
import StudentModel from '../models/studentModel.js';
import { verifyTokenOptional } from '../middleware/authMiddleware.js';

export const updateProfile = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    let userId = null;
    if (authHeader) {
      const decoded = verifyTokenOptional(authHeader);
      if (decoded) userId = decoded.id;
    }
    if (!userId && req.body.userId) {
      userId = Number(req.body.userId);
    }
    if (!userId && req.body.email) {
      const found = await UserModel.findByEmail(req.body.email);
      if (found) userId = found.id;
    }

    if (!userId) {
      return res.status(400).json({ status: 'error', message: 'User ID atau sesi tidak ditemukan.' });
    }

    const existingUser = await UserModel.findById(userId);
    const isSiswa = existingUser?.role === 'siswa';

    const { name, email, avatar, phone, className, gender, careerTitle, careerDesc, riasecCode, notes } = req.body;
    
    // For siswa, registered name cannot be edited (locked by school)
    const finalName = (isSiswa && existingUser?.name) ? existingUser.name : (name !== undefined ? name : existingUser?.name);
    const updatedUser = await UserModel.update(userId, { name: finalName, email, avatar });
    
    let student = await StudentModel.getByUserId(userId);
    if (!student && email) {
      student = await StudentModel.getByEmail(email);
    }
    if (!student && req.body.studentId) {
      student = await StudentModel.getById(Number(req.body.studentId));
    }
    if (!student && req.body.nisn) {
      student = await StudentModel.getByNisn(req.body.nisn);
    }

    let updatedStudent = null;
    if (student) {
      updatedStudent = await StudentModel.update(student.id, {
        name: isSiswa ? student.name : (name !== undefined ? name : student.name),
        email: email !== undefined ? email : student.email,
        phone: phone !== undefined ? phone : student.phone,
        className: className !== undefined ? className : student.class_name,
        gender: gender !== undefined ? gender : student.gender,
        careerTitle: careerTitle !== undefined ? careerTitle : student.career_title,
        careerDesc: careerDesc !== undefined ? careerDesc : student.career_desc,
        riasecCode: isSiswa ? student.riasec_code : (riasecCode !== undefined ? riasecCode : student.riasec_code),
        notes: notes !== undefined ? notes : student.notes
      });
    }

    res.json({
      status: 'success',
      message: 'Profil berhasil diperbarui di database!',
      user: updatedUser,
      student: updatedStudent
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Gagal memperbarui profil: ' + err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    let userId = null;
    if (authHeader) {
      const decoded = verifyTokenOptional(authHeader);
      if (decoded) userId = decoded.id;
    }
    if (!userId && req.body.userId) {
      userId = Number(req.body.userId);
    }
    if (!userId && req.body.email) {
      const found = await UserModel.findByEmail(req.body.email);
      if (found) userId = found.id;
    }

    if (!userId) {
      return res.status(400).json({ status: 'error', message: 'User ID atau sesi tidak ditemukan.' });
    }

    const { oldPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ status: 'error', message: 'Password baru minimal 6 karakter.' });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Pengguna tidak ditemukan.' });
    }

    if (oldPassword && user.password_hash) {
      const isValid = UserModel.verifyPassword(oldPassword, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ status: 'error', message: 'Password lama tidak sesuai.' });
      }
    }

    await UserModel.updatePassword(userId, newPassword);

    res.json({
      status: 'success',
      message: 'Password berhasil diperbarui di database!'
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Gagal mengubah password: ' + err.message });
  }
};
