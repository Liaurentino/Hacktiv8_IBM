import React from 'react';
import { useNavigate } from 'react-router-dom';
import GuruDashboardRekap from '../../components/GuruDashboardRekap';
import '../../styles/guru-dashboard-reference.css';

export default function GuruRekapPage() {
  const navigate = useNavigate();

  return (
    <GuruDashboardRekap
      onSelectStudent={(st) => navigate(`/guru/detail/${st.id}`)}
      onOpenFlagSystem={() => navigate('/guru/flags')}
    />
  );
}
