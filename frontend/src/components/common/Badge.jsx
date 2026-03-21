import React from 'react';
import clsx from 'clsx';

const Badge = ({ children, variant = 'info', className }) => {
  const variants = {
    info: 'bg-neon-blue/20 text-neon-blue',
    success: 'bg-neon-cyan/20 text-neon-cyan',
    warning: 'bg-neon-amber/20 text-neon-amber',
    danger: 'bg-neon-red/20 text-neon-red',
    high: 'badge-high',
    medium: 'badge-medium',
    low: 'badge-low',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-3 py-1 rounded text-xs font-bold uppercase tracking-wide',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
