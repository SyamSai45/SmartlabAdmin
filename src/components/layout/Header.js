// src/components/layout/Header.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, Bell, RefreshCw, X, Maximize2, Minimize2,
  User, LogOut, Settings, ChevronDown, CheckCircle,
  Mail, FileText, Wrench, Loader2,
} from 'lucide-react';
import { useAppData } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

/* ── Constants ── */
const BASE = 'http://31.97.228.17:5101/api';
const getToken = () => sessionStorage.getItem('token');

const PAGE_TITLES = {
  '/dashboard':                  'Dashboard',
  '/dashboard/contact-forms':    'Contact Forms',
  '/dashboard/quote-requests':   'Quote Requests',
  '/dashboard/categories':       'Category Management',
  '/dashboard/products':         'Product Management',
  '/dashboard/service-requests': 'Service Requests',
  '/dashboard/notifications':    'Notifications',
  '/dashboard/resources':        'Resources Management',
  '/dashboard/popup':            'Popup Manager',
};

const typeIcons = {
  contact: { icon: Mail,         bg: 'bg-emerald-100', color: 'text-emerald-600' },
  quote:   { icon: FileText,     bg: 'bg-purple-100',  color: 'text-purple-600'  },
  service: { icon: Wrench,       bg: 'bg-blue-100',    color: 'text-blue-600'    },
  order:   { icon: CheckCircle,  bg: 'bg-amber-100',   color: 'text-amber-600'   },
  system:  { icon: Bell,         bg: 'bg-slate-100',   color: 'text-slate-600'   },
};

const priorityColors = {
  low:    'bg-gray-100   text-gray-600',
  medium: 'bg-blue-100   text-blue-600',
  high:   'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100    text-red-600',
};

