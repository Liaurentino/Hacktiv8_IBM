import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu } from 'lucide-react';
import SiswaSidebar from './siswa/SiswaSidebar';

export default function SiswaLayout() {
  const { currentUser, logoutUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Auto-fill student user if null or non-student role
  React.useEffect(() => {
    if (!currentUser || currentUser.role !== 'siswa') {
      setCurrentUser({
        id: 17,
        name: 'Priya Ramadhani',
        role: 'siswa',
        email: 'priya@siswa.sch.id',
        avatar: 'PR'
      });
    }
  }, [currentUser, setCurrentUser]);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const currentPath = location.pathname;
  const isDashboard = currentPath.includes('/siswa/dashboard');

  return (
    <div className="unified-app-layout student-shell">
      {/* Unified Sidebar for Desktop + Mobile */}
      <SiswaSidebar
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
