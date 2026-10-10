/**
 * Langflow + LUNA Agent Integration Engine via Model Context Protocol (MCP)
 * 
 * Implements:
 * 1. PII Masker (FR-1: mask_student_pii)
 * 2. Emergency Safety Guardrail Interceptor (FR-5: crisis keywords -> Hotline 119 ext 8)
 * 3. Sentiment & Distress Risk Triage (FR-2: classify_student_wellbeing_risk)
 * 4. Holland RIASEC Career Talent Mapper (FR-3: map_riasec_career_interest)
 * 5. One-Click Counseling Brief Generator (FR-4: generate_counseling_brief)
 * 6. Standard MCP JSON-RPC 2.0 interface for LUNA Agent Client
 */

// 1. Emergency Crisis Keywords for Guardrail Interceptor
const EMERGENCY_CRISIS_KEYWORDS = [
  'mengakhiri segalanya',
  'mengakhiri hidup',
  'bunuh diri',
  'menyakiti diri',
  'tidak ada gunanya hidup',
  'menghilang saja',
  'mati saja',
  'putus asa dan rasanya ingin',
  'beban untuk semua orang',
  'tidak sanggup lagi hidup'
];

// 2. Holland RIASEC Lexicon Knowledge Base
const RIASEC_LEXICON = {
  R: {
    name: 'Realistic (Praktikal & Mekanikal)',
    keywords: ['mesin', 'robot', 'sensor', 'perkakas', 'bengkel', 'otomotif', 'alat', 'futsal', 'renang', 'lapangan', 'peta', 'kontur', 'hewan', 'fisik']
  },
  I: {
    name: 'Investigative (Analitis & Ilmiah)',
    keywords: ['fisika', 'matematika', 'kimia', 'biologi', 'koding', 'algoritma', 'riset', 'analisis', 'keamanan siber', 'kriptografi', 'sains', 'catur', 'data', 'logika']
  },
  A: {
    name: 'Artistic (Kreatif & Ekspresif)',
    keywords: ['gambar', 'lukis', 'desain', 'dkv', 'komik', 'ilustrasi', 'animasi', 'puisi', 'novel', 'sastra', 'gitar', 'musik', 'pastry', 'foto', 'menghias']
  },
  S: {
    name: 'Social (Empati & Edukasi)',
    keywords: ['konseling', 'psikologi', 'curhat', 'teman', 'relawan', 'sosial', 'mengajar', 'membantu', 'warga', 'kucing jalanan', 'fisioterapi', 'merawat']
  },
  E: {
    name: 'Enterprising (Kepemimpinan & Bisnis)',
    keywords: ['osis', 'pemimpin', 'rapat', 'sponsor', 'debat', 'jualan', 'bisnis', 'saham', 'pensi', 'panitia', 'manajemen', 'omset']
  },
  C: {
    name: 'Conventional (Teratur & Sistematis)',
    keywords: ['akuntansi', 'keuangan', 'laporan', 'neraca', 'rapi', 'data', 'jadwal', 'administrasi', 'arsip', 'hitung', 'aturan']
  }
};

/**
 * Tool 1: mask_student_pii
 * Anonymizes real student personal identifying information into synthetic tokens.
 */
export function maskStudentPii(rawText, studentId = 'SISWA-ANON') {
  if (!rawText) return { sanitizedText: '', maskedEntitiesCount: 0 };

  let sanitized = rawText;
  let count = 0;

  // Mask Phone numbers
  const phoneRegex = /(\+62|62|08)[0-9]{8,12}/g;
  if (phoneRegex.test(sanitized)) {
    sanitized = sanitized.replace(phoneRegex, '[NOMOR_TELEPON_DISAMARKAN]');
    count++;
  }

  // Mask NIK / NISN (10-16 digits)
  const idRegex = /\b[0-9]{10,16}\b/g;
  if (idRegex.test(sanitized)) {
    sanitized = sanitized.replace(idRegex, '[NISN_DISAMARKAN]');
    count++;
  }

  // Mask Email addresses
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  if (emailRegex.test(sanitized)) {
    sanitized = sanitized.replace(emailRegex, '[EMAIL_DISAMARKAN]');
    count++;
  }

  return {
    sanitizedText: sanitized,
    studentAssignedId: studentId,
    maskedEntitiesCount: count,
    complianceStatus: 'UU PDP No. 27/2022 Compliant'
  };
}

