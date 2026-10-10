import React from 'react';
import { Search, Calendar, FileText } from 'lucide-react';
import { getTriageBadgeInfo } from '../../../utils/triageHelpers';

export default function FlagTable({
  flags,
  filteredFlags,
  search,
  setSearch,
  handleUpdateStatus,
  setScheduleTarget,
  setScheduleTopic,
  setInterventionTarget,
  setInterventionNote
}) {
  return (
    <div className="card" style={{ padding: '0px', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text)' }}>
            Daftar Matriks Deteksi Dini &amp; Flag Siswa
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Menampilkan {filteredFlags.length} dari total {flags.length} sinyal terdeteksi
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%', maxWidth: '280px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari siswa atau pemicu..."
              style={{ fontSize: '12.5px', padding: '6px 12px 6px 30px', borderRadius: '6px', border: '1.5px solid var(--border)', width: '100%', background: '#FAF9FE' }}
            />
          </div>
        </div>
      </div>

      <div className="table-scroll-hint" style={{ padding: '8px 16px 0' }}>
        <span>👉 Geser tabel ke samping untuk melihat analisis deteksi AI &amp; aksi</span>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th style={{ width: '36px', textAlign: 'center' }}>#</th>
              <th className="sticky-col-left" style={{ minWidth: '160px' }}>Siswa &amp; Identitas</th>
              <th>Tingkat Flag</th>
              <th style={{ minWidth: '240px' }}>Pemicu &amp; Analisis Deteksi AI</th>
              <th>Kategori</th>
              <th>Sumber &amp; Tanggal</th>
              <th>Status Tindak Lanjut</th>
              <th style={{ textAlign: 'center', minWidth: '160px' }}>Aksi Guru BK</th>
            </tr>
          </thead>
          <tbody>
            {filteredFlags.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                  <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#166534', marginBottom: '4px' }}>
                    ✅ Tidak Ada Sinyal Flag Intervensi Aktif
                  </div>
                  <div style={{ fontSize: '12px' }}>
                    Semua siswa saat ini berada dalam kondisi aman dan capaian stabil.
                  </div>
                </td>
              </tr>
            ) : filteredFlags.map((flg, idx) => (
              <tr key={flg.id}>
                <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {idx + 1}
                </td>
                <td className="sticky-col-left">
                  <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '13px' }}>
                    {flg.student_name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    NIS: {flg.nisn}
                  </div>
                </td>
                <td>
                  {(() => {
                    const badge = getTriageBadgeInfo(flg.level);
                    return (
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 800,
                        background: badge.bg,
                        color: badge.color
                      }}>
                        {flg.level.toUpperCase()}
                      </span>
                    );
                  })()}
                </td>
                <td style={{ fontSize: '12.5px', color: 'var(--text)', lineHeight: 1.5 }}>
                  {flg.trigger}
                </td>
                <td>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)' }}>
                    {flg.category}
                  </span>
                </td>
                <td style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  <div>{flg.source}</div>
                  <div>{flg.date}</div>
                </td>
                <td>
                  <span style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: flg.status === 'resolved' ? '#166534' : flg.status === 'in_progress' ? '#1E40AF' : '#DC2626'
                  }}>
                    {flg.status === 'resolved' ? '✓ Sudah Ditangani' : flg.status === 'in_progress' ? '⏳ Sedang Proses' : '⚠️ Belum Ditangani'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {flg.status !== 'resolved' ? (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(flg.id, 'resolved', 'Konseling Selesai')}
                        style={{
                          background: '#16A34A',
                          color: '#FFF',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Tandai Selesai
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#166534', fontWeight: 700 }}>
                        Selesai
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setScheduleTarget(flg);
                        setScheduleTopic(`Evaluasi ${flg.category} - ${flg.trigger}`);
                      }}
                      style={{
                        background: '#EDE9FE',
                        color: '#5B21B6',
                        border: '1px solid #DDD6FE',
                        padding: '5px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <Calendar size={11} /> Jadwal Temu
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setInterventionTarget(flg);
                        setInterventionNote('');
                      }}
                      style={{
                        background: '#FAF9FE',
                        color: '#475569',
                        border: '1px solid #CBD5E1',
                        padding: '5px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <FileText size={11} /> Catat Aksi
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
