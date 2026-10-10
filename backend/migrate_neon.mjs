import pg from 'pg';

const connectionString = 'postgresql://neondb_owner:npg_GHDcUASzfO61@ep-hidden-scene-b4onkhk7-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  console.log('=== MIGRATING NEON POSTGRESQL ===');
  try {
    // 1. Add UNIQUE constraint on grades(student_id, subject_key) if not exists
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'grades_student_subject_unique'
        ) THEN
          ALTER TABLE grades ADD CONSTRAINT grades_student_subject_unique UNIQUE (student_id, subject_key);
          RAISE NOTICE 'Constraint grades_student_subject_unique added.';
        ELSE
          RAISE NOTICE 'Constraint grades_student_subject_unique already exists.';
        END IF;
      END $$;
    `);
    console.log('✔ UNIQUE constraint on grades verified/added.');

    // 2. Best Practice Indexes
    await pool.query('CREATE INDEX IF NOT EXISTS idx_grades_student_id ON grades(student_id);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_grades_subject_key ON grades(subject_key);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_students_nisn ON students(nisn);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_flags_student_id ON counseling_flags(student_id);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_chat_student_id ON chat_messages(student_id);');
    console.log('✔ Best-practice indexes created.');

    console.log('=== NEON MIGRATION COMPLETED SUCCESSFULLY ===');
  } catch (err) {
    console.error('Migration error:', err.message);
  } finally {
    await pool.end();
  }
}

run();
