import React from 'react';
import { Calendar, X } from 'lucide-react';

export default function FlagScheduleModal({
  scheduleTarget,
  onClose,
  handleSaveSchedule,
  scheduleDate,
  setScheduleDate,
  scheduleTime,
  setScheduleTime,
  scheduleLocation,
  setScheduleLocation,
  scheduleTopic,
  setScheduleTopic
}) {
  if (!scheduleTarget) return null;

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
          background: '#7C69EF',
          color: '#FFFFFF',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 800 }}>
            <Calendar size={18} />
            <span>Jadwalkan Sesi Konseling BK</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSaveSchedule} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Siswa yang Dituju
            </label>
            <input
              type="text"
              readOnly
              value={`${scheduleTarget.student_name} (${scheduleTarget.nisn})`}
              style={{ width: '100%', padding: '9px 12px', background: '#F8F7FD', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '13px', fontWeight: 700 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Tanggal Sesi
              </label>
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                required
                style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Waktu (WIB)
              </label>
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                required
                style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '13px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Tempat / Sarana Konseling
            </label>
            <select
              value={scheduleLocation}
              onChange={(e) => setScheduleLocation(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '13px', background: '#FAF9FE' }}
            >
              <option value="Ruang Konseling BK (Tatap Muka)">🏫 Ruang Konseling BK (Tatap Muka)</option>
              <option value="Online via Google Meet / Video Call">💻 Online via Google Meet / Video Call</option>
              <option value="Kunjungan Rumah / Home Visit">🏡 Kunjungan Rumah / Home Visit</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Agenda / Fokus Percakapan
            </label>
            <input
              type="text"
              value={scheduleTopic}
              onChange={(e) => setScheduleTopic(e.target.value)}
              placeholder="Misal: Evaluasi fluktuasi nilai & dialog afektif"
              required
              style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '13px' }}
            />
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
              Simpan Jadwal Temu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
