import React from 'react';
import { useNavigate } from 'react-router-dom';
import SiswaDashboard from '../../components/SiswaDashboard';
import { useAuth } from '../../context/AuthContext';
import '../../styles/siswa-dashboard-reference.css';

export default function SiswaDashboardPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <SiswaDashboard
      currentUser={currentUser}
      onOpenChat={() => navigate('/siswa/chat')}
      onOpenProfile={() => navigate('/siswa/profile')}
    />
  );
}
