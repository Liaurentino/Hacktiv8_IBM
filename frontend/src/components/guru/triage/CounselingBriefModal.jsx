import React from 'react';
import { FileText, Download, Printer } from 'lucide-react';
import BriefCrisisAlert from './BriefCrisisAlert';
import BriefStartersSection from './BriefStartersSection';

export default function CounselingBriefModal({
  selectedStudent,
  onClose,
  loadingAnalysis,
  analysisResult,
  copiedQuestionIdx,
  onCopyQuestion,
  onDownloadMarkdown
}) {
  if (!selectedStudent) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--rounded-lg)',
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-mockup)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Top Header */}
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid var(--colors-hairline-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--colors-surface-cream)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: '#fa520f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileText size={22} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--colors-ink)' }}>
                Counseling Prep Sheet • {selectedStudent.student_id} ({selectedStudent.grade_level})
              </h3>
              <div style={{ fontSize: '12.5px', color: 'var(--colors-steel)' }}>
                Identitas Anonim • Terverifikasi UU PDP No. 27/2022
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 24,
              color: 'var(--colors-ink)',
              cursor: 'pointer',
              padding: 4
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Content Body */}
        <div style={{ padding: '28px', overflowY: 'auto' }}>
          {loadingAnalysis ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: '36px', marginBottom: '16px' }}>
                ⚙️
              </div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--colors-ink)' }}>
                Menyiapkan ringkasan bimbingan konseling...
              </div>
              <div style={{ fontSize: '13px', color: 'var(--colors-steel)', marginTop: '6px' }}>
                1. Perlindungan Privasi → 2. Evaluasi Kesejahteraan → 3. Analisis Afektif → 4. Rekomendasi Minat Bakat
              </div>
            </div>
          ) : analysisResult ? (
            <div>
              {/* Pipeline Steps */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '24px',
                  background: '#f8f9fa',
                  padding: '10px 16px',
                  borderRadius: 'var(--rounded-md)',
                  fontSize: '12px',
                  flexWrap: 'wrap'
                }}
              >
                <span style={{ color: 'var(--colors-steel)', fontWeight: 600 }}>TAHAPAN ANALISIS:</span>
                {analysisResult.pipelineSteps?.map((s, idx) => (
                  <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: s.status === 'COMPLETED' ? '#2b8a3e' : '#e67700', fontWeight: 500 }}>
                      {s.step}. {s.tool}
                    </span>
                    {idx < analysisResult.pipelineSteps.length - 1 && <span style={{ color: '#ccc' }}>→</span>}
                  </span>
                ))}
              </div>

              {/* RED EMERGENCY CRISIS ALERT */}
              {analysisResult.triage?.isEmergencyCrisis && <BriefCrisisAlert />}

              {/* 1. Triage Summary */}
              <div
                style={{
                  backgroundColor: analysisResult.triage?.triageLevel === 'MERAH' ? '#fff5f5' : analysisResult.triage?.triageLevel === 'KUNING' ? '#fff9db' : '#ebfbee',
                  borderRadius: 'var(--rounded-md)',
                  padding: '20px',
                  marginBottom: '24px',
                  border: `1px solid ${analysisResult.triage?.triageLevel === 'MERAH' ? '#ffc9c9' : analysisResult.triage?.triageLevel === 'KUNING' ? '#ffe066' : '#b2f2bb'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--colors-ink)' }}>
                      STATUS TRIASE: {analysisResult.triage?.triageLevel}
                    </span>
                    <span className="badge badge-dark" style={{ fontSize: '11px' }}>
                      Skor Urgensi: {analysisResult.triage?.urgencyScore}/100
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--colors-steel)' }}>
                    Absensi: {selectedStudent.attendance_trend}
                  </span>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--colors-steel)', marginBottom: '4px' }}>
                    KUTIPAN BUKTI TEKS SISWA (EVIDENCE-BASED REASONING):
                  </div>
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      padding: '12px 16px',
                      borderRadius: 'var(--rounded-xs)',
                      borderLeft: '4px solid var(--colors-primary)',
                      fontStyle: 'italic',
                      fontSize: '13.5px',
                      color: 'var(--colors-ink)'
                    }}
                  >
                    "{analysisResult.triage?.evidenceQuotes}"
                  </div>
                </div>

                <div style={{ fontSize: '13px', color: 'var(--colors-ink-tint)', marginBottom: '8px' }}>
                  <strong>Analisis Situasi:</strong> {analysisResult.triage?.reasoningSummary}
                </div>

                <div style={{ fontSize: '13px', color: 'var(--colors-ink-tint)' }}>
                  <strong>Rekomendasi Tindakan:</strong> {analysisResult.triage?.recommendedAction}
                </div>
              </div>

              {/* 2. Holland RIASEC */}
              {!analysisResult.triage?.isEmergencyCrisis && (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--colors-hairline-soft)',
                    borderRadius: 'var(--rounded-md)',
                    padding: '20px',
                    marginBottom: '24px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--colors-ink)' }}>
                        Pemetaan Minat Bakat (Holland RIASEC)
                      </h4>
                      <div style={{ fontSize: '12px', color: 'var(--colors-steel)' }}>
                        Kode Dominan: <strong style={{ color: 'var(--colors-primary)' }}>{analysisResult.riasec?.primaryCode}</strong> ({analysisResult.riasec?.topThemeName})
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
                    {analysisResult.riasec?.scores && Object.entries(analysisResult.riasec.scores).map(([dim, score]) => {
                      const labels = {
                        R: 'Realistic (Mekanikal)',
                        I: 'Investigative (Analitis)',
                        A: 'Artistic (Kreatif)',
                        S: 'Social (Empati)',
                        E: 'Enterprising (Bisnis)',
                        C: 'Conventional (Data)'
                      };
                      return (
                        <div key={dim} style={{ background: '#f8f9fa', padding: '8px 12px', borderRadius: 'var(--rounded-xs)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 600 }}>{dim} - {labels[dim]}</span>
                            <span style={{ color: 'var(--colors-primary)', fontWeight: 600 }}>{score}%</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: '#e9ecef', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${score}%`, height: '100%', background: 'var(--colors-primary)', transition: 'width 0.5s ease' }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--colors-steel)', marginBottom: '8px' }}>
                      REKOMENDASI JALUR PROGRAM STUDI / KARIR:
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {analysisResult.riasec?.recommendedStudyPaths?.map((path, idx) => (
                        <span key={idx} className="badge badge-cream" style={{ fontSize: '12px', padding: '4px 10px' }}>
                          🎓 {path}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Empathetic Conversation Starters */}
              <BriefStartersSection
                conversationStarters={analysisResult.counselingBrief?.conversationStarters}
                onCopyQuestion={onCopyQuestion}
                copiedQuestionIdx={copiedQuestionIdx}
              />

              {/* Responsible AI Notice */}
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: 'var(--rounded-xs)',
                  borderLeft: '3px solid #868e96',
                  fontSize: '12px',
                  color: '#495057',
                  marginBottom: '24px'
                }}
              >
                <strong>Catatan Etika &amp; Kepatuhan Privasi:</strong> {analysisResult.counselingBrief?.responsibleAiDisclaimer}
              </div>

              {/* Modal Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={onDownloadMarkdown}
                  className="btn button-secondary"
                  style={{ padding: '10px 18px', fontSize: '13px' }}
                >
                  <Download size={14} />
                  Ekspor Markdown (.md)
                </button>
                <button
                  onClick={() => window.print()}
                  className="btn button-dark"
                  style={{ padding: '10px 18px', fontSize: '13px' }}
                >
                  <Printer size={14} />
                  Cetak Lembar Konseling
                </button>
              </div>
            </div>
          ) : (
            <div>Gagal memuat analisis. Silakan coba kembali.</div>
          )}
        </div>
      </div>
    </div>
  );
}
