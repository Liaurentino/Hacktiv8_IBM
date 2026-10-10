import React from 'react';
import { Search, RefreshCw } from 'lucide-react';

export default function MapelFilterSearchBar({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  KKM = 75,
  onRefresh
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '280px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Cari murid berdasarkan nama atau NISN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '13px'
            }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '9px 12px',
            borderRadius: '8px',
            border: '1px solid #CBD5E1',
            fontSize: '13px',
            background: '#FFFFFF',
            color: '#334155'
          }}
        >
          <option value="all">Semua Status Ketuntasan</option>
          <option value="tuntas">Hanya Tuntas KKM (≥{KKM})</option>
          <option value="remedial">Hanya Remedial (&lt;{KKM})</option>
        </select>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: '#F1F5F9',
          border: '1px solid #CBD5E1',
          borderRadius: '8px',
          padding: '8px 14px',
          fontSize: '13px',
          color: '#475569',
          cursor: 'pointer'
        }}
      >
        <RefreshCw size={15} />
        <span>Muat Ulang</span>
      </button>
    </div>
  );
}
