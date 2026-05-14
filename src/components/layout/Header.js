// src/components/layout/Header.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, RefreshCw, X, Maximize2, Minimize2, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAppData } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/dashboard/contact-forms': 'Contact Forms',
  '/dashboard/quote-requests': 'Quote Requests',
  '/dashboard/categories': 'Category Management',
  '/dashboard/products': 'Product Management',
};

function Header({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { contacts, quotes, refreshData } = useAppData();
  const { user, logout } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const title = PAGE_TITLES[location.pathname] || 'Admin';

  // Get unread counts
  const unreadContacts = contacts?.filter(c => !c.read).length || 0;
  const unreadQuotes = quotes?.filter(q => !q.read).length || 0;
  const totalUnread = unreadContacts + unreadQuotes;

  // Get recent notifications (combine contacts and quotes)
  const getRecentNotifications = () => {
    const notifications = [];

    contacts?.filter(c => !c.read).forEach(contact => {
      notifications.push({
        id: `contact-${contact.id}`,
        type: 'contact',
        title: contact.name,
        message: contact.message?.slice(0, 60),
        time: contact.createdAt,
        link: '/dashboard/contact-forms'
      });
    });

    quotes?.filter(q => !q.read).forEach(quote => {
      notifications.push({
        id: `quote-${quote.id}`,
        type: 'quote',
        title: quote.name,
        message: `${quote.productName || 'Product'} - ${quote.quantity} units`,
        time: quote.createdAt,
        link: '/dashboard/quote-requests'
      });
    });

    return notifications.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);

    window.location.reload();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle responsive
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAdminDropdown && !event.target.closest('.admin-dropdown')) {
        setShowAdminDropdown(false);
      }
      if (showNotif && !event.target.closest('.notif-dropdown')) {
        setShowNotif(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showAdminDropdown, showNotif]);

  const handleLogout = async () => {
    await logout();
    sessionStorage.clear();
    navigate('/');
  };

  const handleSettings = () => {
    navigate('/dashboard/settings');
    setShowAdminDropdown(false);
  };

  const handleProfile = () => {
    navigate('/dashboard/profile');
    setShowAdminDropdown(false);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-6 h-16 bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Mobile menu button */}
        <button
          className="btn-icon lg:hidden hover:bg-slate-100 rounded-lg p-2 transition-colors"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu size={20} className="text-slate-600" />
        </button>

        {/* Title with responsive text */}
        <h1 className="font-display text-lg sm:text-xl font-bold text-slate-900 truncate">
          {title}
        </h1>
      </div>

      {/* Actions - Right side */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Refresh button */}
        <button
          className="btn-icon hover:bg-slate-100 rounded-lg p-2 transition-colors relative"
          onClick={handleRefresh}
          disabled={isRefreshing}
          aria-label="Refresh data"
        >
          <RefreshCw
            size={17}
            className={`text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`}
          />
        </button>

        {/* Fullscreen toggle */}
        <button
          className="btn-icon hover:bg-slate-100 rounded-lg p-2 transition-colors hidden sm:flex"
          onClick={toggleFullscreen}
          aria-label="Toggle fullscreen"
        >
          {isFullscreen ? (
            <Minimize2 size={17} className="text-slate-500" />
          ) : (
            <Maximize2 size={17} className="text-slate-500" />
          )}
        </button>

        {/* Notification bell */}
        <div className="relative notif-dropdown">
          <button
            className="btn-icon hover:bg-slate-100 rounded-lg p-2 transition-colors relative"
            onClick={() => setShowNotif(v => !v)}
            aria-label="Notifications"
          >
            <Bell size={18} className="text-slate-500" />
            {totalUnread > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotif && (
            <>
              <div
                className="fixed inset-0 z-40 lg:hidden"
                onClick={() => setShowNotif(false)}
              />
              <div className={`
                absolute right-0 top-full mt-2 
                w-[90vw] sm:w-80 max-h-[80vh]
                bg-white rounded-2xl border border-slate-200 
                shadow-xl z-50 overflow-hidden
                transition-all duration-200
              `}>
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <span className="text-sm font-semibold text-slate-800">Notifications</span>
                  <div className="flex items-center gap-2">
                    {totalUnread > 0 && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                        {totalUnread} new
                      </span>
                    )}
                    <button
                      onClick={() => setShowNotif(false)}
                      className="lg:hidden text-slate-400 hover:text-slate-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <div className="overflow-y-auto max-h-[calc(80vh-60px)]">
                  {getRecentNotifications().length > 0 ? (
                    getRecentNotifications().map(notif => (
                      <a
                        key={notif.id}
                        href={notif.link}
                        onClick={() => setShowNotif(false)}
                        className="block px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <p className="text-xs font-semibold text-slate-700 truncate">
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {new Date(notif.time).toLocaleDateString()}
                        </p>
                      </a>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <div className="text-4xl mb-2">🔔</div>
                      <p className="text-sm text-slate-400">All caught up!</p>
                      <p className="text-xs text-slate-300 mt-1">No new notifications</p>
                    </div>
                  )}
                </div>

                {totalUnread > 0 && (
                  <div className="px-4 py-2 border-t border-slate-100 bg-slate-50">
                    <button
                      className="w-full text-center text-xs text-blue-600 hover:text-blue-700 font-medium"
                      onClick={() => {
                        setShowNotif(false);
                        // Navigate to all notifications
                      }}
                    >
                      View all notifications →
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Admin Dropdown */}
        <div className="relative admin-dropdown">
          <button
            className="flex items-center gap-2 hover:bg-slate-100 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 transition-colors"
            onClick={() => setShowAdminDropdown(v => !v)}
            aria-label="Admin menu"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <User size={16} className="text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-700 leading-tight">
                {user?.name?.split(' ')[0] || 'Admin'}
              </p>
              <p className="text-xs text-slate-400 leading-tight">
                {user?.role || 'Administrator'}
              </p>
            </div>
            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-200 hidden sm:block ${showAdminDropdown ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Admin Dropdown Menu */}
          {showAdminDropdown && (
            <>
              <div
                className="fixed inset-0 z-40 lg:hidden"
                onClick={() => setShowAdminDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                {/* User Info Section */}
                <div className="px-4 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                      <User size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {user?.name || 'Administrator'}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user?.email || 'admin@smartlabtech.com'}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-semibold rounded-full">
                        {user?.role || 'Admin'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={handleProfile}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User size={16} className="text-slate-400" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={handleSettings}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Settings size={16} className="text-slate-400" />
                    <span>Settings</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

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

        {/* Live indicator - hidden on mobile */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">Live</span>
        </div>
      </div>
    </header>
  );
}

export default Header;