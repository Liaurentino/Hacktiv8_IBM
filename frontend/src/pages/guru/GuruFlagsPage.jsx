import React from 'react';
import { useNavigate } from 'react-router-dom';
import GuruFlagSystem from '../../components/GuruFlagSystem';
import '../../styles/guru-flag-reference.css';

export default function GuruFlagsPage() {
  const navigate = useNavigate();

  return (
    <GuruFlagSystem
      onOpenStudentDetail={(st) => navigate(`/guru/detail/${st.id}`)}
    />
  );
}
