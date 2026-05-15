// src/components/layout/Sidebar.js
import React, { Activity, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, FileText,
  FolderOpen, Package, FlaskConical, LogOut, User,
  ChevronDown, ChevronRight, Mail, PhoneCall,
  BadgeCheck,
  FileSpreadsheet,
  ClipboardList,
  Layers3,
  PlusCircle,
  FileBadge,
  Star,
  BarChart3,
  Info,
  MonitorPlay,
  Home,
  Megaphone,
  ShieldCheck,
  Gem,
  Target,
  LayoutTemplate,
  MonitorSmartphone,
  BookOpen,
  Send,
  Clock3,
  GitBranch,
  Wrench,
  Users,
  BriefcaseBusiness,
  HelpCircle,
  Lightbulb,
  Headset,
  ActivityIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppContext';

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },

  { to: "/dashboard/categories", label: "Category", Icon: FolderOpen },

  { to: "/dashboard/brands", label: "Brands", Icon: BadgeCheck },

  {
    label: "Products",
    Icon: Package,
    isDropdown: true,
    children: [
      { to: "/dashboard/addproduct", label: "Create Product", icon: PlusCircle },
      { to: "/dashboard/products", label: "All Products", icon: Package },
    ],
  },

  {
    label: "Home Sections",
    Icon: Home,
    isDropdown: true,
    children: [
      { to: "/dashboard/home-hero", label: "Home Hero", icon: MonitorPlay },
      { to: "/dashboard/home-about", label: "Home About", icon: Info },
      { to: "/dashboard/home-counts", label: "Home Counts", icon: BarChart3 },
      { to: "/dashboard/home-reviews", label: "Home Reviews", icon: Star },
      { to: "/dashboard/home-details", label: "Home Details", icon: FileBadge },
    ],
  },

  {
    label: "About Sections",
    Icon: BookOpen,
    isDropdown: true,
    children: [
      { to: "/dashboard/about-hero", label: "About Hero", icon: MonitorSmartphone },
      { to: "/dashboard/about-overview", label: "About Overview", icon: LayoutTemplate },
      { to: "/dashboard/about-mission", label: "About Mission", icon: Target },
      { to: "/dashboard/about-values", label: "About Values", icon: Gem },
      { to: "/dashboard/about-choose", label: "Why Choose Us", icon: ShieldCheck },
      { to: "/dashboard/about-cta", label: "About CTA", icon: Megaphone },
    ],
  },

  {
    label: "Service Sections",
    Icon: BriefcaseBusiness,
    isDropdown: true,
    children: [
      { to: "/dashboard/service-hero", label: "Service Hero", icon: MonitorPlay },
      { to: "/dashboard/service-who-we-are", label: "Who We Are", icon: Users },
      { to: "/dashboard/service-services", label: "Services", icon: Wrench },
      { to: "/dashboard/service-steps", label: "Steps", icon: GitBranch },
      { to: "/dashboard/service-availability", label: "Availability", icon: Clock3 },
      { to: "/dashboard/service-request", label: "Request", icon: Send },
    ],
  },

  {
    label: "Support Sections",
    Icon: Headset,
    isDropdown: true,
    children: [
      { to: "/dashboard/support-hero", label: "Support Hero", icon: MonitorPlay },
      { to: "/dashboard/support-quick-points", label: "Quick Points", icon: Lightbulb },
      { to: "/dashboard/support-solutions", label: "Solutions", icon: ShieldCheck },
      { to: "/dashboard/support-performance", label: "Performance", icon: ActivityIcon },
      { to: "/dashboard/support-faqs", label: "FAQs", icon: HelpCircle },
      { to: "/dashboard/support-cta", label: "CTA", icon: Megaphone },
    ],
  },

  {
    label: "Contact Management",
    Icon: MessageSquare,
    isDropdown: true,
    children: [
      { to: "/dashboard/contacts", label: "Contact", icon: Mail, badgeKey: "contacts" },
      { to: "/dashboard/get-in-touch", label: "Get In Touch", icon: PhoneCall, badgeKey: "touch" },
      { to: "/dashboard/resume", label: "Resume", icon: FileText, badgeKey: "resume" },
    ],
  },
];

function Sidebar({ open, onClose }) {
  const { logout, user } = useAuth();
  const { contacts, quotes } = useAppData();
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const pendingContacts = contacts?.filter(c => c.status === 'pending').length || 0;
  const pendingQuotes = quotes?.filter(q => q.status === 'pending').length || 0;

  const getBadge = (key) => {
    if (key === 'contacts') return pendingContacts;
    if (key === 'quotes') return pendingQuotes;
    return 0;
  };

  const toggleDropdown = (label) => {
    setOpenDropdowns(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isChildActive = (children) => {
    return children?.some(child => location.pathname === child.to || location.pathname.startsWith(child.to));
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50
          flex flex-col h-screen flex-shrink-0
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
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

          {NAV_ITEMS.map((item) => {
            if (item.isDropdown) {
              const isOpen = openDropdowns[item.label];
              const hasActiveChild = isChildActive(item.children);

              return (
                <div key={item.label} className="mb-1">
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className={`
                      w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg
                      transition-all duration-200 group
                      ${hasActiveChild ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}
                    `}
                  >
                    <item.Icon size={17} />
                    <span className="flex-1 text-left text-sm">{item.label}</span>
                    {isOpen ? (
                      <ChevronDown size={14} className="transition-transform" />
                    ) : (
                      <ChevronRight size={14} className="transition-transform" />
                    )}
                  </button>

                  <div className={`
                    overflow-hidden transition-all duration-200 ease-in-out
                    ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                  `}>
                    <div className="pl-4 mt-1 space-y-1">
                      {item.children.map((child) => {
                        const badge = child.badgeKey ? getBadge(child.badgeKey) : 0;
                        const isActive = location.pathname === child.to;

                        return (
                          <NavLink
                            key={child.to}
                            to={child.to}
                            onClick={() => window.innerWidth < 1024 && onClose()}
                            className={({ isActive }) => `
                              flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                              transition-all duration-200
                              ${isActive
                                ? 'bg-blue-500/20 text-white border-l-2 border-blue-400'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                              }
                            `}
                          >
                            <child.icon size={14} />
                            <span className="flex-1">{child.label}</span>
                            {badge > 0 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white animate-pulse">
                                {badge}
                              </span>
                            )}
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            // Regular nav items
            const badge = item.badgeKey ? getBadge(item.badgeKey) : 0;
            const isActive = location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.startsWith(item.to));

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={`
                  flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-1
                  transition-all duration-200
                  ${isActive
                    ? 'bg-blue-500/20 text-white border-l-2 border-blue-400'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <item.Icon size={17} />
                <span className="flex-1 text-sm">{item.label}</span>
                {badge > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white animate-pulse">
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
              <div className="text-white/40 text-[11px] truncate">{user?.email || 'admin@smartlabtech.com'}</div>
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
    </>
  );
}

export default Sidebar;