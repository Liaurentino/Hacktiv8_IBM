import { isPostgres, pgPool, sqliteDb } from '../config/db.js';
import bcrypt from 'bcryptjs';

export const UserModel = {
  async findByEmail(email) {
    if (isPostgres) {
      const res = await pgPool.query('SELECT * FROM users WHERE email = $1', [email]);
      return res.rows[0] || null;
    }
    return sqliteDb.prepare('SELECT * FROM users WHERE email = ?').get(email) || null;
  },

  async findById(id) {
    if (isPostgres) {
      const res = await pgPool.query(
        'SELECT id, email, name, role, avatar, provider, subject_key, subject_name, created_at FROM users WHERE id = $1',
        [id]
      );
      return res.rows[0] || null;
    }
    return sqliteDb.prepare(
      'SELECT id, email, name, role, avatar, provider, subject_key, subject_name, created_at FROM users WHERE id = ?'
    ).get(id) || null;
  },

  async create({
    email,
    password,
    name,
    role = 'siswa',
    avatar = '',
    provider = 'local',
    googleId = null,
    subjectKey = null,
    subjectName = null
  }) {
    let passwordHash = null;
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      passwordHash = bcrypt.hashSync(password, salt);
    }
    const now = new Date().toISOString();

    if (isPostgres) {
      const res = await pgPool.query(
        `INSERT INTO users (email, password_hash, name, role, avatar, provider, google_id, subject_key, subject_name, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [email, passwordHash, name, role, avatar, provider, googleId, subjectKey, subjectName, now]
      );
      return res.rows[0];
    }

    const stmt = sqliteDb.prepare(`
      INSERT INTO users (email, password_hash, name, role, avatar, provider, google_id, subject_key, subject_name, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const res = stmt.run(email, passwordHash, name, role, avatar, provider, googleId, subjectKey, subjectName, now);
    return this.findById(res.lastInsertRowid);
  },

  async upsertGoogleUser({ email, name, avatar, googleId, role = 'guru_bk' }) {
    const existing = await this.findByEmail(email);
    if (existing) {
      if (isPostgres) {
        await pgPool.query(
          'UPDATE users SET google_id = $1, avatar = COALESCE(avatar, $2) WHERE id = $3',
          [googleId, avatar, existing.id]
        );
      } else {
        sqliteDb.prepare('UPDATE users SET google_id = ?, avatar = COALESCE(avatar, ?) WHERE id = ?')
          .run(googleId, avatar, existing.id);
      }
      return this.findById(existing.id);
    }
    return this.create({
      email,
      name,
      avatar,
      role,
      provider: 'google',
      googleId
    });
  },

  verifyPassword(plainPassword, passwordHash) {
    if (!plainPassword || !passwordHash) return false;
    return bcrypt.compareSync(plainPassword, passwordHash);
  },

  async update(id, { name, email, avatar, subjectKey, subjectName }) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const newName = name !== undefined ? name : existing.name;
    const newEmail = email !== undefined ? email.trim().toLowerCase() : existing.email;
    const newAvatar = avatar !== undefined ? avatar : existing.avatar;
    const newSubjectKey = subjectKey !== undefined ? subjectKey : existing.subject_key;
    const newSubjectName = subjectName !== undefined ? subjectName : existing.subject_name;

    if (isPostgres) {
      const res = await pgPool.query(
        `UPDATE users SET name = $1, email = $2, avatar = $3, subject_key = $4, subject_name = $5
         WHERE id = $6 RETURNING id, email, name, role, avatar, provider, subject_key, subject_name, created_at`,
        [newName, newEmail, newAvatar, newSubjectKey, newSubjectName, id]
      );
      return res.rows[0];
    }

    sqliteDb.prepare('UPDATE users SET name = ?, email = ?, avatar = ?, subject_key = ?, subject_name = ? WHERE id = ?')
      .run(newName, newEmail, newAvatar, newSubjectKey, newSubjectName, id);
    return this.findById(id);
  },

  async updatePassword(id, newPassword) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    if (isPostgres) {
      await pgPool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, id]);
    } else {
      sqliteDb.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, id);
    }
    return true;
  }
};

export default UserModel;
