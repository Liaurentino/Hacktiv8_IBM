import React, { useState, useRef, useEffect, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  AlertCircle,
  MessageCircle,
  BookOpen,
  Sparkles,
  Info,
  X,
  ExternalLink,
  Trash2,
  Check
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export default function NotificationBell({
  variant = 'icon', // 'icon' | 'nav-item'
  sidebarCollapsed = false,
  onOpen
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const [confirmClear, setConfirmClear] = useState(false);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));
  const [coords, setCoords] = useState({ top: 0, left: 0, right: 0 });

  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const navigate = useNavigate();
  const titleId = useId();

  const {
    notifications,
    unreadCount,
    criticalUnread,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  } = useNotifications();

  // Responsive breakpoint tracking
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update positioning coordinates for desktop popover
  const calculatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right
      });
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      calculatePosition();
      if (onOpen) onOpen();
    }
    setIsOpen((prev) => !prev);
    setConfirmClear(false);
  };

  // Keyboard accessibility & scroll lock
  useEffect(() => {
    if (isOpen) {
      // Calculate coordinates when open
      calculatePosition();

      // Prevent background scrolling on mobile
      const prevOverflow = document.body.style.overflow;
      if (isMobile) {
        document.body.style.overflow = 'hidden';
      }

      // Auto-focus panel or close button
      const closeBtn = panelRef.current?.querySelector('.notif-close-btn');
      if (closeBtn) {
        setTimeout(() => closeBtn.focus(), 60);
      }

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      };

      const handleOutsideClick = (e) => {
        if (
          panelRef.current &&
          !panelRef.current.contains(e.target) &&
          triggerRef.current &&
          !triggerRef.current.contains(e.target)
        ) {
          setIsOpen(false);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);

      return () => {
        if (isMobile) {
          document.body.style.overflow = prevOverflow;
        }
        window.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleOutsideClick);
        document.removeEventListener('touchstart', handleOutsideClick);
      };
    } else {
      // When closed, restore focus to the trigger button
      if (triggerRef.current) {
        triggerRef.current.focus();
      }
    }
  }, [isOpen, isMobile]);

  // Filtered and sorted notifications list (newest first)
  const sortedList = [...notifications].sort((a, b) => (b.timeMs || 0) - (a.timeMs || 0));
  const displayedList = filter === 'unread'
    ? sortedList.filter((n) => !n.read)
    : sortedList;

  const handleOpenItem = (item) => {
    if (!item.read) {
      markAsRead(item.id);
    }
    setIsOpen(false);
    if (item.link) {
      navigate(item.link);
    }
  };

  const getIconConfig = (type, priority) => {
    if (type === 'crisis' || priority === 'krisis') {
      return {
        icon: <AlertCircle size={18} color="#FFFFFF" />,
        bg: '#EF4444',
        badgeBg: '#FEE2E2',
        badgeColor: '#991B1B',
        priorityLabel: '🔴 Mendesak'
      };
    }
    if (type === 'academic' || priority === 'high') {
      return {
        icon: <BookOpen size={18} color="#FFFFFF" />,
        bg: '#F59E0B',
        badgeBg: '#FEF3C7',
        badgeColor: '#92400E',
        priorityLabel: '🟡 Perhatian'
      };
    }
    if (type === 'chat') {
      return {
        icon: <MessageCircle size={18} color="#FFFFFF" />,
        bg: '#8B5CF6',
        badgeBg: '#EDE9FE',
        badgeColor: '#5B21B6',
        priorityLabel: null
      };
    }
    if (type === 'career') {
      return {
        icon: <Sparkles size={18} color="#FFFFFF" />,
        bg: '#10B981',
        badgeBg: '#D1FAE5',
        badgeColor: '#065F46',
        priorityLabel: null
      };
    }
    return {
      icon: <Info size={18} color="#FFFFFF" />,
      bg: '#3B82F6',
      badgeBg: '#DBEAFE',
      badgeColor: '#1E40AF',
      priorityLabel: null
    };
  };

  const badgeText = unreadCount > 99 ? '99+' : unreadCount > 0 ? unreadCount : null;
  const accessibleLabel = unreadCount > 0
    ? `Notifikasi, ${unreadCount} belum dibaca`
    : 'Notifikasi';

  // Desktop popover positioning coordinates
  const popoverStyle = !isMobile
    ? coords.left < 320
      ? {
          position: 'fixed',
          top: `${Math.max(16, Math.min(coords.top - 8, window.innerHeight - 520))}px`,
          left: `${Math.max(16, coords.right + 12)}px`,
          width: '390px',
          maxHeight: '520px'
        }
      : {
          position: 'fixed',
          top: `${coords.bottom + 8}px`,
          right: `${Math.max(16, window.innerWidth - coords.right)}px`,
          width: '390px',
          maxHeight: '520px'
        }
    : {};

  return (
    <>
      {/* TRIGGER 1: Sidebar Navigation Item Variant */}
      {variant === 'nav-item' && (
        <button
          ref={triggerRef}
          type="button"
          className={`notif-nav-item ${isOpen ? 'active' : ''}`}
          onClick={handleToggle}
          aria-label={accessibleLabel}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          title={sidebarCollapsed ? accessibleLabel : 'Lihat Notifikasi'}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Bell size={18} />
            {badgeText && sidebarCollapsed && (
              <span className={`notif-bell-badge ${criticalUnread ? 'pulse' : ''}`}>
                {badgeText}
              </span>
            )}
          </div>
          {!sidebarCollapsed && (
            <>
              <span style={{ flex: 1, textAlign: 'left' }}>Notifikasi</span>
              {badgeText && (
                <span className={`unified-badge badge-red ${criticalUnread ? 'pulse' : ''}`}>
                  {badgeText}
                </span>
              )}
            </>
          )}
        </button>
      )}

      {/* TRIGGER 2: Icon Button Variant (Top bar, Header, etc.) */}
      {variant === 'icon' && (
        <button
          ref={triggerRef}
          type="button"
          className="notif-bell-btn"
          onClick={handleToggle}
          aria-label={accessibleLabel}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          title="Pusat Notifikasi LUNA"
        >
          <Bell size={18} />
          {badgeText && (
            <span className={`notif-bell-badge ${criticalUnread ? 'pulse' : ''}`}>
              {badgeText}
            </span>
          )}
        </button>
      )}

      {/* NOTIFICATION PANEL (Desktop Popover OR Mobile Bottom Sheet) */}
      {isOpen && (
        <>
          {/* Mobile Backdrop Overlay */}
          {isMobile && (
            <div
              className="notif-mobile-backdrop"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Panel Container */}
          <div
            ref={panelRef}
            className={isMobile ? 'notif-bottom-sheet' : 'notif-dropdown'}
            style={popoverStyle}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            {/* Mobile Sheet Drag Handle */}
            {isMobile && <div className="notif-sheet-handle" aria-hidden="true" />}

            {/* Header */}
            <header className="notif-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2
                  id={titleId}
                  style={{
                    fontWeight: 800,
                    fontSize: '15px',
                    color: '#23214A',
                    margin: 0
                  }}
                >
                  Notifikasi
                </h2>
                {unreadCount > 0 && (
                  <span
                    style={{
                      background: '#ECE9FD',
                      color: '#5243C2',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}
                  >
                    {badgeText} baru
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="notif-mark-all-btn"
                    title="Tandai semua telah dibaca"
                    aria-label="Tandai semua notifikasi telah dibaca"
                  >
                    <CheckCheck size={14} />
                    <span>Tandai semua dibaca</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="notif-close-btn"
                  aria-label="Tutup panel notifikasi"
                  title="Tutup Notifikasi"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            {/* Tabs Filter */}
            <div className="notif-tabs" role="tablist" aria-label="Filter status notifikasi">
              <button
                type="button"
                role="tab"
                id="tab-all"
                aria-selected={filter === 'all'}
                aria-controls="notif-list-panel"
                className={`notif-tab-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                Semua ({notifications.length})
              </button>
              <button
                type="button"
                role="tab"
                id="tab-unread"
                aria-selected={filter === 'unread'}
                aria-controls="notif-list-panel"
                className={`notif-tab-btn ${filter === 'unread' ? 'active' : ''}`}
                onClick={() => setFilter('unread')}
              >
                Belum Dibaca ({unreadCount})
              </button>
            </div>

            {/* Scrollable List */}
            <div
              id="notif-list-panel"
              className="notif-list"
              role="region"
              aria-live="polite"
              aria-labelledby={filter === 'all' ? 'tab-all' : 'tab-unread'}
            >
              {displayedList.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6E6D8A' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: '#F1F5F9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 10px',
                      color: '#64748B'
                    }}
                  >
                    <Bell size={22} />
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1E293B' }}>
                    {filter === 'unread' ? 'Tidak ada notifikasi yang belum dibaca.' : 'Belum ada notifikasi.'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                    {filter === 'unread'
                      ? 'Seluruh pemberitahuan sudah Anda tinjau.'
                      : 'Pembaruan bimbingan konseling dan akademik akan muncul di sini.'}
                  </div>
                </div>
              ) : (
                displayedList.map((item) => {
                  const conf = getIconConfig(item.type, item.priority);
                  return (
                    <article
                      key={item.id}
                      className={`notif-item ${!item.read ? 'unread' : ''}`}
                      onClick={() => handleOpenItem(item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOpenItem(item);
                        }
                      }}
                      aria-label={`${item.title}. ${item.message}. ${item.read ? 'Sudah dibaca' : 'Belum dibaca'}`}
                    >
                      {/* Left Icon */}
                      <div className="notif-icon-box" style={{ background: conf.bg }} aria-hidden="true">
                        {conf.icon}
                      </div>

                      {/* Item Body */}
                      <div className="notif-item-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                          <span className="notif-item-title" style={{ fontWeight: !item.read ? 800 : 600 }}>
                            {item.title}
                          </span>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            {!item.read && (
                              <span className="notif-unread-tag">
                                <span className="sr-only">Status: </span>
                                Baru
                              </span>
                            )}
                            <span
                              style={{
                                background: conf.badgeBg,
                                color: conf.badgeColor,
                                fontSize: '9.5px',
                                fontWeight: 800,
                                padding: '1px 6px',
                                borderRadius: '4px',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {item.category}
                            </span>
                          </div>
                        </div>

                        <p className="notif-item-desc" style={{ margin: '0 0 6px 0' }}>
                          {item.message}
                        </p>

                        <div className="notif-item-footer">
                          <span>{item.timestamp}</span>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {/* Action Buka */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenItem(item);
                              }}
                              className="notif-action-open-btn"
                              title="Buka halaman terkait"
                            >
                              <span>Buka</span>
                              <ExternalLink size={11} />
                            </button>

                            {/* Action Hapus Individual */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(item.id);
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#94A3B8',
                                cursor: 'pointer',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px'
                              }}
                              aria-label={`Hapus notifikasi ${item.title}`}
                              title="Hapus notifikasi"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            {/* Footer with Confirmation before Clear */}
            {notifications.length > 0 && (
              <footer className="notif-footer">
                {confirmClear ? (
                  <div className="notif-confirm-box" style={{ width: '100%', margin: '0' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#991B1B' }}>
                      ⚠️ Hapus seluruh riwayat notifikasi secara permanen?
                    </div>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                      <button
                        type="button"
                        onClick={() => setConfirmClear(false)}
                        className="btn-notif-cancel"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          clearAll();
                          setConfirmClear(false);
                        }}
                        className="btn-notif-danger"
                      >
                        Ya, Bersihkan
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setConfirmClear(true)}
                      className="notif-clear-btn"
                      title="Hapus seluruh riwayat notifikasi"
                    >
                      Bersihkan Riwayat
                    </button>
                    <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                      LUNA Early Warning
                    </span>
                  </>
                )}
              </footer>
            )}
          </div>
        </>
      )}
    </>
  );
}
