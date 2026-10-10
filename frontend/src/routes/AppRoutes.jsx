import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import GuruLayout from '../layouts/GuruLayout';
import SiswaLayout from '../layouts/SiswaLayout';

// Public & Auth Pages
import LandingPage from '../pages/landing/LandingPage';
import LoginPageView from '../pages/auth/LoginPageView';

// Guru BK & Guru Mapel Pages
import GuruKelolaAkunPage from '../pages/guru/GuruKelolaAkunPage';
import GuruBuatAkunPage from '../pages/guru/GuruBuatAkunPage';
import GuruRekapPage from '../pages/guru/GuruRekapPage';
import GuruFlagsPage from '../pages/guru/GuruFlagsPage';
import GuruMuridDetailPage from '../pages/guru/GuruMuridDetailPage';
import GuruAiChatPage from '../pages/guru/GuruAiChatPage';
import GuruMapelNilaiPage from '../pages/guru/GuruMapelNilaiPage';
import GuruTriagePage from '../pages/guru/GuruTriagePage';

// Siswa Pages
import SiswaDashboardPage from '../pages/siswa/SiswaDashboardPage';
import SiswaChatPage from '../pages/siswa/SiswaChatPage';
import SiswaProfilePage from '../pages/siswa/SiswaProfilePage';

function GuruIndexRedirect() {
  const { currentUser } = useAuth();
  if (currentUser?.role === 'guru_mapel' || currentUser?.role === 'guru') {
    return <Navigate to="nilai-mapel" replace />;
  }
  return <Navigate to="rekap" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public / Landing Route */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPageView />} />

      {/* Portal Guru (BK & Mapel) Routes */}
      <Route path="/guru" element={<GuruLayout />}>
        <Route index element={<GuruIndexRedirect />} />
        <Route path="nilai-mapel" element={<GuruMapelNilaiPage />} />
        <Route path="rekap" element={<GuruRekapPage />} />
        <Route path="triage" element={<GuruTriagePage />} />
        <Route path="flags" element={<GuruFlagsPage />} />
        <Route path="students" element={<GuruKelolaAkunPage />} />
        <Route path="buat-akun" element={<GuruBuatAkunPage />} />
        <Route path="detail/:id" element={<GuruMuridDetailPage />} />
        <Route path="ai-chat" element={<GuruAiChatPage />} />
      </Route>

      {/* Portal Siswa Routes */}
      <Route path="/siswa" element={<SiswaLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SiswaDashboardPage />} />
        <Route path="chat" element={<SiswaChatPage />} />
        <Route path="profile" element={<SiswaProfilePage />} />
      </Route>

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
