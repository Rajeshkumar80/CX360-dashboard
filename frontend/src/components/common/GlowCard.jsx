import React from 'react';
import clsx from 'clsx';

const GlowCard = ({ children, color = 'blue', className, ...props }) => {
  const glowColors = {
    blue: 'border-gray-700/40',
    red: 'border-gray-700/40',
    cyan: 'border-gray-700/40',
    amber: 'border-gray-700/40',
  };

  return (
    <div
      className={clsx(
        'glass-card p-6 shadow-neon-card transition-all duration-300',
        glowColors[color],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlowCard;
