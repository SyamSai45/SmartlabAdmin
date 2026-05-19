// src/components/layout/Sidebar.js
import React, { Activity, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  ActivityIcon,
  PenSquare,
  PanelsTopLeft,
  Briefcase,
  Trophy,
  Layout,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppContext';

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },

  { to: "/dashboard/categories", label: "Category", Icon: FolderOpen },

  { to: "/dashboard/principles", label: "Principles", Icon: BadgeCheck },

  {
    label: "Products",
    Icon: Package,
    isDropdown: true,
    children: [
      { to: "/dashboard/addproduct", label: "Create Product", icon: PlusCircle },
      { to: "/dashboard/products", label: "All Products", icon: Package },
      { to: "/dashboard/suggested-products", label: "Suggested Products", icon: Package },
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
      { to: "/dashboard/home-details", label: "Home testimonial Details", icon: FileBadge },
      { to: "/dashboard/home-reviews", label: "Home Reviews", icon: Star },
    ],
  },

  {
    label: "About Sections",
    Icon: BookOpen,
    isDropdown: true,
    children: [
      { to: "/dashboard/about-hero", label: "About Hero", icon: MonitorSmartphone },
      { to: "/dashboard/about-overview", label: "About Overview", icon: LayoutTemplate },
      { to: "/dashboard/about-cards", label: "About Cards", icon: Target },
      { to: "/dashboard/about-corevalues", label: "About Core Values", icon: Gem },
      { to: "/dashboard/about-chooseus", label: "Why Choose Us", icon: ShieldCheck },
      { to: "/dashboard/about-cta", label: "About CTA", icon: Megaphone },
    ],
  },

  {
    label: "Service Sections",
    Icon: BriefcaseBusiness,
    isDropdown: true,
    children: [
      { to: "/dashboard/service-popup", label: "Service Popup", icon: MonitorPlay },
      { to: "/dashboard/service-home", label: "Service Home", icon: MonitorPlay },
      { to: "/dashboard/service-hero", label: "Service Hero", icon: Users },
      { to: "/dashboard/service-catalog", label: "Service Catalog", icon: Wrench },
      { to: "/dashboard/service-support", label: "Service Support", icon: GitBranch },
    ],
  },

  {
    label: "Support Sections",
    Icon: Headset,
    isDropdown: true,
    children: [
      { to: "/dashboard/support-hero", label: "Support Hero", icon: MonitorPlay },
      { to: "/dashboard/support-cards", label: "Support Cards", icon: Lightbulb },
      { to: "/dashboard/support-solutions", label: "Solutions", icon: ShieldCheck },
      { to: "/dashboard/support-lifecycle", label: "Performance", icon: ActivityIcon },
      { to: "/dashboard/support-faqs", label: "FAQs", icon: HelpCircle },
      { to: "/dashboard/support-cta", label: "CTA", icon: Megaphone },
    ],
  },

  {
    label: "Blogs Sections",
    Icon: BookOpen,
    isDropdown: true,
    children: [
      { to: "/dashboard/blogs", label: "Blogs", icon: FileText },

      // { to: "/dashboard/blog-hero", label: "Blog Hero", icon: MonitorPlay },

      // { to: "/dashboard/blog-list", label: "Blog List", icon: FileText },

      // { to: "/dashboard/blog-create", label: "Create Blog", icon: PenSquare },
    ],
  },

  {
    label: "Resources Management",
    Icon: BookOpen,
    isDropdown: true,
    children: [
      { to: "/dashboard/resources/hero", label: "Resource Hero", icon: Layout },
      { to: "/dashboard/resources/articles", label: "Articles", icon: FileText },
      { to: "/dashboard/resources/docs", label: "Documents", icon: FolderOpen },
      { to: "/dashboard/resources/case-studies", label: "Case Studies", icon: Briefcase },
      { to: "/dashboard/resources/faqs", label: "FAQs", icon: HelpCircle },
      { to: "/dashboard/resources/achievements", label: "Achievements", icon: Trophy },
      { to: "/dashboard/resources/cta", label: "CTA Section", icon: Megaphone },
    ],
  },

  {
    label: "Contact Management",
    Icon: MessageSquare,
    isDropdown: true,
    children: [
      { to: "/dashboard/contect-hero", label: "Contact Hero", icon: Mail, badgeKey: "contacts" },
      { to: "/dashboard/contacts", label: "Contact", icon: PhoneCall, badgeKey: "contacts" },
      { to: "/dashboard/quotes", label: "Quote Requests", icon: Mail, badgeKey: "touch" },
      { to: "/dashboard/service-requests", label: "Service Requests", icon: PhoneCall, badgeKey: "touch" },
    ],
  },

  {
    label: "Footer Sections",
    Icon: PanelsTopLeft,
    isDropdown: true,
    children: [
      { to: "/dashboard/footer", label: "Footer", icon: Package },
    ],
  },
  { to: "/dashboard/notifications", label: "Notifications", Icon: Bell },
];

function Sidebar({ open, onClose }) {
  const { logout, user } = useAuth();
  const { contacts, quotes } = useAppData();
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const navigate = useNavigate();

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

  const handleLogout = () => {

    // Remove token
    sessionStorage.removeItem("token");

    // Optional: clear all session data
    // sessionStorage.clear();

    // Redirect to login
    navigate("/", { replace: true });
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
            style={{ background: 'linear-gradient(135deg,#fff,#fff)', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}
          >
            <img src='/logo.png' className='w-16 h-8' />
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
                            {/* {badge > 0 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white animate-pulse">
                                {badge}
                              </span>
                            )} */}
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
                {/* {badge > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white animate-pulse">
                    {badge}
                  </span>
                )} */}
              </NavLink>
            );
          })}
        </nav>

        {/* ── Logout Button ── */}
        <div
          className="p-4"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(255,255,255,0.02)'
          }}
        >
          <button
            onClick={handleLogout}
            className="
              group
              relative
              overflow-hidden
              w-full
              flex items-center justify-center gap-3
              px-4 py-3.5
              rounded-2xl
              text-sm font-semibold
              text-white/80
              border border-white/10
              bg-white/[0.04]
              hover:bg-red-500/15
              hover:border-red-400/30
              hover:text-red-300
              transition-all duration-300
              hover:shadow-[0_8px_30px_rgba(239,68,68,0.18)]
            "
            title="Sign out"
          >

            {/* Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10" />

            <LogOut
              size={18}
              className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1"
            />

            <span className="relative z-10 tracking-wide">
              Logout
            </span>

          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;