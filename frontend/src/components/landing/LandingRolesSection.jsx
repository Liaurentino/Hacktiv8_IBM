import React from 'react';
import { User, BookOpen, School, ChevronRight } from 'lucide-react';

export default function LandingRolesSection({ onSelectPortal }) {
  return (
    <section id="untuk-siapa" style={{ padding: '50px 20px', background: '#FFFFFF', width: '100%', borderTop: '1px solid #E2E0FD' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: 'var(--luna-navy)' }}>
            Dirancang untuk 3 Peran Utama
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '560px', margin: '8px auto 0' }}>
            Setiap pemangku kepentingan memiliki antarmuka khusus yang disesuaikan dengan kebutuhan sehari-hari.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '20px'
          }}
        >
          {/* Role 1: Siswa */}
          <div className="card" style={{ padding: '24px', borderRadius: '18px', background: '#F8FAFF', border: '1.5px solid #C7D2FE', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#E0E7FF', color: '#3730A3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={22} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, background: '#EDE9FE', color: '#5B21B6', padding: '4px 10px', borderRadius: '12px' }}>
                Siswa
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--luna-navy)', marginBottom: '8px' }}>
              Ruang Curhat &amp; Karir
            </h3>
            <ul style={{ paddingLeft: '18px', margin: '0 0 16px', fontSize: '13px', color: 'var(--slate-600)', lineHeight: 1.8 }}>
              <li>Curhat AI 24/7 tanpa rasa takut atau malu</li>
              <li>Pantau riwayat nilai P1–P14 secara transparan</li>
              <li>Rekomendasi jurusan &amp; karir berbasis RIASEC</li>
              <li>Pesan motivasi harian &amp; afirmasi positif</li>
            </ul>
            <button
              type="button"
              onClick={() => onSelectPortal('siswa')}
              style={{
                marginTop: 'auto',
                background: '#FFFFFF',
                border: '1.5px solid #4F46E5',
                color: '#4F46E5',
                padding: '9px 14px',
                borderRadius: '24px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span>Akses Portal Siswa</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Role 2: Guru Mapel */}
          <div className="card" style={{ padding: '24px', borderRadius: '18px', background: '#F0FDF4', border: '1.5px solid #BBF7D0', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={22} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, background: '#DCFCE7', color: '#166534', padding: '4px 10px', borderRadius: '12px' }}>
                Guru Mata Pelajaran
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--luna-navy)', marginBottom: '8px' }}>
              Pantau Nilai &amp; Rekap
            </h3>
            <ul style={{ paddingLeft: '18px', margin: '0 0 16px', fontSize: '13px', color: 'var(--slate-600)', lineHeight: 1.8 }}>
              <li>Input dan kelola nilai tugas serta ujian berkala</li>
              <li>Lihat tren capaian kelas XI IPA 2 secara instan</li>
              <li>Identifikasi siswa yang membutuhkan remedial</li>
              <li>Sinkronisasi data capaian secara real-time</li>
            </ul>
            <button
              type="button"
              onClick={() => onSelectPortal('guru')}
              style={{
                marginTop: 'auto',
                background: '#FFFFFF',
                border: '1.5px solid #166534',
                color: '#166534',
                padding: '9px 14px',
                borderRadius: '24px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span>Akses Portal Guru</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Role 3: Guru BK */}
          <div className="card" style={{ padding: '24px', borderRadius: '18px', background: '#FAF8FF', border: '1.5px solid #DDD6FE', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#EDE9FE', color: '#5B21B6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <School size={22} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, background: '#EDE9FE', color: '#5B21B6', padding: '4px 10px', borderRadius: '12px' }}>
                Konselor BK
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--luna-navy)', marginBottom: '8px' }}>
              Early Warning &amp; Konseling
            </h3>
            <ul style={{ paddingLeft: '18px', margin: '0 0 16px', fontSize: '13px', color: 'var(--slate-600)', lineHeight: 1.8 }}>
              <li>Triase otomatis siswa (Hijau, Kuning, Merah, Hitam)</li>
              <li>Deteksi dini sinyal keputusasaan &amp; isolasi belajar</li>
              <li>Kelola direktori akun dan data profil siswa</li>
              <li>Jadwalkan intervensi preventif sebelum terlambat</li>
            </ul>
            <button
              type="button"
              onClick={() => onSelectPortal('guru')}
              style={{
                marginTop: 'auto',
                background: 'var(--luna-navy)',
                border: 'none',
                color: '#FFFFFF',
                padding: '9px 14px',
                borderRadius: '24px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span>Akses Portal Guru BK</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
