import { DatabaseSync } from 'node:sqlite';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data', 'bk_luna.db');

const db = new DatabaseSync(dbPath);
const defaultPassword = 'password123';
const salt = bcrypt.genSaltSync(10);
const passwordHash = bcrypt.hashSync(defaultPassword, salt);
const now = new Date().toISOString();

const students = db.prepare('SELECT id, user_id, nisn, name, email FROM students').all();
console.log('Current students count:', students.length);

const EMAIL_MAP = {
  '20240199': 'alisha@siswa.sch.id',
  '20240042': 'priya@siswa.sch.id',
  '20240015': 'andi@siswa.sch.id',
  '20240078': 'siti@siswa.sch.id',
  '20240034': 'dewi@siswa.sch.id',
  '20240056': 'rian@siswa.sch.id',
  '20240061': 'clara@siswa.sch.id',
  '20249999': 'siswa@siswa.sch.id'
};

for (const s of students) {
  const desiredEmail = EMAIL_MAP[s.nisn] || (s.email && s.email.trim() ? s.email.trim() : `${s.nisn}@siswa.sch.id`);

  // 1. Update email di students jika kosong
  if (!s.email || s.email.trim() === '') {
    db.prepare('UPDATE students SET email = ? WHERE id = ?').run(desiredEmail, s.id);
  }

  // 2. Cek apakah user sudah ada di users table
  let u = db.prepare('SELECT id, email FROM users WHERE LOWER(email) = LOWER(?)').get(desiredEmail);
  if (!u) {
    const avatar = s.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const res = db.prepare('INSERT INTO users (email, password_hash, name, role, avatar, provider, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
      desiredEmail,
      passwordHash,
      s.name,
      'siswa',
      avatar,
      'local',
      now
    );
    u = { id: res.lastInsertRowid, email: desiredEmail };
  }

  // 3. Link students.user_id ke users.id
  db.prepare('UPDATE students SET user_id = ? WHERE id = ?').run(u.id, s.id);
}

const updatedStudents = db.prepare('SELECT id, user_id, nisn, name, email FROM students').all();
console.log('Updated students in DB:');
console.table(updatedStudents);

const updatedUsers = db.prepare('SELECT id, email, name, role FROM users WHERE role = ?').all('siswa');
console.log('Student users in DB:');
console.table(updatedUsers);
