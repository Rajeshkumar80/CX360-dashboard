import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Zap, Globe, Landmark, BarChart3, Shield, FileCheck,
  Mail, MessageSquare, Phone, PenSquare, Monitor, Users,
  CheckCircle, AlertTriangle, TrendingUp
} from 'lucide-react';

const LearnMore = () => {
  const navigate = useNavigate();

  const channels = [
    { icon: Mail, name: 'Email', desc: 'IMAP polling auto-ingests support emails into the system' },
    { icon: MessageSquare, name: 'WhatsApp', desc: 'Twilio-powered WhatsApp integration for instant messaging' },
    { icon: Phone, name: 'SMS & Phone', desc: 'Receive complaints via SMS or phone call transcripts' },
    { icon: Monitor, name: 'Live Chat', desc: 'Real-time chat widget integration with webhook support' },
    { icon: Globe, name: 'Web Form', desc: 'Customer-facing complaint submission form' },
    { icon: PenSquare, name: 'Manual Entry', desc: 'Agents can log complaints received via walk-in or other channels' },
  ];

  const howItWorks = [
    { step: '1', title: 'Complaint Arrives', desc: 'A complaint comes in through any of the 6 supported channels — email, WhatsApp, SMS, phone, live chat, or web form.' },
    { step: '2', title: 'AI Classification', desc: 'The AI engine analyzes the message and classifies it by category, sentiment, priority, severity, and regulatory flags.' },
    { step: '3', title: 'Auto-Escalation', desc: 'High-severity or fraud-related complaints are automatically escalated to the appropriate team with alerts.' },
    { step: '4', title: 'Agent Response', desc: 'AI generates a professional draft response. Agents can review, edit, and send — or let the system auto-respond.' },
    { step: '5', title: 'Track & Resolve', desc: 'SLA timers track resolution progress. Dashboards show real-time analytics and compliance status.' },
  ];

  const roles = [
    { icon: Shield, role: 'Admin', features: ['Full inbox access with AI-classified complaints', 'Manual complaint entry with AI analysis', 'Real-time analytics dashboard', 'Complaints log with filters & export', 'Channel & system settings management'] },
    { icon: Users, role: 'Manager', features: ['Analytics dashboard with trends & KPIs', 'Complaints log with search & filters', 'Monitor team performance & SLA compliance', 'View escalation reports'] },
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
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="btn-ghost flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button onClick={() => navigate('/login')} className="btn-primary">
            Login
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 px-8 py-16 max-w-6xl mx-auto w-full">

        {/* Intro */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4">
            How <span className="text-accent">CX360</span> Works
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            An end-to-end AI-powered complaint management system built for banking and financial services.
            From intake to resolution — fully automated, fully compliant.
          </p>
        </div>

        {/* How It Works - Steps */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
            <TrendingUp className="w-6 h-6 text-accent inline-block mr-2 -mt-1" />
            Complaint Lifecycle
          </h2>
          <div className="space-y-4">
            {howItWorks.map((item, i) => (
              <div key={i} className="flex gap-4 items-start card-hover animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6 Channels */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
            <Globe className="w-6 h-6 text-accent inline-block mr-2 -mt-1" />
            6-Channel Intake
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {channels.map((ch, i) => {
              const Icon = ch.icon;
              return (
                <div key={i} className="card-hover text-left animate-slide-up" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="w-10 h-10 bg-accent-muted rounded-lg flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-1">{ch.name}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{ch.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* AI Features */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
            <Zap className="w-6 h-6 text-accent inline-block mr-2 -mt-1" />
            AI-Powered Intelligence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="card-hover">
              <h3 className="font-semibold text-text-primary mb-3">Classification Engine</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" /> 10 banking-specific categories</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" /> Sentiment analysis (Positive / Neutral / Negative)</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" /> Priority assignment (Low → Urgent)</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" /> Severity scoring (1–10)</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" /> Confidence percentage for transparency</li>
              </ul>
            </div>
            <div className="card-hover">
              <h3 className="font-semibold text-text-primary mb-3">Compliance & Escalation</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" /> RBI regulatory flag detection</li>
                <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" /> PCI-DSS compliance alerts</li>
                <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" /> FDIC mention tracking</li>
                <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" /> Auto-escalation for fraud & high severity</li>
                <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" /> SLA breach alerts with priority-based targets</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Roles */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
            <Users className="w-6 h-6 text-accent inline-block mr-2 -mt-1" />
            Role-Based Access
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((r, i) => {
              const Icon = r.icon;
              return (
                <div key={i} className="card-hover animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent-muted rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary">{r.role}</h3>
                  </div>
                  <ul className="space-y-2">
                    {r.features.map((feat, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                        <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Ready to get started?</h2>
          <p className="text-text-secondary mb-6">Login to access the dashboard and start managing complaints.</p>
          <button onClick={() => navigate('/login')} className="btn-primary text-lg px-8 py-3.5 shadow-lg shadow-accent/20">
            Go to Login
          </button>
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

export default LearnMore;
