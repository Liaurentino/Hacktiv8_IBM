import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useGoogleSheetSync } from '../../hooks/useGoogleSheetSync';
import MapelHeaderAndMetrics from '../../components/guru/mapel/MapelHeaderAndMetrics';
import MapelGradeSyncManager from '../../components/guru/mapel/MapelGradeSyncManager';
import MapelScoreTable from '../../components/guru/mapel/MapelScoreTable';
import EditScoreModal from '../../components/guru/mapel/EditScoreModal';
import MapelFilterSearchBar from '../../components/guru/mapel/MapelFilterSearchBar';
import '../../styles/guru-kelas-reference.css';

export default function GuruMapelNilaiPage() {
  const { currentUser } = useAuth();
  const { showToast } = useNotifications();

  // Subject defaults to user's assigned subject, or 'mtk' if not assigned
  const [activeSubjectKey, setActiveSubjectKey] = useState(currentUser?.subject_key || 'mtk');
  const [subjectsList, setSubjectsList] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'tuntas', 'remedial'

  // Modal Edit State
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editScores, setEditScores] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const KKM = 75;

  // Load subject list on mount
  useEffect(() => {
    api.getSubjects().then((res) => {
      if (res.status === 'success' && res.subjects) {
        setSubjectsList(res.subjects);
      }
    }).catch(() => {});
  }, []);

  // Update subject if currentUser changes
  useEffect(() => {
    if (currentUser?.subject_key) {
      setActiveSubjectKey(currentUser.subject_key);
    }
  }, [currentUser]);

  // Load grades when active subject changes
  const loadGrades = async () => {
    setLoading(true);
    try {
      const res = await api.getGradesBySubject(activeSubjectKey);
      if (res.status === 'success' && res.students) {
        setStudents(res.students);
      }
    } catch (err) {
      console.error('Gagal memuat nilai:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrades();
  }, [activeSubjectKey]);

  // Google Sheet Polling Auto-Sync Hook (Metode 1: Polling Berkala)
  const syncData = useGoogleSheetSync({
    subjectKey: activeSubjectKey,
    students,
    intervalSeconds: 20,
    showToast,
    onSyncSuccess: () => {
      // Muat ulang daftar nilai murid secara halus
      api.getGradesBySubject(activeSubjectKey).then((res) => {
        if (res.status === 'success' && res.students) {
          setStudents(res.students);
        }
      }).catch(console.error);
    }
  });

  // Active Subject Detail
  const activeSubjectObj = subjectsList.find((s) => s.key === activeSubjectKey) || {
    key: activeSubjectKey,
    name: currentUser?.subject_name || 'Matematika'
  };

  // Open edit modal for student
  const handleOpenEdit = (student) => {
    setSelectedStudent(student);
    const initialScores = Array.isArray(student.scores) && student.scores.length === 7
      ? [...student.scores]
      : Array.from({ length: 7 }, () => Math.round(student.avg_score || 80));
    setEditScores(initialScores);
    setSaveSuccessMsg('');
  };

  // Handle individual score change
  const handleScoreChange = (index, value) => {
    const valNum = Math.max(0, Math.min(100, Number(value) || 0));
    const nextScores = [...editScores];
    nextScores[index] = valNum;
    setEditScores(nextScores);
  };

  // Save updated grades to backend
  const handleSaveScores = async () => {
    if (!selectedStudent) return;
    setSaving(true);
    setSaveSuccessMsg('');
    try {
      const res = await api.updateGrade(selectedStudent.student_id, activeSubjectKey, editScores);
      if (res.status === 'success') {
        setSaveSuccessMsg(`Nilai ${selectedStudent.student_name} berhasil disimpan!`);
        showToast({
          type: 'success',
          title: 'Nilai Berhasil Diperbarui',
          message: `Nilai ${selectedStudent.student_name} untuk mapel ${activeSubjectKey.toUpperCase()} berhasil disimpan.`
        });
        setStudents((prev) =>
          prev.map((s) => {
            if (s.student_id === selectedStudent.student_id) {
              return {
                ...s,
                scores: res.data.scores,
                avg_score: res.data.avg_score,
                min_score: res.data.min_score,
                max_score: res.data.max_score,
                letter_grade: res.data.letter_grade
              };
            }
            return s;
          })
        );
        setTimeout(() => {
          setSelectedStudent(null);
          setSaveSuccessMsg('');
        }, 1200);
      }
    } catch (err) {
      alert('Gagal menyimpan nilai: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Compute live average in edit modal
  const modalAvg = editScores.length
    ? +(editScores.reduce((a, b) => a + b, 0) / editScores.length).toFixed(1)
    : 0;

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nisn.includes(searchTerm);
    if (!matchSearch) return false;

    const isTuntas = Number(s.avg_score) >= KKM;
    if (statusFilter === 'tuntas') return isTuntas;
    if (statusFilter === 'remedial') return !isTuntas;
    return true;
  });

  // Summary Metrics
  const classAvg = students.length
    ? +(students.reduce((acc, s) => acc + Number(s.avg_score || 0), 0) / students.length).toFixed(1)
    : 0;
  const tuntasCount = students.filter((s) => Number(s.avg_score) >= KKM).length;
  const remedialCount = students.length - tuntasCount;
  const highestScore = students.length ? Math.max(...students.map((s) => Number(s.avg_score || 0))) : 0;

  return (
    <div className="preview-guru-mapel-nilai page-standard-container">
      {/* Header & Metrics */}
      <MapelHeaderAndMetrics
        activeSubjectKey={activeSubjectKey}
        setActiveSubjectKey={setActiveSubjectKey}
        activeSubjectObj={activeSubjectObj}
        subjectsList={subjectsList}
        currentUser={currentUser}
        KKM={KKM}
        classAvg={classAvg}
        tuntasCount={tuntasCount}
        remedialCount={remedialCount}
        highestScore={highestScore}
      />

      {/* Unified Grade Sync & Excel/CSV Import Manager */}
      <MapelGradeSyncManager
        syncData={syncData}
        activeSubjectKey={activeSubjectKey}
        activeSubjectName={activeSubjectObj.name}
        students={students}
        KKM={KKM}
        onImportSuccess={() => {
          showToast({
            type: 'success',
            title: 'Import Nilai Sukses',
            message: `Nilai murid untuk mata pelajaran ${activeSubjectObj.name} berhasil diperbarui.`
          });
          loadGrades();
        }}
      />

      {/* Filter and Search Bar */}
      <MapelFilterSearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        KKM={KKM}
        onRefresh={loadGrades}
      />

      {/* Main Table */}
      <MapelScoreTable
        loading={loading}
        filteredStudents={filteredStudents}
        activeSubjectName={activeSubjectObj.name}
        KKM={KKM}
        onOpenEdit={handleOpenEdit}
      />

      {/* Modal Input & Edit Nilai */}
      <EditScoreModal
        selectedStudent={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        activeSubjectName={activeSubjectObj.name}
        KKM={KKM}
        editScores={editScores}
        modalAvg={modalAvg}
        handleScoreChange={handleScoreChange}
        setEditScores={setEditScores}
        saveSuccessMsg={saveSuccessMsg}
        handleSaveScores={handleSaveScores}
        saving={saving}
      />
    </div>
  );
}
