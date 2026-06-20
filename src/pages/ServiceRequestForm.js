// src/components/admin/ServiceRequestManager.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Eye, Edit, Trash2, CheckCircle, XCircle,
  Loader2, AlertCircle, ChevronLeft, ChevronRight,
  Calendar, Phone, Mail, MapPin, Building, Package,
  FileText, Clock, RefreshCw, Download, TrendingUp, User
} from 'lucide-react';

const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  `}</style>
);

const statusColors = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  assigned: 'bg-blue-100 text-blue-700 border-blue-200',
  'in-progress': 'bg-purple-100 text-purple-700 border-purple-200',
  resolved: 'bg-green-100 text-green-700 border-green-200',
  closed: 'bg-slate-100 text-slate-700 border-slate-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200'
};

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
  { value: 'cancelled', label: 'Cancelled' }
];

export default function ServiceRequestManager() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1
  });
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch requests and stats
  useEffect(() => {
    fetchRequests();
    fetchStats();
  }, [filters]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      let url = `http://31.97.228.17:5101/api/servicepage/admin?page=${filters.page}&limit=${filters.limit}`;
      if (filters.status) url += `&status=${filters.status}`;
      if (filters.search) url += `&search=${filters.search}`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      const data = await response.json();
      
      if (data.success) {
        setRequests(data.data);
        setPagination(data.pagination);
      } else {
        setError('Failed to fetch service requests');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://31.97.228.17:5101/api/servicepage/admin/stats', {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      const data = await response.json();
      if (data.success) setStats(data.data);
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const updateStatus = async (id, newStatus) => {
    setUpdatingStatus(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://31.97.228.17:5101/api/servicepage/admin/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      if (data.success) {
        fetchRequests();
        fetchStats();
        if (selectedRequest) setSelectedRequest(data.data);
      }
    } catch (err) {
      console.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const deleteRequest = async (id, permanent = false) => {
    if (!window.confirm(`Are you sure you want to ${permanent ? 'permanently delete' : 'delete'} this request?`)) return;
    
    try {
      const token = sessionStorage.getItem('token');
      const url = permanent 
        ? `http://31.97.228.17:5101/api/servicepage/admin/${id}/permanent`
        : `http://31.97.228.17:5101/api/servicepage/admin/${id}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      
      const data = await response.json();
      if (data.success) {
        fetchRequests();
        fetchStats();
        if (isModalOpen) setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to delete request');
    }
  };

  const StatCard = ({ label, value, color }) => (
    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );

  return (
    <>
      <FontLink />
      <div className="max-w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-px bg-blue-600" />
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600">
              Admin Panel
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            Service Request Manager
          </h1>
          <p className="text-slate-500 mt-2">Manage and track customer service requests</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
            <StatCard label="Total" value={stats.total} color="text-slate-700" />
            <StatCard label="Pending" value={stats.pending} color="text-amber-600" />
            <StatCard label="Assigned" value={stats.assigned} color="text-blue-600" />
            <StatCard label="In Progress" value={stats.inProgress} color="text-purple-600" />
            <StatCard label="Resolved" value={stats.resolved} color="text-green-600" />
            <StatCard label="Closed" value={stats.closed} color="text-slate-600" />
            <StatCard label="Cancelled" value={stats.cancelled} color="text-red-600" />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-100 shadow-lg mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by company, person, instrument..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-blue-500 outline-none"
            >
              <option value="">All Status</option>
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              onClick={() => { setFilters({ status: '', search: '', page: 1 }); fetchRequests(); }}
              className="px-3 py-2 rounded-xl border border-slate-200 text-sm hover:bg-slate-50"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Requests Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={40} className="animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-10 text-slate-400">No service requests found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500">ID</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500">Date</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500">Company</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500">Contact</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500">Instrument</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500">Status</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="py-3 px-3 text-sm text-slate-600 font-mono">{request._id.slice(-6)}</td>
                      <td className="py-3 px-3 text-sm text-slate-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3">
                        <div>
                          <p className="text-sm font-medium text-slate-800">{request.companyDetails}</p>
                          <p className="text-xs text-slate-400">{request.location}</p>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div>
                          <p className="text-sm text-slate-800">{request.contactPerson}</p>
                          <p className="text-xs text-slate-400">{request.contactNo}</p>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div>
                          <p className="text-sm text-slate-800">{request.instrumentType}</p>
                          <p className="text-xs text-slate-400">{request.modelNo}</p>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={request.status}
                          onChange={(e) => updateStatus(request._id, e.target.value)}
                          disabled={updatingStatus}
                          className={`px-2 py-1 rounded-full text-xs font-semibold border ${statusColors[request.status]} outline-none cursor-pointer`}
                        >
                          {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setSelectedRequest(request); setIsModalOpen(true); }}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => deleteRequest(request._id)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                  disabled={filters.page === 1}
                  className="p-2 rounded-lg border border-slate-200 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-4 py-2 text-sm">
                  Page {filters.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                  disabled={filters.page === pagination.pages}
                  className="p-2 rounded-lg border border-slate-200 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
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
                  Service Request Details
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">
                  <XCircle size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400">Request ID</label>
                    <p className="text-sm font-mono">{selectedRequest._id}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Created At</label>
                    <p className="text-sm">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 flex items-center gap-1"><Building size={12} /> Company Details</label>
                  <p className="text-sm font-medium">{selectedRequest.companyDetails}</p>
                  <p className="text-sm text-slate-600">{selectedRequest.unit} | {selectedRequest.location}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 flex items-center gap-1"><User size={12} /> Contact Person</label>
                    <p className="text-sm">{selectedRequest.contactPerson}</p>
                    <p className="text-xs text-slate-500">{selectedRequest.designation}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 flex items-center gap-1"><Phone size={12} /> Contact</label>
                    <p className="text-sm">{selectedRequest.contactNo}</p>
                    <p className="text-xs text-slate-500">{selectedRequest.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 flex items-center gap-1"><Package size={12} /> Instrument</label>
                    <p className="text-sm">{selectedRequest.instrumentType}</p>
                    <p className="text-xs text-slate-500">Model: {selectedRequest.modelNo} | SN: {selectedRequest.serialNo}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 flex items-center gap-1"><FileText size={12} /> Contract</label>
                    <p className="text-sm">{selectedRequest.contractType}</p>
                    <p className="text-xs text-slate-500">PO: {selectedRequest.poNumber}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400">Nature of Problem</label>
                  <p className="text-sm bg-slate-50 p-3 rounded-lg mt-1">{selectedRequest.natureOfProblem}</p>
                </div>

                <div>
                  <label className="text-xs text-slate-400">Status</label>
                  <select
                    value={selectedRequest.status}
                    onChange={(e) => updateStatus(selectedRequest._id, e.target.value)}
                    className={`mt-1 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusColors[selectedRequest.status]} outline-none`}
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => deleteRequest(selectedRequest._id)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    Delete Request
                  </button>
                  <button
                    onClick={() => deleteRequest(selectedRequest._id, true)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Permanent Delete
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