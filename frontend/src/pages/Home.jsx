import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, BarChart3, MessageSquare, Landmark, AlertTriangle, FileCheck, Globe } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Zap, title: 'AI Classification', desc: 'Auto-classify complaints by category, sentiment, priority & severity using Claude AI' },
    { icon: Globe, title: '6-Channel Integration', desc: 'Email, WhatsApp, SMS, Live Chat, Web Form & Manual — all in one unified inbox' },
    { icon: Landmark, title: 'Banking Compliance', desc: 'RBI, FDIC & PCI-DSS regulatory flag detection with automatic escalation rules' },
    { icon: BarChart3, title: 'Real-time Analytics', desc: 'SLA tracking, escalation monitoring, and 30-day trend analysis with live dashboards' },
    { icon: Shield, title: 'Fraud Detection', desc: 'Automatic fraud & dispute escalation with severity scoring and alert system' },
    { icon: FileCheck, title: 'SLA Management', desc: 'Priority-based resolution targets with breach alerts and compliance reporting' },
  ];

  return (
    <div className="min-h-screen bg-brand-900 flex flex-col">
      {/* Header */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-brand-400/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
            <span className="text-white font-extrabold text-lg">CX</span>
          </div>
          <span className="text-xl font-bold text-text-primary">CX<span className="text-accent">360</span></span>
        </div>
        <button onClick={() => navigate('/login')} className="btn-primary">
          Login
        </button>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-muted text-accent rounded-full text-sm font-medium mb-6 animate-pulse-orange">
          <Zap className="w-4 h-4" />
          CX360 v1.0.0
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-text-primary leading-tight max-w-4xl mb-4">
          Intelligent Complaint{' '}
          <span className="text-accent">Resolution.</span>
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-text-secondary mb-6">
          Full Circle.
        </h2>

        <p className="text-lg text-text-secondary max-w-xl mb-10 leading-relaxed">
          AI-powered complaint management for Banking & Financial Services.
          Classify, escalate, and resolve across 6 channels — in real time.
        </p>

        <div className="flex gap-4">
          <button onClick={() => navigate('/login')} className="btn-primary text-lg px-8 py-3.5 shadow-lg shadow-accent/20">
            Get Started
          </button>
          <button className="btn-ghost text-lg px-8 py-3.5">
            Learn More
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-20 max-w-5xl w-full">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="card-hover text-left animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="w-10 h-10 bg-accent-muted rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-12 mt-16">
          {[
            { label: 'Channels', value: '6' },
            { label: 'Banking Categories', value: '10' },
            { label: 'Compliance Standards', value: '3' },
            { label: 'Response Time', value: '<2s' },
          ].map((s, i) => (
            <div key={i} className="text-center animate-slide-up" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
              <p className="text-3xl font-extrabold text-accent">{s.value}</p>
              <p className="text-sm text-text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-brand-400/10">
        <p className="text-text-muted text-sm">
          © 2025 CX360 — Intelligent Complaint Resolution. Full Circle.
          <br />
          <span className="text-text-muted/60">Banking & Financial Services</span>
        </p>
      </footer>
    </div>
  );
};

export default Home;
