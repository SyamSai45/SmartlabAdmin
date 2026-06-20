import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import {
  Package, MessageSquare, FileText, Tag, TrendingUp,
  Clock, Bell, RefreshCw, AlertTriangle, Star,
  CheckCircle, BookOpen, ShoppingBag, Users, Zap, Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://31.97.228.17:5101/api/dashboard/stats";

/* ─── Helpers ─── */
function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtTime(d) {
  return new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}
function timeSince(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

const CARD_GRADIENTS = [
  { from: "#6366f1", to: "#8b5cf6" },
  { from: "#f59e0b", to: "#ef4444" },
  { from: "#10b981", to: "#06b6d4" },
  { from: "#ec4899", to: "#f43f5e" },
];

const STATUS_MAP = {
  pending: { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b", border: "#fde68a" },
  approved: { bg: "#d1fae5", text: "#064e3b", dot: "#10b981", border: "#a7f3d0" },
  processing: { bg: "#dbeafe", text: "#1e3a8a", dot: "#3b82f6", border: "#bfdbfe" },
  quoted: { bg: "#ede9fe", text: "#4c1d95", dot: "#8b5cf6", border: "#ddd6fe" },
  rejected: { bg: "#fee2e2", text: "#7f1d1d", dot: "#ef4444", border: "#fecaca" },
  completed: { bg: "#ccfbf1", text: "#134e4a", dot: "#14b8a6", border: "#99f6e4" },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.processing;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize"
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ background: s.dot }} />
      {status}
    </span>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-lg text-xs">
      <p className="font-bold text-slate-700 mb-1.5">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="font-semibold mb-0.5" style={{ color: p.color }}>
          {p.name}: <span className="text-slate-800">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

function Skeleton({ className = "" }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
        backgroundSize: "200% 100%",
        animation: "skeletonPulse 1.5s infinite",
      }}
    />
  );
}

function StatCard({ icon: Icon, label, value, sub, link, gradient, delay = 0 }) {

  const navigate = useNavigate();

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 text-white"
      style={{
        background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
        animation: `fadeUp 0.5s ease ${delay}s both`,
        boxShadow: `0 8px 24px ${gradient.from}40`,
      }}
      onClick={() => navigate(link)}
    >
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
      <div className="absolute right-6 bottom-2 w-12 h-12 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
      <div className="relative z-10">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          <Icon size={20} className="text-white" />
        </div>
        <div className="text-3xl font-bold leading-none mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {value}
        </div>
        <div className="text-white/90 text-[13px] font-semibold">{label}</div>
        <div className="text-white/55 text-[11px] mt-0.5">{sub}</div>
      </div>
    </div>
  );
}

function KpiBar({ label, value, max, color, suffix = "" }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-slate-500 font-medium">{label}</span>
        <span className="font-bold text-slate-700">{value}{suffix}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
      </div>
    </div>
  );
}

function QuickStat({ icon: Icon, label, value, color, delay = 0 }) {
  return (
    <div
      className="bg-white rounded-2xl px-5 py-4 flex items-center gap-3 border border-slate-100"
      style={{ animation: `fadeUp 0.5s ease ${delay}s both`, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <div className="text-2xl font-bold leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif", color }}>
          {value}
        </div>
        <div className="text-[11.5px] text-slate-400 mt-0.5 leading-tight">{label}</div>
      </div>
    </div>
  );
}

