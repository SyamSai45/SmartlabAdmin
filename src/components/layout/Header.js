// src/components/layout/Header.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, RefreshCw } from 'lucide-react';
import { useAppData } from '../../context/AppContext';

const PAGE_TITLES = {
  '/dashboard':  'Dashboard',
  '/contacts':   'Contact Form Submissions',
  '/quotes':     'Quote Requests',
  '/categories': 'Category Management',
  '/products':   'Product Management',
};

export function Header({ onMenuClick }) {
  const location  = useLocation();
  const { contacts } = useAppData();
  const [showNotif, setShowNotif] = useState(false);
  const title     = PAGE_TITLES[location.pathname] || 'Admin';
  const unread    = contacts.filter(c => !c.read).length;

  return (
    <header className="flex items-center gap-4 px-6 h-16 bg-white border-b border-slate-200 shadow-[0_1px_4px_rgba(10,22,40,0.06)] flex-shrink-0">
      {/* Mobile hamburger */}
      <button className="btn-icon lg:hidden" onClick={onMenuClick}>
        <Menu size={20} className="text-slate-600" />
      </button>

      {/* Title */}
      <h1 className="font-display text-xl font-bold text-slate-900 flex-1">{title}</h1>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button className="btn-icon" title="Refresh">
          <RefreshCw size={17} className="text-slate-500" />
        </button>

        {/* Notification bell */}
        <div className="relative">
          <button className="btn-icon relative" onClick={() => setShowNotif(v => !v)}>
            <Bell size={18} className="text-slate-500" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotif && (
            <div
              className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-[0_12px_32px_rgba(10,22,40,0.14)] z-50 overflow-hidden"
              onMouseLeave={() => setShowNotif(false)}
            >
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">Notifications</span>
                {unread > 0 && <span className="badge badge-blue">{unread} new</span>}
              </div>
              {contacts.filter(c => !c.read).slice(0, 4).map(c => (
                <div key={c.id} className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <p className="text-xs font-semibold text-slate-700 truncate">{c.name}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{c.message.slice(0, 60)}…</p>
                </div>
              ))}
              {unread === 0 && (
                <div className="px-4 py-6 text-center text-sm text-slate-400">All caught up!</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Live indicator */}
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50">
        <span className="dot dot-green animate-pulse2" />
        <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">Live</span>
      </div>
    </header>
  );
}