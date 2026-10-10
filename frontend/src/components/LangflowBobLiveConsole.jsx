import React, { useState } from 'react';
import { Terminal, Play, Cpu, Check, Copy, Network, ShieldCheck, Sparkles } from 'lucide-react';

export default function LangflowBobLiveConsole() {
  const [activeTool, setActiveTool] = useState('mask_student_pii');
  const [toolResult, setToolResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const tools = [
    {
      name: 'mask_student_pii',
      label: '1. Privacy Masker',
      description: 'Menyamarkan nama, no HP, NISN siswa menjadi kode sintetis sesuai UU PDP No. 27/2022',
      defaultArgs: {
        rawText: 'Halo nama saya Budi Santoso (NISN: 0054819201), no HP 081234567890. Saya merasa sangat lelah belajar.',
        studentId: 'SISWA-04'
      }
    },
    {
      name: 'classify_student_wellbeing_risk',
      label: '2. Risk & Triage Classifier',
      description: 'Menilai sentimen afektif siswa dan menentukan level triase (HIJAU, KUNING, MERAH)',
      defaultArgs: {
        sanitizedText: 'Tugas numpuk dari 4 guru bikin kepala mau pecah. Badan rasanya capek terus dan sulit konsentrasi.',
        attendanceTrend: '2x Alpa berturut-turut'
      }
    },
    {
      name: 'map_riasec_career_interest',
      label: '3. Holland RIASEC Mapper',
      description: 'Menghitung 6 dimensi minat Holland dan menyusun 3 rekomendasi program studi',
      defaultArgs: {
        hobbiesText: 'Merakit robotika dan koding mikrokontroler',
        favoriteSubjects: 'Fisika dan Informatika',
        reflectionText: 'Sangat senang saat proyek otomatisasi sensor berjalan lancar.'
      }
    },
    {
      name: 'generate_counseling_brief',
      label: '4. Prep Sheet Generator',
      description: 'Menyusun ringkasan konseling 1 halaman + 3 pertanyaan dialog empatik',
      defaultArgs: {
        studentProfile: { student_id: 'SISWA-01', grade_level: 'Kelas 11' },
        triageResult: { triageLevel: 'HIJAU', evidenceQuotes: 'Sangat senang saat kodingan loop berjalan lancar.', reasoningSummary: 'Kondisi stabil & fokus bakat positif.' },
        riasecResult: { primaryCode: 'IRS', topThemeName: 'Investigative (Analitis)', recommendedStudyPaths: ['Teknik Informatika', 'Bioteknologi', 'Teknik Mesin'] }
      }
    }
  ];

  const currentTool = tools.find((t) => t.name === activeTool);

  const handleExecuteMcpTool = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/counselor/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Math.floor(Math.random() * 1000),
          method: 'tools/call',
          params: {
            name: currentTool.name,
            arguments: currentTool.defaultArgs
          }
        })
      });
      const data = await response.json();
      setToolResult(data);
    } catch (err) {
      console.error('Error invoking MCP tool:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(toolResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="section" style={{ backgroundColor: 'var(--colors-surface-code)', color: '#ffffff', borderTop: '1px solid #333336' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '720px', marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#ffd06a', marginBottom: '10px' }}>
            <Terminal size={16} />
            <span className="micro-uppercase" style={{ color: '#ffd06a' }}>
              Simulasi Modul Pendampingan Siswa LUNA
            </span>
          </div>
          <h2 className="display-lg" style={{ color: '#ffffff', fontSize: '42px', marginBottom: '12px' }}>
            Uji Coba 4 Alur Bimbingan &amp; Asesmen
          </h2>
          <p style={{ color: '#a8a8a8', fontSize: '15px' }}>
            Simulasi interaktif untuk menguji alur perlindungan privasi siswa, deteksi risiko kesejahteraan belajar, pemetaan minat bakat, dan pembuatan lembar persiapan konseling.
          </p>
        </div>

        {/* Console Box in Surface-Code */}
        <div style={{
          backgroundColor: '#161618',
          borderRadius: 'var(--rounded-lg)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-mockup)'
        }}>
          {/* Top Bar with Tools Segmented Navigation */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            backgroundColor: '#121214',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {tools.map((tool) => {
                const isActive = activeTool === tool.name;
                return (
                  <button
                    key={tool.name}
                    onClick={() => { setActiveTool(tool.name); setToolResult(null); }}
                    className={`pill-tab ${isActive ? 'pill-tab-active' : ''}`}
                    style={{
                      backgroundColor: isActive ? 'var(--colors-primary)' : 'rgba(255, 255, 255, 0.06)',
                      color: isActive ? '#ffffff' : '#a8a8a8',
                      borderColor: isActive ? 'var(--colors-primary)' : 'transparent',
                      fontSize: '13px'
                    }}
                  >
                    {tool.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleExecuteMcpTool}
              disabled={loading}
              className="btn button-primary"
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              {loading ? (
                'Memproses simulasi...'
              ) : (
                <>
                  <Play size={13} fill="currentColor" />
                  Jalankan Simulasi
                </>
              )}
            </button>
          </div>

          {/* Description bar */}
          <div style={{ padding: '12px 20px', backgroundColor: '#18181b', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', color: '#ffd06a' }}>
            <strong>Fokus Modul:</strong> {currentTool.description}
          </div>

          {/* Code split view: Input Arguments vs MCP Response */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            {/* Left: Input Payload */}
            <div style={{ padding: '18px 20px', borderRight: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#8a8a8a', marginBottom: '8px', letterSpacing: '0.5px' }}>
                DATA MASUKAN SIMULASI:
              </div>
              <pre style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12.5px',
                color: '#e5e5e5',
                margin: 0,
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap'
              }}>
                {JSON.stringify({
                  modul: currentTool.name,
                  parameter: currentTool.defaultArgs
                }, null, 2)}
              </pre>
            </div>

            {/* Right: Response Payload */}
            <div style={{ padding: '18px 20px', backgroundColor: '#101012' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#38ef7d', letterSpacing: '0.5px' }}>
                  HASIL REKOMENDASI SISTEM:
                </span>
                {toolResult && (
                  <button
                    onClick={copyPayload}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#a8a8a8',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {copied ? <Check size={12} color="#38ef7d" /> : <Copy size={12} />}
                    {copied ? 'Tersalin' : 'Salin Hasil'}
                  </button>
                )}
              </div>

              <pre style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12.5px',
                color: toolResult ? '#ffd06a' : '#666',
                margin: 0,
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                minHeight: '160px'
              }}>
                {toolResult 
                  ? JSON.stringify(toolResult, null, 2) 
                  : '// Klik tombol "Jalankan Simulasi" untuk melihat hasil analisis modul...'}
              </pre>
            </div>
          </div>

          {/* Console footer */}
          <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#8a8a8a' }}>
            <span>Standar Etika: Kepatuhan UU PDP No. 27/2022</span>
            <span>Prinsip: Pendampingan Non-Klinis Terverifikasi</span>
          </div>
        </div>
      </div>
    </section>
  );
}
