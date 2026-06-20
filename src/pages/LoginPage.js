// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

const API_URL = 'http://31.97.228.17:5101/api/auth/login';

export function LoginPage() {
  const navigate = useNavigate();

  const [email,    setEmail]   = useState('');
  const [pass,     setPass]    = useState('');
  const [showP,    setShowP]   = useState(false);
  const [err,      setErr]     = useState('');
  const [loading,  setLoading] = useState(false);

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');

    if (!email || !pass) {
      setErr('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password: pass }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErr(json.message || 'Invalid credentials');
        setLoading(false);
        return;
      }

      /* ── Persist auth data ── */
      const { token, _id, name, email: userEmail, role } = json.data;
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('Admin',  JSON.stringify({ _id, name, email: userEmail, role }));

      console.log(token)

      navigate('/dashboard', { replace: true });
    } catch (error) {
      setErr('Network error — please try again.');
      setLoading(false);
    }
  };

  /* ── Shared input style helpers ── */
  const inputBase = {
    paddingLeft: 34,
    background:  'rgba(255,255,255,0.07)',
    border:      '1.5px solid rgba(255,255,255,0.12)',
    color:       '#fff',
    height:      46,
  };
  const onFocus = (e) => {
    e.target.style.borderColor = 'rgba(14,165,233,0.6)';
    e.target.style.background  = 'rgba(255,255,255,0.10)';
    e.target.style.outline     = 'none';
  };
  const onBlur = (e) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.12)';
    e.target.style.background  = 'rgba(255,255,255,0.07)';
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#060d1f 0%,#0a1628 45%,#0d1f3c 100%)' }}
    >
      {/* ── Keyframes ── */}
      <style>{`
        @keyframes ringRotate {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes spin2 { to { transform: rotate(360deg); } }
        .animate-spin2 { animation: spin2 0.7s linear infinite; }
        .ring {
          position: absolute; top: 50%; left: 50%;
          border-radius: 50%; transform: translate(-50%,-50%);
        }
        .login-input {
          width: 100%; border-radius: 10px;
          font-size: 14px; transition: border-color 0.2s, background 0.2s;
        }
        .login-input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>

      {/* ── Decorative rings ── */}
      <div className="ring" style={{ width: 650, height: 650, border: '1px dashed rgba(14,165,233,0.10)', animation: 'ringRotate 50s linear infinite' }} />
      <div className="ring" style={{ width: 440, height: 440, border: '1px solid rgba(255,255,255,0.04)', animation: 'ringRotate 30s linear infinite reverse' }} />

      {/* ── Glow blobs ── */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(14,165,233,0.08) 0%,transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(30,58,138,0.12) 0%,transparent 70%)' }} />

      {/* ── Card ── */}
      <div
        className="relative z-10 w-full max-w-[400px]"
        style={{
          background:     'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          border:         '1px solid rgba(255,255,255,0.10)',
          borderRadius:   24,
          padding:        '40px 36px',
          boxShadow:      '0 32px 80px rgba(0,0,0,0.4)',
        }}
      >
        {/* ── Logo ── */}
        <div className="flex flex-col items-center mb-9">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg,#1e3a8a,#0ea5e9)', boxShadow: '0 8px 24px rgba(37,99,235,0.38)' }}
          >
            <FlaskConical size={28} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            SmartLab<span className="text-sky-400">Tech</span>
          </div>
          <div className="text-[11px] text-white/35 uppercase tracking-[0.18em] mt-1.5">Admin Portal</div>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
              Email Address
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.30)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@smartlabtech.com"
                className="login-input"
                style={inputBase}
                onFocus={onFocus}
                onBlur={onBlur}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
              Password
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.30)' }} />
              <input
                type={showP ? 'text' : 'password'}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••••"
                className="login-input"
                style={{ ...inputBase, paddingLeft: 34, paddingRight: 42 }}
                onFocus={onFocus}
                onBlur={onBlur}
                required
              />
              <button
                type="button"
                onClick={() => setShowP((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: 'rgba(255,255,255,0.40)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.70)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.40)')}
              >
                {showP ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error banner */}
          {err && (
            <div
              className="flex items-center gap-2 text-[13px] text-red-300 px-3 py-2.5 rounded-xl"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}
            >
              <AlertCircle size={14} className="shrink-0" />
              {err}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-white mt-1 transition-all"
            style={{
              background:    loading ? 'rgba(14,165,233,0.5)' : 'linear-gradient(135deg,#1e3a8a,#0ea5e9)',
              boxShadow:     loading ? 'none' : '0 4px 20px rgba(14,165,233,0.30)',
              cursor:        loading ? 'not-allowed' : 'pointer',
              border:        'none',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = '0.92'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            {loading ? (
              <>
                <span
                  className="animate-spin2"
                  style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.30)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }}
                />
                Signing in…
              </>
            ) : (
              <>
                <ArrowRight size={15} />
                Sign In to Admin
              </>
            )}
          </button>

        </form>

        {/* ── Hint ── */}
        <p className="text-center mt-6 text-[11px]" style={{ color: 'rgba(255,255,255,0.20)' }}>
          Protected admin area · SmartLabTech
        </p>
      </div>
    </div>
  );
}

export default LoginPage;