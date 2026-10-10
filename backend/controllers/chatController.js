import ChatModel from '../models/chatModel.js';
import FlagModel from '../models/flagModel.js';
import StudentModel from '../models/studentModel.js';

export const getChatHistory = async (req, res) => {
  try {
    const messages = await ChatModel.getByStudentId(Number(req.params.studentId));
    res.json({
      status: 'success',
      messages
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { studentId, studentIds, mode = 'auto', message, emotion = 'senang' } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ status: 'error', message: 'Pesan tidak boleh kosong.' });
    }

    // Tentukan konteks siswa yang dikirimkan
    let targetIds = [];
    if (Array.isArray(studentIds) && studentIds.length > 0) {
      targetIds = studentIds.map((id) => Number(id)).filter((n) => !isNaN(n));
    } else if (studentId && studentId !== 'all' && studentId !== 'umum') {
      targetIds = [Number(studentId)];
    }

    const isGeneralMode = targetIds.length === 0 || mode === 'umum';

    // 1. Verifikasi Siswa pada Database (Keamanan & Otorisasi Hak Akses)
    let selectedStudents = [];
    if (!isGeneralMode) {
      for (const id of targetIds) {
        const st = await StudentModel.getById(id);
        if (!st) {
          return res.status(404).json({
            status: 'error',
            message: `Akses ditolak atau data siswa (ID: ${id}) tidak ditemukan di database sekolah.`
          });
        }
        selectedStudents.push(st);
      }
    }

    const primaryStudentId = selectedStudents[0]?.id || 1;

    // Catat pesan pengguna ke riwayat chat
    await ChatModel.save({
      studentId: primaryStudentId,
      sender: 'user',
      message,
      emotion
    });

    // 2. EMERGENCY CRISIS GUARDRAIL INTERCEPT (FLAG HITAM)
    if (req.isEmergency) {
      const studentName = selectedStudents[0]?.name || 'Siswa';
      const nisn = selectedStudents[0]?.nisn || '-';

      await FlagModel.createFlag({
        studentId: primaryStudentId,
        studentName,
        nisn,
        level: 'black',
        category: 'Krisis Keselamatan Diri',
        trigger: `Indikasi keputusasaan akut terdeteksi pada chat: "${message.substring(0, 80)}..."`,
        source: '🛡️ LUNA AI Emergency Guardrail',
        status: 'unhandled'
      });

      const emergencyReply = `Aku sangat peduli dan mendengarkanmu, ${studentName.split(' ')[0]}. Kamu tidak sendirian dan keselamatanmu adalah yang terpenting ♡.\n\n🚨 **Bantuan Segera Siap Mendampingimu:**\n• **Hotline Kesehatan Jiwa Kemenkes RI:** Hubungi **119 ext 8** (Bebas pulsa / 24 Jam)\n• **Ruang Bimbingan Konseling:** Bu Ratna Dewi (Guru BK) siap bertemu dan mendengarkanmu sekarang juga.\n\nTetaplah bersama kami ya? 🫂`;

      const savedAiMsg = await ChatModel.save({
        studentId: primaryStudentId,
        sender: 'ai',
        message: emergencyReply,
        emotion: 'cemas'
      });

      return res.json({
        status: 'success',
        reply: emergencyReply,
        emotion: 'cemas',
        emergency: true,
        flag_level: 'black',
        hotline: '119 ext 8',
        message: savedAiMsg
      });
    }

    const msgLower = message.toLowerCase();
    let aiReply = '';
    let aiEmotion = 'senang';

    // 3. Skenario Multi-Siswa: Ringkasan Agregat Aman (Tanpa Mencampur Privasi Personal)
    if (selectedStudents.length > 1) {
      aiEmotion = 'berpikir';
      const studentNames = selectedStudents.map((s) => s.name.split(' ')[0]).join(', ');
      const avgAcademic = (
        selectedStudents.reduce((acc, s) => acc + Number(s.academic_score || s.avg_grade || 75), 0) /
        selectedStudents.length
      ).toFixed(1);

      aiReply = `📊 **Ringkasan Agregat AI untuk ${selectedStudents.length} Siswa Terpilih (${studentNames}):**
*(Catatan: Bersifat agregasi kohort untuk bahan pertimbangan Guru BK / Guru Mapel. Tidak mencampur atau menampilkan jurnal pribadi antar-siswa.)*

1. **Gambaran Akademik Kolektif:**
• Rata-rata nilai kohort kelompok: **${avgAcademic}**.
• Sebagian siswa menunjukkan performa belajar aktif dengan kebutuhan pendampingan pada mata pelajaran eksakta dan penguatan motivasi harian.

2. **Rekomendasi Pendekatan Guru:**
• Lakukan sesi kelompok kecil (*study circle*) untuk materi yang memerlukan remedial suportif.
• Berikan ruang dialog afektif secara individual terpisah guna menjaga kerahasiaan isu pribadi masing-masing siswa.
• Koordinasikan dengan Guru Pengampu terkait opsi penugasan alternatif berbasis minat bakat.

⚠️ *Peringatan Etika:* Keputusan bimbingan akhir tetap berada pada penilaian profesional Guru BK dan Guru Kelas.`;
    }
    // 4. Skenario Mode Umum / Tanpa Siswa Khusus
    else if (isGeneralMode) {
      if (msgLower.includes('remedial') || msgLower.includes('kkm') || msgLower.includes('nilai')) {
        aiEmotion = 'semangat';
        aiReply = `💡 **Panduan Pedagogis Umum — Strategi Remedial Efektif Berbasis Empati:**

1. **Analisis Diagnosis Hambatan:** Identifikasi apakah kesulitan siswa bersumber pada konsep dasar (*foundational gap*), manajemen waktu belajar, atau kejenuhan afektif.
2. **Format Tindak Lanjut Diferensiasi:** Berikan latihan bertahap dengan bimbingan sejawat (*peer tutoring*) sebelum evaluasi ulang.
3. **Koordinasi Terpadu:** Libatkan Guru BK jika terdapat indikasi penurunan motivasi yang berlangsung lebih dari 2 pekan berturut-turut.

*Disarankan untuk memilih siswa tertentu jika Bapak/Ibu memerlukan analisis riwayat akademik yang lebih spesifik.*`;
      } else if (msgLower.includes('dialog') || msgLower.includes('konseling') || msgLower.includes('triase')) {
        aiEmotion = 'semangat';
        aiReply = `💡 **Panduan Dialog Empatik Umum Guru BK & Pendidik:**

1. **Prinsip Active Listening:** Ciptakan ruang aman tanpa penghakiman (*zero medical labeling*).
2. **Conversation Starters:**
• *"Boleh ceritakan bagian mana dalam ritme belajar minggu ini yang terasa paling melelahkan?"*
• *"Apa satu hal yang paling bisa sekolah bantu ringankan untukmu saat ini?"*
3. **Penyusunan Action Plan:** Rumuskan 1–2 target kecil (*micro-goals*) yang dapat dievaluasi bersama dalam 14 hari ke depan.`;
      } else {
        aiReply = `Halo Bapak/Ibu Guru! 🌟 LUNA AI siap mendampingi perumusan strategi pembelajaran, panduan dialog empatik, maupun analisis kebijakan kelas.
        
Bapak/Ibu dapat menggunakan tombol **"Pilih siswa"** di atas jika ingin menyematkan data spesifik siswa tertentu untuk dianalisis secara akurat dan etis.`;
      }
    }
    // 5. Skenario Satu Siswa Terpilih
    else {
      const student = selectedStudents[0];
      const targetName = student.name;
      const firstWord = targetName.split(' ')[0];

      if (msgLower.includes('intervensi') || msgLower.includes('dialog') || msgLower.includes('starter') || msgLower.includes('panduan konseling') || msgLower.includes('strategi bk')) {
        aiEmotion = 'semangat';
        aiReply = `Berikut adalah **Saran Rencana Intervensi Konseling untuk ${targetName} (Bahan Pertimbangan Guru):**

📌 **1. Identifikasi & Analisis Capaian:**
• ${targetName} memiliki catatan akademik rata-rata ${student?.avg_grade || student?.academic_score || '78'} (Kelas ${student?.class_name || 'XI IPA 2'}).
• Sinyal deteksi dini mengindikasikan pentingnya dialog suportif terfokus pada beban tugas dan kesejahteraan belajar.

🗣️ **2. Tiga Pertanyaan Pembuka Dialog Empatik (Conversation Starters):**
1. *"Ibu perhatikan belakangan ini energimu agak terkuras, ${firstWord}, boleh cerita bagian mana dari kegiatan belajar yang terasa paling menantang?"*
2. *"Di luar urusan nilai sekolah, bagaimana istirahat dan kegiatanmu seminggu ini? Apakah ada hal yang membuatmu kepikiran?"*
3. *"Jika kita bisa mulai meringankan satu hal bersama-sama minggu ini, hal apa yang paling ingin kamu perbaiki terlebih dahulu?"*

📋 **3. Tindak Lanjut:**
• Buat kesepakatan belajar bertahap (*micro-goals*) untuk 2 minggu ke depan.
• Koordinasikan dengan Guru Mata Pelajaran terkait jadwal remedial terstruktur tanpa membebani mental siswa.`;
      } else if (msgLower.includes('riasec') || msgLower.includes('minat') || msgLower.includes('bakat') || msgLower.includes('jurusan')) {
        aiEmotion = 'berpikir';
        aiReply = `Berdasarkan pemetaan **Holland RIASEC** untuk **${targetName}** (Kode Minat: **${student?.riasec_code || 'IRC'}**):

🎯 **Korelasi Capaian & Minat Karir:**
• Karakteristik dominan: **${student?.career_title || 'Peneliti Sains & Rekayasa'}** — selaras dengan minat: *${student?.hobbies_interests || 'Eksplorasi sains, eksperimen lab, dan analisis data'}*.
• Rekomendasi Program Studi / Vokasi: **${student?.career_jobs || 'Teknik Informatika, Bioteknologi Terapan, Farmasi Klinis'}**.

💡 **Saran bagi Guru BK:**
Gunakan hasil eksplorasi nilai 7 pertemuan sebagai bahan refleksi bersama ${targetName}, dan validasi kembali dengan wawancara minat bakat berkala.`;
      } else {
        aiEmotion = 'senang';
        aiReply = `Halo Bapak/Ibu Guru! Terkait siswa **${targetName}** (Kelas ${student?.class_name || 'XI IPA 2'}, Rata-rata: ${student?.academic_score || student?.avg_grade || '80'}):

LUNA siap membantu merancang panduan dialog empatik, membedah korelasi nilai per pertemuan (P1–P14), atau menyusun rekomendasi minat bakat karir. Silakan ajukan pertanyaan spesifik terkait siswa ini.`;
      }
    }

    const savedAiMsg = await ChatModel.save({
      studentId: primaryStudentId,
      sender: 'ai',
      message: aiReply,
      emotion: aiEmotion
    });

    res.json({
      status: 'success',
      reply: aiReply,
      emotion: aiEmotion,
      contextCount: selectedStudents.length,
      mode: isGeneralMode ? 'umum' : (selectedStudents.length > 1 ? 'multi' : 'single'),
      students: selectedStudents.map((s) => ({ id: s.id, name: s.name, class: s.class_name })),
      message: savedAiMsg
    });
  } catch (err) {
    console.error('Error in sendMessage chatController:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};
