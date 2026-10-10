import React from 'react';
import { ShieldAlert, PhoneCall } from 'lucide-react';

export default function BriefCrisisAlert() {
  return (
    <div
      style={{
        backgroundColor: '#fff5f5',
        border: '2px solid #c92a2a',
        borderRadius: 'var(--rounded-md)',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 4px 16px rgba(201, 42, 42, 0.15)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <ShieldAlert size={26} color="#c92a2a" />
        <h4 style={{ color: '#c92a2a', margin: 0, fontSize: '16px', fontWeight: 700 }}>
          ESKALASI PROTOKOL KRISIS DARURAT (JALUR MERAH)
        </h4>
      </div>
      <p style={{ fontSize: '13.5px', color: '#495057', lineHeight: 1.5, marginBottom: '14px' }}>
        Teks siswa memicu indikator keputusasaan berat. <strong>Sesuai prinsip Responsible AI, sistem memblokir kesimpulan otomatis</strong> dan mewajibkan intervensi langsung tatap muka oleh Guru BK.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <a
          href="tel:119"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#c92a2a',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: 'var(--rounded-md)',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 600
          }}
        >
          <PhoneCall size={14} />
          Hubungi Hotline Kemenkes 119 ext 8
        </a>
        <span style={{ fontSize: '12px', color: '#868e96' }}>
          (Layanan Kesehatan Jiwa Sejiwa 24 Jam Bebas Pulsa)
        </span>
      </div>
    </div>
  );
}
