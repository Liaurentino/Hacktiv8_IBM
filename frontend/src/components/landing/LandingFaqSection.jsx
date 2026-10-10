import React, { useState } from 'react';

const FAQ_DATA = [
  {
    q: 'Apakah curhat di LUNA benar-benar aman dan rahasia?',
    a: 'Ya, keamanan psikologis dan konfidensialitas adalah prioritas tertinggi LUNA. Setiap percakapan dilindungi dengan enkripsi dan hanya digunakan untuk pendampingan konseling sekolah tanpa disebarluaskan.'
  },
  {
    q: 'Bagaimana cara sistem Early Warning mendeteksi siswa yang butuh bantuan?',
    a: 'LUNA memadukan tren nilai berkala (P1–P14), absensi, dan analisis empati LUNA Empathy AI Engine untuk mengelompokkan status triase siswa: Hijau (Stabil), Kuning (Observasi), Merah (Prioritas BK), dan Hitam (Darurat).'
  },
  {
    q: 'Apakah data siswa dan sekolah tersimpan dengan aman?',
    a: 'Benar. Semua data siswa, nilai per mata pelajaran, catatan konseling, dan riwayat refleksi tersimpan secara terpusat dengan enkripsi privasi sesuai standar UU PDP No. 27/2022.'
  },
  {
    q: 'Apa perbedaan hak akses antara Siswa, Guru, dan Guru BK?',
    a: 'Siswa dapat mengakses curhat AI, nilai pribadi, dan rekomendasi karir. Guru dapat mengelola nilai mata pelajaran kelas. Guru BK memiliki wewenang khusus memantau dashboard deteksi dini dan mengelola intervensi siswa.'
  }
];

export default function LandingFaqSection() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section id="faq" style={{ padding: '50px 20px', background: '#FFFFFF', width: '100%', borderTop: '1px solid #E2E0FD' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 800, color: 'var(--luna-navy)' }}>
            Pertanyaan yang Sering Diajukan
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Pahami bagaimana LUNA menjaga privasi, menganalisis perkembangan, dan membantu siswa.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQ_DATA.map((item, index) => (
            <div
              key={index}
              style={{
                border: '1.5px solid #E2E8F0',
                borderRadius: '14px',
                overflow: 'hidden',
                background: '#FAF9FE',
                transition: 'all 0.2s'
              }}
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--luna-navy)' }}>
                  {item.q}
                </span>
                <span
                  style={{
                    fontSize: '18px',
                    color: 'var(--text-muted)',
                    fontWeight: 700,
                    transform: openFaq === index ? 'rotate(45deg)' : 'none',
                    transition: 'transform 0.2s'
                  }}
                >
                  +
                </span>
              </button>
              {openFaq === index && (
                <div style={{ padding: '0 20px 18px', fontSize: '13.5px', color: 'var(--slate-600)', lineHeight: 1.6, borderTop: '1px solid #F1F5F9' }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
