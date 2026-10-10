import { isPostgres, pgPool, sqliteDb } from '../config/db.js';

export const FlagModel = {
  async getAll() {
    if (isPostgres) {
      const res = await pgPool.query('SELECT * FROM counseling_flags ORDER BY id DESC');
      return res.rows.map((r) => ({
        ...r,
        history: typeof r.history_json === 'string' ? JSON.parse(r.history_json || '[]') : (r.history_json || [])
      }));
    }
    const rows = sqliteDb.prepare('SELECT * FROM counseling_flags ORDER BY id DESC').all();
    return rows.map((r) => ({
      ...r,
      history: JSON.parse(r.history_json || '[]')
    }));
  },

  async updateStatus(id, newStatus, action = 'Status Diperbarui', note = '') {
    let flag;
    let history = [];

    if (isPostgres) {
      const res = await pgPool.query('SELECT * FROM counseling_flags WHERE id = $1', [id]);
      flag = res.rows[0];
      if (!flag) return null;
      history = typeof flag.history_json === 'string' ? JSON.parse(flag.history_json || '[]') : (flag.history_json || []);
    } else {
      flag = sqliteDb.prepare('SELECT * FROM counseling_flags WHERE id = ?').get(id);
      if (!flag) return null;
      history = JSON.parse(flag.history_json || '[]');
    }

    const now = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB';
    history.unshift({
      date: now,
      action: action,
      note: note || `Status flag diubah menjadi ${newStatus}.`
    });

    if (isPostgres) {
      await pgPool.query(
        'UPDATE counseling_flags SET status = $1, history_json = $2 WHERE id = $3',
        [newStatus, JSON.stringify(history), id]
      );
    } else {
      sqliteDb.prepare('UPDATE counseling_flags SET status = ?, history_json = ? WHERE id = ?')
        .run(newStatus, JSON.stringify(history), id);
    }

    return {
      ...flag,
      status: newStatus,
      history
    };
  },

  async createFlag({ studentId, studentName, nisn, level = 'warning', category = 'Psikososial & Emosional', trigger = '', source = '🛡️ LUNA AI Early Detection', status = 'unhandled' }) {
    const now = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB';
    const history = [
      {
        date: now,
        action: `Flag ${level.toUpperCase()} Diterbitkan`,
        note: trigger
      }
    ];

    const newId = 'flg-' + Date.now().toString().slice(-4);
    if (isPostgres) {
      const res = await pgPool.query(`
        INSERT INTO counseling_flags (id, student_id, student_name, nisn, level, category, trigger, source, date, status, history_json)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [newId, studentId, studentName, nisn, level, category, trigger, source, now, status, JSON.stringify(history)]);
      return {
        ...res.rows[0],
        history
      };
    }

    sqliteDb.prepare(`
      INSERT INTO counseling_flags (id, student_id, student_name, nisn, level, category, trigger, source, date, status, history_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(newId, studentId, studentName, nisn, level, category, trigger, source, now, status, JSON.stringify(history));

    return {
      id: newId,
      student_id: studentId,
      student_name: studentName,
      nisn,
      level,
      category,
      trigger,
      source,
      date: now,
      status,
      history
    };
  }
};

export default FlagModel;
