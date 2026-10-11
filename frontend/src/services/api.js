let currentApiBase = localStorage.getItem('luna_backend_url') || 'http://localhost:3001/api';

// Auto-discovery function: mendeteksi port backend secara otomatis jika port 3001 dialihkan ke 3002, 3003, dll.
export async function discoverBackendUrl() {
  // 1. Coba baca file static active_port.json yang ditulis oleh backend
  try {
    const res = await fetch('/active_port.json?t=' + Date.now());
    if (res.ok) {
      const data = await res.json();
      if (data && data.url) {
        currentApiBase = data.url;
        localStorage.setItem('luna_backend_url', currentApiBase);
        return currentApiBase;
      }
    }
  } catch (e) {}

  // 2. Ping kandidat port [3001, 3002, 3003, 3004, 3005] jika file belum sinkron
  const candidatePorts = [3001, 3002, 3003, 3004, 3005];
  for (const p of candidatePorts) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 400);
      const res = await fetch(`http://localhost:${p}/api/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const d = await res.json();
        if (d && d.status === 'ok') {
          currentApiBase = `http://localhost:${p}/api`;
          localStorage.setItem('luna_backend_url', currentApiBase);
          console.log(`🔗 LUNA API terhubung ke backend aktif di: ${currentApiBase}`);
          return currentApiBase;
        }
      }
    } catch (e) {}
  }

  return currentApiBase;
}

// Inisialisasi pendeteksian port saat web pertama kali dibuka
discoverBackendUrl();

