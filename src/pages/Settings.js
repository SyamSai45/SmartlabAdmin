// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Lock, Shield, Save, Loader2, AlertCircle,
  CheckCircle, Eye, EyeOff, Key, Bell, Monitor, Globe
} from 'lucide-react';

/* ── API base ── */
const BASE = 'http://31.97.228.17:5101/api/auth';
const getToken = () => sessionStorage.getItem('token');

/* ── Fonts ── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  `}</style>
);

/* ── Auth hook ── */
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const token = getToken();
      if (!token) { setLoading(false); return; }
      const res  = await fetch(`${BASE}/me`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success && data.data) setUser(data.data);
    } catch (err) {
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUserProfile(); }, []);

  const updateUser = (partial) => setUser((prev) => ({ ...prev, ...partial }));

  return { user, loading, updateUser, refetchUser: fetchUserProfile };
};

/* ── Reveal wrapper ── */
function Reveal({ children, delay = 0, className = '' }) {
  const [visible, setVisible] = useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ── Tab button ── */
const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all relative ${
      isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
    }`}
  >
    <Icon size={16} />
    {label}
    {isActive && (
      <motion.div
        layoutId="activeTab"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-sky-500"
        initial={false}
        transition={{ duration: 0.3 }}
      />
    )}
  </button>
);

/* ── Input field ── */
const InputField = ({
  icon: Icon, label, type = 'text', value, onChange,
  placeholder, error, required = false,
  showPasswordToggle = false, onTogglePassword, showPassword,
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
      <Icon size={14} /> {label}
    </label>
    <div className="relative">
      <input
        type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2.5 rounded-xl border ${
          error ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
        } focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
        placeholder={placeholder}
        required={required}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

/* ── Alert banner ── */
const MessageAlert = ({ type, text, onClose }) => {
  if (!text) return null;
  return (
    <div className={`mb-6 p-4 rounded-xl flex items-center justify-between ${
      type === 'success'
        ? 'bg-green-50 border border-green-200 text-green-700'
        : 'bg-red-50 border border-red-200 text-red-700'
    }`}>
      <div className="flex items-center gap-2">
        {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
        <span className="text-sm">{text}</span>
      </div>
      <button onClick={onClose} className="opacity-50 hover:opacity-100">
        <AlertCircle size={14} />
      </button>
    </div>
  );
};

/* ── Profile form ── */
const ProfileForm = ({ formData, onChange, onSubmit, loading }) => (
  <form onSubmit={onSubmit} className="space-y-5">
    <InputField
      icon={User} label="Full Name"
      value={formData.name}
      onChange={(e) => onChange('name', e.target.value)}
      placeholder="Enter your full name" required
    />
    <InputField
      icon={Mail} label="Email Address" type="email"
      value={formData.email}
      onChange={(e) => onChange('email', e.target.value)}
      placeholder="Enter your email address" required
    />
    <div className="flex justify-end pt-4">
      <button
        type="submit" disabled={loading}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-sky-600 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  </form>
);

/* ── Password form ── */
const PasswordForm = ({ formData, onChange, onSubmit, loading }) => {
  const [showCurrent, setShowCurrent]   = useState(false);
  const [showNew,     setShowNew]       = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);

  const passwordsMatch = formData.newPassword === formData.confirmPassword;
  const isValid =
    formData.currentPassword.length >= 1 &&
    formData.newPassword.length >= 6 &&
    passwordsMatch;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Current password */}
      <InputField
        icon={Lock} label="Current Password"
        value={formData.currentPassword}
        onChange={(e) => onChange('currentPassword', e.target.value)}
        placeholder="Enter your current password"
        required
        showPasswordToggle onTogglePassword={() => setShowCurrent((v) => !v)} showPassword={showCurrent}
      />

      {/* New password */}
      <InputField
        icon={Lock} label="New Password"
        value={formData.newPassword}
        onChange={(e) => onChange('newPassword', e.target.value)}
        placeholder="Enter new password (min 6 chars)"
        required
        showPasswordToggle onTogglePassword={() => setShowNew((v) => !v)} showPassword={showNew}
      />

      {/* Confirm password */}
      <InputField
        icon={Lock} label="Confirm New Password"
        value={formData.confirmPassword}
        onChange={(e) => onChange('confirmPassword', e.target.value)}
        placeholder="Confirm your new password"
        required
        showPasswordToggle onTogglePassword={() => setShowConfirm((v) => !v)} showPassword={showConfirm}
        error={formData.confirmPassword && !passwordsMatch ? 'Passwords do not match' : ''}
      />

      {/* Match indicator */}
      {formData.newPassword && (
        <div className={`text-xs flex items-center gap-1 ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}>
          {passwordsMatch ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
          {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button
          type="submit" disabled={loading || !isValid}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Key size={16} />}
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </form>
  );
};

