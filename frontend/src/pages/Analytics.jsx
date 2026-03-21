import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import { TrendingUp, Clock, BarChart3, Loader2, AlertTriangle, Shield, Download } from 'lucide-react';
import { api, downloadComplaintsCSV } from '../services/api';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import socket from '../services/socket';

const COLORS = ['#ff6600', '#ff8c00', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6', '#f97316', '#6366f1'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-700 border border-brand-400/30 rounded-lg p-3 text-sm">
        <p className="text-text-primary font-semibold">{label || payload[0].name || payload[0].payload?.name}</p>
        <p className="text-accent">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [summary, setSummary] = useState({ total: 0, today: 0, thisWeek: 0, thisMonth: 0 });
  const [byCategory, setByCategory] = useState([]);
  const [bySource, setBySource] = useState([]);
  const [bySentiment, setBySentiment] = useState([]);
  const [byPriority, setByPriority] = useState([]);
  const [trends, setTrends] = useState([]);
  const [slaBreaches, setSlaBreaches] = useState({ count: 0, complaints: [] });
  const [escalations, setEscalations] = useState({ count: 0, complaints: [] });
  const [regulatory, setRegulatory] = useState({ count: 0, complaints: [] });
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();
  const { isAdmin } = useAuth();

  const gridColor = isDark ? '#333' : '#ddd';
  const tickColor = isDark ? '#999' : '#555';

  const sentimentColors = { Positive: '#22c55e', Neutral: '#eab308', Negative: '#ef4444' };
  const priorityColors = { Urgent: '#ef4444', High: '#ff6600', Medium: '#eab308', Low: '#22c55e' };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [s, c, src, sent, pri, t, sla, esc, reg] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/analytics/by-category'),
        api.get('/analytics/by-source'),
        api.get('/analytics/by-sentiment'),
        api.get('/analytics/by-priority'),
        api.get('/analytics/trends'),
        api.get('/analytics/sla-breaches'),
        api.get('/analytics/escalations'),
        api.get('/analytics/regulatory'),
      ]);
      setSummary(s.data);
      setByCategory(c.data);
      setBySource(src.data);
      setBySentiment(sent.data.map(d => ({ ...d, color: sentimentColors[d.name] || '#666' })));
      setByPriority(pri.data.map(d => ({ ...d, color: priorityColors[d.name] || '#666' })));
      setTrends(t.data);
      setSlaBreaches(sla.data);
      setEscalations(esc.data);
      setRegulatory(reg.data);
    } catch {
      // Keep defaults
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => {
    socket.on('analytics-update', fetchAll);
    return () => socket.off('analytics-update', fetchAll);
  }, []);

  const handleExportCSV = async () => {
    await downloadComplaintsCSV();
  };

  const stats = [
    { label: 'Total', value: summary.total, icon: BarChart3, color: 'text-accent' },
    { label: 'Today', value: summary.today, icon: Clock, color: 'text-accent' },
    { label: 'This Week', value: summary.thisWeek, icon: TrendingUp, color: 'text-accent' },
    { label: 'This Month', value: summary.thisMonth, icon: BarChart3, color: 'text-accent' },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Analytics Dashboard</h1>
          <p className="text-text-secondary mt-1">Complaint trends, SLA tracking & compliance insights</p>
        </div>
        <button onClick={handleExportCSV} className="btn-ghost text-sm flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="card flex items-center gap-4">
              <div className="w-10 h-10 bg-accent-muted rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-text-muted text-sm">{s.label}</p>
                <p className="text-2xl font-bold text-accent">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* SLA + Escalation + Regulatory cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card border-l-4 border-l-red-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/15 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-text-muted text-sm">SLA Breaches</p>
              <p className="text-2xl font-bold text-red-400">{slaBreaches.count}</p>
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-l-orange-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/15 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Escalated</p>
              <p className="text-2xl font-bold text-orange-400">{escalations.count}</p>
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-l-yellow-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/15 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Regulatory Flagged</p>
              <p className="text-2xl font-bold text-yellow-400">{regulatory.count}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 30-day Trend */}
      {trends.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-text-primary mb-4">30-Day Complaint Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" stroke={gridColor} tick={{ fill: tickColor, fontSize: 11 }} />
              <YAxis stroke={gridColor} tick={{ fill: tickColor, fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="count" stroke="#ff6600" strokeWidth={2} dot={{ fill: '#ff6600', r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category PieChart */}
        {byCategory.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-text-primary mb-4">By Category</h2>
            <div className="flex items-center">
              <ResponsiveContainer width="55%" height={250}>
                <PieChart>
                  <Pie data={byCategory} cx="50%" cy="50%" innerRadius={45} outerRadius={90} dataKey="count" paddingAngle={2} strokeWidth={0}>
                    {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 text-xs">
                {byCategory.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-text-secondary truncate max-w-[120px]">{c.name}</span>
                    <span className="text-text-primary font-semibold ml-auto">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Source BarChart */}
        {bySource.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-text-primary mb-4">By Source</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={bySource}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={gridColor} tick={{ fill: tickColor, fontSize: 12 }} />
                <YAxis stroke={gridColor} tick={{ fill: tickColor, fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#ff6600" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Sentiment DonutChart */}
        {bySentiment.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Sentiment Analysis</h2>
            <div className="flex items-center gap-8">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={bySentiment} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="count" paddingAngle={4} strokeWidth={0}>
                    {bySentiment.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {bySentiment.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-sm text-text-secondary">{s.name}</span>
                    <span className="text-sm font-semibold text-text-primary">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Priority BarChart */}
        {byPriority.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Priority Distribution</h2>
            <div className="space-y-4">
              {byPriority.map((p, i) => {
                const total = byPriority.reduce((s, x) => s + x.count, 0);
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-text-secondary">{p.name}</span>
                      <span className="text-sm font-semibold text-text-primary">{p.count}</span>
                    </div>
                    <div className="w-full bg-brand-500 rounded-full h-2.5 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(p.count / total) * 100}%`, backgroundColor: p.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Regulatory flagged complaints table */}
      {regulatory.complaints?.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-400" />
            Regulatory Flagged Complaints
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-400/20">
                  <th className="text-left py-2 px-3 text-text-muted font-medium">Case ID</th>
                  <th className="text-left py-2 px-3 text-text-muted font-medium">Customer</th>
                  <th className="text-left py-2 px-3 text-text-muted font-medium">Category</th>
                  <th className="text-left py-2 px-3 text-text-muted font-medium">Flag</th>
                  <th className="text-left py-2 px-3 text-text-muted font-medium">Reason</th>
                  <th className="text-left py-2 px-3 text-text-muted font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {regulatory.complaints.slice(0, 10).map(c => (
                  <tr key={c._id} className="border-b border-brand-400/10 hover:bg-brand-600/30 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-accent text-xs">{c.caseId}</td>
                    <td className="py-2.5 px-3 text-text-primary">{c.customerName}</td>
                    <td className="py-2.5 px-3 text-text-secondary">{c.category}</td>
                    <td className="py-2.5 px-3">
                      <span className="badge bg-yellow-500/15 text-yellow-400">{c.regulatoryFlag}</span>
                    </td>
                    <td className="py-2.5 px-3 text-text-muted text-xs max-w-[200px] truncate">{c.regulatoryReason}</td>
                    <td className="py-2.5 px-3">
                      <span className={`badge ${c.status === 'resolved' ? 'bg-green-500/15 text-green-400' : c.status === 'escalated' ? 'bg-red-500/15 text-red-400' : 'bg-accent-muted text-accent'}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
