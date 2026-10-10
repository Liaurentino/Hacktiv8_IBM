import React from 'react';
import { FileText, X } from 'lucide-react';

export default function FlagInterventionModal({
  interventionTarget,
  onClose,
  handleSaveIntervention,
  interventionType,
  setInterventionType,
  interventionNote,
  setInterventionNote,
  interventionOutcome,
  setInterventionOutcome
}) {
  if (!interventionTarget) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        maxWidth: '520px',
        width: '100%',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid var(--border)'
      }}>
        <div style={{
          background: '#2F3366',
          color: '#FFFFFF',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 800 }}>
            <FileText size={18} />
            <span>Catat Hasil Sesi Intervensi BK</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSaveIntervention} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Siswa yang Ditangani
            </label>
            <input
              type="text"
              readOnly
              value={`${interventionTarget.student_name} (${interventionTarget.nisn})`}
              style={{ width: '100%', padding: '9px 12px', background: '#F8F7FD', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '13px', fontWeight: 700 }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Bentuk Tindakan Intervensi
            </label>
            <select
              value={interventionType}
              onChange={(e) => setInterventionType(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '13px', background: '#FAF9FE' }}
            >
              <option value="Konseling Individu 1-on-1">🗣️ Konseling Individu 1-on-1</option>
              <option value="Koordinasi dengan Guru Mata Pelajaran">🤝 Koordinasi dengan Guru Mata Pelajaran</option>
              <option value="Pemanggilan / Diskusi dengan Orang Tua">👨‍👩‍👧 Pemanggilan / Diskusi dengan Orang Tua</option>
              <option value="Rekomendasi Modul Remedial Khusus">📚 Rekomendasi Modul Remedial Khusus</option>
              <option value="Bimbingan Minat Karir &amp; Penjurusan">🧭 Bimbingan Minat Karir &amp; Penjurusan</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Catatan Kesepakatan &amp; Refleksi
            </label>
            <textarea
              rows={4}
              value={interventionNote}
              onChange={(e) => setInterventionNote(e.target.value)}
              placeholder="Catat komitmen belajar siswa, akar kendala yang diidentifikasi, dan langkah konkrit yang disepakati..."
              required
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '13px', resize: 'vertical', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Status Siswa Setelah Sesi Ini
            </label>
            <select
              value={interventionOutcome}
              onChange={(e) => setInterventionOutcome(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '13px', background: '#FAF9FE' }}
            >
              <option value="in_progress">👀 Dalam Pemantauan Lanjutan (Monitoring 2 Minggu)</option>
              <option value="resolved">✅ Selesai Ditangani / Kondisi Belajar Stabil</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'transparent', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-luna-primary"
              style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '13px' }}
            >
              Simpan Catatan Intervensi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
