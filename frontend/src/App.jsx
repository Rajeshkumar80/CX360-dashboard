import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import AutomatedInbox from './pages/AutomatedInbox';
import ManualEntry from './pages/ManualEntry';
import Analytics from './pages/Analytics';
import ComplaintsLog from './pages/ComplaintsLog';
import SettingsPage from './pages/SettingsPage';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/manager/analytics" />;
  return <Layout>{children}</Layout>;
};

function AppRoutes() {
  const { user, isAdmin } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={isAdmin ? '/admin/inbox' : '/manager/analytics'} /> : <Home />} />
      <Route path="/login" element={user ? <Navigate to={isAdmin ? '/admin/inbox' : '/manager/analytics'} /> : <Login />} />

      {/* Admin routes */}
      <Route path="/admin/inbox" element={<ProtectedRoute adminOnly><AutomatedInbox /></ProtectedRoute>} />
      <Route path="/admin/manual" element={<ProtectedRoute adminOnly><ManualEntry /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute adminOnly><Analytics /></ProtectedRoute>} />
      <Route path="/admin/complaints" element={<ProtectedRoute adminOnly><ComplaintsLog /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute adminOnly><SettingsPage /></ProtectedRoute>} />

      {/* Manager routes */}
      <Route path="/manager/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/manager/complaints" element={<ProtectedRoute><ComplaintsLog /></ProtectedRoute>} />

      {/* Fallbacks */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
