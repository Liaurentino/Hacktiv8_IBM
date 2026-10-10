import React from 'react';
import {
  Moon,
  BookOpen,
  School,
  Bot,
  Zap,
  Flag,
  Users,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  X
} from 'lucide-react';
import NotificationBell from '../../components/common/NotificationBell';

export default function GuruSidebar({
  isGuruMapel,
  isGuruBk,
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

      {/* Unified Sidebar */}
      <aside
        className={`unified-sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${mobileNavOpen ? 'mobile-open' : ''}`}
      >
        {/* Brand & Toggle Header */}
        <div className="unified-sidebar-header">
          <div
            className="unified-brand"
            onClick={() => handleNav(isGuruMapel ? '/guru/nilai-mapel' : '/guru/rekap')}
            title="LUNA Portal Guru"
          >
            <div className="unified-brand-icon">
              <Moon size={18} />
            </div>
            {!sidebarCollapsed && (
              <div className="unified-brand-info">
                <div className="unified-brand-title">LUNA</div>
                <div className="unified-brand-sub">
                  {isGuruMapel ? `Guru ${currentUser?.subject_name || 'Mapel'}` : 'Portal Guru BK'}
                </div>
              </div>
            )}
          </div>

          <div className="unified-header-actions">
            <NotificationBell
              variant="icon"
              sidebarCollapsed={sidebarCollapsed}
              onOpen={() => setMobileNavOpen(false)}
            />

            <button
              type="button"
              className="unified-toggle-btn desk-only"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Perluas Menu' : 'Ciutkan Menu'}
              aria-label="Toggle Sidebar"
            >
              {sidebarCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
            </button>

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
          <div className="unified-nav-heading">
            {isGuruMapel ? `MAPEL ${currentUser?.subject_name?.toUpperCase() || 'MATAPELAJARAN'}` : 'PORTAL GURU BK'}
          </div>
        )}

        {/* Navigation Items */}
        <div className="unified-nav-list">

          {/* Guru Mapel Menu */}
          {isGuruMapel && (
            <>
              <div
                className={`unified-nav-item ${currentPath.includes('/guru/nilai-mapel') ? 'active' : ''}`}
                onClick={() => handleNav('/guru/nilai-mapel')}
                title="Input & Rekap Nilai"
              >
                <BookOpen size={18} />
                {!sidebarCollapsed && (
                  <>
                    <span>Input &amp; Rekap Nilai</span>
                    <span className="unified-badge badge-blue">
                      {currentUser?.subject_name || 'Mapel'}
                    </span>
                  </>
                )}
              </div>

              <div
                className={`unified-nav-item ${currentPath.includes('/guru/rekap') ? 'active' : ''}`}
                onClick={() => handleNav('/guru/rekap')}
                title="Dashboard Rekap Kelas"
              >
                <School size={18} />
                {!sidebarCollapsed && <span>Dashboard Rekap Kelas</span>}
              </div>

              <div
                className={`unified-nav-item ${currentPath.includes('/guru/ai-chat') ? 'active' : ''}`}
                onClick={() => handleNav('/guru/ai-chat')}
                title="Tanya LUNA AI"
              >
                <Bot size={18} />
                {!sidebarCollapsed && (
                  <>
                    <span>Tanya LUNA AI</span>
                    <span className="unified-badge badge-purple">AI</span>
                  </>
                )}
              </div>
            </>
          )}

          {/* Guru BK Menu */}
          {isGuruBk && (
            <>
              <div
                className={`unified-nav-item ${currentPath.includes('/guru/rekap') ? 'active' : ''}`}
                onClick={() => handleNav('/guru/rekap')}
                title="Dashboard Rekap Kelas"
              >
                <School size={18} />
                {!sidebarCollapsed && <span>Dashboard Rekap Kelas</span>}
              </div>

              <div
                className={`unified-nav-item ${currentPath.includes('/guru/triage') ? 'active' : ''}`}
                onClick={() => handleNav('/guru/triage')}
                title="Papan Triase Siswa"
              >
                <Zap size={18} />
                {!sidebarCollapsed && (
                  <>
                    <span>Papan Triase Siswa</span>
                  </>
                )}
              </div>

              <div
                className={`unified-nav-item ${currentPath.includes('/guru/flags') ? 'active' : ''}`}
                onClick={() => handleNav('/guru/flags')}
                title="Sistem Flag"
              >
                <Flag size={18} />
                {!sidebarCollapsed && (
                  <>
                    <span>Sistem Flag (Warning)</span>
                    <span className="unified-badge badge-red">2 Kritis</span>
                  </>
                )}
              </div>

              <div
                className={`unified-nav-item ${currentPath.includes('/guru/students') || currentPath.includes('/guru/buat-akun') ? 'active' : ''}`}
                onClick={() => handleNav('/guru/students')}
                title="Direktori Siswa"
              >
                <Users size={18} />
                {!sidebarCollapsed && <span>Direktori Siswa</span>}
              </div>

              <div
                className={`unified-nav-item ${currentPath.includes('/guru/ai-chat') ? 'active' : ''}`}
                onClick={() => handleNav('/guru/ai-chat')}
                title="Konsol AI Konselor"
              >
                <Bot size={18} />
                {!sidebarCollapsed && (
                  <>
                    <span>Konsol AI Konselor</span>
                    <span className="unified-badge badge-purple">AI</span>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer: User + Logout */}
        <div className="unified-sidebar-footer">
          <div
            className="unified-user-card"
            title={currentUser?.name}
          >
            <div className="unified-user-avatar">
              {currentUser?.avatar || (isGuruMapel ? 'GM' : 'RD')}
            </div>
            {!sidebarCollapsed && (
              <div className="unified-user-info">
                <div className="unified-user-name">{currentUser?.name || (isGuruMapel ? 'Guru Mapel' : 'Guru BK')}</div>
                <div className="unified-user-role">
                  {isGuruMapel ? `Guru ${currentUser?.subject_name || 'Mapel'}` : 'Guru BK • SMAN 1'}
                </div>
              </div>
            )}
          </div>

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
