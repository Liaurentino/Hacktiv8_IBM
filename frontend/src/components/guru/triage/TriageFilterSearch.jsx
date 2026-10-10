import React from 'react';
import { Search } from 'lucide-react';

export default function TriageFilterSearch({
  filter,
  setFilter,
  search,
  setSearch,
  totalStudents,
  redCount,
  yellowCount,
  greenCount
}) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--rounded-md)',
        padding: '16px 20px',
        border: '1px solid var(--colors-hairline-soft)',
        marginBottom: '28px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}
    >
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setFilter('ALL')}
          className={`pill-tab ${filter === 'ALL' ? 'pill-tab-active' : ''}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: filter === 'ALL' ? 700 : 600,
            cursor: 'pointer',
            border: filter === 'ALL' ? '1.5px solid #5243C2' : '1.5px solid #E2DFF6',
            background: filter === 'ALL' ? '#5243C2' : '#F4F1FE',
            color: filter === 'ALL' ? '#FFFFFF' : '#2F3366',
            boxShadow: filter === 'ALL' ? '0 2px 8px rgba(82, 67, 194, 0.28)' : 'none',
            transition: 'all 0.15s ease',
            outline: 'none'
          }}
        >
          Semua Siswa ({totalStudents})
        </button>
        <button
          type="button"
          onClick={() => setFilter('MERAH')}
          className={`pill-tab pill-tab-red ${filter === 'MERAH' ? 'pill-tab-active' : ''}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: filter === 'MERAH' ? 700 : 600,
            cursor: 'pointer',
            border: filter === 'MERAH' ? '1.5px solid #DC2626' : '1.5px solid #FECACA',
            background: filter === 'MERAH' ? '#DC2626' : '#FEF2F2',
            color: filter === 'MERAH' ? '#FFFFFF' : '#991B1B',
            boxShadow: filter === 'MERAH' ? '0 2px 8px rgba(220, 38, 38, 0.28)' : 'none',
            transition: 'all 0.15s ease',
            outline: 'none'
          }}
        >
          🔴 Jalur Merah ({redCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('KUNING')}
          className={`pill-tab pill-tab-yellow ${filter === 'KUNING' ? 'pill-tab-active' : ''}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: filter === 'KUNING' ? 700 : 600,
            cursor: 'pointer',
            border: filter === 'KUNING' ? '1.5px solid #D97706' : '1.5px solid #FDE68A',
            background: filter === 'KUNING' ? '#D97706' : '#FEF3C7',
            color: filter === 'KUNING' ? '#FFFFFF' : '#78350F',
            boxShadow: filter === 'KUNING' ? '0 2px 8px rgba(217, 119, 6, 0.28)' : 'none',
            transition: 'all 0.15s ease',
            outline: 'none'
          }}
        >
          🟡 Jalur Kuning ({yellowCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('HIJAU')}
          className={`pill-tab pill-tab-green ${filter === 'HIJAU' ? 'pill-tab-active' : ''}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: filter === 'HIJAU' ? 700 : 600,
            cursor: 'pointer',
            border: filter === 'HIJAU' ? '1.5px solid #16A34A' : '1.5px solid #BBF7D0',
            background: filter === 'HIJAU' ? '#16A34A' : '#F0FDF4',
            color: filter === 'HIJAU' ? '#FFFFFF' : '#166534',
            boxShadow: filter === 'HIJAU' ? '0 2px 8px rgba(22, 163, 74, 0.28)' : 'none',
            transition: 'all 0.15s ease',
            outline: 'none'
          }}
        >
          🟢 Jalur Hijau ({greenCount})
        </button>
      </div>

      <div style={{ position: 'relative', width: '280px' }}>
        <Search size={15} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--colors-steel)' }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari ID, minat, atau teks refleksi..."
          className="text-input"
          style={{ paddingLeft: '36px', height: '40px', fontSize: '13.5px' }}
        />
      </div>
    </div>
  );
}
