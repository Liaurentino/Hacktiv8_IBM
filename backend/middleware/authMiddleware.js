import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'luna_bk_secret_jwt_key_2026';

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Token otentikasi tidak ditemukan.' });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ status: 'error', message: 'Sesi kedaluwarsa atau token tidak valid.' });
    }
    try {
      const user = await UserModel.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ status: 'error', message: 'Pengguna tidak ditemukan di database.' });
      }
      req.user = user;
      next();
    } catch (dbErr) {
      console.error('⚠️ [authMiddleware] Error fetching user from DB:', dbErr.message);
      return res.status(500).json({ status: 'error', message: 'Koneksi database sementara terganggu.' });
    }
  });
}

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      subject_key: user.subject_key || null,
      subject_name: user.subject_name || null
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyTokenOptional(authHeader) {
  if (!authHeader) return null;
  try {
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

export async function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const decoded = verifyTokenOptional(authHeader);
    if (decoded && decoded.id) {
      try {
        const user = await UserModel.findById(decoded.id);
        if (user) req.user = user;
      } catch (e) {
        // Token tidak valid atau db terputus, lanjutkan tanpa req.user
      }
    }
  }
  next();
}

/**
 * Middleware RBAC: Membatasi hak akses endpoint berdasarkan role
 * Contoh penggunaan: requireRole('guru_bk') atau requireRole('guru_mapel', 'admin')
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Normalisasi role guru
    const userRole = req.user?.role;
    
    // Izinkan jika role cocok langsung atau jika guru_mapel cocok dengan role 'guru'
    const isAllowed = allowedRoles.some((role) => {
      if (role === userRole) return true;
      if (role === 'guru_mapel' && (userRole === 'guru' || userRole === 'guru_mapel')) return true;
      if (role === 'guru_bk' && userRole === 'guru_bk') return true;
      return false;
    });

    if (!isAllowed) {
      return res.status(403).json({
        status: 'error',
        message: `Akses ditolak: Anda login sebagai ${userRole || 'tamu'}, namun tindakan ini memerlukan hak akses [${allowedRoles.join(', ')}].`
      });
    }

    next();
  };
};
