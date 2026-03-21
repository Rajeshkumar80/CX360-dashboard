import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Inbox, PenSquare, BarChart3, FileText, Settings, TrendingUp, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ total: 0, today: 0, thisWeek: 0, thisMonth: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/summary').then(({ data }) => setSummary(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const prefix = isAdmin ? '/admin' : '/manager';

  const stats = [
    { label: 'Total', value: summary.total, icon: BarChart3, color: 'text-accent' },
    { label: 'Today', value: summary.today, icon: Clock, color: 'text-accent' },
    { label: 'This Week', value: summary.thisWeek, icon: TrendingUp, color: 'text-status-success' },
    { label: 'This Month', value: summary.thisMonth, icon: AlertTriangle, color: 'text-status-warning' },
  ];

  const quickLinks = isAdmin ? [
    { label: 'Inbox', desc: 'Process incoming complaints', icon: Inbox, path: `${prefix}/inbox` },
    { label: 'Manual Entry', desc: 'Enter & analyse a complaint', icon: PenSquare, path: `${prefix}/manual` },
    { label: 'Analytics', desc: 'View charts & insights', icon: BarChart3, path: `${prefix}/analytics` },
    { label: 'Complaints Log', desc: 'Browse all complaints', icon: FileText, path: `${prefix}/complaints` },
    { label: 'Settings', desc: 'Channel configuration', icon: Settings, path: `${prefix}/settings` },
  ] : [
    { label: 'Analytics', desc: 'View charts & insights', icon: BarChart3, path: `${prefix}/analytics` },
    { label: 'Complaints Log', desc: 'Browse all complaints', icon: FileText, path: `${prefix}/complaints` },
  ];

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Welcome back, {user?.name}</h1>
        <p className="text-text-secondary mt-1">CX360 Banking Complaint Management System</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm">{s.label}</p>
                  <p className="text-3xl font-bold text-accent mt-1">{s.value}</p>
                </div>
                <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-3">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {quickLinks.map((link, i) => {
            const Icon = link.icon;
            return (
              <button key={i} onClick={() => navigate(link.path)} className="card-hover text-left group">
                <div className="w-10 h-10 bg-accent-muted rounded-lg flex items-center justify-center mb-3 group-hover:bg-accent transition-colors">
                  <Icon className="w-5 h-5 text-accent group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-text-primary">{link.label}</h3>
                <p className="text-sm text-text-secondary mt-1">{link.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
