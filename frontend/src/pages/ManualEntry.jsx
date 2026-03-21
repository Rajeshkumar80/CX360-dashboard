import React, { useState } from 'react';
import { Sparkles, Copy, Check, Loader2, CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import { api } from '../services/api';

const BANKING_CATEGORIES = [
  'Transaction Issue', 'Fraud & Dispute', 'Loan & EMI', 'KYC & Account',
  'Card Services', 'Net Banking / App', 'Interest & Charges', 'Branch & ATM',
  'General', 'Other',
];

const ManualEntry = () => {
  const [form, setForm] = useState({
    rawMessage: '', source: 'manual', manualCategory: '', manualPriority: '',
    customerName: '', customerId: '', customerContact: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.rawMessage.length < 10) {
      setError('Message must be at least 10 characters');
      return;
    }
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const { data } = await api.post('/complaints/manual', form);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyse complaint');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.aiReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setForm({
      rawMessage: '', source: 'manual', manualCategory: '', manualPriority: '',
      customerName: '', customerId: '', customerContact: '',
    });
    setResult(null);
    setError('');
  };

  const getBadge = (type, value) => {
    const map = {
      sentiment: { Negative: 'bg-red-500/15 text-red-400', Neutral: 'bg-yellow-500/15 text-yellow-400', Positive: 'bg-green-500/15 text-green-400' },
      priority: { Urgent: 'bg-red-500/15 text-red-400', High: 'bg-orange-500/15 text-orange-400', Medium: 'bg-yellow-500/15 text-yellow-400', Low: 'bg-green-500/15 text-green-400' },
    };
    return map[type]?.[value] || 'bg-brand-500 text-text-secondary';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Manual Complaint Entry</h1>
        <p className="text-text-secondary mt-1">Enter a banking complaint and get AI-powered analysis</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Customer Name</label>
              <input name="customerName" value={form.customerName} onChange={handleChange} placeholder="Enter name" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Customer ID <span className="text-text-muted">(optional)</span></label>
              <input name="customerId" value={form.customerId} onChange={handleChange} placeholder="CUS-XXXX" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Contact</label>
              <input name="customerContact" value={form.customerContact} onChange={handleChange} placeholder="Email or phone" className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Source</label>
              <select name="source" value={form.source} onChange={handleChange} className="input-field">
                {['manual', 'email', 'chat', 'webform', 'phone', 'whatsapp'].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Category Hint</label>
              <select name="manualCategory" value={form.manualCategory} onChange={handleChange} className="input-field">
                <option value="">Auto-detect</option>
                {BANKING_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Priority Hint</label>
              <select name="manualPriority" value={form.manualPriority} onChange={handleChange} className="input-field">
                <option value="">Auto-detect</option>
                {['Low', 'Medium', 'High', 'Urgent'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Complaint Description</label>
            <textarea name="rawMessage" value={form.rawMessage} onChange={handleChange} rows={5} required placeholder="Type or paste the banking complaint here (min 10 characters)..." className="input-field resize-none" />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading || !!result} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analysing...</> : <><Sparkles className="w-4 h-4" /> Analyse & Suggest Reply</>}
          </button>
        </form>
      </div>

      {result && (
        <div className="card animate-fade-in">
          {/* Escalation alert */}
          {result.shouldEscalate && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-bold text-red-400 uppercase">ESCALATED — {result.escalationReason}</span>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">AI Analysis Result</h2>
            <span className="font-mono text-sm text-accent font-semibold">{result.caseId}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="badge bg-accent-muted text-accent">{result.category}</span>
            <span className={`badge ${getBadge('sentiment', result.sentiment)}`}>{result.sentiment}</span>
            <span className={`badge ${getBadge('priority', result.priority)}`}>{result.priority}</span>
            {result.confidence != null && <span className="badge bg-brand-500 text-text-secondary">{result.confidence}% confidence</span>}
            {result.severityScore && <span className="badge bg-brand-500 text-text-secondary">Severity: {result.severityScore}/10</span>}
            {result.regulatoryFlag && result.regulatoryFlag !== 'None' && (
              <span className="badge bg-yellow-500/15 text-yellow-400">⚠️ {result.regulatoryFlag}</span>
            )}
          </div>

          {/* Severity bar */}
          {result.severityScore && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-muted">Severity Score</span>
                <span className="text-xs font-mono text-text-secondary">{result.severityScore}/10</span>
              </div>
              <div className="w-full h-2 bg-brand-500 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${result.severityScore * 10}%`,
                    backgroundColor: result.severityScore >= 8 ? '#ef4444' : result.severityScore >= 5 ? '#ff6600' : '#22c55e',
                  }}
                />
              </div>
            </div>
          )}

          {/* Suggested action */}
          {result.suggestedAction && (
            <div className="mb-4 px-3 py-2 bg-brand-800 rounded-lg">
              <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Internal Action Note</p>
              <p className="text-sm text-text-secondary">{result.suggestedAction}</p>
            </div>
          )}

          <div className="bg-brand-800 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-accent uppercase tracking-wide">⚠ Suggested Reply — Do Not Send From This Portal</span>
              <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors">
                {copied ? <><Check className="w-3.5 h-3.5 text-green-400" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Reply</>}
              </button>
            </div>
            <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">{result.aiReply}</p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-brand-400/20">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Saved to Complaints Log</span>
            </div>
            <button onClick={handleReset} className="btn-ghost text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> New Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualEntry;
