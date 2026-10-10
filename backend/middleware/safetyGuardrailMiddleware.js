/**
 * Safety Guardrail Intercept Middleware
 * Deteksi Dini Krisis Emosional Akut & Sinyal Bahaya Langsung (Flag Hitam)
 * Sesuai Standar Responsible AI & Etika Konseling Siswa
 */

const CRISIS_KEYWORDS = [
  'bunuh diri',
  'akhiri hidup',
  'ingin mati',
  'mau mati',
  'menyakiti diri',
  'sayat tangan',
  'gantung diri',
  'lompat dari gedung',
  'tidak ingin hidup',
  'mati saja',
  'pengen mati'
];

export function checkCrisisSignals(text) {
  if (!text || typeof text !== 'string') return false;
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
}

export default function safetyGuardrailMiddleware(req, res, next) {
  const textToCheck = req.body?.message || req.body?.reflection_text || '';
  
  if (checkCrisisSignals(textToCheck)) {
    req.isEmergency = true;
    req.crisisTrigger = 'Terdeteksi indikasi krisis keselamatan diri darurat dalam teks siswa.';
  } else {
    req.isEmergency = false;
  }
  
  next();
}
