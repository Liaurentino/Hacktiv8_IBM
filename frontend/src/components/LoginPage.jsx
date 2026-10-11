import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function LoginPage({ onLoginSuccess, onBackToLanding }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await api.login(email.trim(), password);
      if (res.status === 'success') {
        onLoginSuccess(res.user, res.token);
      } else {
        setErrorMsg(res.message || 'Login gagal. Periksa email/NISN dan password.');
      }
    } catch (err) {
      setErrorMsg('Layanan sedang mengalami kendala. Silakan coba kembali nanti.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = (e, p) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.8)',
        padding: '36px 32px',
        position: 'relative'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--brand)',
            color: '#FFFFFF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            marginBottom: '12px',
            boxShadow: '0 8px 16px -4px rgba(67, 56, 202, 0.3)'
          }}>
            🌙
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--slate-900)', margin: 0, letterSpacing: '-0.02em' }}>
            Masuk ke LUNA LMS
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--slate-500)', marginTop: '4px', marginBottom: 0 }}>
            Sistem Informasi BK &amp; Portal Akademik Siswa
          </p>
        </div>

        {errorMsg && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#991B1B',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '12.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>
              Email Sekolah atau NISN
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--slate-400)' }} />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@sekolah.sch.id atau NISN"
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13.5px',
                  background: '#FFFFFF',
                  outline: 'none',
                  transition: 'border-color 0.15s'
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--slate-700)' }}>
                Password
              </label>
              <span style={{ fontSize: '11.5px', color: 'var(--brand)', cursor: 'pointer' }} onClick={() => alert('Silakan hubungi Guru BK atau Admin Sekolah untuk reset password akun Anda.')}>
                Lupa password?
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--slate-400)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13.5px',
                  background: '#FFFFFF',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              background: '#22C55E',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '24px',
              padding: '12px 20px',
              fontSize: '14.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(34, 197, 94, 0.35)',
              transition: 'all 0.15s'
            }}
          >
            {loading ? 'Memverifikasi...' : 'Sign in'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Info Akun Terdaftar */}
        <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
          <p style={{ fontSize: '12px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
            Akun siswa dan pendidik didaftarkan secara resmi oleh pihak sekolah. Hubungi <strong>Guru BK</strong> untuk informasi akun Anda.
          </p>
        </div>

        {onBackToLanding && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button
              type="button"
              onClick={onBackToLanding}
              style={{ background: 'none', border: 'none', color: 'var(--slate-500)', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              &larr; Kembali ke Beranda
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
