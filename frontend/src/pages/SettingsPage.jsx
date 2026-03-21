import React, { useEffect, useState } from 'react';
import { Mail, MessageCircle, Phone, MessageSquare, Globe, Loader2, Check, X, Sparkles } from 'lucide-react';
import { api } from '../services/api';

const CHANNEL_META = {
  email: {
    name: 'Email (IMAP)',
    icon: Mail,
    description: 'Poll inbox via IMAP for incoming complaint emails',
    fields: [
      { key: 'host', label: 'IMAP Host', placeholder: 'imap.gmail.com' },
      { key: 'port', label: 'Port', placeholder: '993' },
      { key: 'user', label: 'Email Address', placeholder: 'support@company.com' },
      { key: 'password', label: 'App Password', placeholder: '••••••••', type: 'password' },
    ],
  },
  whatsapp: {
    name: 'WhatsApp',
    icon: MessageCircle,
    description: 'Receive complaints via Twilio WhatsApp Business API',
    fields: [
      { key: 'accountSid', label: 'Account SID', placeholder: 'ACxxxxxxxxxx' },
      { key: 'authToken', label: 'Auth Token', placeholder: '••••••••', type: 'password' },
      { key: 'whatsappNumber', label: 'WhatsApp Number', placeholder: 'whatsapp:+14155238886' },
    ],
  },
  sms: {
    name: 'SMS / Phone',
    icon: Phone,
    description: 'Receive SMS and call transcripts via Twilio',
    fields: [
      { key: 'accountSid', label: 'Account SID', placeholder: 'ACxxxxxxxxxx' },
      { key: 'authToken', label: 'Auth Token', placeholder: '••••••••', type: 'password' },
      { key: 'phoneNumber', label: 'Phone Number', placeholder: '+1xxxxxxxxxx' },
    ],
  },
  chat: {
    name: 'Live Chat',
    icon: MessageSquare,
    description: 'Receive chat transcripts from Tawk.to or Crisp',
    fields: [
      { key: 'platform', label: 'Platform', placeholder: 'tawk.to or crisp' },
      { key: 'webhookSecret', label: 'Webhook Secret', placeholder: '••••••••', type: 'password' },
    ],
  },
  webform: {
    name: 'Web Form',
    icon: Globe,
    description: 'Direct website form submissions — always available',
    fields: [],
  },
};

const StatusDot = ({ status }) => {
  const labels = {
    connected: '🟢 Connected',
    disconnected: '🔴 Disconnected',
    unconfigured: '🟡 Not configured',
  };
  return (
    <span className="flex items-center gap-1.5 text-xs text-text-secondary">
      {labels[status] || 'Unknown'}
    </span>
  );
};

