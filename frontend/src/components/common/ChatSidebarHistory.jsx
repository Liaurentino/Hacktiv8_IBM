import React from 'react';
import {
  MessageSquarePlus,
  PanelRightClose,
  PanelRight,
  MessageSquare,
  Trash2,
  Calendar,
  Users,
  X
} from 'lucide-react';

export default function ChatSidebarHistory({
  sidebarOpen = false,
  setSidebarOpen = () => {},
  sidebarCollapsed = false,
  setSidebarCollapsed = () => {},
  onNewChat = () => {},
  activeSessionId = 'today-1',
  setActiveSessionId = () => {},
  onClearCurrent = () => {},
  onRequestSchedule = null,
  role = 'siswa',
  onOpenStudentSelector = null,
  selectedStudents = []
}) {
  const sessions = [
    { id: 'today-1', title: 'Persiapan SNBP & Nilai Biologi', time: 'Hari ini' },
    { id: 'today-2', title: 'Tips Mengatasi Cemas Belajar', time: 'Hari ini' },
    { id: 'prev-1', title: 'Eksplorasi Karir Holland RIASEC', time: 'Kemarin' },
    { id: 'prev-2', title: 'Target Nilai Evaluasi Tengah (UTS)', time: '7 hari lalu' }
  ];

  return (
    <>
      {/* Mobile/Tablet Backdrop Overlay */}
      <div
        className={`luna-chat-overlay ${sidebarOpen ? 'is-open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Right Sidebar Component */}
      <aside className={`luna-chat-sidebar ${sidebarOpen ? 'is-open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Header */}
        <div className="luna-chat-sidebar-header">
          <div className="luna-chat-brand-block">
            <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#F4F1FE', border: '1.5px solid #E8E5F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src="/assets/mascot/mascot_senang.png" alt="LUNA" style={{ width: '22px', height: '22px', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            {!sidebarCollapsed && (
              <div>
                <div className="luna-chat-brand-title">Histori Chat</div>
                <div className="luna-chat-brand-subtitle">{role === 'siswa' ? 'Sesi Curhat Siswa' : 'Sesi Konseling Guru'}</div>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle / Mobile Close Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* Desktop collapse button (collapses toward right) */}
            <button
              type="button"
              className="luna-chat-icon-btn desk-collapse-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Perluas Histori Chat' : 'Ciutkan Histori ke Kanan'}
            >
              {sidebarCollapsed ? <PanelRight size={16} /> : <PanelRightClose size={16} />}
            </button>
            {/* Mobile close drawer button */}
            <button
              type="button"
              className="luna-chat-icon-btn mobile-close-btn"
              onClick={() => setSidebarOpen(false)}
              style={{ display: 'none' }}
              title="Tutup Menu"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          type="button"
          onClick={() => {
            onNewChat();
            if (window.innerWidth < 1024) setSidebarOpen(false);
          }}
          className="luna-chat-new-btn"
          title="Mulai Percakapan Baru"
        >
          <MessageSquarePlus size={16} />
          <span>Obrolan Baru</span>
        </button>

        {/* Sessions Stream */}
        <div className="luna-chat-sessions">
          {!sidebarCollapsed && <div className="luna-chat-session-group-title">Hari ini</div>}
          {sessions.slice(0, 2).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setActiveSessionId(s.id);
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className={`luna-chat-session-item ${activeSessionId === s.id ? 'active' : ''}`}
              title={s.title}
            >
              <MessageSquare size={14} style={{ flexShrink: 0 }} />
              <span>{s.title}</span>
            </button>
          ))}

          {!sidebarCollapsed && <div className="luna-chat-session-group-title">Sebelumnya</div>}
          {sessions.slice(2).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setActiveSessionId(s.id);
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className={`luna-chat-session-item ${activeSessionId === s.id ? 'active' : ''}`}
              title={s.title}
            >
              <MessageSquare size={14} style={{ flexShrink: 0 }} />
              <span>{s.title}</span>
            </button>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="luna-chat-sidebar-footer">
          {/* Tombol Pilih Siswa di navbar sebelah kanan di bagian bawah */}
          {onOpenStudentSelector && (
            <button
              type="button"
              onClick={() => {
                onOpenStudentSelector();
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className={`luna-chat-session-item ${selectedStudents && selectedStudents.length > 0 ? 'active' : ''}`}
              style={{
                color: selectedStudents && selectedStudents.length > 0 ? '#4338CA' : 'var(--text-dark, #23214A)',
                background: selectedStudents && selectedStudents.length > 0 ? '#EEF2FF' : '#F8FAFC',
                border: selectedStudents && selectedStudents.length > 0 ? '1.5px solid #C7D2FE' : '1px solid #E2E8F0',
                fontWeight: 700,
                borderRadius: '10px'
              }}
              title={
                selectedStudents && selectedStudents.length > 0
                  ? `Fokus Siswa: ${selectedStudents.map((s) => s.name).join(', ')} (Klik untuk ubah)`
                  : 'Pilih Fokus Siswa'
              }
            >
              <Users size={15} style={{ color: selectedStudents && selectedStudents.length > 0 ? '#4F46E5' : '#7C69EF', flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedStudents && selectedStudents.length === 1
                  ? selectedStudents[0].name
                  : selectedStudents && selectedStudents.length > 1
                  ? `${selectedStudents.length} Siswa Dipilih`
                  : 'Pilih Siswa'}
              </span>
            </button>
          )}

          {onRequestSchedule && (
            <button
              type="button"
              onClick={onRequestSchedule}
              className="luna-chat-session-item"
              style={{ color: 'var(--luna-navy, #2F3366)', fontWeight: 600 }}
              title="Jadwal Temu Guru BK"
            >
              <Calendar size={15} style={{ color: '#7C69EF', flexShrink: 0 }} />
              <span>Jadwal Temu Guru BK</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClearCurrent}
            className="luna-chat-session-item"
            style={{ color: '#EF4444' }}
            title="Bersihkan Percakapan Ini"
          >
            <Trash2 size={15} style={{ flexShrink: 0 }} />
            <span>Bersihkan Chat</span>
          </button>
        </div>
      </aside>
    </>
  );
}
