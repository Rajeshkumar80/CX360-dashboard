import React, { useState, useEffect, useCallback } from 'react';
import { Mail, MessageSquare, Globe, Phone, Sparkles, Copy, Check, Loader2, RefreshCw, AlertTriangle, Shield, Clock, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { api } from '../services/api';
import socket from '../services/socket';

const sourceIcon = {
  email: Mail, chat: MessageSquare, webform: Globe, phone: Phone,
  whatsapp: MessageCircle, manual: Sparkles,
};
const sourceLabel = {
  email: 'Email', chat: 'Live Chat', webform: 'Web Form',
  phone: 'Phone', whatsapp: 'WhatsApp', manual: 'Manual',
};

const SLAColors = {
  within: 'bg-green-500/15 text-green-400',
  approaching: 'bg-yellow-500/15 text-yellow-400',
  breached: 'bg-red-500/15 text-red-400',
};

const AutomatedInbox = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [copied, setCopied] = useState({});
  const [expanded, setExpanded] = useState({});
  const [newIds, setNewIds] = useState(new Set());
  const [customerHistory, setCustomerHistory] = useState({});
  const [resolveData, setResolveData] = useState({});

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter ? { source: filter } : {};
      const { data } = await api.get('/complaints', { params });
      setComplaints(data.complaints || []);
    } catch {
      setComplaints([]);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  useEffect(() => {
    const handler = (complaint) => {
      setComplaints(prev => [complaint, ...prev]);
      setNewIds(prev => new Set([...prev, complaint._id]));
      setTimeout(() => setNewIds(prev => {
        const next = new Set(prev);
        next.delete(complaint._id);
        return next;
      }), 3000);
    };
    socket.on('new-complaint', handler);
    return () => socket.off('new-complaint', handler);
  }, []);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [id]: false })), 2000);
  };

  const fetchCustomerHistory = async (contact) => {
    if (!contact || customerHistory[contact]) return;
    try {
      const { data } = await api.get(`/complaints/customer/${encodeURIComponent(contact)}`);
      setCustomerHistory(prev => ({ ...prev, [contact]: data }));
    } catch {}
  };

  const handleResolve = async (id) => {
    const note = resolveData[id] || '';
    if (note.length < 5) return;
    try {
      await api.patch(`/complaints/${id}/resolve`, { resolutionNote: note });
      fetchComplaints();
      setResolveData(prev => ({ ...prev, [id]: '' }));
    } catch {}
  };

  const getBadge = (type, value) => {
    const map = {
      sentiment: { Negative: 'bg-red-500/15 text-red-400', Neutral: 'bg-yellow-500/15 text-yellow-400', Positive: 'bg-green-500/15 text-green-400' },
      priority: { Urgent: 'bg-red-500/15 text-red-400', High: 'bg-orange-500/15 text-orange-400', Medium: 'bg-yellow-500/15 text-yellow-400', Low: 'bg-green-500/15 text-green-400' },
    };
    return map[type]?.[value] || 'bg-brand-500 text-text-secondary';
  };

  const tabs = [
    { value: '', label: 'All' },
    { value: 'email', label: 'Email' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'phone', label: 'Phone' },
    { value: 'chat', label: 'Chat' },
    { value: 'webform', label: 'Web Form' },
    { value: 'manual', label: 'Manual' },
  ];

  const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  // Check for high severity alerts
  const highSeverity = complaints.filter(c => c.severityScore >= 8 && c.status !== 'resolved');

  return (
    <div className="space-y-5 animate-fade-in">
      {/* High severity banner */}
      {highSeverity.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 animate-slide-down">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-400">
              {highSeverity.length} High Severity Alert{highSeverity.length > 1 ? 's' : ''}
            </p>
            <p className="text-xs text-red-400/70">
              {highSeverity.map(c => c.caseId).join(', ')}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Automated Inbox</h1>
          <p className="text-text-secondary mt-1">Real-time complaints classified by AI</p>
        </div>
        <button onClick={fetchComplaints} className="btn-ghost text-sm flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-brand-800 p-1 rounded-lg w-fit flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === tab.value ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
        </div>
      ) : complaints.length === 0 ? (
        <div className="card text-center py-12 text-text-muted">No complaints found.</div>
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => {
            const Icon = sourceIcon[c.source] || Mail;
            const isExpanded = expanded[c._id];
            const isNew = newIds.has(c._id);
            const history = customerHistory[c.customerContact];

            return (
              <div
                key={c._id}
                className={`card cursor-pointer transition-all duration-300 ${isNew ? 'animate-flash-orange' : ''} ${c.shouldEscalate ? 'border-l-4 border-l-red-500' : ''}`}
                onClick={() => {
                  setExpanded(prev => ({ ...prev, [c._id]: !prev[c._id] }));
                  if (!isExpanded && c.customerContact) fetchCustomerHistory(c.customerContact);
                }}
              >
                {/* Escalation banner */}
                {c.shouldEscalate && (
                  <div className="flex items-center gap-2 mb-3 px-3 py-1.5 bg-red-500/10 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-bold text-red-400 uppercase">ESCALATED — {c.escalationReason || 'Requires immediate attention'}</span>
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-brand-500 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-accent font-semibold">{c.caseId}</span>
                        <span className="font-semibold text-text-primary text-sm">{c.customerName}</span>
                        <span className="badge bg-brand-500 text-text-muted text-[10px]">{sourceLabel[c.source] || c.source}</span>
                        {c.regulatoryFlag && c.regulatoryFlag !== 'None' && (
                          <span className="badge bg-yellow-500/15 text-yellow-400 text-[10px]">⚠️ {c.regulatoryFlag}</span>
                        )}
                      </div>
                      <p className="text-xs text-text-muted">{c.customerContact} · {timeAgo(c.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0 flex-wrap items-center">
                    {c.category && <span className="badge bg-accent-muted text-accent">{c.category}</span>}
                    {c.priority && <span className={`badge ${getBadge('priority', c.priority)}`}>{c.priority}</span>}
                    {c.sentiment && <span className={`badge ${getBadge('sentiment', c.sentiment)}`}>{c.sentiment}</span>}
                    {c.slaStatus && <span className={`badge ${SLAColors[c.slaStatus] || ''}`}>{c.slaStatus === 'within' ? '🟢 SLA OK' : c.slaStatus === 'approaching' ? '🟡 SLA Near' : '🔴 SLA Breach'}</span>}
                    {/* Severity meter */}
                    {c.severityScore && (
                      <div className="flex items-center gap-1" title={`Severity: ${c.severityScore}/10`}>
                        <div className="w-16 h-1.5 bg-brand-500 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${c.severityScore * 10}%`,
                              backgroundColor: c.severityScore >= 8 ? '#ef4444' : c.severityScore >= 5 ? '#ff6600' : '#22c55e',
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-text-muted">{c.severityScore}</span>
                      </div>
                    )}
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
                  </div>
                </div>

                <p className="text-sm text-text-secondary mt-3 line-clamp-2">{c.rawMessage}</p>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-brand-400/20 animate-fade-in" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-6">
                      {/* Main content */}
                      <div className="flex-1 space-y-4">
                        {/* Full message */}
                        <div>
                          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Full Message</h4>
                          <div className="bg-brand-800 rounded-lg p-4 max-h-40 overflow-y-auto">
                            <p className="text-sm text-text-primary whitespace-pre-wrap">{c.rawMessage}</p>
                          </div>
                        </div>

                        {/* Classification details */}
                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                          {c.confidence != null && <span className="text-text-secondary"><span className="text-text-muted">Confidence:</span> {c.confidence}%</span>}
                          {c.severityScore && <span className="text-text-secondary"><span className="text-text-muted">Severity:</span> {c.severityScore}/10</span>}
                          {c.regulatoryFlag && c.regulatoryFlag !== 'None' && <span className="text-yellow-400"><span className="text-text-muted">Regulatory:</span> {c.regulatoryFlag} — {c.regulatoryReason}</span>}
                        </div>

                        {/* Suggested action */}
                        {c.suggestedAction && (
                          <div>
                            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Suggested Action (Internal)</h4>
                            <p className="text-sm text-text-secondary italic">{c.suggestedAction}</p>
                          </div>
                        )}

                        {/* AI Reply */}
                        {c.aiReply && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-accent uppercase tracking-wide">⚠ Suggested Reply — Do Not Send From This Portal</span>
                              <button
                                onClick={() => handleCopy(c._id, c.aiReply)}
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

                        {/* Resolution section */}
                        {c.status !== 'resolved' && (
                          <div className="border-t border-brand-400/20 pt-4">
                            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Resolve Complaint</h4>
                            <textarea
                              placeholder="Enter resolution notes (required)..."
                              value={resolveData[c._id] || ''}
                              onChange={(e) => setResolveData(prev => ({ ...prev, [c._id]: e.target.value }))}
                              className="input-field resize-none text-sm"
                              rows={2}
                            />
                            <button
                              onClick={() => handleResolve(c._id)}
                              disabled={!resolveData[c._id] || resolveData[c._id].length < 5}
                              className="btn-primary text-sm mt-2 disabled:opacity-40"
                            >
                              ✓ Mark as Resolved
                            </button>
                          </div>
                        )}

                        {c.status === 'resolved' && c.resolutionNote && (
                          <div className="border-t border-brand-400/20 pt-3">
                            <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-1">✓ Resolved</h4>
                            <p className="text-sm text-text-secondary">{c.resolutionNote}</p>
                            <p className="text-xs text-text-muted mt-1">Resolved at: {new Date(c.resolvedAt).toLocaleString()}</p>
                          </div>
                        )}
                      </div>

                      {/* Customer History Sidebar */}
                      {c.customerContact && (
                        <div className="w-56 shrink-0 border-l border-brand-400/20 pl-4">
                          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Customer History</h4>
                          {history ? (
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs text-text-muted">Total Complaints</p>
                                <p className="text-lg font-bold text-text-primary">{history.totalComplaints}</p>
                              </div>
                              <div>
                                <p className="text-xs text-text-muted">Most Common</p>
                                <p className="text-sm font-medium text-accent">{history.mostCommonCategory}</p>
                              </div>
                              <div>
                                <p className="text-xs text-text-muted">Avg Resolution</p>
                                <p className="text-sm font-medium text-text-secondary">{history.avgResolutionTime}</p>
                              </div>
                              {history.complaints?.length > 1 && (
                                <div>
                                  <p className="text-xs text-text-muted mb-2">Previous Cases</p>
                                  {history.complaints.filter(h => h._id !== c._id).slice(0, 3).map(h => (
                                    <div key={h._id} className="py-1.5 border-b border-brand-400/10 last:border-0">
                                      <p className="text-[10px] font-mono text-accent">{h.caseId}</p>
                                      <p className="text-[10px] text-text-muted truncate">{h.category} · {h.status}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <Loader2 className="w-4 h-4 animate-spin text-accent mx-auto" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
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

export default AutomatedInbox;