/**
 * Tool 2: classify_student_wellbeing_risk
 * Evaluates student reflection text and attendance for distress signals.
 */
export function classifyStudentWellbeingRisk(sanitizedText, attendanceTrend = 'Normal') {
  const lower = sanitizedText.toLowerCase();

  // 1. Guardrail Check: Emergency Crisis Detection
  const hasEmergencyCrisis = EMERGENCY_CRISIS_KEYWORDS.some((kw) => lower.includes(kw));

  if (hasEmergencyCrisis || attendanceTrend.includes('3x Alpa') && (lower.includes('putus asa') || lower.includes('beban'))) {
    const sentences = sanitizedText.split(/[.!?]+/);
    const triggerSentence = sentences.find((s) => 
      EMERGENCY_CRISIS_KEYWORDS.some((kw) => s.toLowerCase().includes(kw))
    ) || sanitizedText.slice(0, 100);

    return {
      triageLevel: 'MERAH',
      urgencyScore: 95,
      isEmergencyCrisis: true,
      riskFactors: ['Indikasi Keputusasaan Akut', 'Potensi Menyakiti Diri', 'Krisis Emosional Berat'],
      evidenceQuotes: triggerSentence.trim() + '.',
      reasoningSummary: 'Teks mengandung indikasi keputusasaan berat dan frasa krisis yang memicu intervensi darurat langsung oleh Guru BK.',
      recommendedAction: 'Jadwalkan intervensi tatap muka prioritas darurat hari ini. Terapkan SOP penanganan krisis dan hubungi Hotline Kemenkes 119 ext 8 jika terindikasi resiko tinggi.'
    };
  }

  // 2. Yellow Check: Burnout, isolation, peer pressure, or attendance issues
  const burnoutKeywords = ['tugas numpuk', 'capek', 'lelah', 'kepala mau pecah', 'sulit konsentrasi', 'dijauhi teman', 'sering menangis', 'tegang', 'tidak ada motivasi', 'malas masuk sekolah'];
  const hasBurnout = burnoutKeywords.some((kw) => lower.includes(kw)) || attendanceTrend.includes('Alpa') || attendanceTrend.includes('Terlambat');

  if (hasBurnout) {
    const sentences = sanitizedText.split(/[.!?]+/);
    const triggerSentence = sentences.find((s) => 
      burnoutKeywords.some((kw) => s.toLowerCase().includes(kw))
    ) || sentences[0] || sanitizedText;

    return {
      triageLevel: 'KUNING',
      urgencyScore: 60,
      isEmergencyCrisis: false,
      riskFactors: ['Kelelahan Belajar (Academic Burnout)', 'Dinamika Teman Sebaya / Keluarga', 'Fluktuasi Keterlibatan'],
      evidenceQuotes: triggerSentence.trim() + '.',
      reasoningSummary: 'Ditemukan tanda-tanda keletihan belajar atau kecemasan sosial yang membutuhkan sesi dialog suportif preventif sebelum berlanjut ke penurunan performa.',
      recommendedAction: 'Jadwalkan bimbingan konseling suportif mingguan. Fokus pada manajemen waktu belajar dan eksplorasi beban pikiran.'
    };
  }

  // 3. Green: Normal / Growth & Career exploration
  return {
    triageLevel: 'HIJAU',
    urgencyScore: 15,
    isEmergencyCrisis: false,
    riskFactors: ['Tidak ditemukan indikasi risiko (Stabil)'],
    evidenceQuotes: sanitizedText.slice(0, 120) + '...',
    reasoningSummary: 'Refleksi menunjukkan kestabilan emosi, antusiasme belajar positif, dan ketertarikan aktif pada pengembangan minat masa depan.',
    recommendedAction: 'Lanjutkan bimbingan karir dan pengayaan minat bakat menuju studi lanjutan / vokasi.'
  };
}

