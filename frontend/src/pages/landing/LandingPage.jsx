import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingHero from '../../components/LandingHero';
import { useAuth } from '../../context/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const handleOpenAuth = () => {
    navigate('/login');
  };

  const handleSelectPortal = (portal) => {
    if (portal === 'guru') {
      setCurrentUser({
        name: 'Bu Ratna Dewi, M.Pd',
        role: 'guru_bk',
        email: 'ratna@sekolah.sch.id',
        avatar: 'RD'
      });
      navigate('/guru');
    } else {
      setCurrentUser({
        name: 'Budi Siswa Demo',
        role: 'siswa',
        email: 'siswa@siswa.sch.id',
        avatar: 'BS'
      });
      navigate('/siswa/dashboard');
    }
  };

  return (
    <LandingHero
      onOpenAuth={handleOpenAuth}
      onSelectPortal={handleSelectPortal}
    />
  );
}
