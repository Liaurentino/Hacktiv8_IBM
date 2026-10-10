import { isPostgres, pgPool, sqliteDb, calculateGrade } from '../config/db.js';

export const StudentModel = {
  async getAll({ search = '', className = '', status = '', triage = '', includeGrades = false } = {}) {
    if (isPostgres) {
      let query = 'SELECT * FROM students WHERE 1=1';
      const params = [];
      let pIdx = 1;

      if (className && className !== 'all' && className !== 'Semua Kelas') {
        query += ` AND class_name = $${pIdx++}`;
        params.push(className);
      }
      if (status && status !== 'all') {
        query += ` AND counseling_status = $${pIdx++}`;
        params.push(status);
      }
      if (triage && triage !== 'all') {
        query += ` AND triage_level = $${pIdx++}`;
        params.push(triage);
      }
      if (search) {
        query += ` AND (name ILIKE $${pIdx} OR nisn ILIKE $${pIdx} OR notes ILIKE $${pIdx})`;
        params.push(`%${search}%`);
        pIdx++;
      }
      query += ' ORDER BY rank ASC, id ASC';
      const res = await pgPool.query(query, params);

      let gradesByStudent = {};
      if (includeGrades) {
        const gRes = await pgPool.query('SELECT * FROM grades');
        for (const g of gRes.rows) {
          if (!gradesByStudent[g.student_id]) gradesByStudent[g.student_id] = {};
          gradesByStudent[g.student_id][g.subject_key] = {
            ...g,
            scores: typeof g.scores_json === 'string' ? JSON.parse(g.scores_json || '[]') : (g.scores_json || [])
          };
        }
      }

      return res.rows.map((r) => ({
        ...r,
        career_jobs: typeof r.career_jobs_json === 'string' ? JSON.parse(r.career_jobs_json || '[]') : (r.career_jobs_json || []),
        grades: includeGrades ? (gradesByStudent[r.id] || {}) : undefined
      }));
    }

    let query = 'SELECT * FROM students WHERE 1=1';
    const params = [];
    if (className && className !== 'all' && className !== 'Semua Kelas') {
      query += ' AND class_name = ?';
      params.push(className);
    }
    if (status && status !== 'all') {
      query += ' AND counseling_status = ?';
      params.push(status);
    }
    if (triage && triage !== 'all') {
      query += ' AND triage_level = ?';
      params.push(triage);
    }
    if (search) {
      query += ' AND (name LIKE ? OR nisn LIKE ? OR notes LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }
    query += ' ORDER BY rank ASC, id ASC';
    const rows = sqliteDb.prepare(query).all(...params);

    let gradesByStudent = {};
    if (includeGrades) {
      const allGrades = sqliteDb.prepare('SELECT * FROM grades').all();
      for (const g of allGrades) {
        if (!gradesByStudent[g.student_id]) gradesByStudent[g.student_id] = {};
        gradesByStudent[g.student_id][g.subject_key] = {
          ...g,
          scores: JSON.parse(g.scores_json || '[]')
        };
      }
    }

    return rows.map((r) => ({
      ...r,
      career_jobs: JSON.parse(r.career_jobs_json || '[]'),
      grades: includeGrades ? (gradesByStudent[r.id] || {}) : undefined
    }));
  },

  async getById(id) {
    if (isPostgres) {
      const sRes = await pgPool.query('SELECT * FROM students WHERE id = $1', [id]);
      const student = sRes.rows[0];
      if (!student) return null;

      const gRes = await pgPool.query('SELECT * FROM grades WHERE student_id = $1', [id]);
      const fRes = await pgPool.query('SELECT * FROM counseling_flags WHERE student_id = $1 OR nisn = $2', [id, student.nisn]);

      return {
        ...student,
        career_jobs: typeof student.career_jobs_json === 'string' ? JSON.parse(student.career_jobs_json || '[]') : (student.career_jobs_json || []),
        grades: gRes.rows.map((g) => ({
          ...g,
          scores: typeof g.scores_json === 'string' ? JSON.parse(g.scores_json || '[]') : (g.scores_json || [])
        })),
        flags: fRes.rows.map((f) => ({
          ...f,
          history: typeof f.history_json === 'string' ? JSON.parse(f.history_json || '[]') : (f.history_json || [])
        }))
      };
    }

    const student = sqliteDb.prepare('SELECT * FROM students WHERE id = ?').get(id);
    if (!student) return null;

    const grades = sqliteDb.prepare('SELECT * FROM grades WHERE student_id = ?').all(id);
    const flags = sqliteDb.prepare('SELECT * FROM counseling_flags WHERE student_id = ? OR nisn = ?').all(id, student.nisn);

    return {
      ...student,
      career_jobs: JSON.parse(student.career_jobs_json || '[]'),
      grades: grades.map((g) => ({
        ...g,
        scores: JSON.parse(g.scores_json || '[]')
      })),
      flags: flags.map((f) => ({
        ...f,
        history: JSON.parse(f.history_json || '[]')
      }))
    };
  },

  async getByNisn(nisn) {
    if (isPostgres) {
      const res = await pgPool.query('SELECT * FROM students WHERE nisn = $1', [nisn]);
      return res.rows[0] || null;
    }
    return sqliteDb.prepare('SELECT * FROM students WHERE nisn = ?').get(nisn) || null;
  },

  async getByUserId(userId) {
    if (isPostgres) {
      const res = await pgPool.query('SELECT * FROM students WHERE user_id = $1', [userId]);
      return res.rows[0] || null;
    }
    return sqliteDb.prepare('SELECT * FROM students WHERE user_id = ?').get(userId) || null;
  },

  async getByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    if (isPostgres) {
      const res = await pgPool.query('SELECT * FROM students WHERE LOWER(email) = $1', [cleanEmail]);
      return res.rows[0] || null;
    }
    return sqliteDb.prepare('SELECT * FROM students WHERE LOWER(email) = ?').get(cleanEmail) || null;
  },

  async create(data) {
    const {
      userId = null,
      nisn,
      name,
      email = '',
      phone = '',
      className = 'XI IPA 2',
      gender = 'L',
      rank = 1,
      academicScore = 80,
      counselingStatus = 'Normal',
      triageLevel = 'HIJAU',
      riasecCode = 'I - S - A',
      careerTitle = 'Eksplorasi Karir Terbimbing',
      careerTag = '',
      careerDesc = '',
      careerJobs = [],
      attendanceTrend = 'Normal (100%)',
      notes = ''
    } = data;

    const letter = calculateGrade(academicScore);
    const now = new Date().toISOString();

    let studentId;
    if (isPostgres) {
      const res = await pgPool.query(`
        INSERT INTO students (
          user_id, nisn, name, email, phone, class_name, gender, rank,
          academic_score, avg_grade, letter_grade, counseling_status, triage_level,
          riasec_code, career_title, career_tag, career_desc, career_jobs_json,
          attendance_trend, notes, created_at, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
        RETURNING id
      `, [
        userId, nisn, name, email, phone, className, gender, rank,
        academicScore, academicScore, letter, counselingStatus, triageLevel,
        riasecCode, careerTitle, careerTag || `Eksplorasi Karir — ${name}`, careerDesc || 'Program pendampingan akademik terpadu.',
        JSON.stringify(careerJobs.length ? careerJobs : ['Eksplorasi Jalur Kuliah', 'Pengembangan Portofolio']),
        attendanceTrend, notes, now, now
      ]);
      studentId = res.rows[0].id;
    } else {
      const stmt = sqliteDb.prepare(`
        INSERT INTO students (
          user_id, nisn, name, email, phone, class_name, gender, rank,
          academic_score, avg_grade, letter_grade, counseling_status, triage_level,
          riasec_code, career_title, career_tag, career_desc, career_jobs_json,
          attendance_trend, notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const res = stmt.run(
        userId, nisn, name, email, phone, className, gender, rank,
        academicScore, academicScore, letter, counselingStatus, triageLevel,
        riasecCode, careerTitle, careerTag || `Eksplorasi Karir — ${name}`, careerDesc || 'Program pendampingan akademik terpadu.',
        JSON.stringify(careerJobs.length ? careerJobs : ['Eksplorasi Jalur Kuliah', 'Pengembangan Portofolio']),
        attendanceTrend, notes, now, now
      );
      studentId = res.lastInsertRowid;
    }

    const MAPEL_KEYS = ['mtk','biologi','kimia','biologi','bindo','bing','ekonomi','sosiologi','geografi','seni','olahraga'];
    const MAPEL_NAMES = {
      mtk:'Matematika', fisika:'Fisika', kimia:'Kimia', biologi:'Biologi',
      bindo:'B. Indonesia', bing:'B. Inggris', ekonomi:'Ekonomi',
      sosiologi:'Sosiologi', geografi:'Geografi', seni:'Seni Budaya', olahraga:'Olahraga'
    };

    for (const key of MAPEL_KEYS) {
      const scores = Array.from({ length: 7 }, () => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(40, Math.min(100, Math.round(academicScore + delta)));
      });
      const avg = +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
      const min = Math.min(...scores);
      const max = Math.max(...scores);
      const subGrade = calculateGrade(avg);

      if (isPostgres) {
        await pgPool.query(`
          INSERT INTO grades (student_id, subject_key, subject_name, scores_json, avg_score, min_score, max_score, letter_grade)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [studentId, key, MAPEL_NAMES[key], JSON.stringify(scores), avg, min, max, subGrade]);
      } else {
        sqliteDb.prepare(`
          INSERT INTO grades (student_id, subject_key, subject_name, scores_json, avg_score, min_score, max_score, letter_grade)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(studentId, key, MAPEL_NAMES[key], JSON.stringify(scores), avg, min, max, subGrade);
      }
    }

    return this.getById(studentId);
  },

  async update(id, data) {
    const existing = await this.getById(id);
    if (!existing) return null;

    const name = data.name !== undefined ? data.name : existing.name;
    const nisn = data.nisn !== undefined ? data.nisn : existing.nisn;
    const email = data.email !== undefined ? data.email : existing.email;
    const phone = data.phone !== undefined ? data.phone : existing.phone;
    const className = data.className !== undefined ? data.className : existing.class_name;
    const gender = data.gender !== undefined ? data.gender : existing.gender;
    const rank = data.rank !== undefined ? data.rank : existing.rank;
    const academicScore = data.academicScore !== undefined ? data.academicScore : existing.academic_score;
    const letter = calculateGrade(academicScore);
    const counselingStatus = data.counselingStatus !== undefined ? data.counselingStatus : existing.counseling_status;
    const triageLevel = data.triageLevel !== undefined ? data.triageLevel : existing.triage_level;
    const riasecCode = data.riasecCode !== undefined ? data.riasecCode : existing.riasec_code;
    const careerTitle = data.careerTitle !== undefined ? data.careerTitle : existing.career_title;
    const careerDesc = data.careerDesc !== undefined ? data.careerDesc : existing.career_desc;
    const notes = data.notes !== undefined ? data.notes : existing.notes;
    const now = new Date().toISOString();

    if (isPostgres) {
      await pgPool.query(`
        UPDATE students SET
          name = $1, nisn = $2, email = $3, phone = $4, class_name = $5, gender = $6, rank = $7,
          academic_score = $8, avg_grade = $9, letter_grade = $10, counseling_status = $11, triage_level = $12,
          riasec_code = $13, career_title = $14, career_desc = $15, notes = $16, updated_at = $17
        WHERE id = $18
      `, [
        name, nisn, email, phone, className, gender, rank,
        academicScore, academicScore, letter, counselingStatus, triageLevel,
        riasecCode, careerTitle, careerDesc, notes, now, id
      ]);
    } else {
      sqliteDb.prepare(`
        UPDATE students SET
          name = ?, nisn = ?, email = ?, phone = ?, class_name = ?, gender = ?, rank = ?,
          academic_score = ?, avg_grade = ?, letter_grade = ?, counseling_status = ?, triage_level = ?,
          riasec_code = ?, career_title = ?, career_desc = ?, notes = ?, updated_at = ?
        WHERE id = ?
      `).run(
        name, nisn, email, phone, className, gender, rank,
        academicScore, academicScore, letter, counselingStatus, triageLevel,
        riasecCode, careerTitle, careerDesc, notes, now, id
      );
    }

    return this.getById(id);
  },

  async delete(id) {
    if (isPostgres) {
      const res = await pgPool.query('DELETE FROM students WHERE id = $1', [id]);
      return res.rowCount > 0;
    }
    const student = sqliteDb.prepare('SELECT * FROM students WHERE id = ?').get(id);
    if (!student) return false;
    sqliteDb.prepare('DELETE FROM students WHERE id = ?').run(id);
    return true;
  }
};

export default StudentModel;