/* ════════════════════════════════════════════
   HEADER
════════════════════════════════════════════ */
function Header({ onMenuClick }) {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { refreshData }    = useAppData();
  const { logout }         = useAuth();

  /* ── UI state ── */
  const [showNotif,         setShowNotif]         = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [isRefreshing,      setIsRefreshing]      = useState(false);
  const [isFullscreen,      setIsFullscreen]      = useState(false);

  /* ── Admin profile state (from /api/auth/me) ── */
  const [adminProfile,      setAdminProfile]      = useState(null);
  const [profileLoading,    setProfileLoading]    = useState(false);

  /* ── Notifications state ── */
  const [notifications,  setNotifications]  = useState([]);
  const [unreadCount,    setUnreadCount]    = useState(0);

  const title = PAGE_TITLES[location.pathname] || 'Admin Dashboard';

  /* ─────────────────────────────────────────
     Fetch admin profile from /api/auth/me
  ───────────────────────────────────────── */
  const fetchAdminProfile = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setProfileLoading(true);
    try {
      const res  = await fetch(`${BASE}/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAdminProfile(data.data);
        // Keep sessionStorage in sync so other pages can read it
        sessionStorage.setItem('user', JSON.stringify(data.data));
      }
    } catch (err) {
      console.error('Error fetching admin profile:', err);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  /* ─────────────────────────────────────────
     Notifications
  ───────────────────────────────────────── */
  const fetchNotifications = useCallback(async () => {
    try {
      const res  = await fetch(`${BASE}/notifications?limit=10`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res  = await fetch(`${BASE}/notifications/unread/count`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) setUnreadCount(data.data.unreadCount);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  }, []);

  const markAsRead = async (id) => {
    try {
      await fetch(`${BASE}/notifications/${id}/read`, {
        method:  'PUT',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchNotifications();
      fetchUnreadCount();
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${BASE}/notifications/read-all`, {
        method:  'PUT',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchNotifications();
      fetchUnreadCount();
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const getNotificationLink = (n) => {
    if (n.referenceModel === 'Contact')     return '/dashboard/contacts';
    if (n.referenceModel === 'Quote')       return '/dashboard/quotes';
    if (n.referenceModel === 'ServiceForm') return '/dashboard/service-requests';
    return '#';
  };

  /* ─────────────────────────────────────────
     Mount effects
  ───────────────────────────────────────── */
  useEffect(() => {
    fetchAdminProfile();
    fetchNotifications();
    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 30_000);
    return () => clearInterval(interval);
  }, [fetchAdminProfile, fetchNotifications, fetchUnreadCount]);

  /* Refetch profile whenever the dropdown opens */
  useEffect(() => {
    if (showAdminDropdown) fetchAdminProfile();
  }, [showAdminDropdown, fetchAdminProfile]);

  /* Fullscreen listener */
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  /* Click-outside to close dropdowns */
  useEffect(() => {
    const handler = (e) => {
      if (showAdminDropdown && !e.target.closest('.admin-dropdown')) setShowAdminDropdown(false);
      if (showNotif         && !e.target.closest('.notif-dropdown')) setShowNotif(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showAdminDropdown, showNotif]);

  /* ─────────────────────────────────────────
     Actions
  ───────────────────────────────────────── */
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchNotifications(), fetchAdminProfile(), refreshData?.()]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    sessionStorage.clear();
    navigate('/');
  };

  const handleSettings = () => {
    navigate('/dashboard/settings');
    setShowAdminDropdown(false);
  };

  const handleNotificationsPage = () => {
    navigate('/dashboard/notifications');
    setShowAdminDropdown(false);
  };

  /* Derived display values — prefer live API data, fall back to sessionStorage */
  const storedUser  = (() => { try { return JSON.parse(sessionStorage.getItem('user') || '{}'); } catch { return {}; } })();
  const profile     = adminProfile || storedUser;
  const displayName = profile?.name  || 'Admin';
  const displayRole = profile?.role  || 'Administrator';
  const displayEmail= profile?.email || 'admin@smartlabtech.com';
  const initials    = displayName.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  const recentNotifs = notifications.slice(0, 5);

  /* ─────────────────────────────────────────
     Render
  ───────────────────────────────────────── */
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-6 h-16 bg-white border-b border-slate-200 shadow-sm flex-shrink-0">

      {/* Left: menu + title */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          className="btn-icon lg:hidden hover:bg-slate-100 rounded-lg p-2 transition-colors"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu size={20} className="text-slate-600" />
        </button>
        <h1 className="font-display text-lg sm:text-xl font-bold text-slate-900 truncate">
          {title}
        </h1>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1 sm:gap-2">

        {/* Refresh */}
        <button
          className="hover:bg-slate-100 rounded-lg p-2 transition-colors"
          onClick={handleRefresh}
          disabled={isRefreshing}
          aria-label="Refresh data"
        >
          <RefreshCw size={17} className={`text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>

        {/* Fullscreen */}
        <button
          className="hover:bg-slate-100 rounded-lg p-2 transition-colors hidden sm:flex"
          onClick={toggleFullscreen}
          aria-label="Toggle fullscreen"
        >
          {isFullscreen
            ? <Minimize2 size={17} className="text-slate-500" />
            : <Maximize2 size={17} className="text-slate-500" />}
        </button>

        {/* ── Notifications ── */}
        <div className="relative notif-dropdown">
          <button
            className="hover:bg-slate-100 rounded-lg p-2 transition-colors relative"
            onClick={() => setShowNotif((v) => !v)}
            aria-label="Notifications"
          >
            <Bell size={18} className="text-slate-500" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <>
              <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setShowNotif(false)} />
              <div className="absolute right-0 top-full mt-2 w-[90vw] sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden">

                {/* Notif header */}
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-blue-600" />
                    <span className="text-sm font-semibold text-slate-800">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-700">
                        Mark all read
                      </button>
                    )}
                    <button onClick={() => setShowNotif(false)} className="lg:hidden text-slate-400 hover:text-slate-600">
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Notif list */}
                <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
                  {recentNotifs.length > 0 ? (
                    recentNotifs.map((notif) => {
                      const info = typeIcons[notif.type] || typeIcons.system;
                      const Icon = info.icon;
                      return (
                        <a
                          key={notif._id}
                          href={getNotificationLink(notif)}
                          onClick={() => { if (!notif.isRead) markAsRead(notif._id); setShowNotif(false); }}
                          className={`block px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                        >
                          <div className="flex items-start gap-2">
                            <div className={`w-8 h-8 rounded-lg ${info.bg} flex items-center justify-center flex-shrink-0`}>
                              <Icon size={14} className={info.color} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-semibold text-slate-700 truncate">{notif.title}</p>
                                {!notif.isRead && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] text-slate-400">
                                  {format(new Date(notif.createdAt), 'MMM dd, h:mm a')}
                                </span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${priorityColors[notif.priority]}`}>
                                  {notif.priority}
                                </span>
                              </div>
                            </div>
                          </div>
                        </a>
                      );
                    })
                  ) : (
                    <div className="px-4 py-10 text-center">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                        <Bell size={24} className="text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-500">No new notifications</p>
                      <p className="text-xs text-slate-400 mt-1">All caught up!</p>
                    </div>
                  )}
                </div>

                <div className="px-4 py-2 border-t border-slate-100 bg-slate-50">
                  <button
                    onClick={() => { setShowNotif(false); navigate('/dashboard/notifications'); }}
                    className="w-full text-center text-xs text-blue-600 hover:text-blue-700 font-medium py-1"
                  >
                    View all notifications →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Admin dropdown ── */}
        <div className="relative admin-dropdown">
          <button
            className="flex items-center gap-2 hover:bg-slate-100 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 transition-colors"
            onClick={() => setShowAdminDropdown((v) => !v)}
            aria-label="Admin menu"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shrink-0">
              {profileLoading
                ? <Loader2 size={14} className="text-white animate-spin" />
                : <span className="text-white text-xs font-bold">{initials}</span>
              }
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-700 leading-tight">{displayName.split(' ')[0]}</p>
              <p className="text-xs text-slate-400 leading-tight capitalize">{displayRole}</p>
            </div>
            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-200 hidden sm:block ${showAdminDropdown ? 'rotate-180' : ''}`}
            />
          </button>

          {showAdminDropdown && (
            <>
              <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setShowAdminDropdown(false)} />
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden">

                {/* Profile card */}
                <div className="px-4 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                  {profileLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Loader2 size={20} className="text-blue-500 animate-spin" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                        <div className="h-2.5 w-32 bg-slate-200 rounded animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shrink-0">
                        <span className="text-white text-base font-bold">{initials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{displayName}</p>
                        <p className="text-xs text-slate-500 truncate">{displayEmail}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-semibold rounded-full capitalize">
                          {displayRole}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Menu items */}
                <div className="py-2">
                  <button
                    onClick={handleNotificationsPage}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Bell size={16} className="text-slate-400" />
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={handleSettings}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Settings size={16} className="text-slate-400" />
                    <span>Settings</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Live indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">Live</span>
        </div>

      </div>
    </header>
  );
}

export default Header;