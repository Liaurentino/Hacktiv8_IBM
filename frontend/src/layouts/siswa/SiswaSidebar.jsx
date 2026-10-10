import React from 'react';
import {
  Moon,
  LayoutDashboard,
  Bot,
  Settings,
  Compass,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  X,
  Bell
} from 'lucide-react';
import NotificationBell from '../../components/common/NotificationBell';

export default function SiswaSidebar({
  currentPath,
  currentUser,
  onNavigate,
  onLogout,
  sidebarCollapsed = false,
  setSidebarCollapsed = () => {},
  mobileNavOpen = false,
  setMobileNavOpen = () => {}
}) {
  const handleNav = (path) => {
    onNavigate(path);
    setMobileNavOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      <div
        className={`unified-nav-backdrop ${mobileNavOpen ? 'open' : ''}`}
        onClick={() => setMobileNavOpen(false)}
        aria-hidden="true"
      />

      {/* Unified Sidebar (Desktop Fixed/Collapsible + Mobile Slide Drawer) */}
      <aside
        className={`unified-sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${mobileNavOpen ? 'mobile-open' : ''}`}
      >
        {/* Brand & Toggle Header */}
        <div className="unified-sidebar-header">
          <div
            className="unified-brand"
            onClick={() => handleNav('/siswa/dashboard')}
            title="LUNA Portal Siswa"
          >
            <div className="unified-brand-icon">
              <Moon size={18} />
            </div>
            {!sidebarCollapsed && (
              <div className="unified-brand-info">
                <div className="unified-brand-title">LUNA</div>
                <div className="unified-brand-sub">Portal Siswa</div>
              </div>
            )}
          </div>

          <div className="unified-header-actions">
            <NotificationBell
              variant="icon"
              sidebarCollapsed={sidebarCollapsed}
              onOpen={() => setMobileNavOpen(false)}
            />

            {/* Desktop Collapse Toggle Button */}
            <button
              type="button"
              className="unified-toggle-btn desk-only"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Perluas Menu' : 'Ciutkan Menu'}
              aria-label="Toggle Sidebar"
            >
              {sidebarCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
            </button>

            {/* Mobile Close Button */}
            <button
              type="button"
              className="unified-close-btn mobile-only"
              onClick={() => setMobileNavOpen(false)}
              title="Tutup Menu"
              aria-label="Tutup Menu"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Section Heading */}
        {!sidebarCollapsed && (
          <div className="unified-nav-heading">MENU SISWA</div>
        )}

        {/* Navigation Items */}
        <div className="unified-nav-list">

          <div
            className={`unified-nav-item ${currentPath.includes('/siswa/dashboard') ? 'active' : ''}`}
            onClick={() => handleNav('/siswa/dashboard')}
            title="Dashboard Akademik"
          >
            <LayoutDashboard size={18} />
            {!sidebarCollapsed && <span>Dashboard Akademik</span>}
          </div>

          <div
            className={`unified-nav-item ${currentPath.includes('/siswa/chat') ? 'active' : ''}`}
            onClick={() => handleNav('/siswa/chat')}
            title="Teman Curhat LUNA (AI)"
          >
            <Bot size={18} />
            {!sidebarCollapsed && (
              <>
                <span>Teman Curhat LUNA (AI)</span>
                <span className="unified-badge badge-green">Online</span>
              </>
            )}
          </div>

          <div
            className={`unified-nav-item ${currentPath.includes('/siswa/profile') ? 'active' : ''}`}
            onClick={() => handleNav('/siswa/profile')}
            title="Pengaturan Profil"
          >
            <Settings size={18} />
            {!sidebarCollapsed && <span>Pengaturan Profil</span>}
          </div>

          <div
            className="unified-nav-item"
            onClick={() => {
              alert('Asesmen RIASEC lanjutan akan dibuka pada tahap peminatan semester mendatang.');
              setMobileNavOpen(false);
            }}
            title="Asesmen RIASEC"
          >
            <Compass size={18} />
            {!sidebarCollapsed && (
              <>
                <span>Asesmen RIASEC</span>
                <span className="unified-badge badge-muted">Segera</span>
              </>
            )}
          </div>
        </div>

        {/* User Card + Logout at Bottom */}
        <div className="unified-sidebar-footer">
          {/* User Profile Pill */}
          <div
            className="unified-user-card"
            onClick={() => handleNav('/siswa/profile')}
            title={`Profil: ${currentUser?.name || 'Priya Ramadhani'}`}
          >
            <div className="unified-user-avatar">
              {currentUser?.avatar || 'PR'}
            </div>
            {!sidebarCollapsed && (
              <div className="unified-user-info">
                <div className="unified-user-name">{currentUser?.name || 'Priya Ramadhani'}</div>
                <div className="unified-user-role">Siswa • XI IPA 2</div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            type="button"
            className="unified-logout-btn"
            onClick={onLogout}
            title="Keluar dari Akun"
          >
            <LogOut size={16} />
            {!sidebarCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
