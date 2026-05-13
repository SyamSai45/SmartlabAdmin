// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showP, setShowP] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!email || !pass) { setErr('Please fill in all fields.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900)); // simulate network
    const ok = login(email, pass);
    // Store token in sessionStorage
    sessionStorage.setItem("token", "1234567890abcdef");
    if (ok) {
      navigate('/dashboard', { replace: true });
    } else {
      setErr('Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#060d1f 0%,#0a1628 45%,#0d1f3c 100%)' }}
    >
      {/* ── Decorative rings ── */}
      <style>{`
        @keyframes ringRotate { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        .ring { position:absolute; top:50%; left:50%; border-radius:50%; transform:translate(-50%,-50%); }
      `}</style>
      <div className="ring" style={{ width: 650, height: 650, border: '1px dashed rgba(14,165,233,0.1)', animation: 'ringRotate 50s linear infinite' }} />
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
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 24,
          padding: '40px 36px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-9">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg,#1e3a8a,#0ea5e9)', boxShadow: '0 8px 24px rgba(37,99,235,0.38)' }}
          >
            <FlaskConical size={28} className="text-white" />
          </div>
          <div className="font-display text-2xl font-bold text-white tracking-tight">
            SmartLab<span className="text-sky-400">Tech</span>
          </div>
          <div className="text-[11px] text-white/35 uppercase tracking-[0.18em] mt-1.5">Admin Portal</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <label className="form-label" style={{ color: 'rgba(255,255,255,0.45)' }}>Email Address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                className="input"
                style={{ paddingLeft: 34, background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#fff', height: 46 }}
                onFocus={e => { e.target.style.borderColor = 'rgba(14,165,233,0.6)'; e.target.style.background = 'rgba(255,255,255,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="form-label" style={{ color: 'rgba(255,255,255,0.45)' }}>Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type={showP ? 'text' : 'password'}
                value={pass}
                onChange={e => setPass(e.target.value)}
                placeholder="admin@123"
                className="input"
                style={{ paddingLeft: 34, paddingRight: 42, background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#fff', height: 46 }}
                onFocus={e => { e.target.style.borderColor = 'rgba(14,165,233,0.6)'; e.target.style.background = 'rgba(255,255,255,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
                required
              />
              <button
                type="button"
                onClick={() => setShowP(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors border-0 bg-transparent cursor-pointer"
              >
                {showP ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {err && (
            <div
              className="flex items-center gap-2 text-[13px] text-red-300 px-3 py-2.5 rounded-xl"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}
            >
              <AlertCircle size={14} className="flex-shrink-0" />
              {err}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full justify-center h-12 text-sm mt-1"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin2" />
            ) : (
              <><ArrowRight size={15} /> Sign In to Admin</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}