import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import {
  Package, MessageSquare, FileText, FolderOpen,
  TrendingUp, Users, Clock,
} from 'lucide-react';
import { useAppData }      from '../context/AppContext';
import { DASHBOARD_STATS } from '../data/mockData';
import { fmtDate, fmtTime } from '../utils/helpers';

/* ─── Stat card ─── */
function StatCard({ label, value, sub, Icon, gradFrom, gradTo, lightBg }) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: lightBg }}
        >
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}
          >
            <Icon size={18} className="text-white" />
          </div>
        </div>
      </div>
      <div className="font-display text-3xl font-bold text-slate-900 leading-none">{value}</div>
      <div className="text-[13.5px] font-semibold text-slate-700 mt-1.5">{label}</div>
      <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
    </div>
  );
}

/* ─── Custom recharts tooltip ─── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-card-hover text-xs">
      <p className="font-bold text-slate-700 mb-1.5">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export function DashboardPage() {
  const { contacts, quotes, categories, products } = useAppData();
  const { monthlyData, recentActivity } = DASHBOARD_STATS;

  const pending   = contacts.filter(c => c.status === 'pending').length;
  const unread    = contacts.filter(c => !c.read).length;
  const pQuotes   = quotes.filter(q => q.status === 'pending').length;

  const chartData = monthlyData.labels.map((label, i) => ({
    label,
    Contacts: monthlyData.contacts[i],
    Quotes:   monthlyData.quotes[i],
  }));

  const stats = [
    { label:'Total Products',     value: products.length,   sub:`${categories.length} categories`,      Icon: Package,       gradFrom:'#1e3a8a', gradTo:'#0ea5e9', lightBg:'rgba(37,99,235,0.08)'  },
    { label:'Pending Contacts',   value: pending,            sub:`${unread} unread`,                     Icon: MessageSquare, gradFrom:'#f59e0b', gradTo:'#ef4444', lightBg:'rgba(245,158,11,0.1)'  },
    { label:'Quote Requests',     value: quotes.length,      sub:`${pQuotes} pending review`,            Icon: FileText,      gradFrom:'#10b981', gradTo:'#0ea5e9', lightBg:'rgba(16,185,129,0.08)' },
    { label:'Active Categories',  value: categories.filter(c=>c.active).length, sub:'categories enabled', Icon: FolderOpen, gradFrom:'#8b5cf6', gradTo:'#ec4899', lightBg:'rgba(139,92,246,0.08)' },
  ];

  const dotColor = { quote:'dot-green', contact:'dot-blue', product:'dot-amber', other:'dot-blue' };

  return (
    <div className="space-y-6">
      {/* ── Welcome banner ── */}
      <div
        className="rounded-2xl px-7 py-6 flex items-center justify-between gap-5 flex-wrap relative overflow-hidden"
        style={{ background:'linear-gradient(135deg,#0a1628,#1e3a8a 60%,#0369a1)', boxShadow:'0 8px 32px rgba(10,22,40,0.18)' }}
      >
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize:'180px' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="dot dot-green animate-pulse2" />
            <span className="text-white/50 text-[11px] font-semibold uppercase tracking-widest">Live Dashboard</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-1">
            Welcome back, <span className="text-sky-400">Admin</span>
          </h2>
          <p className="text-white/45 text-sm">SmartLabTech Admin · {fmtDate(new Date())} {fmtTime(new Date())}</p>
        </div>

        <div className="flex gap-3 relative z-10">
          {[
            { v: products.length, l: 'Products'  },
            { v: pending,         l: 'Pending'   },
            { v: quotes.length,   l: 'Quotes'    },
          ].map(({ v, l }) => (
            <div
              key={l}
              className="text-center px-4 py-3 rounded-xl"
              style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="font-display text-xl font-bold text-white leading-none">{v}</div>
              <div className="text-[11px] text-white/40 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Chart + Activity ── */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        {/* Chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="section-title mb-0.5">Inquiry Trends</div>
              <p className="text-xs text-slate-400">Monthly contacts and quote requests</p>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <TrendingUp size={13} /> +18% this month
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gContacts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="gQuotes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#0ea5e9" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="label" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize:12, paddingTop:12 }} />
              <Area type="monotone" dataKey="Contacts" stroke="#2563eb" strokeWidth={2.5} fill="url(#gContacts)" dot={{ r:3.5, fill:'#2563eb' }} />
              <Area type="monotone" dataKey="Quotes"   stroke="#0ea5e9" strokeWidth={2.5} fill="url(#gQuotes)"   dot={{ r:3.5, fill:'#0ea5e9' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Activity feed */}
        <div className="card overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="section-title text-[17px]">Recent Activity</div>
            <Clock size={15} className="text-slate-300" />
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {recentActivity.map((a, i) => (
              <div key={i} className="px-5 py-3.5 flex gap-3 items-start hover:bg-slate-50 transition-colors">
                <div className={`dot mt-1.5 ${dotColor[a.type] || 'dot-blue'}`} style={{ background: a.color, boxShadow:`0 0 0 3px ${a.color}22` }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] text-slate-700 leading-snug">{a.text}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick stats strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Out of Stock',    val: products.filter(p=>!p.inStock).length,  color:'#ef4444' },
          { label:'Featured Products', val: products.filter(p=>p.featured).length,color:'#f59e0b' },
          { label:'Approved Quotes', val: quotes.filter(q=>q.status==='approved').length, color:'#10b981' },
          { label:'Unread Contacts', val: contacts.filter(c=>!c.read).length,     color:'#8b5cf6' },
        ].map(({ label, val, color }) => (
          <div key={label} className="card px-5 py-4 flex items-center gap-3">
            <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ background: color }} />
            <div>
              <div className="font-display text-2xl font-bold text-slate-900 leading-none">{val}</div>
              <div className="text-[11.5px] text-slate-400 mt-0.5">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}