import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import LangflowBobLiveConsole from '../../components/LangflowBobLiveConsole';
import CounselorChatTab from '../../components/guru/ai-chat/CounselorChatTab';

export default function GuruAiChatPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('counselor-chat'); // 'counselor-chat' | 'mcp-console'
  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  
  const isGuruMapel = currentUser?.role === 'guru_mapel' || currentUser?.role === 'guru';

  // Load students on mount for alignment
  useEffect(() => {
    api.getStudents().then((res) => {
      if (res.status === 'success' && res.students) {
        setStudentsList(res.students);
      }
    }).catch(() => {});
  }, []);
  
  // Counselor Chat States
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: isGuruMapel
        ? `Selamat datang, **${currentUser?.name || 'Bapak/Ibu Guru'}**! 🌟\n\nSaya adalah **LUNA Pedagogical Assistant** yang didukung oleh *LUNA Empathy AI Engine*. Saya siap membantu Bapak/Ibu dalam:\n• Menyusun strategi pembelajaran & penguatan kompetensi **${currentUser?.subject_name || 'mata pelajaran'}**.\n• Menganalisis tren nilai P1–P14 untuk identifikasi remedial dan pengayaan.\n• Merumuskan koordinasi catatan kelas bersama Guru BK.\n\nSilakan pilih topik cepat di bawah atau ajukan pertanyaan spesifik.`
        : `Selamat datang, **${currentUser?.name || 'Bapak/Ibu Guru'}**! 🌟\n\nSaya adalah **LUNA Assistant for Educators & Counselors** yang didukung oleh *LUNA Empathy AI Engine*. Saya siap membantu Bapak/Ibu dalam:\n• Menyusun strategi dialog empatik (*Conversation Starters*) untuk siswa berisiko.\n• Menganalisis korelasi nilai P1–P14 dengan pemetaan minat karir (*Holland RIASEC*).\n• Menyiapkan rekomendasi tindak lanjut Flag Merah/Kuning berbasis etika (*Human-in-the-Loop*).\n\nSilakan pilih topik cepat di bawah atau ajukan pertanyaan studi kasus spesifik.`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Dynamic context prompt presets
  const counselorPromptPresets = selectedStudents.length === 1
    ? [
        `Analisis mendalam tren nilai akademik untuk ${selectedStudents[0].name}`,
        `Susun 3 pertanyaan dialog pembuka empatik (*Conversation Starters*) untuk ${selectedStudents[0].name}`,
        `Rekomendasi karir & jurusan RIASEC yang cocok untuk ${selectedStudents[0].name}`,
        `Strategi intervensi suportif bersama guru mapel untuk ${selectedStudents[0].name}`
      ]
    : selectedStudents.length > 1
    ? [
        `Bandingkan beban belajar dan tren nilai akademik ${selectedStudents.map((s) => s.name.split(' ')[0]).join(' & ')}`,
        `Susun panduan dialog kelompok suportif untuk ${selectedStudents.length} siswa ini`,
        `Identifikasi kesamaan pola risiko belajar dan rekomendasi pendampingan`,
        `Rekomendasi koordinasi terpadu Guru BK dan Guru Mata Pelajaran`
      ]
    : isGuruMapel
    ? [
        `Strategi remedial efektif untuk siswa di bawah KKM ${currentUser?.subject_name || 'Mapel'}`,
        'Panduan memotivasi siswa dengan fluktuasi nilai akademik',
        'Penyusunan materi pengayaan bagi siswa berprestasi',
        'Strategi koordinasi catatan observasi kelas dengan Guru BK'
      ]
    : [
        'Panduan dialog empatik untuk siswa dengan penurunan nilai drastis',
        'Rekomendasi intervensi suportif siswa dengan alpa berturut-turut',
        'Pemetaan karir & jurusan RIASEC siswa berprestasi sains',
        'Strategi kolaborasi Guru BK dengan Guru Mata Pelajaran'
      ];

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      // Send chat message with multi-student IDs or general mode
      const targetPayload = selectedStudents.length === 0
        ? { mode: 'umum' }
        : {
            studentIds: selectedStudents.map((s) => s.id),
            mode: selectedStudents.length === 1 ? 'single' : 'multi'
          };
      const res = await api.sendChatMessage(targetPayload, text);
      if (res.status === 'success') {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: res.reply,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: 'Maaf, terjadi kendala saat menghubungkan ke asisten AI: ' + err.message,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isGuruMapel || activeTab === 'counselor-chat') {
    return (
      <CounselorChatTab
        currentUser={currentUser}
        messages={messages}
        loading={loading}
        inputText={inputText}
        setInputText={setInputText}
        handleSendMessage={handleSendMessage}
        counselorPromptPresets={counselorPromptPresets}
        copyToClipboard={copyToClipboard}
        copiedId={copiedId}
        studentsList={studentsList}
        selectedStudents={selectedStudents}
        setSelectedStudents={setSelectedStudents}
        selectedStudent={selectedStudents.length === 1 ? selectedStudents[0] : null}
        setSelectedStudent={(st) => setSelectedStudents(st ? [st] : [])}
        onClearChat={() => setMessages([])}
        onOpenSimulation={!isGuruMapel ? () => setActiveTab('mcp-console') : null}
      />
    );
  }

  return (
    <div className="preview-guru-ai-chat page-standard-container" style={{ padding: '24px 28px 72px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          background: '#FFFFFF',
          padding: '12px 18px',
          borderRadius: '14px',
          border: '1.5px solid #E8E5F7',
          boxShadow: '0 2px 10px rgba(47, 51, 102, 0.04)',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('counselor-chat')}
          className="btn-luna-secondary"
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1.5px solid #E8E5F7',
            cursor: 'pointer'
          }}
        >
          <MessageSquare size={15} style={{ color: '#7C69EF' }} />
          <span>← Kembali ke AI Chat</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#312E81' }}>
            ⚡ Ruang Simulasi 4 Layanan Konseling &amp; Afektif
          </span>
          <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#166534', border: '1px solid #BBF7D0', padding: '3px 8px', borderRadius: '999px', fontWeight: 700 }}>
            Aktif
          </span>
        </div>
      </div>

      <LangflowBobLiveConsole />
    </div>
  );
}
