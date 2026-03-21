import React, { useEffect, useState } from 'react';
import { Search, Loader2, CheckCircle, ChevronDown, ChevronUp, Copy, Check, Mail, MessageSquare, Globe, Phone, Sparkles, AlertTriangle, MessageCircle, Download } from 'lucide-react';
import { api, downloadComplaintsCSV } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const BANKING_CATEGORIES = [
  'Transaction Issue', 'Fraud & Dispute', 'Loan & EMI', 'KYC & Account',
  'Card Services', 'Net Banking / App', 'Interest & Charges', 'Branch & ATM',
  'General', 'Other',
];

const sourceIcon = { email: Mail, chat: MessageSquare, webform: Globe, phone: Phone, whatsapp: MessageCircle, manual: Sparkles };

const ComplaintsLog = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [total, setTotal] = useState(0);
  const [expanded, setExpanded] = useState({});
  const [copied, setCopied] = useState({});
  const [resolveData, setResolveData] = useState({});
  const { isAdmin } = useAuth();

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filterCategory) params.category = filterCategory;
      if (filterPriority) params.priority = filterPriority;
      if (filterStatus) params.status = filterStatus;
      const { data } = await api.get('/complaints', { params });
      setComplaints(data.complaints || []);
      setTotal(data.total || 0);
    } catch {
      setComplaints([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchComplaints(); }, [filterCategory, filterPriority, filterStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const handleResolve = async (id) => {
    const note = resolveData[id] || '';
    if (note.length < 5) return;
    try {
      await api.patch(`/complaints/${id}/resolve`, { resolutionNote: note });
      fetchComplaints();
      setResolveData(prev => ({ ...prev, [id]: '' }));
    } catch {}
  };

  const handleCopy = (id, text, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [id]: false })), 2000);
  };

  const getBadge = (type, value) => {
    const map = {
      sentiment: { Negative: 'bg-red-500/15 text-red-400', Neutral: 'bg-yellow-500/15 text-yellow-400', Positive: 'bg-green-500/15 text-green-400' },
      priority: { Urgent: 'bg-red-500/15 text-red-400', High: 'bg-orange-500/15 text-orange-400', Medium: 'bg-yellow-500/15 text-yellow-400', Low: 'bg-green-500/15 text-green-400' },
      status: { pending: 'bg-yellow-500/15 text-yellow-400', classified: 'bg-accent-muted text-accent', resolved: 'bg-green-500/15 text-green-400', escalated: 'bg-red-500/15 text-red-400' },
    };
    return map[type]?.[value] || 'bg-brand-500 text-text-secondary';
  };

  const SLAColors = {
    within: 'bg-green-500/15 text-green-400',
    approaching: 'bg-yellow-500/15 text-yellow-400',
    breached: 'bg-red-500/15 text-red-400',
  };

  const handleExportCSV = async () => {
    const params = {};
    if (search) params.search = search;
    if (filterCategory) params.category = filterCategory;
    if (filterPriority) params.priority = filterPriority;
    if (filterStatus) params.status = filterStatus;
    await downloadComplaintsCSV(params);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Complaints Log</h1>
          <p className="text-text-secondary mt-1">Search and manage all complaints</p>
        </div>
        <button
          type="button"
          onClick={handleExportCSV}
          className="btn-ghost text-sm flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search complaints..." className="input-field pl-10" />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="input-field py-2 w-auto">
          <option value="">All Categories</option>
          {BANKING_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="input-field py-2 w-auto">
          <option value="">All Priorities</option>
          {['Low', 'Medium', 'High', 'Urgent'].map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-field py-2 w-auto">
          <option value="">All Status</option>
          {['pending', 'classified', 'resolved', 'escalated'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <button type="submit" className="btn-primary text-sm">Search</button>
      </form>

      <p className="text-sm text-text-muted">{total} complaint{total !== 1 ? 's' : ''} found</p>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>
      ) : complaints.length === 0 ? (
        <div className="card text-center py-12 text-text-muted">No complaints found.</div>
      ) : (
        <div className="space-y-2">
          {complaints.map(c => {
            const isOpen = expanded[c._id];
            const Icon = sourceIcon[c.source] || Mail;
            return (
              <div key={c._id} className={`card !p-0 overflow-hidden ${c.shouldEscalate ? 'border-l-4 border-l-red-500' : ''}`}>
                {/* Row header */}
                <div
                  onClick={() => toggleExpand(c._id)}
                  className="flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-brand-600/30 transition-colors"
                >
                  <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-accent">{c.caseId}</span>
                      <span className="font-semibold text-text-primary text-sm">{c.customerName}</span>
                      <span className="text-xs text-text-muted capitalize">· {c.source}</span>
                      <span className="text-xs text-text-muted">· {new Date(c.createdAt).toLocaleDateString()}</span>
                      {c.regulatoryFlag && c.regulatoryFlag !== 'None' && (
                        <span className="text-yellow-400 text-xs">⚠️ {c.regulatoryFlag}</span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted mt-0.5 truncate max-w-lg">{c.rawMessage}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                    <span className="badge bg-accent-muted text-accent">{c.category}</span>
                    <span className={`badge ${getBadge('sentiment', c.sentiment)}`}>{c.sentiment}</span>
                    <span className={`badge ${getBadge('priority', c.priority)}`}>{c.priority}</span>
                    <span className={`badge ${getBadge('status', c.status)}`}>{c.status}</span>
                    {c.slaStatus && <span className={`badge ${SLAColors[c.slaStatus] || ''}`}>{c.slaStatus}</span>}
                  </div>

                  <div className="shrink-0 ml-2">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
                  </div>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-2 border-t border-brand-400/20 animate-fade-in">
                    {/* Escalation banner */}
                    {c.shouldEscalate && (
                      <div className="flex items-center gap-2 mb-4 px-3 py-1.5 bg-red-500/10 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-bold text-red-400 uppercase">ESCALATED to {c.escalatedTo} — {c.escalationReason}</span>
                      </div>
                    )}

                    {/* Info row */}
                    <div className="flex flex-wrap gap-x-6 gap-y-1 mb-4 text-sm">
                      {c.customerContact && (
                        <span className="text-text-secondary"><span className="text-text-muted">Contact:</span> {c.customerContact}</span>
                      )}
                      {c.customerId && (
                        <span className="text-text-secondary"><span className="text-text-muted">ID:</span> {c.customerId}</span>
                      )}
                      {c.confidence != null && (
                        <span className="text-text-secondary"><span className="text-text-muted">Confidence:</span> {c.confidence}%</span>
                      )}
                      {c.severityScore && (
                        <span className="text-text-secondary"><span className="text-text-muted">Severity:</span> {c.severityScore}/10</span>
                      )}
                      <span className="text-text-secondary"><span className="text-text-muted">Processed:</span> {new Date(c.processedAt || c.createdAt).toLocaleString()}</span>
                    </div>

                    {/* Full message */}
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Complaint Description</h4>
                      <div className="bg-brand-800 rounded-lg p-4">
                        <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">{c.rawMessage}</p>
                      </div>
                    </div>

                    {/* Suggested action */}
                    {c.suggestedAction && (
                      <div className="mb-4 px-3 py-2 bg-brand-800 rounded-lg">
                        <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Internal Action Note</p>
                        <p className="text-sm text-text-secondary">{c.suggestedAction}</p>
                      </div>
                    )}

                    {/* AI Reply */}
                    {c.aiReply && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-semibold text-accent uppercase tracking-wide">⚠ Suggested Reply — Do Not Send From This Portal</h4>
                          <button
                            onClick={(e) => handleCopy(c._id, c.aiReply, e)}
                            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors"
                          >
                            {copied[c._id] ? <><Check className="w-3.5 h-3.5 text-green-400" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Reply</>}
                          </button>
                        </div>
                        <div className="bg-brand-800 rounded-lg p-4">
                          <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">{c.aiReply}</p>
                        </div>
                      </div>
                    )}

                    {/* Resolution */}
                    {c.status === 'resolved' && c.resolutionNote && (
                      <div className="border-t border-brand-400/20 pt-3">
                        <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-1">✓ Resolved</h4>
                        <p className="text-sm text-text-secondary">{c.resolutionNote}</p>
                        <p className="text-xs text-text-muted mt-1">Resolved: {new Date(c.resolvedAt).toLocaleString()}</p>
                      </div>
                    )}

                    {/* Resolve action */}
                    {isAdmin && c.status !== 'resolved' && (
                      <div className="border-t border-brand-400/20 pt-4 mt-4">
                        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Resolve Complaint</h4>
                        <textarea
                          placeholder="Enter resolution notes (required, min 5 characters)..."
                          value={resolveData[c._id] || ''}
                          onChange={(e) => setResolveData(prev => ({ ...prev, [c._id]: e.target.value }))}
                          className="input-field resize-none text-sm"
                          rows={2}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={() => handleResolve(c._id)}
                          disabled={!resolveData[c._id] || resolveData[c._id].length < 5}
                          className="btn-primary text-sm mt-2 disabled:opacity-40"
                        >
                          <CheckCircle className="w-4 h-4 inline mr-1" /> Mark as Resolved
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ComplaintsLog;
