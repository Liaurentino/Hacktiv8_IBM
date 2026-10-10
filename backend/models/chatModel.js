import { isPostgres, pgPool, sqliteDb } from '../config/db.js';

export const ChatModel = {
  async getByStudentId(studentId) {
    if (isPostgres) {
      const res = await pgPool.query('SELECT * FROM chat_messages WHERE student_id = $1 ORDER BY id ASC', [studentId]);
      return res.rows;
    }
    return sqliteDb.prepare('SELECT * FROM chat_messages WHERE student_id = ? ORDER BY id ASC').all(studentId);
  },

  async save({ studentId, sender, message, emotion = 'senang' }) {
    const now = new Date().toISOString();
    if (isPostgres) {
      const res = await pgPool.query(`
        INSERT INTO chat_messages (student_id, sender, message, emotion, timestamp)
        VALUES ($1, $2, $3, $4, $5) RETURNING *
      `, [studentId, sender, message, emotion, now]);
      return res.rows[0];
    }
    const stmt = sqliteDb.prepare(`
      INSERT INTO chat_messages (student_id, sender, message, emotion, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `);
    const res = stmt.run(studentId, sender, message, emotion, now);
    return sqliteDb.prepare('SELECT * FROM chat_messages WHERE id = ?').get(res.lastInsertRowid);
  }
};

export default ChatModel;