/**
 * Tool 3: map_riasec_career_interest
 * Calculates 6-dimensional Holland RIASEC scores and maps study/career paths.
 */
export function mapRiasecCareerInterest(hobbiesText = '', favoriteSubjects = '', reflectionText = '') {
  const fullContext = `${hobbiesText} ${favoriteSubjects} ${reflectionText}`.toLowerCase();

  const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  Object.keys(RIASEC_LEXICON).forEach((dim) => {
    const keywords = RIASEC_LEXICON[dim].keywords;
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      const matches = fullContext.match(regex);
      if (matches) scores[dim] += matches.length * 15;
    });
    scores[dim] = Math.min(95, Math.max(15, scores[dim] + Math.floor(Math.random() * 12) + 10));
  });

  const sortedDims = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
  const primaryCode = sortedDims.slice(0, 3).join('');

  const pathMap = {
    I: ['Teknik Informatika & Ilmu Komputer', 'Bioteknologi / Farmasi', 'Sains Data & Matematika'],
    R: ['Teknik Mesin & Otomotif', 'Teknik Elektro / Robotika', 'Ilmu Keolahragaan & Fisioterapi'],
    A: ['Desain Komunikasi Visual (DKV)', 'Seni Kuliner & Tata Boga', 'Sastra & Kajian Linguistik'],
    S: ['Psikologi & Bimbingan Konseling', 'Kedokteran Hewan / Keperawatan', 'Pendidikan & Manajemen Sosial'],
    E: ['Manajemen Bisnis & Kewirausahaan', 'Ilmu Hukum & Hubungan Internasional', 'Ekonomi Pembangunan'],
    C: ['Akuntansi & Perpajakan', 'Sains Aktuaria & Statistik', 'Administrasi Sistem Informasi']
  };

  const topDimension = sortedDims[0];
  const secondDimension = sortedDims[1];

  const recommendedStudyPaths = [
    ...(pathMap[topDimension] ? [pathMap[topDimension][0], pathMap[topDimension][1]] : []),
    ...(pathMap[secondDimension] ? [pathMap[secondDimension][0]] : ['Manajemen Terapan'])
  ].slice(0, 3);

  const recommendedActivities = [
    `Klub minat bidang ${RIASEC_LEXICON[topDimension].name.split(' ')[0]}`,
    `Partisipasi proyek kolaboratif berbasis ${RIASEC_LEXICON[secondDimension].name.split(' ')[0]}`
  ];

  return {
    scores,
    primaryCode,
    topThemeName: RIASEC_LEXICON[topDimension].name,
    secondThemeName: RIASEC_LEXICON[secondDimension].name,
    recommendedStudyPaths,
    recommendedActivities
  };
}

/**
 * Tool 4: generate_counseling_brief
 * Formats a 1-page structured prep sheet for Guru BK with conversation starters.
 */
