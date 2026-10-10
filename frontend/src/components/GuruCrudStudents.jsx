import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Search,
  Edit3,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Users,
  School,
  Mail,
  Phone
} from 'lucide-react';
import api from '../services/api';
import GuruBuatAkunSiswa from './GuruBuatAkunSiswa';
import EditStudentModal from './EditStudentModal';
import DeleteStudentModal from './DeleteStudentModal';
import PageHeader from './common/PageHeader';

// Halaman Kelola Akun Siswa — murni manajemen akun login siswa (tanpa nilai / data BK).
export default function GuruCrudStudents() {
  const [view, setView] = useState('list'); // 'list' | 'create'
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('Semua Kelas');

  const [studentToEdit, setStudentToEdit] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [alertBanner, setAlertBanner] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.getStudents({ search, className: selectedClass });
      if (res.status === 'success') setStudents(res.students || []);
    } catch (err) {
      console.error('Gagal mengambil data akun siswa:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'list') fetchStudents();
  }, [search, selectedClass, view]);

  const showBanner = (type, text) => {
    setAlertBanner({ type, text });
    setTimeout(() => setAlertBanner(null), 4000);
  };

  if (view === 'create') {
    return <GuruBuatAkunSiswa onNavigateToStudents={() => setView('list')} />;
  }

  const classCount = new Set(students.map((s) => s.class_name)).size;
  const withPhone = students.filter((s) => s.phone).length;

  return (
    <div className="preview-guru-crud-students page-standard-container">
      {/* Standardized Header */}
      <PageHeader
        icon={Users}
        moduleTag="Portal Bimbingan Konseling • LUNA Education System"
        title="Kelola & Direktori Akun Siswa"
        description="Daftar akun login portal siswa untuk akses pendampingan mandiri, konseling, dan refleksi berkala."
        metadata={[
          { label: 'Unit Sekolah', value: 'SMA Negeri 1 Harapan' },
          { label: 'Total Siswa Aktif', value: `${students.length} Siswa` },
          { label: 'Perlindungan Data', value: 'Terenkripsi (UU PDP)' }
        ]}
        actions={
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={fetchStudents} className="btn-luna-secondary" style={{ fontSize: '13px', padding: '9px 14px' }}>
              <RefreshCw size={14} />
              <span>Segarkan</span>
            </button>
            <button onClick={() => setView('create')} className="btn-luna-primary" id="btn-buat-akun-siswa">
              <UserPlus size={16} />
              <span>Buat Akun Siswa</span>
            </button>
          </div>
        }
      />

      {alertBanner && (
        <div style={{
          background: alertBanner.type === 'success' ? '#F0FDF4' : '#EFF6FF',
          border: `1px solid ${alertBanner.type === 'success' ? '#BBF7D0' : '#BFDBFE'}`,
          color: alertBanner.type === 'success' ? '#166534' : '#1E40AF',
          padding: '12px 18px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} />
          <span>{alertBanner.text}</span>
        </div>
      )}

      {/* Ringkasan akun */}
      <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div className="stat-card">
          <div className="stat-label">
            <span>Total Akun Siswa</span>
            <Users size={14} style={{ color: 'var(--brand)' }} />
          </div>
          <div className="stat-value">{students.length}</div>
          <div className="stat-sub">Akun siswa terdaftar</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <span>Jumlah Kelas</span>
            <School size={14} style={{ color: 'var(--slate-600)' }} />
          </div>
          <div className="stat-value">{classCount}</div>
          <div className="stat-sub">Kelas yang memiliki akun</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <span>Kontak Terisi</span>
            <Phone size={14} style={{ color: 'var(--slate-600)' }} />
          </div>
          <div className="stat-value">{withPhone}</div>
          <div className="stat-sub">Akun dengan nomor HP</div>
        </div>
      </div>

      {/* Filter */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 160px', minWidth: '140px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
              Kelas
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1.5px solid var(--border)', fontSize: '13px', background: '#FFF' }}
            >
              <option value="Semua Kelas">Semua Kelas</option>
              <option value="XI IPA 2">XI IPA 2</option>
              <option value="XI IPA 1">XI IPA 1</option>
              <option value="XI IPS 1">XI IPS 1</option>
              <option value="XI IPS 2">XI IPS 2</option>
              <option value="X IPA 1">X IPA 1</option>
              <option value="XII IPA 1">XII IPA 1</option>
            </select>
          </div>
          <div style={{ flex: '3 1 260px', minWidth: '200px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
              Cari Nama / NISN
            </label>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ketik nama atau NISN siswa..."
                style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: '6px', border: '1.5px solid var(--border)', fontSize: '13px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabel akun */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontSize: '15px', fontWeight: 800, color: 'var(--primary)' }}>
          Daftar Akun Siswa ({students.length})
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw size={24} className="spin-anim" style={{ margin: '0 auto 10px' }} />
            <div>Memuat data akun...</div>
          </div>
        ) : students.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Users size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
            <div style={{ fontSize: '15px', fontWeight: 600 }}>Belum ada akun yang cocok</div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>Ubah filter atau klik "Buat Akun Siswa".</div>
          </div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '40px', textAlign: 'center' }}>No</th>
                  <th className="sticky-col-left" style={{ minWidth: '180px' }}>Nama Siswa</th>
                  <th>NISN</th>
                  <th>Email Login</th>
                  <th>No. HP</th>
                  <th>Kelas</th>
                  <th>JK</th>
                  <th style={{ textAlign: 'center', minWidth: '100px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st, idx) => (
                  <tr key={st.id}>
                    <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)' }}>{idx + 1}</td>
                    <td className="sticky-col-left">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '30px', height: '30px', borderRadius: '50%',
                          background: '#EEF2FF', color: '#4338CA',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: '12px', flexShrink: 0
                        }}>
                          {st.name.charAt(0)}
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '13.5px' }}>{st.name}</span>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '12.5px' }}>{st.nisn}</td>
                    <td style={{ fontSize: '12.5px', color: 'var(--slate-700)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <Mail size={12} style={{ color: 'var(--slate-400)' }} />
                        {st.email || '—'}
                      </span>
                    </td>
                    <td style={{ fontSize: '12.5px', color: 'var(--slate-700)' }}>{st.phone || '—'}</td>
                    <td><span className="badge-class">{st.class_name}</span></td>
                    <td style={{ fontSize: '12.5px' }}>{st.gender === 'P' ? 'P' : 'L'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setStudentToEdit(st)}
                          title="Edit Akun"
                          style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', color: '#4338CA', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', display: 'flex' }}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setStudentToDelete(st)}
                          title="Hapus Akun"
                          style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', display: 'flex' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <EditStudentModal
        isOpen={!!studentToEdit}
        student={studentToEdit}
        onClose={() => setStudentToEdit(null)}
        onStudentUpdated={(s) => { fetchStudents(); showBanner('success', `Akun ${s.name} berhasil diperbarui.`); }}
      />
      <DeleteStudentModal
        isOpen={!!studentToDelete}
        student={studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onStudentDeleted={() => { fetchStudents(); showBanner('info', 'Akun siswa berhasil dihapus.'); }}
      />
    </div>
  );
}
