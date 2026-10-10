import React, { useState, useEffect } from 'react';
import {
  Plus,
  Calendar,
  Sparkles,
  ShieldCheck,
  PanelRight
} from 'lucide-react';
import api from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import ChatSidebarHistory from './common/ChatSidebarHistory';
import ChatViewContainer from './common/ChatViewContainer';
import '../styles/luna-chat-system.css';

export default function SiswaChat({ studentId = 14, studentName = 'Priya Ramadhani' }) {
  const { showToast } = useNotifications();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [mascotEmotion, setMascotEmotion] = useState('senang');
  const [emergencyAlert, setEmergencyAlert] = useState(false);

  // Responsive right sidebar states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState('today-1');

  const fetchHistory = async () => {
    try {
      const res = await api.getChatHistory(studentId);
      if (res.status === 'success' && res.messages && res.messages.length > 0) {
        setMessages(res.messages);
      } else {
        setMessages([
          {
            id: 1,
            sender: 'ai',
            emotion: 'senang',
            message: `Halo, **${studentName.split(' ')[0]}**! 👋 Aku LUNA, asisten konselor AI kamu (LUNA Empathy AI Engine).\n\nAku sudah membaca rekapan nilaimu hingga evaluasi terkini. Ada hal yang ingin kamu diskusikan hari ini? Kamu bisa curhat tentang tips belajar, persiapan SNBP/SNBT, atau rekomendasi karir masa depan ya! ✨`,
            timestamp: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      console.error('Gagal mengambil history chat:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [studentId]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      message: text,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage(studentId, text);
      if (res.status === 'success') {
        setMessages((prev) => [
          ...prev,
          {
            id: res.message?.id || Date.now() + 1,
            sender: 'ai',
            message: res.reply,
            emotion: res.emotion || 'senang',
            timestamp: new Date().toISOString()
          }
        ]);
        if (res.emergency) {
          setEmergencyAlert(true);
        }
        if (res.emotion) {
          setMascotEmotion(res.emotion);
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          message: 'Maaf, terjadi kendala saat menghubungi asisten AI: ' + err.message,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        emotion: 'senang',
        message: `Halo lagi, **${studentName.split(' ')[0]}**! ✨ Sesi obrolan baru sudah dimulai. Apa yang ingin kamu ceritakan atau tanyakan kali ini?`,
        timestamp: new Date().toISOString()
      }
    ]);
    setActiveSessionId(`session-${Date.now()}`);
  };

  const handleRequestSchedule = () => {
    showToast({
      type: 'success',
      title: 'Jadwal Temu Diajukan',
      message: 'Pengajuan sesi temu dengan Bu Ratna Dewi (Guru BK) telah dikirimkan ke Ruang BK SMAN 1.'
    });
  };

  const quickPrompts = [
    'Peluangku masuk jurusan Farmasi/Biokimia UI?',
    'Bagaimana cara dongkrak nilai Biologi & Matematika?',
    'Akhir-akhir ini saya merasa cemas dan lelah dengan ujian',
    'Ingin jadwal temu konseling dengan Bu Guru BK'
  ];

  return (
    <div className="luna-chat-shell">
      {/* Main Chat Canvas */}
      <div className="luna-chat-main">
        {/* Floating Controls (No Header Bar) */}
        <div
          className="luna-chat-floating-controls"
          style={{
            position: 'absolute',
            top: '14px',
            right: '18px',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <button
            type="button"
            onClick={handleRequestSchedule}
            className="btn-luna-secondary"
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(47, 51, 102, 0.08)',
              border: '1px solid #E8E5F7'
            }}
          >
            <Calendar size={13} />
            <span className="hidden-on-mobile">Jadwal Temu BK</span>
          </button>

          <button
            type="button"
            className="luna-chat-icon-btn history-toggle-btn"
            onClick={() => {
              if (window.innerWidth < 1024) {
                setSidebarOpen(!sidebarOpen);
              } else {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}
            title={sidebarCollapsed ? 'Buka Histori Chat' : 'Ciutkan Histori Chat'}
            style={{
              background: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(47, 51, 102, 0.08)',
              border: '1px solid #E8E5F7',
              color: (!sidebarCollapsed || sidebarOpen) ? 'var(--luna-lavender, #7C69EF)' : 'var(--text-muted, #6E6D8A)'
            }}
          >
            <PanelRight size={18} />
          </button>
        </div>

        {/* Centered Message Stream + Sticky Bottom Floating Input */}
        <ChatViewContainer
          messages={messages}
          loading={loading}
          inputText={inputText}
          setInputText={setInputText}
          onSendMessage={handleSendMessage}
          quickPrompts={quickPrompts}
          emergencyAlert={emergencyAlert}
          assistantTitle="LUNA BK Advisor"
          assistantSubtitle="LUNA Empathy AI Engine • Zero Medical Labeling"
          mascotEmotion={mascotEmotion}
          userInitial={studentName.charAt(0)}
          emptyTitle="Siap mendengarkan ceritamu, Siswa SMAN 1"
          emptySubtitle="Curhatkan apa pun seputar rasa cemas belajar, persiapan evaluasi, atau konsultasi minat karir masa depan."
        />
      </div>

      {/* History Chat Sidebar placed on the RIGHT */}
      <ChatSidebarHistory
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        onNewChat={handleNewChat}
        activeSessionId={activeSessionId}
        setActiveSessionId={setActiveSessionId}
        onClearCurrent={() => setMessages([])}
        onRequestSchedule={handleRequestSchedule}
        role="siswa"
      />
    </div>
  );
}
