import React from 'react';
import { BrainCircuit, CheckCircle2 } from 'lucide-react';

export default function LandingAboutSection() {
  return (
    <section id="tentang" style={{ padding: '50px 20px', background: '#FAF9FF', width: '100%', borderTop: '1px solid #E2E0FD' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            alignItems: 'center',
            gap: '36px'
          }}
        >
          <div>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 800, color: 'var(--luna-navy)', marginBottom: '14px' }}>
              Harmoni Konseling Humanis &amp; AI Early Warning
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--slate-600)', lineHeight: 1.7, marginBottom: '14px' }}>
              LUNA lahir dari kebutuhan nyata di sekolah: banyak siswa mengalami stres akademik dan kehilangan arah tanpa berani bercerita ke ruang BK karena rasa malu atau takut dihakimi.
            </p>
            <p style={{ fontSize: '14px', color: 'var(--slate-600)', lineHeight: 1.7, marginBottom: '20px' }}>
              Dengan memadukan kecerdasan <strong>Asisten AI LUNA</strong>, penyimpanan data terenkripsi, dan instrumen psikometrik <strong>RIASEC</strong>, LUNA mendeteksi penurunan sebelum menjadi masalah besar, memberi peringatan dini kepada konselor, dan menjadi sahabat setia siswa 24/7.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--luna-navy)' }}>4 Level</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Triase Deteksi Dini Kesejahteraan</div>
              </div>
              <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#4338CA' }}>14 Sesi</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Matriks Penilaian Berkala (P1–P14)</div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '2px solid #E2E0FD',
              padding: '24px',
              boxShadow: '0 10px 30px rgba(47, 51, 102, 0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <BrainCircuit size={24} style={{ color: '#6366F1' }} />
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--luna-navy)', margin: 0 }}>
                  Ekosistem Pendampingan Cerdas Terpadu
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Perlindungan Privasi &amp; Data Real-Time</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px' }}>
                <CheckCircle2 size={16} style={{ color: '#10B981', marginTop: '2px', flexShrink: 0 }} />
                <div><strong>Penyimpanan Cloud Terenkripsi:</strong> Akses data cepat dengan jaminan perlindungan data pribadi sesuai UU PDP No. 27/2022.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px' }}>
                <CheckCircle2 size={16} style={{ color: '#10B981', marginTop: '2px', flexShrink: 0 }} />
                <div><strong>AI Empati &amp; Deteksi Dini:</strong> Analisis sentimen obrolan siswa untuk menemukan indikasi stres atau isolasi diri.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px' }}>
                <CheckCircle2 size={16} style={{ color: '#10B981', marginTop: '2px', flexShrink: 0 }} />
                <div><strong>Rekomendasi Karir RIASEC:</strong> Pemetaan minat Realistic, Investigative, Artistic, Social, Enterprising, Conventional.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
