// src/components/layout/Sidebar.js
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, FileText,
  FolderOpen, Package, FlaskConical, LogOut, User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppContext';

const NAV_ITEMS = [
  { to: '/dashboard',   label: 'Dashboard',      Icon: LayoutDashboard },
  { to: '/contacts',    label: 'Contact Forms',   Icon: MessageSquare,   badgeKey: 'contacts'  },
  { to: '/quotes',      label: 'Quote Requests',  Icon: FileText,        badgeKey: 'quotes'    },
  { to: '/categories',  label: 'Categories',      Icon: FolderOpen      },
  { to: '/products',    label: 'Products',        Icon: Package         },
];

export function Sidebar({ open, onClose }) {
  const { logout, user } = useAuth();
  const { contacts, quotes } = useAppData();
  const location = useLocation();

  const pendingContacts = contacts.filter(c => c.status === 'pending').length;
  const pendingQuotes   = quotes.filter(q => q.status === 'pending').length;

  const getBadge = (key) => {
    if (key === 'contacts') return pendingContacts;
    if (key === 'quotes')   return pendingQuotes;
    return 0;
  };

  return (
    <aside
      className={`sidebar ${open ? 'open' : ''} flex flex-col h-screen sticky top-0 flex-shrink-0`}
      style={{
        width: 260,
        background: 'linear-gradient(180deg, #060d1f 0%, #0f2356 40%, #1a3a7a 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* ── Logo ── */}
      <div className="px-5 py-5 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}
        >
          <FlaskConical size={20} className="text-white" />
        </div>
        <div>
          <div className="font-display text-lg font-bold text-white tracking-tight">
            SmartLab<span className="text-sky-400">Tech</span>
          </div>
          <div className="text-[10px] text-white/30 uppercase tracking-[0.14em] mt-0.5">Admin Panel</div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="text-[10px] text-white/25 uppercase tracking-widest px-2 mb-2 mt-1">Navigation</div>
        {NAV_ITEMS.map(({ to, label, Icon, badgeKey }) => {
          const badge = badgeKey ? getBadge(badgeKey) : 0;
          const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
          return (
            <NavLink
              key={to}
              to={to}
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={17} />
              <span className="flex-1">{label}</span>
              {badge > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">
                  {badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── User card ── */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)' }}
          >
            <User size={15} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-[13px] font-semibold truncate">{user?.name || 'Admin'}</div>
            <div className="text-white/40 text-[11px] truncate">{user?.email}</div>
          </div>
          <button
            onClick={logout}
            className="text-white/30 hover:text-red-400 transition-colors p-1"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}