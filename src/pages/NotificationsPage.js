// src/components/admin/AdminNotifications.js
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCircle, XCircle, Mail, FileText, Wrench,
  Loader2, AlertCircle, Trash2, CheckCheck, Eye, RefreshCw,
  Filter, ChevronDown, Calendar, Clock, Inbox
} from 'lucide-react';
import { format } from 'date-fns';

const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  `}</style>
);

const priorityColors = {
  low: 'bg-gray-100 text-gray-600 border-gray-200',
  medium: 'bg-blue-100 text-blue-700 border-blue-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  urgent: 'bg-red-100 text-red-700 border-red-200 animate-pulse'
};

const typeIcons = {
  contact: { icon: Mail, bg: 'bg-emerald-100', color: 'text-emerald-600' },
  quote: { icon: FileText, bg: 'bg-purple-100', color: 'text-purple-600' },
  service: { icon: Wrench, bg: 'bg-blue-100', color: 'text-blue-600' },
  order: { icon: CheckCircle, bg: 'bg-amber-100', color: 'text-amber-600' },
  system: { icon: Bell, bg: 'bg-slate-100', color: 'text-slate-600' }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedType, setSelectedType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stats, setStats] = useState({ total: 0, unread: 0 });

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      let url = 'http://31.97.228.17:5101/api/notifications';
      if (selectedType !== 'all') {
        url = `http://31.97.228.17:5101/api/notifications/type/${selectedType}`;
      }
      
      const response = await fetch(url, {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.data);
        setUnreadCount(data.unreadCount || 0);
        setStats({ total: data.pagination?.total || data.data.length, unread: data.unreadCount || 0 });
      } else {
        setError('Failed to load notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, [selectedType]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://31.97.228.17:5101/api/notifications/unread/count', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      const data = await response.json();
      if (data.success) setUnreadCount(data.data.unreadCount);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchNotifications, fetchUnreadCount]);

  const markAsRead = async (id) => {
    setActionLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://31.97.228.17:5101/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      const data = await response.json();
      if (data.success) {
        fetchNotifications();
        fetchUnreadCount();
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const markAllAsRead = async () => {
    if (!window.confirm('Mark all notifications as read?')) return;
    setActionLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://31.97.228.17:5101/api/notifications/read-all', {
        method: 'PUT',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      const data = await response.json();
      if (data.success) {
        fetchNotifications();
        fetchUnreadCount();
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteNotification = async (id, permanent = false) => {
    if (!window.confirm('Delete this notification?')) return;
    setActionLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const url = permanent 
        ? `http://31.97.228.17:5101/api/notifications/${id}/permanent`
        : `http://31.97.228.17:5101/api/notifications/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      const data = await response.json();
      if (data.success) {
        fetchNotifications();
        fetchUnreadCount();
        if (showDetailModal) setShowDetailModal(false);
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteAllRead = async () => {
    if (!window.confirm('Delete all read notifications?')) return;
    setActionLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://31.97.228.17:5101/api/notifications/read/all', {
        method: 'DELETE',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      const data = await response.json();
      if (data.success) {
        fetchNotifications();
      }
    } catch (err) {
      console.error('Error deleting read notifications:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const viewDetails = (notification) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
  };

  const getReferenceLink = (notification) => {
    const { referenceModel, referenceId } = notification;
    if (referenceModel === 'Contact') return `/dashboard/contacts`;
    if (referenceModel === 'Quote') return `/dashboard/quotes`;
    if (referenceModel === 'ServiceForm') return `/dashboard/Service-requests`;
    return '#';
  };

  const typeOptions = [
    { value: 'all', label: 'All Types', icon: Bell },
    { value: 'contact', label: 'Contact Forms', icon: Mail },
    { value: 'quote', label: 'Quote Requests', icon: FileText },
    { value: 'service', label: 'Service Requests', icon: Wrench }
  ];

  if (loading && notifications.length === 0) {
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-px bg-blue-600" />
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600">
              Admin Panel
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                Notifications
              </h1>
              <p className="text-slate-500 mt-1">Manage and track all system notifications</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchNotifications}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-2 text-sm"
              >
                <RefreshCw size={14} /> Refresh
              </button>
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0 || actionLoading}
                className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center gap-2 text-sm disabled:opacity-50"
              >
                <CheckCheck size={14} /> Mark All Read
              </button>
              <button
                onClick={deleteAllRead}
                className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-2 text-sm"
              >
                <Trash2 size={14} /> Clear Read
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-slate-400">Total</p><p className="text-2xl font-bold text-slate-800">{stats.total}</p></div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><Bell size={20} className="text-blue-600" /></div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-slate-400">Unread</p><p className="text-2xl font-bold text-red-600">{stats.unread}</p></div>
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center"><Bell size={20} className="text-red-600" /></div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-slate-400">Contact</p><p className="text-2xl font-bold text-emerald-600">{notifications.filter(n => n.type === 'contact').length}</p></div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center"><Mail size={20} className="text-emerald-600" /></div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-slate-400">Service</p><p className="text-2xl font-bold text-blue-600">{notifications.filter(n => n.type === 'service').length}</p></div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><Wrench size={20} className="text-blue-600" /></div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              {typeOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setSelectedType(option.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                    selectedType === option.value 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <option.icon size={12} /> {option.label}
                </button>
              ))}
            </div>
            <div className="flex-1" />
            <div className="text-xs text-slate-400">
              Showing {notifications.length} notifications
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Inbox size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-600 mb-1">No notifications</h3>
            <p className="text-sm text-slate-400">All caught up! New notifications will appear here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification, idx) => {
              const IconComponent = typeIcons[notification.type]?.icon || Bell;
              const iconStyle = typeIcons[notification.type] || typeIcons.system;
              
              return (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`bg-white rounded-xl border transition-all hover:shadow-md ${
                    !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : 'border-slate-100'
                  }`}
                >
                  <div className="p-4 flex items-start gap-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl ${iconStyle.bg} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent size={18} className={iconStyle.color} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-800">{notification.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{notification.message}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${priorityColors[notification.priority]}`}>
                            {notification.priority}
                          </span>
                          {!notification.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                        </div>
                      </div>
                      
                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock size={10} /> {format(new Date(notification.createdAt), 'MMM dd, yyyy h:mm a')}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar size={10} /> {notification.type}
                        </span>
                        {notification.data?.status && (
                          <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            Status: {notification.data.status}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => viewDetails(notification)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Mark as Read"
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Notification Details
                </h2>
                <button onClick={() => setShowDetailModal(false)} className="p-1 rounded-lg hover:bg-slate-100">
                  <XCircle size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b">
                  <div className={`w-12 h-12 rounded-xl ${typeIcons[selectedNotification.type]?.bg} flex items-center justify-center`}>
                    {React.createElement(typeIcons[selectedNotification.type]?.icon || Bell, { size: 22, className: typeIcons[selectedNotification.type]?.color })}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{selectedNotification.title}</h3>
                    <p className="text-sm text-slate-500">{selectedNotification.message}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400">Type</label>
                    <p className="text-sm font-medium capitalize">{selectedNotification.type}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Priority</label>
                    <p className={`text-sm font-medium capitalize ${priorityColors[selectedNotification.priority]?.split(' ')[1]}`}>
                      {selectedNotification.priority}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Created At</label>
                    <p className="text-sm">{format(new Date(selectedNotification.createdAt), 'PPP p')}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Status</label>
                    <p className="text-sm">{selectedNotification.isRead ? 'Read' : 'Unread'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-slate-400">Reference Model</label>
                    <p className="text-sm">{selectedNotification.referenceModel}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-slate-400">Reference ID</label>
                    <p className="text-sm font-mono">{selectedNotification.referenceId}</p>
                  </div>
                </div>

                {selectedNotification.data && (
                  <div className="border-t pt-3">
                    <label className="text-xs text-slate-400">Additional Data</label>
                    <pre className="mt-2 p-3 bg-slate-50 rounded-lg text-xs overflow-auto">
                      {JSON.stringify(selectedNotification.data, null, 2)}
                    </pre>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <a
                    href={getReferenceLink(selectedNotification)}
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                  >
                    View Reference
                  </a>
                  <button
                    onClick={() => deleteNotification(selectedNotification._id)}
                    className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold"
                  >
                    Delete Notification
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}