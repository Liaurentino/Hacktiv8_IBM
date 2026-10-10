import StudentModel from '../models/studentModel.js';
import UserModel from '../models/userModel.js';

export function generateStudentPassword(len = 8) {
  const startChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const restChars = 'abcdefghijkmnpqrstuvwxyz23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let pwd = startChars.charAt(Math.floor(Math.random() * startChars.length));
  for (let i = 1; i < len; i++) {
    pwd += restChars.charAt(Math.floor(Math.random() * restChars.length));
  }
  return pwd;
}

export async function createStudentAccount(data) {
  const {
    name,
    nisn,
    email,
    password,
    phone,
    parentPhone,
    className,
    gender,
    rank,
    academicScore,
    counselingStatus,
    triageLevel,
    riasecCode,
    careerTitle,
    careerDesc,
    notes
  } = data;

  if (!name || !nisn) {
    throw new Error('Nama dan NISN siswa wajib diisi.');
  }

  const cleanNisn = nisn.toString().trim();
  const cleanName = name.toString().trim();
  const studentEmail = email && email.toString().trim() !== ''
    ? email.toString().trim().toLowerCase()
    : `${cleanNisn}@siswa.sch.id`;

  const studentPassword = password && password.toString().trim() !== ''
    ? password.toString().trim()
    : generateStudentPassword(8);

  let studentUser = await UserModel.findByEmail(studentEmail);
  if (!studentUser) {
    studentUser = await UserModel.create({
      name: cleanName,
      email: studentEmail,
      password: studentPassword,
      role: 'siswa',
      avatar: cleanName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    });
  }

  const combinedNotes = parentPhone
    ? `[No. Wali: ${parentPhone}] ${notes || ''}`.trim()
    : (notes || '');

  const newStudent = await StudentModel.create({
    userId: studentUser ? studentUser.id : null,
    name: cleanName,
    nisn: cleanNisn,
    email: studentEmail,
    phone: phone ? phone.toString().trim() : '',
    className: className || 'XI IPA 2',
    gender: gender || 'L',
    rank: rank ? Number(rank) : 1,
    academicScore: academicScore ? Number(academicScore) : 80,
    counselingStatus: counselingStatus || 'Normal',
    triageLevel: triageLevel || 'HIJAU',
    riasecCode: riasecCode || 'I - S - A',
    careerTitle: careerTitle || 'Eksplorasi Karir Terbimbing',
    careerDesc: careerDesc || '',
    notes: combinedNotes
  });

  return {
    student: newStudent,
    credentials: {
      name: cleanName,
      nisn: cleanNisn,
      email: studentEmail,
      password: studentPassword,
      className: className || 'XI IPA 2',
      role: 'siswa'
    }
  };
}

export async function processBatchStudents(students) {
  const successList = [];
  const failedList = [];

  for (const item of students) {
    const name = item.name ? item.name.toString().trim() : '';
    const nisn = item.nisn ? item.nisn.toString().trim() : '';

    if (!name || !nisn) {
      failedList.push({
        item,
        reason: 'Nama atau NISN tidak boleh kosong'
      });
      continue;
    }

    const studentEmail = item.email && item.email.toString().trim() !== ''
      ? item.email.toString().trim().toLowerCase()
      : `${nisn}@siswa.sch.id`;

    const existingStudent = await StudentModel.getByNisn(nisn);
    if (existingStudent) {
      failedList.push({
        nisn,
        name,
        email: studentEmail,
        reason: `NISN ${nisn} sudah terdaftar sebelumnya (${existingStudent.name})`
      });
      continue;
    }

    try {
      const result = await createStudentAccount({
        name,
        nisn,
        email: item.email,
        password: item.password,
        phone: item.phone || item.no_hp || item.telepon || '',
        parentPhone: item.parentPhone || item.no_wa_wali || item.parent_phone || '',
        className: item.className || item.class_name || item.kelas || 'XI IPA 2',
        gender: (item.gender || item.jenis_kelamin || 'L').toUpperCase().startsWith('P') ? 'P' : 'L',
        rank: item.rank ? Number(item.rank) : 1,
        academicScore: item.academicScore || item.nilai_rata_rata || item.score ? Number(item.academicScore || item.nilai_rata_rata || item.score) : 80,
        notes: item.notes || ''
      });

      successList.push({
        id: result.student.id,
        nisn,
        name,
        email: result.credentials.email,
        password: result.credentials.password,
        className: result.credentials.className,
        status: 'created'
      });
    } catch (err) {
      failedList.push({
        nisn,
        name,
        reason: err.message
      });
    }
  }

  return { successList, failedList };
}

export function filterStudentForTeacher(student, allowedKey) {
  if (!student) return student;
  const copy = { ...student };
  delete copy.riasec_code;
  delete copy.career_jobs;
  delete copy.career_title;
  delete copy.career_tag;
  delete copy.career_desc;
  if (Array.isArray(copy.grades)) {
    copy.grades = copy.grades.filter((g) => g.subject_key === allowedKey);
  } else if (copy.grades && typeof copy.grades === 'object') {
    const fg = {};
    if (allowedKey && copy.grades[allowedKey]) fg[allowedKey] = copy.grades[allowedKey];
    copy.grades = fg;
  }
  return copy;
}
