import React from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';

export default function LandingNavbar({
  isScrolled,
  activeSection,
  scrollToSection,
  mobileMenuOpen,
  setMobileMenuOpen,
  onOpenAuth,
  onSelectPortal
}) {
  return (
    <>
      <header className={`luna-navbar-wrapper ${isScrolled ? 'scrolled' : ''}`}>
        <div className="luna-navbar-container">
          {/* Brand: Moon Emblem + LUNA bold text */}
          <button
            type="button"
            onClick={(e) => scrollToSection(e, 'beranda')}
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              textAlign: 'left'
            }}
          >
            <div style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 40 40" width="38" height="38" fill="none">
                <path
                  d="M24 6C15.163 6 8 13.163 8 22C8 30.837 15.163 38 24 38C26.5 38 28.8 37.4 30.8 36.3C22.5 35 16 28 16 20C16 12.8 21.2 6.8 28.5 6.1C27 6 25.5 6 24 6Z"
                  fill="#2F3366"
                />
                <path
                  d="M24 16L25.2 18.5L28 19.2L25.8 21.2L26.5 24L24 22.5L21.5 24L22.2 21.2L20 19.2L22.8 18.5L24 16Z"
                  fill="#FCD34D"
                />
                <path d="M28 26C31 24 34 26 35 29C32 29 30 28 28 26Z" fill="#A9A8F5" />
                <path d="M29 31C32 30 35 32 35 34C32 34 30 33 29 31Z" fill="#8A8FD9" />
              </svg>
            </div>
            <span style={{ fontSize: '22px', fontWeight: 900, color: '#2D3166', letterSpacing: '-0.02em', lineHeight: 1 }}>
              LUNA
            </span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="landing-desktop-nav">
            {[
              { id: 'beranda', label: 'Beranda' },
              { id: 'tentang', label: 'Tentang' },
              { id: 'fitur', label: 'Fitur' },
              { id: 'untuk-siapa', label: 'Untuk Siapa' },
              { id: 'faq', label: 'FAQ' }
            ].map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`luna-nav-link ${isActive ? 'active' : ''}`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="landing-desktop-actions">
            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="luna-btn-outline-pill"
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => onOpenAuth('register')}
              className="luna-btn-navy-pill"
            >
              <span>Mulai Sekarang</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="landing-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            title="Buka Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div className="luna-mobile-backdrop" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="luna-mobile-drawer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
            <span style={{ fontSize: '18px', fontWeight: 900, color: '#2D3166' }}>LUNA</span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '14px 0' }}>
            {[
              { id: 'beranda', label: 'Beranda' },
              { id: 'tentang', label: 'Tentang' },
              { id: 'fitur', label: 'Fitur' },
              { id: 'untuk-siapa', label: 'Untuk Siapa' },
              { id: 'faq', label: 'FAQ' }
            ].map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => scrollToSection(e, item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: isActive ? '#EDE8FE' : 'transparent',
                    color: isActive ? '#323768' : '#475569',
                    fontWeight: isActive ? 800 : 600,
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px'
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #E2E8F0', paddingTop: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '6px' }}>
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); onSelectPortal('siswa'); }}
                style={{ background: '#F8FAFF', border: '1px solid #C7D2FE', borderRadius: '10px', padding: '8px', fontSize: '12px', fontWeight: 700, color: '#3730A3', cursor: 'pointer' }}
              >
                🎒 Portal Siswa
              </button>
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); onSelectPortal('guru'); }}
                style={{ background: '#FAF9FE', border: '1px solid #DDD6FE', borderRadius: '10px', padding: '8px', fontSize: '12px', fontWeight: 700, color: '#6B21A8', cursor: 'pointer' }}
              >
                🏫 Portal Guru/BK
              </button>
            </div>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onOpenAuth('login'); }}
              className="luna-btn-outline-pill"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onOpenAuth('register'); }}
              className="luna-btn-navy-pill"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>Mulai Sekarang</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
