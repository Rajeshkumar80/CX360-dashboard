import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className, glow = false, ...props }) => {
  return (
    <div
      className={clsx(
        'glass-card p-6 shadow-neon-card',
        glow && 'border-gray-600/60',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