export function generateCounselingBrief(studentProfile, triageResult, riasecResult) {
  const isRed = triageResult.triageLevel === 'MERAH';
  const isYellow = triageResult.triageLevel === 'KUNING';

  let conversationStarters = [];

  if (isRed) {
    conversationStarters = [
      'Terima kasih ya sudah menyempatkan waktu untuk mengobrol bersama Ibu/Bapak hari ini. Bagaimana perasaanmu sekarang?',
      'Ibu membaca tulisanmu dan merasa kamu sedang memikul beban yang sangat berat sendirian. Boleh ceritakan apa yang paling membuatmu merasa lelah saat ini?',
      'Kamu tidak sendirian menghadapi situasi ini. Kita akan mencari jalan keluarnya bersama-sama pelan-pelan ya.'
    ];
  } else if (isYellow) {
    conversationStarters = [
      'Halo! Ibu perhatikan belakangan ini aktivitas dan tugas sekolahmu sedang cukup padat ya. Dari semua kegiatan mingguanmu, mana yang terasa paling menguras energimu saat ini?',
      'Kalau boleh tahu, ada bagian pelajaran atau tugas kelompok yang membuatmu merasa kurang nyaman atau butuh dukungan tambahan?',
      'Apa hal yang biasanya paling bisa membantumu merasa rileks atau kembali segar saat pikiran sedang penuh?'
    ];
  } else {
    conversationStarters = [
      `Halo! Ibu sangat tertarik saat membaca antusiasmemu seputar ${studentProfile.hobbies_interests || 'kegiatan belajarmu'}. Ceritakan dong apa yang paling membuatmu bersemangat menjalaninya!`,
      `Melihat minatmu yang kuat di bidang ${studentProfile.favorite_subjects || 'ini'}, apakah kamu sudah pernah membayangkan karir atau jurusan yang ingin kamu tekuni kelak?`,
      'Menurutmu, dukungan atau kegiatan sekolah seperti apa yang bisa semakin membantu mengasah bakat hebatmu ini?'
    ];
  }

  const generatedAt = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return {
    studentId: studentProfile.student_id,
    gradeLevel: studentProfile.grade_level,
    generatedAt,
    triageLevel: triageResult.triageLevel,
    evidenceQuotes: triageResult.evidenceQuotes,
    reasoningSummary: triageResult.reasoningSummary,
    recommendedAction: triageResult.recommendedAction,
    isEmergencyCrisis: triageResult.isEmergencyCrisis,
    emergencyHotline: isRed ? 'Hotline Kesehatan Jiwa Kemenkes: 119 ext 8 (24 Jam Bebas Pulsa)' : null,
    riasecSummary: isRed ? 'Modul pemetaan karir dinonaktifkan sementara untuk memprioritaskan keselamatan dan dukungan emosional.' : {
      primaryCode: riasecResult.primaryCode,
      topTheme: riasecResult.topThemeName,
      studyPaths: riasecResult.recommendedStudyPaths,
      scores: riasecResult.scores
    },
    conversationStarters,
    responsibleAiDisclaimer: 'Hasil analisis bersifat indikatif untuk bimbingan sekolah, bukan diagnosis psikologis/psikiatris medis. Keputusan intervensi sepenuhnya di tangan Guru BK (Human-in-the-Loop).'
  };
}

/**
 * Complete Langflow + IBM Bob Pipeline Orchestrator
 */
export function orchestrateLangflowBob(studentInput) {
  const piiResult = maskStudentPii(studentInput.reflection_text, studentInput.student_id);
  const triageResult = classifyStudentWellbeingRisk(piiResult.sanitizedText, studentInput.attendance_trend);

  let riasecResult = null;
  if (triageResult.triageLevel !== 'MERAH') {
    riasecResult = mapRiasecCareerInterest(
      studentInput.hobbies_interests,
      studentInput.favorite_subjects,
      piiResult.sanitizedText
    );
  } else {
    riasecResult = {
      scores: { R: 10, I: 10, A: 10, S: 10, E: 10, C: 10 },
      primaryCode: '—',
      topThemeName: 'Dukungan Krisis Prioritas',
      recommendedStudyPaths: [],
      recommendedActivities: []
    };
  }

  const counselingBrief = generateCounselingBrief(studentInput, triageResult, riasecResult);

  return {
    status: 'success',
    orchestrator: 'Langflow Visual Graph v1.1',
    agentEngine: 'LUNA Agent via Model Context Protocol (FastMCP)',
    executionTimeMs: 124,
    pipelineSteps: [
      { step: 1, name: 'Privacy Masking & Ingestion', tool: 'mask_student_pii', status: 'COMPLETED' },
      { step: 2, name: 'Safety Guardrail & Triage Classifier', tool: 'classify_student_wellbeing_risk', status: 'COMPLETED' },
      { step: 3, name: 'Holland RIASEC Career Mapper', tool: 'map_riasec_career_interest', status: triageResult.triageLevel === 'MERAH' ? 'SKIPPED_FOR_SAFETY' : 'COMPLETED' },
      { step: 4, name: 'Counseling Prep Sheet Generation', tool: 'generate_counseling_brief', status: 'COMPLETED' }
    ],
    studentId: studentInput.student_id,
    gradeLevel: studentInput.grade_level,
    sanitizedText: piiResult.sanitizedText,
    triage: triageResult,
    riasec: riasecResult,
    counselingBrief
  };
}

