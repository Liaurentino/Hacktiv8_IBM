import React from 'react';
import { useNavigate } from 'react-router-dom';
import GuruCrudStudents from '../../components/GuruCrudStudents';

export default function GuruKelolaAkunPage() {
  const navigate = useNavigate();

  return (
    <GuruCrudStudents
      onSelectStudentDetail={(st) => navigate(`/guru/detail/${st.id}`)}
      onNavigateToCreate={() => navigate('/guru/buat-akun')}
    />
  );
}