/* ─── Main ─── */
export function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (!json.success) throw new Error("API returned failure");
      setData(json.data);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <>
        <style>{`@keyframes skeletonPulse{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
        <div className="space-y-5 p-1">
          <Skeleton className="h-36" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
          <div className="grid lg:grid-cols-[1fr_300px] gap-4">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Skeleton className="h-52" />
            <Skeleton className="h-52" />
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            <Skeleton className="h-72" />
            <Skeleton className="h-72" />
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
          <AlertTriangle size={28} className="text-red-400" />
        </div>
        <h3 className="text-slate-800 font-bold text-lg mb-1">Failed to load dashboard</h3>
        <p className="text-slate-400 text-sm mb-5">{error}</p>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  const { products, categories, contacts, quotes, notifications, summary, recentActivity, brands, blogs } = data;
  const now = new Date();

  const months = ["Jan", "Feb", "Mar", "Apr", "May"];
  const chartData = months.map((label, i) => ({
    label,
    Contacts: [3, 5, 4, 7, contacts.thisMonth][i],
    Quotes: [2, 3, 5, 4, quotes.thisMonth][i],
  }));

  const pieData = [
    { name: "Processing", value: quotes.processing, color: "#3b82f6" },
    { name: "Quoted", value: quotes.quoted, color: "#8b5cf6" },
    { name: "Approved", value: quotes.approved, color: "#10b981" },
    { name: "Pending", value: quotes.pending, color: "#f59e0b" },
    { name: "Rejected", value: quotes.rejected, color: "#ef4444" },
  ].filter((s) => s.value > 0);

  const contactBarData = [
    { name: "Total", value: contacts.total, fill: "#6366f1" },
    { name: "Pending", value: contacts.pending, fill: "#f59e0b" },
    { name: "Replied", value: contacts.replied, fill: "#10b981" },
    { name: "This Week", value: contacts.thisWeek, fill: "#ec4899" },
    { name: "Today", value: contacts.today, fill: "#06b6d4" },
  ];

  const statCards = [
    {
      icon: Package, label: "Active Products", value: products.active,
      sub: `${products.featured} featured · ${categories.total} categories`,
      gradient: CARD_GRADIENTS[0],
      link: '/dashboard/products'
    },
    {
      icon: MessageSquare, label: "Total Contacts", value: contacts.total,
      sub: `${contacts.pending} pending · ${contacts.today} today`,
      gradient: CARD_GRADIENTS[1],
      link: '/dashboard/contacts'
    },
    {
      icon: FileText, label: "Quote Requests", value: quotes.total,
      sub: `${quotes.processing} processing · ${quotes.approved} approved`,
      gradient: CARD_GRADIENTS[2],
      link: '/dashboard/quotes'
    },
    {
      icon: Tag, label: "Principals", value: brands.total,
      sub: `${categories.total} categories`,
      gradient: CARD_GRADIENTS[3],
      link: '/dashboard/principals'
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        @keyframes skeletonPulse{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes livePulse{0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.5)}50%{box-shadow:0 0 0 7px rgba(16,185,129,0)}}
        .live-dot{width:9px;height:9px;border-radius:50%;background:#10b981;animation:livePulse 2s infinite}
      `}</style>

      <div className="space-y-5 bg-slate-50 min-h-screen p-4 md:p-6" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>

        {/* ── Banner ── */}
        <div
          className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 45%, #db2777 100%)",
            animation: "fadeUp 0.4s ease both",
            boxShadow: "0 12px 40px rgba(79,70,229,0.25)",
          }}
        >
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
          <div className="absolute bottom-0 left-24 w-32 h-32 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="live-dot" />
                <span className="text-white/60 text-[11px] font-semibold uppercase tracking-widest">Live Dashboard</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Welcome back, <span className="text-yellow-300">Admin</span>
              </h2>
              <p className="text-white/50 text-sm">
                SmartLabTech · {fmtDate(now)} {fmtTime(now)}
                {lastUpdated && <span className="ml-2 text-white/30">· updated {fmtTime(lastUpdated)}</span>}
              </p>
            </div>

            <div className="flex gap-3 flex-wrap items-center">
              {[
                { v: products.active, l: "Products", c: "#a5f3fc" },
                { v: contacts.pending, l: "Pending", c: "#fde68a" },
                { v: quotes.total, l: "Quotes", c: "#ddd6fe" },
                { v: notifications.unread, l: "Alerts", c: "#fecaca" },
              ].map(({ v, l, c }) => (
                <div
                  key={l}
                  className="text-center px-4 py-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  <div className="text-xl font-bold leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif", color: c }}>{v}</div>
                  <div className="text-[11px] text-white/40 mt-1">{l}</div>
                </div>
              ))}
              <button
                onClick={fetchData}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-white/70 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <RefreshCw size={13} /> Refresh
              </button>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.07} />)}
        </div>

        {/* ── Area Chart + KPIs ── */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-4">

          <div
            className="bg-white rounded-2xl p-5 border border-slate-100"
            style={{ animation: "fadeUp 0.5s ease 0.25s both", boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-bold text-slate-800 text-[17px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Inquiry Trends
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Monthly contacts &amp; quote requests</p>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                <TrendingUp size={12} /> +{Math.round(((contacts.thisMonth - 7) / 7) * 100)}% this month
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-4 mb-3">
              {[{ color: "#6366f1", label: "Contacts" }, { color: "#ec4899", label: "Quotes" }].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
                  <span className="text-xs text-slate-500">{label}</span>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gQ" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Contacts" stroke="#6366f1" strokeWidth={2.5} fill="url(#gC)"
                  dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }} />
                <Area type="monotone" dataKey="Quotes" stroke="#ec4899" strokeWidth={2.5} fill="url(#gQ)"
                  dot={{ r: 4, fill: "#ec4899", strokeWidth: 2, stroke: "#fff" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div
            className="bg-white rounded-2xl p-5 border border-slate-100 space-y-4"
            style={{ animation: "fadeUp 0.5s ease 0.3s both", boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-indigo-500" />
              <div className="font-bold text-slate-800 text-[17px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Summary KPIs
              </div>
            </div>
            <KpiBar label="Total Leads" value={summary.totalLeads} max={30} color="#6366f1" />
            <KpiBar label="Pending Actions" value={summary.pendingActions} max={20} color="#f59e0b" />
            <KpiBar label="Conversion Rate" value={summary.conversionRate} max={100} color="#10b981" suffix="%" />
            <KpiBar label="Active Products" value={summary.activeProducts} max={10} color="#ec4899" />
            <div className="border-t border-slate-100 pt-4 space-y-3">
              {[
                { icon: Zap, label: "Today's contacts", value: contacts.today },
                { icon: Clock, label: "This week", value: contacts.thisWeek },
                { icon: Clock, label: "This month", value: contacts.thisMonth },
                { icon: Users, label: "Total contacts", value: contacts.total },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={12} className="text-slate-300" />
                    <span className="text-xs text-slate-400">{label}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Pie + Bar ── */}
        <div className="grid sm:grid-cols-2 gap-4">

          {/* Pie */}
          <div
            className="bg-white rounded-2xl p-5 border border-slate-100"
            style={{ animation: "fadeUp 0.5s ease 0.35s both", boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
          >
            <div className="font-bold text-slate-800 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Quote Status
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
              {pieData.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                  <span className="text-[11px] text-slate-500">{s.name} ({s.value})</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={pieData} cx={75} cy={75} innerRadius={42} outerRadius={72}
                    paddingAngle={3} dataKey="value" strokeWidth={2} stroke="#fff">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2.5">
                {pieData.map((s) => (
                  <div key={s.name}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-500">{s.name}</span>
                      <span className="font-bold text-slate-700">{s.value}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${quotes.total ? Math.round((s.value / quotes.total) * 100) : 0}%`, background: s.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar */}
          <div
            className="bg-white rounded-2xl p-5 border border-slate-100"
            style={{ animation: "fadeUp 0.5s ease 0.4s both", boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
          >
            <div className="font-bold text-slate-800 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Contact Activity
            </div>
            <p className="text-xs text-slate-400 mb-4">Breakdown by category</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={contactBarData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                <defs>
                  {contactBarData.map((d, i) => (
                    <linearGradient key={i} id={`bg${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={d.fill} stopOpacity={1} />
                      <stop offset="100%" stopColor={d.fill} stopOpacity={0.55} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {contactBarData.map((_, i) => <Cell key={i} fill={`url(#bg${i})`} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Recent Activity ── */}
        <div className="grid lg:grid-cols-2 gap-4">

          {/* Quote Requests */}
          <div
            className="bg-white rounded-2xl overflow-hidden border border-slate-100"
            style={{ animation: "fadeUp 0.5s ease 0.45s both", boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
          >
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
            >
              <div className="font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Recent Quote Requests
              </div>
              <span className="text-[10px] font-semibold text-indigo-200 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                {recentActivity.contacts.length} latest
              </span>
            </div>
            <div className="divide-y divide-slate-50 overflow-y-auto max-h-72">
              {recentActivity.contacts.map((c) => (
                <div key={c._id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}
                  >
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[13px] font-semibold text-slate-800 truncate">{c.name}</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {c.company} · {c.city} · Qty: {c.quantity}
                    </p>
                    <p className="text-[10px] text-slate-300 mt-0.5">{timeSince(c.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Products */}
          <div
            className="bg-white rounded-2xl overflow-hidden border border-slate-100"
            style={{ animation: "fadeUp 0.5s ease 0.5s both", boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
          >
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)" }}
            >
              <div className="font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Recent Products
              </div>
              <span className="text-[10px] font-semibold text-emerald-100 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                {recentActivity.quotes.length} products
              </span>
            </div>
            <div className="divide-y divide-slate-50 overflow-y-auto max-h-72">
              {recentActivity.quotes.map((p) => (
                <div key={p._id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #d1fae5, #a7f3d0)" }}
                  >
                    <ShoppingBag size={16} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[13px] font-semibold text-slate-800 truncate">{p.name}</span>
                      <span
                        className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"
                        style={{ border: "1px solid #a7f3d0" }}
                      >
                        ₹{(p.discountedPrice || p.price || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{p.brandName} · {p.categoryName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-medium ${p.inStock ? "text-emerald-500" : "text-red-400"}`}>
                        {p.inStock ? "● In Stock" : "○ Out of Stock"}
                      </span>
                      {p.isFeatured && <span className="text-[10px] text-amber-500 font-medium">★ Featured</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quick Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <QuickStat icon={Star} label="Featured Products" value={products.featured} color="#f59e0b" delay={0.55} />
          <QuickStat icon={CheckCircle} label="Approved Quotes" value={quotes.approved} color="#10b981" delay={0.60} />
          <QuickStat icon={Bell} label="Unread Notifications" value={notifications.unread} color="#ef4444" delay={0.65} />
          <QuickStat icon={BookOpen} label="Total Blogs" value={blogs.total} color="#8b5cf6" delay={0.70} />
        </div>

      </div>
    </>
  );
}

export default DashboardPage;