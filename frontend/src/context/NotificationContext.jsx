import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast as sonnerToast } from 'sonner';

const NotificationContext = createContext(null);

const DEFAULT_NOTIFICATIONS = {
  guru_bk: [
    {
      id: 'notif-bk-1',
      type: 'crisis',
      priority: 'krisis',
      category: 'KRISIS',
      title: 'Sinyal Kerentanan Emosional Terdeteksi',
      message: 'Siswa SISWA-09 (Fajar Maulana) menunjukkan indikasi keputusasaan akut pada curhat chatbot. Segera lakukan kontak darurat.',
      timestamp: '5 menit yang lalu',
      timeMs: Date.now() - 5 * 60 * 1000,
      read: false,
      link: '/guru/flags'
    },
    {
      id: 'notif-bk-2',
      type: 'academic',
      priority: 'high',
      category: 'FLAG MERAH',
      title: 'Penurunan Nilai Drastis Matematika',
      message: 'Siswa SISWA-04 (Budi Setiawan) mengalami penurunan nilai >15 poin (P14: 58.0). Lembar persiapan konseling siap.',
      timestamp: '25 menit yang lalu',
      timeMs: Date.now() - 25 * 60 * 1000,
      read: false,
      link: '/guru/detail/4'
    },
    {
      id: 'notif-bk-3',
      type: 'chat',
      priority: 'medium',
      category: 'CURHAT AI',
      title: 'Curhat Refleksi Siswa Baru',
      message: 'Siswa SISWA-01 (Budi Siswa Demo) menyelesaikan sesi refleksi mingguan dan membagikan jurnal beban belajar.',
      timestamp: '1 jam yang lalu',
      timeMs: Date.now() - 60 * 60 * 1000,
      read: false,
      link: '/guru/triage'
    },
    {
      id: 'notif-bk-4',
      type: 'info',
      priority: 'low',
      category: 'SISTEM',
      title: 'Panduan Konseling Siswa Siap Ditinjau',
      message: 'Asisten AI LUNA Konselor telah memproses profil minat bakat RIASEC dan panduan konseling untuk 3 siswa.',
      timestamp: '3 jam yang lalu',
      timeMs: Date.now() - 3 * 60 * 60 * 1000,
      read: true,
      link: '/guru/rekap'
    }
  ],
  guru_mapel: [
    {
      id: 'notif-mapel-1',
      type: 'academic',
      priority: 'high',
      category: 'REMEDIAL',
      title: '4 Siswa di Bawah KKM (75)',
      message: 'Penilaian harian P14 mendeteksi 4 siswa perlu jadwal remedial sebelum rekap semester difinalisasi.',
      timestamp: '15 menit yang lalu',
      timeMs: Date.now() - 15 * 60 * 1000,
      read: false,
      link: '/guru/nilai-mapel'
    },
    {
      id: 'notif-mapel-2',
      type: 'info',
      priority: 'medium',
      category: 'DEADLINE',
      title: 'Sinkronisasi Nilai P14 & UTS',
      message: 'Penginputan capaian harian pertemuan 14 dibuka hingga Jumat ini pukul 17.00 WIB.',
      timestamp: '2 jam yang lalu',
      timeMs: Date.now() - 2 * 60 * 60 * 1000,
      read: false,
      link: '/guru/nilai-mapel'
    },
    {
      id: 'notif-mapel-3',
      type: 'success',
      priority: 'low',
      category: 'PRESTASI',
      title: 'Peningkatan Rata-rata Kelas',
      message: 'Rata-rata kelas XI IPA 2 untuk mata pelajaran yang diampu mencapai 82.4 poin (+1.2 poin).',
      timestamp: 'Kemarin',
      timeMs: Date.now() - 24 * 60 * 60 * 1000,
      read: true,
      link: '/guru/rekap'
    }
  ],
  siswa: [
    {
      id: 'notif-siswa-1',
      type: 'info',
      priority: 'medium',
      category: 'JADWAL BK',
      title: 'Undangan Konseling Tatap Muka',
      message: 'Guru BK (Bu Ratna Dewi) menjadwalkan sesi bimbingan karir dan peminatan SNBP hari Rabu pukul 10.00 WIB di Ruang BK.',
      timestamp: '10 menit yang lalu',
      timeMs: Date.now() - 10 * 60 * 1000,
      read: false,
      link: '/siswa/dashboard'
    },
    {
      id: 'notif-siswa-2',
      type: 'academic',
      priority: 'low',
      category: 'NILAI BARU',
      title: 'Nilai Matematika P14 Diperbarui',
      message: 'Guru pengampu telah mengunggah nilai pertemuan 14: 88.0 (Grade B+). Capaianmu di atas rata-rata kelas!',
      timestamp: '1 jam yang lalu',
      timeMs: Date.now() - 60 * 60 * 1000,
      read: false,
      link: '/siswa/dashboard'
    },
    {
      id: 'notif-siswa-3',
      type: 'career',
      priority: 'low',
      category: 'RIASEC',
      title: 'Rekomendasi Karir Baru dari AI',
      message: 'Kombinasi nilai sains dan seni menunjukkan kecocokan pada rumpun Investigatif & Artistik (Desain Produk & Rekayasa).',
      timestamp: 'Kemarin',
      timeMs: Date.now() - 24 * 60 * 60 * 1000,
      read: true,
      link: '/siswa/dashboard'
    },
    {
      id: 'notif-siswa-4',
      type: 'chat',
      priority: 'low',
      category: 'LUNA AI',
      title: 'Teman Curhat LUNA Siap Menemanimu',
      message: 'Merasa lelah setelah ujian? Yuk cerita santai dan luapkan beban pikiranmu ke LUNA AI 24/7.',
      timestamp: '2 hari lalu',
      timeMs: Date.now() - 48 * 60 * 60 * 1000,
      read: true,
      link: '/siswa/chat'
    }
  ]
};

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const role = currentUser?.role === 'siswa' ? 'siswa' : (currentUser?.role === 'guru_mapel' || currentUser?.role === 'guru' ? 'guru_mapel' : 'guru_bk');

  const storageKey = `luna_notifs_${role}`;

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_NOTIFICATIONS[role] || DEFAULT_NOTIFICATIONS.guru_bk;
  });

  const [toasts, setToasts] = useState([]);

  // Sync when role changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setNotifications(JSON.parse(saved));
      } else {
        setNotifications(DEFAULT_NOTIFICATIONS[role] || DEFAULT_NOTIFICATIONS.guru_bk);
      }
    } catch {
      setNotifications(DEFAULT_NOTIFICATIONS[role] || DEFAULT_NOTIFICATIONS.guru_bk);
    }
  }, [role, storageKey]);

  // Save to localStorage
  const saveNotifs = (updatedList) => {
    setNotifications(updatedList);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedList));
    } catch {}
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalUnread = notifications.some((n) => !n.read && (n.priority === 'krisis' || n.priority === 'high'));

  const markAsRead = (id) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveNotifs(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifs(updated);
    showToast({
      type: 'success',
      title: 'Notifikasi Ditandai',
      message: 'Semua notifikasi telah ditandai sebagai dibaca.'
    });
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifs(updated);
  };

  const clearAll = () => {
    saveNotifs([]);
    showToast({
      type: 'info',
      title: 'Notifikasi Dibersihkan',
      message: 'Seluruh daftar notifikasi telah dihapus.'
    });
  };

  const addNotification = (newNotif) => {
    const entry = {
      id: `notif-${Date.now()}`,
      timestamp: 'Baru saja',
      timeMs: Date.now(),
      read: false,
      ...newNotif
    };
    saveNotifs([entry, ...notifications]);
    showToast({
      type: entry.type === 'crisis' ? 'error' : 'info',
      title: entry.title,
      message: entry.message
    });
  };

  const showToast = ({ type = 'info', title, message, duration = 4000 }) => {
    const desc = message || '';
    if (type === 'success') {
      sonnerToast.success(title, { description: desc, duration });
    } else if (type === 'error' || type === 'critical' || type === 'crisis') {
      sonnerToast.error(title, { description: desc, duration });
    } else if (type === 'warning') {
      sonnerToast.warning(title, { description: desc, duration });
    } else {
      sonnerToast.info(title, { description: desc, duration });
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        criticalUnread,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        addNotification,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
