/**
 * Formatters and string helpers for LUNA Frontend
 */

/**
 * Mendapatkan inisial 2 karakter dari nama pengguna atau siswa
 * @param {string} name
 * @param {string} fallback
 * @returns {string}
 */
export function getInitials(name, fallback = 'LU') {
  if (!name || typeof name !== 'string') return fallback;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Format tanggal dalam format standar Indonesia (e.g. 10 Oktober 2026)
 * @param {string|Date} dateInput
 * @returns {string}
 */
export function formatDate(dateInput) {
  if (!dateInput) return '-';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}
