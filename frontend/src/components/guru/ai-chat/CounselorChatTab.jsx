import React, { useState } from 'react';
import { Terminal } from 'lucide-react';
import ChatSidebarHistory from '../../common/ChatSidebarHistory';
import ChatViewContainer from '../../common/ChatViewContainer';
import StudentContextSelectorModal from './StudentContextSelectorModal';
import '../../../styles/luna-chat-system.css';

export default function CounselorChatTab({
  currentUser,
  messages,
  loading,
  inputText,
  setInputText,
  handleSendMessage,
  counselorPromptPresets,
  copyToClipboard,
  copiedId,
  studentsList = [],
  selectedStudents = [],
  setSelectedStudents = () => {},
  selectedStudent = null,
  setSelectedStudent = () => {},
  onClearChat,
  onOpenSimulation = null
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState('counselor-1');
  const [isSelectorModalOpen, setIsSelectorModalOpen] = useState(false);

  // Normalize active students array (supports both selectedStudents array and single selectedStudent)
  const activeStudents = Array.isArray(selectedStudents) && selectedStudents.length > 0
    ? selectedStudents
    : selectedStudent
    ? [selectedStudent]
    : [];

  const handleApplyStudents = (newSelection) => {
    setSelectedStudents(newSelection);
    if (newSelection.length === 1) {
      setSelectedStudent(newSelection[0]);
    } else {
      setSelectedStudent(null);
    }
  };

  const handleRemoveSingleStudent = (studentId) => {
    const updated = activeStudents.filter((s) => s.id !== studentId);
    handleApplyStudents(updated);
  };

  const isGuruMapel = currentUser?.role === 'guru_mapel' || currentUser?.role === 'guru';

  return (
    <div className="luna-chat-shell">
      {/* Main Chat Area */}
      <div className="luna-chat-main">
        {/* Floating Controls in Top Right (Identical to Siswa Chat) */}
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
          {onOpenSimulation && !isGuruMapel && (
            <button
              type="button"
              onClick={onOpenSimulation}
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
                border: '1px solid #E8E5F7',
                cursor: 'pointer'
              }}
            >
              <Terminal size={13} style={{ color: '#5243C2' }} />
              <span className="hidden-on-mobile">Simulasi Modul</span>
            </button>
          )}
        </div>

        {/* Stream Messages and Floating Input */}
        <ChatViewContainer
          messages={messages}
          loading={loading}
          inputText={inputText}
          setInputText={setInputText}
          onSendMessage={handleSendMessage}
          quickPrompts={counselorPromptPresets}
          emergencyAlert={false}
          assistantTitle={isGuruMapel ? 'LUNA Pedagogical Engine' : 'LUNA Counselor Engine'}
          assistantSubtitle="LUNA Empathy AI Engine • Zero Medical Labeling • Human-in-the-Loop"
          mascotEmotion="semangat"
          userInitial={currentUser?.avatar || 'BK'}
          emptyTitle="Asisten Konseling & Pedagogi Cerdas"
          emptySubtitle="Ajukan pertanyaan studi kasus, susun dialog empatik, atau analisis tindak lanjut belajar siswa."
          selectedStudents={activeStudents}
          onRemoveStudentContext={handleRemoveSingleStudent}
          onOpenStudentSelector={() => setIsSelectorModalOpen(true)}
        />
      </div>

      {/* Modal Dialog Pemilihan Siswa Terpadu */}
      <StudentContextSelectorModal
        isOpen={isSelectorModalOpen}
        onClose={() => setIsSelectorModalOpen(false)}
        students={studentsList}
        selectedStudents={activeStudents}
        onApplySelection={handleApplyStudents}
        allowMultiSelect={true}
      />

      {/* Sidebar Histori Chat Guru on the RIGHT */}
      <ChatSidebarHistory
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        onNewChat={onClearChat}
        activeSessionId={activeSessionId}
        setActiveSessionId={setActiveSessionId}
        onClearCurrent={onClearChat}
        role="guru"
        onOpenStudentSelector={() => setIsSelectorModalOpen(true)}
        selectedStudents={activeStudents}
      />
    </div>
  );
}
