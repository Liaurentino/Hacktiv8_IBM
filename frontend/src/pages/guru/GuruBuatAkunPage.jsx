import React from 'react';
import { useNavigate } from 'react-router-dom';
import GuruBuatAkunSiswa from '../../components/GuruBuatAkunSiswa';

export default function GuruBuatAkunPage() {
  const navigate = useNavigate();

  return (
    <GuruBuatAkunSiswa
      onNavigateToStudents={() => navigate('/guru/students')}
      onSelectStudentDetail={(st) => navigate(`/guru/detail/${st.id}`)}
    />
  );
}
