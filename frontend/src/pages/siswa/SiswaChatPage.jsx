import React from 'react';
import SiswaChat from '../../components/SiswaChat';
import { useAuth } from '../../context/AuthContext';
import '../../styles/siswa-chat-reference.css';

export default function SiswaChatPage() {
  const { currentUser, activeStudent } = useAuth();

  return (
    <SiswaChat
      studentId={activeStudent?.id || 14}
      studentName={activeStudent?.name || currentUser?.name || 'Priya Ramadhani'}
    />
  );
}