function getApiUrl(endpoint) {
  const base = currentApiBase.replace(/\/$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${cleanEndpoint}`;
}

async function request(endpoint, options = {}, retries = 1) {
  const url = getApiUrl(endpoint);
  try {
    const res = await fetch(url, options);
    return res;
  } catch (err) {
    if (retries > 0) {
      console.warn(`⚠️ Koneksi ke ${url} gagal. Mencari port backend yang aktif...`);
      await discoverBackendUrl();
      const newUrl = getApiUrl(endpoint);
      return await fetch(newUrl, options);
    }
    throw err;
  }
}

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('luna_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleJsonResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    return data;
  }
  const text = await res.text();
  if (!res.ok) {
    const cleanMsg = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    throw new Error(cleanMsg || 'Layanan sedang mengalami kendala. Silakan coba kembali beberapa saat lagi.');
  }
  try {
    return JSON.parse(text);
  } catch {
    return { status: 'success', text };
  }
}

export const api = {
  // ══════════════ AUTH & OAUTH ══════════════
  async login(email, password) {
    const res = await request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('luna_token', data.token);
      localStorage.setItem('luna_user', JSON.stringify(data.user));
    }
    return data;
  },

  async register(dataOrName, email, password, role = 'guru_bk', extra = {}) {
    let payload;
    if (typeof dataOrName === 'object' && dataOrName !== null) {
      payload = dataOrName;
    } else {
      payload = { name: dataOrName, email, password, role, ...extra };
    }
    const res = await request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('luna_token', data.token);
      localStorage.setItem('luna_user', JSON.stringify(data.user));
    }
    return data;
  },

  async loginWithGoogle({ email, name, avatar, role = 'siswa' }) {
    const res = await request('/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        name,
        avatar,
        role,
        googleId: `goog_${Date.now()}`
      })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('luna_token', data.token);
      localStorage.setItem('luna_user', JSON.stringify(data.user));
    }
    return data;
  },

  async getCurrentUser() {
    const res = await request('/auth/me', {
      headers: getHeaders()
    });
    return res.json();
  },

  async updateProfile(profileData) {
    const res = await request('/auth/profile', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    });
    const data = await res.json();
    if (res.ok && data.user) {
      localStorage.setItem('luna_user', JSON.stringify(data.user));
    }
    return data;
  },

  async changePassword(oldPassword, newPassword, userId = null, email = null) {
    const res = await request('/auth/change-password', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ oldPassword, newPassword, userId, email })
    });
    return res.json();
  },

  async getStudentProfileMe({ email = '', userId = '', nisn = '' } = {}) {
    const params = new URLSearchParams();
    if (email) params.append('email', email);
    if (userId) params.append('userId', userId);
    if (nisn) params.append('nisn', nisn);

    const res = await request(`/students/profile/me?${params.toString()}`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async getStudentMe() {
    const res = await request('/students/me', {
      headers: getHeaders()
    });
    return res.json();
  },

  logout() {
    localStorage.removeItem('luna_token');
    localStorage.removeItem('luna_user');
  },

  getStoredUser() {
    const userStr = localStorage.getItem('luna_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // ══════════════ STUDENTS (CRUD) ══════════════
  async getStudents({ search = '', className = '', status = '', triage = '', includeGrades = false } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (className) params.append('className', className);
    if (status) params.append('status', status);
    if (triage) params.append('triage', triage);
    if (includeGrades) params.append('includeGrades', 'true');

    const res = await request(`/students?${params.toString()}`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async getStudentById(id) {
    const res = await request(`/students/${id}`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async generatePassword() {
    const res = await request('/students/generate-password', {
      headers: getHeaders()
    });
    return res.json();
  },

  async createStudent(studentData) {
    const res = await request('/students', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(studentData)
    });
    return res.json();
  },

  async createStudentsBatch(students) {
    const res = await request('/students/batch', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ students })
    });
    return res.json();
  },

  async updateStudent(id, studentData) {
    const res = await request(`/students/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(studentData)
    });
    return res.json();
  },

  async resetStudentPassword(id) {
    const res = await request(`/students/${id}/reset-password`, {
      method: 'POST',
      headers: getHeaders()
    });
    return res.json();
  },

  async deleteStudent(id) {
    const res = await request(`/students/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // ══════════════ COUNSELING FLAGS ══════════════
  async getFlags() {
    const res = await request('/flags', {
      headers: getHeaders()
    });
    return res.json();
  },

  async updateFlagStatus(id, status, action, note) {
    const res = await request(`/flags/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, action, note })
    });
    return res.json();
  },

  // ══════════════ CHAT ASSISTANT ══════════════
  async getChatHistory(studentId = 1) {
    const res = await request(`/chat/${studentId}`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async sendChatMessage(target, message, emotion = 'senang') {
    let payload = { message, emotion };
    if (Array.isArray(target)) {
      payload.studentIds = target;
    } else if (target && typeof target === 'object') {
      if (Array.isArray(target.studentIds)) payload.studentIds = target.studentIds;
      else if (target.studentId) payload.studentId = target.studentId;
      if (target.mode) payload.mode = target.mode;
    } else if (target && target !== 'umum') {
      payload.studentId = target;
    } else {
      payload.mode = 'umum';
    }

    const res = await request('/chat', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // ══════════════ GRADES & MATA PELAJARAN ══════════════
  async getSubjects() {
    const res = await request('/grades/subjects', {
      headers: getHeaders()
    });
    return res.json();
  },

  async getStudentGrades(studentId) {
    const res = await request(`/grades/student/${studentId}`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async getGradesBySubject(subjectKey) {
    const res = await request(`/grades/subject/${subjectKey}`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async updateGrade(studentId, subjectKey, scores) {
    const res = await request(`/grades/${studentId}/${subjectKey}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ scores })
    });
    return res.json();
  },

  async batchUpdateGrades(subjectKey, items) {
    const res = await request(`/grades/batch/${subjectKey}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ items })
    });
    return handleJsonResponse(res);
  },

  // ══════════════ COUNSELOR & LUNA MCP ══════════════
  async getCounselorStudents() {
    const res = await request('/counselor/students', {
      headers: getHeaders()
    });
    return res.json();
  },

  async getCounselorFlow() {
    const res = await request('/counselor/flow', {
      headers: getHeaders()
    });
    return res.json();
  },

  async processCounselorStudent(student) {
    const res = await request('/counselor/process', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(student)
    });
    return res.json();
  }
};

export default api;
