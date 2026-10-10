import api from '../../../services/api';

export function generateLocal8CharPassword() {
  const startLetters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const restChars = 'abcdefghijkmnpqrstuvwxyz23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let pwd = startLetters.charAt(Math.floor(Math.random() * startLetters.length));
  for (let i = 1; i < 8; i++) {
    pwd += restChars.charAt(Math.floor(Math.random() * restChars.length));
  }
  return pwd;
}

export async function submitNewStudentAccount(formData) {
  const payload = {
    name: formData.name.trim(),
    nisn: formData.nisn.trim(),
    email: formData.email.trim() || `${formData.nisn.trim()}@siswa.sch.id`,
    password: formData.password.trim(),
    phone: formData.phone.trim(),
    parentPhone: formData.parentPhone.trim(),
    className: formData.className,
    gender: formData.gender,
    academicScore: Number(formData.academicScore) || 80,
    counselingStatus: 'Normal',
    triageLevel: 'HIJAU',
    riasecCode: 'I - S - A',
    careerTitle: 'Eksplorasi Karir Terbimbing',
    notes: formData.parentPhone ? `[No. Wali: ${formData.parentPhone}] ${formData.notes || ''}`.trim() : formData.notes
  };

  const res = await api.createStudent(payload);
  if (res.status === 'success') {
    const studentObj = res.student;
    const creds = res.credentials || {
      name: payload.name,
      nisn: payload.nisn,
      email: payload.email,
      password: payload.password || 'password123',
      className: payload.className,
      role: 'siswa'
    };

    return {
      success: true,
      record: {
        ...studentObj,
        credentials: creds,
        createdAtTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    };
  }
  return { success: false, message: res.message || 'Gagal menambahkan akun siswa.' };
}

export function formatCredentialsWhatsApp(cred) {
  return `*KREDENSIAL AKUN PORTAL SISWA*\nNama Siswa: ${cred.name}\nNISN: ${cred.nisn}\nKelas: ${cred.className}\nEmail Login: ${cred.email}\nPassword: ${cred.password}\nPortal Siswa: http://localhost:5173\n\nAkun telah aktif di portal sekolah.`;
}
