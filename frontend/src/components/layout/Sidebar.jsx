import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Inbox, PenSquare, BarChart3, FileText, Settings, MessageSquareMore } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import clsx from 'clsx';

const Sidebar = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const prefix = isAdmin ? '/admin' : '/manager';

  const navItems = isAdmin
    ? [
        { path: `${prefix}/inbox`, icon: Inbox, label: 'Inbox' },
        { path: `${prefix}/manual`, icon: PenSquare, label: 'Manual Entry' },
        { path: `${prefix}/analytics`, icon: BarChart3, label: 'Analytics' },
        { path: `${prefix}/complaints`, icon: FileText, label: 'Complaints Log' },
        { path: `${prefix}/settings`, icon: Settings, label: 'Settings' },
      ]
    : [
        { path: `${prefix}/analytics`, icon: BarChart3, label: 'Analytics' },
        { path: `${prefix}/complaints`, icon: FileText, label: 'Complaints Log' },
      ];

  return (
    <aside className="w-56 min-h-[calc(100vh-4rem)] bg-brand-800 border-r border-brand-400/20">
      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                isActive
                  ? 'bg-accent-muted text-accent font-semibold'
                  : 'text-text-secondary hover:bg-brand-600 hover:text-text-primary'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Branding */}
      <div className="absolute bottom-0 left-0 w-56 p-4 border-t border-brand-400/10">
        <p className="text-[10px] text-text-muted text-center leading-relaxed">
          CX360 v1.0.0<br />
          <span className="text-accent/60">Powered by Claude AI</span>
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
