import React from 'react';
import { useNavigate } from 'react-router-dom';
import SiswaProfileSettings from '../../components/SiswaProfileSettings';
import { useAuth } from '../../context/AuthContext';
import '../../styles/siswa-settings-reference.css';

export default function SiswaProfilePage() {
  const navigate = useNavigate();
  const { currentUser, updateUser } = useAuth();

  return (
    <SiswaProfileSettings
      currentUser={currentUser}
      onUpdateCurrentUser={(updated) => updateUser(updated)}
      onNavigateToDashboard={() => navigate('/siswa/dashboard')}
    />
  );
}