const SettingsPage = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [testing, setTesting] = useState({});
  const [testResults, setTestResults] = useState({});
  const [credentials, setCredentials] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/settings/channels');
      setSettings(data);
    } catch {
      setSettings([]);
    }
    setLoading(false);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggle = async (channel, currentEnabled) => {
    setSaving(prev => ({ ...prev, [channel]: true }));
    try {
      await api.patch(`/settings/channels/${channel}`, { enabled: !currentEnabled });
      showToast(`${channel} ${!currentEnabled ? 'enabled' : 'disabled'}`);
      fetchSettings();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update', 'error');
    }
    setSaving(prev => ({ ...prev, [channel]: false }));
  };

  const handleSave = async (channel) => {
    const creds = credentials[channel];
    if (!creds || Object.keys(creds).length === 0) return;
    setSaving(prev => ({ ...prev, [channel]: true }));
    try {
      await api.patch(`/settings/channels/${channel}`, { credentials: creds });
      showToast(`${channel} credentials saved`);
      setCredentials(prev => ({ ...prev, [channel]: {} }));
      fetchSettings();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to save', 'error');
    }
    setSaving(prev => ({ ...prev, [channel]: false }));
  };

  const handleTest = async (channel) => {
    setTesting(prev => ({ ...prev, [channel]: true }));
    setTestResults(prev => ({ ...prev, [channel]: null }));
    try {
      const { data } = await api.post(`/settings/channels/${channel}/test`);
      setTestResults(prev => ({ ...prev, [channel]: data }));
      fetchSettings();
    } catch (err) {
      setTestResults(prev => ({ ...prev, [channel]: { success: false, message: err.response?.data?.error || 'Test failed' } }));
    }
    setTesting(prev => ({ ...prev, [channel]: false }));
  };

  const updateCredential = (channel, key, value) => {
    setCredentials(prev => ({
      ...prev,
      [channel]: { ...prev[channel], [key]: value },
    }));
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>;
  }

  const channels = Object.keys(CHANNEL_META);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Channel Settings</h1>
        <p className="text-text-secondary mt-1">Configure and manage complaint intake channels</p>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg animate-slide-down flex items-center gap-2 ${
          toast.type === 'error' ? 'bg-red-500/90 text-white' : 'bg-brand-700 border border-accent/30 text-text-primary'
        }`}>
          {toast.type === 'error' ? <X className="w-4 h-4" /> : <Check className="w-4 h-4 text-accent" />}
          <span className="text-sm">{toast.message}</span>
        </div>
      )}

      <div className="space-y-4">
        {channels.map(channelKey => {
          const meta = CHANNEL_META[channelKey];
          const Icon = meta.icon;
          const setting = settings.find(s => s.channel === channelKey) || { enabled: channelKey === 'webform', connectionStatus: 'unconfigured' };
          const isEnabled = setting.enabled;
          const creds = credentials[channelKey] || {};
          const testResult = testResults[channelKey];
          const isSaving = saving[channelKey];
          const isTesting = testing[channelKey];

          return (
            <div key={channelKey} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-muted rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">{meta.name}</h3>
                    <p className="text-xs text-text-muted">{meta.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <StatusDot status={setting.connectionStatus} />
                  <button
                    onClick={() => handleToggle(channelKey, isEnabled)}
                    disabled={isSaving}
                    className={`toggle-switch ${isEnabled ? 'bg-accent' : 'bg-brand-400'}`}
                  >
                    <span className={`toggle-switch-dot ${isEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              {isEnabled && meta.fields.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-brand-400/20 animate-fade-in">
                  <div className="grid grid-cols-2 gap-3">
                    {meta.fields.map(field => (
                      <div key={field.key}>
                        <label className="block text-xs font-medium text-text-muted mb-1">{field.label}</label>
                        <input
                          type={field.type || 'text'}
                          placeholder={field.placeholder}
                          value={creds[field.key] || ''}
                          onChange={(e) => updateCredential(channelKey, field.key, e.target.value)}
                          className="input-field text-sm py-2"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => handleSave(channelKey)}
                      disabled={isSaving || Object.keys(creds).length === 0}
                      className="btn-primary text-sm disabled:opacity-40 flex items-center gap-1.5"
                    >
                      {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      Save
                    </button>
                    <button
                      onClick={() => handleTest(channelKey)}
                      disabled={isTesting}
                      className="btn-ghost text-sm flex items-center gap-1.5"
                    >
                      {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                      Test Connection
                    </button>
                    {testResult && (
                      <span className={`text-xs font-medium flex items-center gap-1 ${testResult.success ? 'text-green-400' : 'text-red-400'}`}>
                        {testResult.success ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        {testResult.message}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {channelKey === 'webform' && isEnabled && (
                <div className="pt-4 border-t border-brand-400/20 mt-4 animate-fade-in">
                  <p className="text-xs text-text-muted mb-2">Webhook URL (point your form action here):</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-brand-800 rounded-lg text-xs text-accent font-mono">
                      POST {window.location.origin.replace(':5173', ':5000')}/api/webhook/webform
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin.replace(':5173', ':5000')}/api/webhook/webform`);
                        showToast('Webhook URL copied');
                      }}
                      className="btn-ghost text-xs py-2 px-3"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-xs text-text-muted mt-2">
                    Accepts: <code className="text-accent">{'{ name, email, phone, message }'}</code>
                  </p>
                </div>
              )}

              {setting.lastTestedAt && (
                <p className="text-xs text-text-muted mt-3">
                  Last tested: {new Date(setting.lastTestedAt).toLocaleString()}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="card border-l-4 border-l-accent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent-muted rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Manual Entry</h3>
            <p className="text-xs text-text-muted">Always available — Admin types complaints directly in the portal. No configuration needed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
