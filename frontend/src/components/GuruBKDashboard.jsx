import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LangflowStatusBar from './guru/triage/LangflowStatusBar';
import TriageMetricCards from './guru/triage/TriageMetricCards';
import TriageFilterSearch from './guru/triage/TriageFilterSearch';
import TriageStudentGrid from './guru/triage/TriageStudentGrid';
import CounselingBriefModal from './guru/triage/CounselingBriefModal';

export default function GuruBKDashboard() {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [copiedQuestionIdx, setCopiedQuestionIdx] = useState(null);

  useEffect(() => {
    api.getCounselorStudents()
      .then((data) => {
        if (data.status === 'success') {
          setStudents(data.students || []);
        }
      })
      .catch((err) => console.error('Error fetching students:', err));

    api.getCounselorFlow()
      .then((data) => setFlowSpec(data))
      .catch((err) => console.error('Error fetching flow:', err));
  }, []);

  const filteredStudents = students.filter((s) => {
    const matchesFilter = filter === 'ALL' || s.triage_level_expected === filter;
    const matchesSearch =
      s.student_id.toLowerCase().includes(search.toLowerCase()) ||
      s.reflection_text.toLowerCase().includes(search.toLowerCase()) ||
      s.hobbies_interests.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const redCount = students.filter((s) => s.triage_level_expected === 'MERAH').length;
  const yellowCount = students.filter((s) => s.triage_level_expected === 'KUNING').length;
  const greenCount = students.filter((s) => s.triage_level_expected === 'HIJAU').length;

  const handleOpenStudent = async (student) => {
    setSelectedStudent(student);
    setLoadingAnalysis(true);
    setAnalysisResult(null);

    try {
      const data = await api.processCounselorStudent(student);
      if (data.status === 'success') {
        setAnalysisResult(data);
      }
    } catch (err) {
      console.error('Error running Langflow-LUNA pipeline:', err);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const copyQuestion = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestionIdx(idx);
    setTimeout(() => setCopiedQuestionIdx(null), 2000);
  };

  const downloadMarkdown = () => {
    if (!analysisResult) return;
    const brief = analysisResult.counselingBrief;
    const content = `# LEMBAR PERSIAPAN KONSELING SISWA (COUNSELING PREP SHEET)
**ID Siswa:** ${brief.studentId} | **Kelas:** ${brief.gradeLevel} | **Tanggal:** ${brief.generatedAt}
**Layanan:** Asisten AI LUNA Konselor | **Standar Etika:** UU PDP No. 27/2022

---

## 1. STATUS TRIASE & FAKTOR RISIKO
* **Tingkat Urgensi:** ${brief.triageLevel}
* **Bukti Kutipan Jurnal:** "${brief.evidenceQuotes}"
* **Catatan Analisis:** ${brief.reasoningSummary}
* **Rekomendasi Tindakan Guru BK:** ${brief.recommendedAction}
${brief.isEmergencyCrisis ? `\n> ⚠️ PERINGATAN DARURAT: ${brief.emergencyHotline}\n` : ''}

---

## 2. PEMETAAN MINAT BAKAT (HOLLAND RIASEC)
${brief.isEmergencyCrisis ? '*Modul pemetaan karir dinonaktifkan sementara untuk penanganan darurat.*' : `
* **Kode Dominan:** ${brief.riasecSummary.primaryCode}
* **Klaster Minat Utama:** ${brief.riasecSummary.topTheme}
* **Rekomendasi Rumpun Program Studi:**
${brief.riasecSummary.studyPaths.map((p, i) => `  ${i + 1}. ${p}`).join('\n')}
`}

---

## 3. REKOMENDASI PERTANYAAN PEMBUKA DIALOG EMPATIK
${brief.conversationStarters.map((q, i) => `${i + 1}. "${q}"`).join('\n\n')}

---

*Responsible AI Disclaimer:*
${brief.responsibleAiDisclaimer}
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Counseling_Prep_Sheet_${brief.studentId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="preview-guru-triage page-standard-container">
      {/* 1. Header & Ringkasan Penting */}
      <TriageMetricCards
        totalStudents={students.length}
        redCount={redCount}
        yellowCount={yellowCount}
        greenCount={greenCount}
      />

      {/* 2. Pekerjaan Utama: Filter & Grid Siswa Triase */}
      <TriageFilterSearch
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
        totalStudents={students.length}
        redCount={redCount}
        yellowCount={yellowCount}
        greenCount={greenCount}
      />

      <TriageStudentGrid
        students={filteredStudents}
        onOpenStudent={handleOpenStudent}
      />

      {/* 3. Informasi Tambahan: Pipeline & Diagnostik AI (Collapsible) */}
      <LangflowStatusBar onOpenFlowModal={() => setShowFlowModal(true)} />

      <CounselingBriefModal
        selectedStudent={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        loadingAnalysis={loadingAnalysis}
        analysisResult={analysisResult}
        copiedQuestionIdx={copiedQuestionIdx}
        onCopyQuestion={copyQuestion}
        onDownloadMarkdown={downloadMarkdown}
      />
    </div>
  );
}
