import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  Users,
  User,
  Globe,
  Check,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Info
} from 'lucide-react';

export default function StudentContextSelectorModal({
  isOpen,
  onClose,
  students = [],
  selectedStudents = [], // array of student objects
  onApplySelection,
  allowMultiSelect = true
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectionMode, setSelectionMode] = useState(
    selectedStudents.length > 1 ? 'multi' : selectedStudents.length === 1 ? 'single' : 'umum'
  ); // 'umum' | 'single' | 'multi'
  const [tempSelected, setTempSelected] = useState([]);
  const searchInputRef = useRef(null);

  // Sync state saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setTempSelected([...selectedStudents]);
      if (selectedStudents.length === 0) {
        setSelectionMode('umum');
      } else if (selectedStudents.length === 1) {
        setSelectionMode('single');
      } else {
        setSelectionMode('multi');
      }
      setTimeout(() => {
        if (searchInputRef.current) searchInputRef.current.focus();
      }, 50);
    }
  }, [isOpen, selectedStudents]);

  // Keyboard accessibility: Escape untuk menutup
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter siswa berdasarkan nama, NISN, atau kelas
  const filteredStudents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.nisn && s.nisn.toLowerCase().includes(q)) ||
        (s.class_name && s.class_name.toLowerCase().includes(q))
    );
  }, [students, searchTerm]);

  if (!isOpen) return null;

  const handleToggleStudent = (student) => {
    if (selectionMode === 'umum') {
      setSelectionMode('single');
      setTempSelected([student]);
      return;
    }

    if (selectionMode === 'single') {
      // Single select: langsung pilih siswa ini
      setTempSelected([student]);
      return;
    }

    // Multi select
    const exists = tempSelected.some((s) => s.id === student.id);
    if (exists) {
      setTempSelected(tempSelected.filter((s) => s.id !== student.id));
    } else {
      setTempSelected([...tempSelected, student]);
    }
  };

  const handleSelectGeneral = () => {
    setSelectionMode('umum');
    setTempSelected([]);
  };

  const handleSelectAllFiltered = () => {
    if (!allowMultiSelect) return;
    setSelectionMode('multi');
    setTempSelected(filteredStudents);
  };

  const handleClearSelection = () => {
    setTempSelected([]);
    setSelectionMode('umum');
  };

  const handleConfirm = () => {
    if (selectionMode === 'umum' || tempSelected.length === 0) {
      onApplySelection([]);
    } else {
      onApplySelection(tempSelected);
    }
    onClose();
  };

  const getSemanticStatus = (flagLevel) => {
    switch (flagLevel) {
      case 'black':
        return {
          label: 'Krisis Akut',
          bg: '#181926',
          color: '#FFFFFF',
          icon: <AlertTriangle size={12} style={{ color: '#EF4444' }} />
        };
      case 'critical':
      case 'red':
        return {
          label: 'Prioritas Tinggi',
          bg: '#FEE2E2',
          color: '#991B1B',
          icon: <AlertCircle size={12} style={{ color: '#DC2626' }} />
        };
      case 'warning':
      case 'yellow':
        return {
          label: 'Perlu Perhatian',
          bg: '#FEF3C7',
          color: '#92400E',
          icon: <AlertCircle size={12} style={{ color: '#D97706' }} />
        };
      default:
        return {
          label: 'Stabil',
          bg: '#DCFCE7',
          color: '#166534',
          icon: <CheckCircle2 size={12} style={{ color: '#16A34A' }} />
        };
    }
  };

  return (
    <div
      className="luna-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-selector-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="luna-modal-dialog"
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(35, 33, 74, 0.25)',
          border: '1px solid #E8E5F7',
          overflow: 'hidden'
        }}
      >
        {/* Header Modal */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #E8E5F7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div>
            <h2
              id="student-selector-title"
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#1E1B4B',
                margin: 0,
                lineHeight: 1.2
              }}
            >
              Pilih siswa untuk konteks chat
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#64748B' }}>
              Pilih satu atau beberapa siswa untuk menganalisis data spesifik secara terarah dan privat.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog"
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B',
              flexShrink: 0
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Selector & Quick Actions */}
        <div style={{ padding: '12px 24px 8px', background: '#FAF9FE', borderBottom: '1px solid #E8E5F7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Mode Konteks:</span>
            <button
              type="button"
              onClick={handleSelectGeneral}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                border: selectionMode === 'umum' ? '1.5px solid #4F46E5' : '1px solid #E2E8F0',
                background: selectionMode === 'umum' ? '#EEF2FF' : '#FFFFFF',
                color: selectionMode === 'umum' ? '#4338CA' : '#475569'
              }}
            >
              <Globe size={13} />
              <span>Umum / Tanpa Siswa</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectionMode('single');
                if (tempSelected.length > 1) setTempSelected([tempSelected[0]]);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                border: selectionMode === 'single' ? '1.5px solid #4F46E5' : '1px solid #E2E8F0',
                background: selectionMode === 'single' ? '#EEF2FF' : '#FFFFFF',
                color: selectionMode === 'single' ? '#4338CA' : '#475569'
              }}
            >
              <User size={13} />
              <span>Satu Siswa</span>
            </button>

            {allowMultiSelect && (
              <button
                type="button"
                onClick={() => setSelectionMode('multi')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: selectionMode === 'multi' ? '1.5px solid #4F46E5' : '1px solid #E2E8F0',
                  background: selectionMode === 'multi' ? '#EEF2FF' : '#FFFFFF',
                  color: selectionMode === 'multi' ? '#4338CA' : '#475569'
                }}
              >
                <Users size={13} />
                <span>Beberapa Siswa (Multi-Select)</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Field */}
        <div style={{ padding: '14px 24px 10px' }}>
          <label
            htmlFor="student-search-input"
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 700,
              color: '#334155',
              marginBottom: '6px'
            }}
          >
            Pencarian Siswa (Nama, NISN, atau Kelas):
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                color: '#94A3B8',
                pointerEvents: 'none'
              }}
            />
            <input
              id="student-search-input"
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ketik nama siswa atau NISN..."
              style={{
                width: '100%',
                padding: '10px 36px 10px 36px',
                fontSize: '13.5px',
                border: '1.5px solid #E2E8F0',
                borderRadius: '10px',
                outline: 'none',
                backgroundColor: '#FFFFFF',
                color: '#1E1B4B'
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                title="Hapus pencarian"
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {allowMultiSelect && selectionMode === 'multi' && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '10px',
                fontSize: '12px'
              }}
            >
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4F46E5',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Pilih Semua Hasil ({filteredStudents.length})
              </button>
              {tempSelected.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearSelection}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#DC2626',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Reset Pilihan
                </button>
              )}
            </div>
          )}
        </div>

        {/* List Siswa (Scrollable Container) */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '4px 24px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {filteredStudents.length === 0 ? (
            <div
              style={{
                padding: '36px 16px',
                textAlign: 'center',
                color: '#64748B',
                fontSize: '13.5px'
              }}
            >
              <HelpCircle size={24} style={{ margin: '0 auto 8px', color: '#94A3B8' }} />
              <div>Tidak ditemukan siswa dengan kata kunci "{searchTerm}".</div>
            </div>
          ) : (
            filteredStudents.map((st) => {
              const isSelected = tempSelected.some((s) => s.id === st.id);
              const semantic = getSemanticStatus(st.flag_level);

              return (
                <div
                  key={st.id}
                  onClick={() => handleToggleStudent(st)}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      handleToggleStudent(st);
                    }
                  }}
                  tabIndex={0}
                  role="checkbox"
                  aria-checked={isSelected}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: isSelected ? '1.5px solid #4F46E5' : '1px solid #E8E5F7',
                    backgroundColor: isSelected ? '#FAF8FF' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    outline: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    {/* Checkbox / Radio Icon */}
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: selectionMode === 'single' ? '50%' : '6px',
                        border: isSelected ? '2px solid #4F46E5' : '2px solid #CBD5E1',
                        backgroundColor: isSelected ? '#4F46E5' : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        flexShrink: 0
                      }}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: 700,
                          color: '#1E1B4B',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {st.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                        Kelas: <strong>{st.class_name || 'XI IPA 2'}</strong> • NISN: {st.nisn || '-'}
                      </div>
                    </div>
                  </div>

                  {/* Semantic Status Badge with Icon + Text */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '3px 9px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: semantic.bg,
                      color: semantic.color,
                      flexShrink: 0
                    }}
                  >
                    {semantic.icon}
                    <span>{semantic.label}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Multi-student Privacy Notice */}
        {selectionMode === 'multi' && tempSelected.length > 1 && (
          <div
            style={{
              padding: '8px 24px',
              backgroundColor: '#FEF3C7',
              borderTop: '1px solid #FDE68A',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11.5px',
              color: '#92400E'
            }}
          >
            <Info size={14} style={{ flexShrink: 0 }} />
            <span>
              <strong>Perlindungan Privasi:</strong> Analisis untuk {tempSelected.length} siswa akan disajikan secara agregat tanpa mencampur data pribadi antar-siswa.
            </span>
          </div>
        )}

        {/* Sticky Modal Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid #E8E5F7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            backgroundColor: '#FFFFFF',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>
            {selectionMode === 'umum' || tempSelected.length === 0 ? (
              <span>🌐 Mode: <strong>Umum / Tanpa Siswa</strong></span>
            ) : (
              <span>👥 Terpilih: <strong>{tempSelected.length} siswa</strong></span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 18px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#475569',
                backgroundColor: '#F1F5F9',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              style={{
                padding: '9px 20px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#FFFFFF',
                backgroundColor: '#4F46E5',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)'
              }}
            >
              Gunakan Pilihan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
