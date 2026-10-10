import React from 'react';
import { X, Save } from 'lucide-react';

export default function EditScoreModal({
  selectedStudent,
  onClose,
  activeSubjectName,
  KKM,
  editScores,
  modalAvg,
  handleScoreChange,
  setEditScores,
  saveSuccessMsg,
  handleSaveScores,
  saving
}) {
  if (!selectedStudent) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '24px'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Form Input Nilai Mata Pelajaran {activeSubjectName}
            </span>
            <h3 style={{ margin: '4px 0 2px 0', fontSize: '18px', fontWeight: 800, color: '#1E293B' }}>
              {selectedStudent.student_name}
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
              NISN: {selectedStudent.nisn} • Kelas: {selectedStudent.class_name} • KKM: {KKM}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Live Calculation Bar */}
        <div
          style={{
            background: modalAvg >= KKM ? '#F0FDF4' : '#FEF2F2',
            border: `1px solid ${modalAvg >= KKM ? '#BBF7D0' : '#FECACA'}`,
            borderRadius: '10px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}
        >
          <div>
            <span style={{ fontSize: '12px', color: '#475569' }}>Rata-rata Terhitung: </span>
            <strong style={{ fontSize: '18px', color: modalAvg >= KKM ? '#15803D' : '#B91C1C' }}>{modalAvg}</strong>
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#475569' }}>Status: </span>
            <strong style={{ fontSize: '13px', color: modalAvg >= KKM ? '#15803D' : '#B91C1C' }}>
              {modalAvg >= KKM ? '✅ Tuntas KKM' : '⚠️ Perlu Remedial'}
            </strong>
          </div>
        </div>

        {/* Grid of 7 Meeting / Assignment Scores */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '10px' }}>
            Nilai Harian &amp; Evaluasi (7 Pertemuan: P1–P3, UTS, P5–P6, UAS):
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(78px, 1fr))', gap: '8px' }}>
            {editScores.slice(0, 7).map((score, idx) => {
              const MEETING_NAMES = ['P1', 'P2', 'P3', 'UTS', 'P5', 'P6', 'UAS'];
              const label = MEETING_NAMES[idx] || `P${idx + 1}`;
              const isMajor = label === 'UTS' || label === 'UAS';

              return (
                <div
                  key={idx}
                  style={{
                    background: isMajor ? '#EEF2FF' : '#F8FAFC',
                    border: isMajor ? '1.5px solid #818CF8' : '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '8px 4px',
                    textAlign: 'center'
                  }}
                >
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: isMajor ? 800 : 600, color: isMajor ? '#3730A3' : '#64748B', marginBottom: '4px' }}>
                    {label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => handleScoreChange(idx, e.target.value)}
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      padding: '6px 2px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontWeight: 700,
                      fontSize: '14px',
                      color: score >= KKM ? '#166534' : '#991B1B',
                      background: '#FFFFFF'
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Preset Helper Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setEditScores(Array.from({ length: 7 }, () => 85))}
            style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
          >
            Set Rata-rata 85 (Baik)
          </button>
          <button
            type="button"
            onClick={() => setEditScores(Array.from({ length: 7 }, () => 92))}
            style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
          >
            Set Rata-rata 92 (Sangat Baik)
          </button>
          <button
            type="button"
            onClick={() => setEditScores(Array.from({ length: 7 }, () => 68))}
            style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
          >
            Set Rata-rata 68 (Remedial)
          </button>
        </div>

        {/* Success message banner */}
        {saveSuccessMsg && (
          <div style={{ background: '#DCFCE7', color: '#166534', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
            ✓ {saveSuccessMsg}
          </div>
        )}

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              border: 'none',
              color: '#475569',
              padding: '9px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSaveScores}
            disabled={saving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#4F46E5',
              color: '#FFFFFF',
              border: 'none',
              padding: '9px 20px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1
            }}
          >
            <Save size={16} />
            <span>{saving ? 'Menyimpan...' : 'Simpan Nilai Siswa'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
