import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GuruSidebar from './guru/GuruSidebar';

export default function GuruLayout() {
  const { currentUser, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Determine if user is Guru BK or Guru Mata Pelajaran
  const isGuruMapel = currentUser?.role === 'guru_mapel' || currentUser?.role === 'guru';
  const isGuruBk = !isGuruMapel;

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const currentPath = location.pathname;

  return (
    <div className="unified-app-layout guru-shell">
      {/* Unified Sidebar for Desktop + Mobile */}
      <GuruSidebar
        isGuruMapel={isGuruMapel}
        isGuruBk={isGuruBk}
        currentPath={currentPath}
        currentUser={currentUser}
        onNavigate={navigate}
        onLogout={handleLogout}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
      />

      {/* Mobile Floating Menu Button (Top Left) */}
      <button
        type="button"
        className="unified-mobile-menu-trigger"
        onClick={() => setMobileNavOpen(true)}
        title="Buka Navigasi"
        aria-label="Buka Navigasi"
      >
        <Menu size={22} />
      </button>

      {/* Main Content Area */}
      <div className="unified-content-wrapper">
        <main className="unified-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
