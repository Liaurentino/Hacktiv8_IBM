import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginPage from '../../components/LoginPage';
import { useAuth } from '../../context/AuthContext';

export default function LoginPageView() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleLoginSuccess = (user, token) => {
    loginUser(user, token);
    if (user.role === 'siswa') {
      navigate('/siswa/dashboard');
    } else {
      navigate('/guru');
    }
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  return (
    <LoginPage
      onLoginSuccess={handleLoginSuccess}
      onBackToLanding={handleBackToLanding}
    />
  );
}