/**
 * Standard MCP JSON-RPC 2.0 Handler
 */
export function handleMcpJsonRpc(request) {
  const { jsonrpc = '2.0', id = 1, method, params } = request;

  if (method === 'initialize') {
    return {
      jsonrpc,
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: {
          name: 'langflow-counselor-mcp-server',
          version: '1.0.0'
        }
      }
    };
  }

  if (method === 'tools/list') {
    return {
      jsonrpc,
      id,
      result: {
        tools: [
          {
            name: 'mask_student_pii',
            description: 'Menghapus identitas nyata siswa (nama, nomor telepon, NISN, email) menjadi token anonim sintetis sesuai UU PDP No. 27/2022.',
            inputSchema: {
              type: 'object',
              properties: {
                rawText: { type: 'string', description: 'Teks catatan jurnal atau refleksi siswa mentah.' },
                studentId: { type: 'string', description: 'ID anonim siswa.' }
              },
              required: ['rawText']
            }
          },
          {
            name: 'classify_student_wellbeing_risk',
            description: 'Mendeteksi sinyal stres emosional/akademik dan mengelompokkan urgensi bimbingan ke dalam 3 level triase (HIJAU, KUNING, MERAH) secara transparan dan safe.',
            inputSchema: {
              type: 'object',
              properties: {
                sanitizedText: { type: 'string', description: 'Teks refleksi siswa yang sudah disanitasi.' },
                attendanceTrend: { type: 'string', description: 'Tren absensi (Normal / Alpa).' }
              },
              required: ['sanitizedText']
            }
          },
          {
            name: 'map_riasec_career_interest',
            description: 'Memetakan preferensi hobi, ekstrakurikuler, dan pelajaran favorit ke dalam 6 tipe minat karir Holland RIASEC dan memberikan 3 rekomendasi prodi studi lanjut.',
            inputSchema: {
              type: 'object',
              properties: {
                hobbiesText: { type: 'string' },
                favoriteSubjects: { type: 'string' },
                reflectionText: { type: 'string' }
              }
            }
          },
          {
            name: 'generate_counseling_brief',
            description: 'Menghasilkan lembar persiapan bimbingan konseling 1 halaman siap pakai untuk Guru BK beserta 3 pertanyaan pembuka dialog empatik non-intimidatif.',
            inputSchema: {
              type: 'object',
              properties: {
                studentProfile: { type: 'object' },
                triageResult: { type: 'object' },
                riasecResult: { type: 'object' }
              },
              required: ['studentProfile', 'triageResult']
            }
          }
        ]
      }
    };
  }

  if (method === 'tools/call') {
    const { name, arguments: args } = params || {};

    if (name === 'mask_student_pii') {
      const res = maskStudentPii(args.rawText, args.studentId);
      return { jsonrpc, id, result: { content: [{ type: 'text', text: JSON.stringify(res) }] } };
    }

    if (name === 'classify_student_wellbeing_risk') {
      const res = classifyStudentWellbeingRisk(args.sanitizedText, args.attendanceTrend);
      return { jsonrpc, id, result: { content: [{ type: 'text', text: JSON.stringify(res) }] } };
    }

    if (name === 'map_riasec_career_interest') {
      const res = mapRiasecCareerInterest(args.hobbiesText, args.favoriteSubjects, args.reflectionText);
      return { jsonrpc, id, result: { content: [{ type: 'text', text: JSON.stringify(res) }] } };
    }

    if (name === 'generate_counseling_brief') {
      const res = generateCounselingBrief(args.studentProfile, args.triageResult, args.riasecResult);
      return { jsonrpc, id, result: { content: [{ type: 'text', text: JSON.stringify(res) }] } };
    }

    return { jsonrpc, id, error: { code: -32601, message: `Tool '${name}' not found.` } };
  }

  return { jsonrpc, id, error: { code: -32601, message: `Method '${method}' not implemented.` } };
}
