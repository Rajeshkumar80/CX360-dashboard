import React from 'react';
import clsx from 'clsx';

const Input = ({ 
  label, 
  error, 
  className,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg',
          'text-text-primary placeholder-text-secondary/50',
          'focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/30',
          'transition-all duration-200',
          error && 'border-neon-red focus:border-neon-red focus:ring-neon-red/30',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-neon-red">{error}</p>
      )}
    </div>
  );
};

export default Input;
