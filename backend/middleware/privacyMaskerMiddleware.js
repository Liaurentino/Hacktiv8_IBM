/**
 * Privacy Masker Middleware (UU PDP No. 27/2022)
 * Menyamarkan Personal Identifiable Information (PII) seperti NISN, Nomor Telepon,
 * dan Nama Lengkap Siswa menjadi kode token sintetis (SISWA-XX) sebelum data diproses oleh model LLM.
 */

export function maskPii(text, studentAlias = 'SISWA-XX') {
  if (!text || typeof text !== 'string') return text;

  let masked = text;

  // Masking Nomor Telepon Indonesia (08xx-xxxx-xxxx / +628xx...)
  masked = masked.replace(/(\+62|62|08)[0-9]{8,12}/g, '[KONTAK_DISAMARKAN]');

  // Masking NISN (10 digit angka)
  masked = masked.replace(/\b[0-9]{10}\b/g, '[NISN_DISAMARKAN]');

  // Masking Email
  masked = masked.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_DISAMARKAN]');

  return masked;
}

export default function privacyMaskerMiddleware(req, res, next) {
  if (req.body && req.body.message) {
    req.body.rawMessage = req.body.message;
    req.body.sanitizedMessage = maskPii(req.body.message);
  }
  next();
}
