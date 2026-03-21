import React from 'react';
import { LogOut, User, Sun, Moon, Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

const Header = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-brand-800 border-b border-brand-400/20 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-extrabold tracking-tight">CX</span>
        </div>
        <div>
          <h1 className="text-base font-bold text-text-primary">CX<span className="text-accent">360</span></h1>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Banking Complaint Management</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-text-muted px-3 py-1 bg-accent-muted text-accent rounded-full font-semibold uppercase">
          {user?.role}
        </span>

        <button
          onClick={toggleTheme}
          className="p-2 text-text-muted hover:text-accent hover:bg-brand-600 rounded-lg transition-colors"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-brand-400/20">
          <div className="w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-text-secondary" />
          </div>
          <span className="text-sm text-text-secondary">{user?.name}</span>
          <button onClick={logout} className="p-1.5 text-text-muted hover:text-accent hover:bg-brand-600 rounded-lg transition-colors" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
