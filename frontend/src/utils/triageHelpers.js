/**
 * Triage & Early Warning flag helpers for LUNA Counseling system
 */

export const TRIAGE_LEVELS = {
  MERAH: 'MERAH',
  KUNING: 'KUNING',
  HIJAU: 'HIJAU',
  HITAM: 'HITAM'
};

/**
 * Mendapatkan konfigurasi visual badge berdasarkan level triase siswa
 * @param {string} level 'MERAH' | 'KUNING' | 'HIJAU' | 'HITAM' | 'critical' | 'warning' | 'normal' | 'black'
 * @returns {{ label: string, color: string, bg: string, borderColor: string }}
 */
export function getTriageBadgeInfo(level) {
  const normalized = (level || '').toUpperCase();

  if (normalized === 'MERAH' || normalized === 'CRITICAL') {
    return {
      label: '🔴 Kritis / Darurat',
      shortLabel: 'MERAH',
      color: '#C92A2A',
      bg: '#FFF5F5',
      borderColor: '#FFC9C9',
      shadow: '0 4px 16px rgba(201, 42, 42, 0.12)'
    };
  }

  if (normalized === 'KUNING' || normalized === 'WARNING') {
    return {
      label: '🟡 Perlu Perhatian',
      shortLabel: 'KUNING',
      color: '#E67700',
      bg: '#FFF9DB',
      borderColor: '#FFE066',
      shadow: 'var(--shadow-subtle)'
    };
  }

  if (normalized === 'HITAM' || normalized === 'BLACK') {
    return {
      label: '⚫ Krisis Akut',
      shortLabel: 'KRISIS',
      color: '#FFFFFF',
      bg: '#181926',
      borderColor: '#374151',
      shadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
    };
  }

  // Default: HIJAU / NORMAL
  return {
    label: '🟢 Normal',
    shortLabel: 'HIJAU',
    color: '#2B8A3E',
    bg: '#EBFBEE',
    borderColor: 'var(--colors-hairline-soft)',
    shadow: 'var(--shadow-subtle)'
  };
}
