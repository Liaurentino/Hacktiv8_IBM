import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    return api.getStoredUser() || {
      name: 'Bu Ratna Dewi, M.Pd',
      role: 'guru_bk',
      email: 'ratna@sekolah.sch.id',
      avatar: 'RD'
    };
  });

  const [activeStudent, setActiveStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('luna_token');
    if (token) {
      api.getCurrentUser()
        .then((res) => {
          if (res.status === 'success' && res.user) {
            setCurrentUser(res.user);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Sync active student profile for Siswa portal
  useEffect(() => {
    if (currentUser && currentUser.role === 'siswa') {
      api.getStudents()
        .then((res) => {
          if (res.status === 'success' && res.students && res.students.length > 0) {
            const normalize = (v = '') => (v || '').trim().toLowerCase();
            const uEmail = normalize(currentUser.email);
            const uName = normalize(currentUser.name);
            const uNisn = (currentUser.nisn || (uEmail.includes('@') ? '' : uEmail)).trim();

            let matched = uEmail ? res.students.find((s) => normalize(s.email) === uEmail) : null;
            if (!matched && currentUser.id) {
              matched = res.students.find((s) => s.user_id && Number(s.user_id) === Number(currentUser.id));
            }
            if (!matched && uNisn) {
              matched = res.students.find((s) => String(s.nisn || '').trim() === uNisn);
            }
            if (!matched && uName) {
              matched = res.students.find((s) => normalize(s.name) === uName);
            }
            if (!matched && (uEmail === 'siswa@siswa.sch.id' || uEmail === 'priya@siswa.sch.id')) {
              matched = res.students.find((s) => normalize(s.email) === uEmail || String(s.nisn) === '20249999');
            }

            setActiveStudent(matched || null);
          }
        })
        .catch(() => {});
    } else {
      setActiveStudent(null);
    }
  }, [currentUser]);

  const loginUser = (user, token) => {
    if (token) {
      localStorage.setItem('luna_token', token);
    }
    if (user) {
      localStorage.setItem('luna_user', JSON.stringify(user));
      setCurrentUser(user);
    }
  };

  const logoutUser = () => {
    api.logout();
    setCurrentUser(null);
    setActiveStudent(null);
  };

  const updateUser = (updatedUserData) => {
    const merged = { ...currentUser, ...updatedUserData };
    setCurrentUser(merged);
    localStorage.setItem('luna_user', JSON.stringify(merged));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        activeStudent,
        setActiveStudent,
        loginUser,
        logoutUser,
        updateUser,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
