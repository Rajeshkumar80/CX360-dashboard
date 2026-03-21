import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2, Landmark, Shield } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');

  const quickLogin = async (role) => {
    setError('');
    setLoading(role);
    try {
      const creds = role === 'admin'
        ? { email: 'admin@cx360.com', password: 'Admin@CX360#1' }
        : { email: 'manager@cx360.com', password: 'Manager@CX360#1' };
      const user = await login(creds.email, creds.password);
      navigate(user.role === 'admin' ? '/admin/inbox' : '/manager/analytics');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
    setLoading('');
  };

  return (
    <div className="min-h-screen bg-brand-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-accent/20">
            <span className="text-white font-extrabold text-3xl">CX</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary">CX<span className="text-accent">360</span></h1>
          <p className="text-text-secondary mt-2">Intelligent Complaint Resolution</p>
        </div>

        <div className="card space-y-4">
          <p className="text-text-muted text-sm text-center">Select your role to continue</p>

          <button
            onClick={() => quickLogin('admin')}
            disabled={!!loading}
            className="w-full flex items-center gap-4 px-5 py-4 bg-accent/10 hover:bg-accent/20 border border-accent/30 hover:border-accent/50 rounded-xl transition-all duration-200 group"
          >
            <div className="w-11 h-11 bg-accent rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-text-primary">Admin</p>
              <p className="text-xs text-text-muted">Full access · All channels · Settings</p>
            </div>
            {loading === 'admin' && <Loader2 className="w-5 h-5 animate-spin text-accent shrink-0" />}
          </button>

          <button
            onClick={() => quickLogin('manager')}
            disabled={!!loading}
            className="w-full flex items-center gap-4 px-5 py-4 bg-brand-600/50 hover:bg-brand-600 border border-brand-400/30 hover:border-brand-400/50 rounded-xl transition-all duration-200 group"
          >
            <div className="w-11 h-11 bg-brand-500 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Landmark className="w-5 h-5 text-accent" />
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-text-primary">Manager</p>
              <p className="text-xs text-text-muted">View analytics · Complaints log</p>
            </div>
            {loading === 'manager' && <Loader2 className="w-5 h-5 animate-spin text-accent shrink-0" />}
          </button>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>

        <p className="text-center text-text-muted text-xs mt-8">
          © 2025 CX360 — Banking & Financial Services
        </p>
      </div>
    </div>
  );
};

export default Login;