/* ── Preference toggle row ── */
const PreferenceItem = ({
  icon: Icon, title, description,
  defaultChecked = false, disabled = false,
  iconBg = 'bg-emerald-100', iconColor = 'text-emerald-600',
}) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
        <Icon size={16} className={iconColor} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-700">{title}</p>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
    </div>
    <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} disabled={disabled} />
      <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
        disabled ? 'bg-slate-200' : 'bg-slate-200 peer-checked:bg-blue-600'
      }`} />
    </label>
  </div>
);

/* ════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════ */
export default function Settings() {
  const { user, loading: userLoading, updateUser, refetchUser } = useAuth();

  const [activeTab,  setActiveTab]  = useState('profile');
  const [loading,    setLoading]    = useState(false);
  const [message,    setMessage]    = useState({ type: '', text: '' });

  const [profileForm,  setProfileForm]  = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });

  /* Seed profile form from fetched user */
  useEffect(() => {
    if (user) setProfileForm({ name: user.name || '', email: user.email || '' });
  }, [user]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3500);
  };

  /* ── Update profile ── */
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/update-profile`, {
        method:  'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ name: profileForm.name, email: profileForm.email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showMessage('success', 'Profile updated successfully!');
        updateUser({ name: profileForm.name, email: profileForm.email });
        refetchUser();
      } else {
        showMessage('error', data.message || 'Failed to update profile');
      }
    } catch {
      showMessage('error', 'Network error — please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Change password  →  PUT /api/auth/change-password ── */
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('error', 'New passwords do not match!');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters!');
      return;
    }

    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/change-password`, {
        method:  'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword:     passwordForm.newPassword,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showMessage('success', 'Password updated successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showMessage('error', data.message || 'Failed to update password');
      }
    } catch {
      showMessage('error', 'Network error — please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile',  label: 'Profile Settings',  icon: User },
    { id: 'password', label: 'Change Password',    icon: Key  },
  ];

  /* ── Loading skeleton ── */
  if (userLoading) {
    return (
      <>
        <FontLink />
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 size={48} className="animate-spin text-blue-600" />
        </div>
      </>
    );
  }

  return (
    <>
      <FontLink />
      <div className="max-w-6xl mx-auto">

        {/* ── Page header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-px bg-blue-600" />
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600">
              Account Settings
            </span>
          </div>
          <h1
            className="text-3xl font-bold text-slate-800"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Settings
          </h1>
          <p className="text-slate-500 mt-1">Manage your account preferences and security settings</p>
        </div>

        {/* ── Alert ── */}
        <MessageAlert
          type={message.type}
          text={message.text}
          onClose={() => setMessage({ type: '', text: '' })}
        />

        {/* ── Tabs ── */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200">
          {tabs.map((tab) => (
            <TabButton key={tab.id} {...tab} isActive={activeTab === tab.id} onClick={setActiveTab} />
          ))}
        </div>

        {/* ── Profile tab ── */}
        {activeTab === 'profile' && (
          <Reveal>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-100 shadow-lg">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <h2
                    className="text-xl font-bold text-slate-800"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Profile Information
                  </h2>
                  <p className="text-xs text-slate-400">Update your account details</p>
                </div>
              </div>
              <ProfileForm
                formData={profileForm}
                onChange={(field, value) => setProfileForm((p) => ({ ...p, [field]: value }))}
                onSubmit={handleProfileUpdate}
                loading={loading}
              />
            </div>
          </Reveal>
        )}

        {/* ── Change password tab ── */}
        {activeTab === 'password' && (
          <Reveal>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-100 shadow-lg">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Key size={20} className="text-white" />
                </div>
                <div>
                  <h2
                    className="text-xl font-bold text-slate-800"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Change Password
                  </h2>
                  <p className="text-xs text-slate-400">Update your password to keep your account secure</p>
                </div>
              </div>

              <PasswordForm
                formData={passwordForm}
                onChange={(field, value) => setPasswordForm((p) => ({ ...p, [field]: value }))}
                onSubmit={handlePasswordUpdate}
                loading={loading}
              />

              {/* Security tips */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-blue-600" />
                  <span className="text-sm font-semibold text-blue-800">Password Security Tips</span>
                </div>
                <ul className="text-xs text-blue-700 space-y-1 ml-6 list-disc">
                  <li>Use at least 8 characters with a mix of letters, numbers, and symbols</li>
                  <li>Avoid using common words or personal information</li>
                  <li>Don't reuse passwords across different accounts</li>
                  <li>Update your password regularly for better security</li>
                </ul>
              </div>
            </div>
          </Reveal>
        )}

        {/* ── Account status card ── */}
        <Reveal delay={0.2}>
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <Shield size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Account Status</p>
                  <p className="text-xs text-slate-500">
                    Logged in as{' '}
                    <span className="font-medium text-blue-600 capitalize">
                      {user?.name || user?.role || 'Admin'}
                    </span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Session active</p>
                <p className="text-xs text-slate-400 font-medium">{user?.email}</p>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </>
  );
}