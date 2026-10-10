import React from 'react';

/**
 * PageHeader - Clean Standardized Header Pattern for LUNA Pages
 * 
 * Structure:
 * 1. Judul utama (H1): Nama halaman spesifik (e.g. "Pengaturan Akun & Profil Pribadi").
 * 2. Baris metadata opsional: Identitas siswa / kelas / parameter relevan dipisah bullet '•'.
 * 3. Filter dan aksi: Di sisi kanan pada desktop; responsif di bawah judul pada layar kecil.
 * 4. Header tanpa card: Spacing bersih dan pemisah garis halus sebelum konten.
 * (Tanpa eyebrow "AI slop" dan tanpa paragraf penjelasan teks kecil sesuai arahan desain).
 */
export default function PageHeader({
  title,
  metadata = [],
  actions,
  showDivider = true,
  className = ''
}) {
  return (
    <div
      className={`luna-page-header-container ${className}`}
      style={{
        marginBottom: showDivider ? '24px' : '16px',
        paddingBottom: showDivider ? '16px' : '0',
        borderBottom: showDivider ? '1px solid #E8E5F7' : 'none'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '16px'
        }}
      >
        {/* Left: Text Block (Title & Metadata / Identitas Siswa) */}
        <div style={{ flex: '1 1 360px', minWidth: 0 }}>
          {/* 1. Judul utama */}
          <h1
            style={{
              color: '#1E1B4B',
              margin: '0 0 6px 0',
              fontSize: '24px',
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: '-0.02em',
              lineHeight: 1.25
            }}
          >
            {title}
          </h1>

          {/* 2. Baris metadata / identitas siswa relevan */}
          {metadata && metadata.length > 0 && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                color: '#64748B',
                flexWrap: 'wrap',
                marginTop: '4px'
              }}
            >
              {metadata.map((item, index) => (
                <React.Fragment key={index}>
                  <span>
                    {item.label ? `${item.label}: ` : ''}
                    <strong style={{ color: '#334155' }}>{item.value}</strong>
                  </span>
                  {index < metadata.length - 1 && (
                    <span style={{ color: '#CBD5E1', userSelect: 'none' }}>•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Right: Actions / Filters (Desktop di kanan, wrap pada mobile) */}
        {actions && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
              flexShrink: 0,
              alignSelf: 'flex-start'
            }}
          >
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
