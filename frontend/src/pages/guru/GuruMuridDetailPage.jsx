import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GuruMuridDetail from '../../components/GuruMuridDetail';
import '../../styles/guru-murid-reference.css';

export default function GuruMuridDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <GuruMuridDetail
      studentId={Number(id) || 1}
      onBack={() => navigate('/guru/students')}
      onOpenFlagSystem={() => navigate('/guru/flags')}
    />
  );
}
