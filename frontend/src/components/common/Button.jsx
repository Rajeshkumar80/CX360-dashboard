import React from 'react';
import clsx from 'clsx';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  disabled,
  loading,
  ...props 
}) => {
  const variants = {
    primary: 'neon-button',
    secondary: 'bg-dark-700 hover:bg-dark-600 border border-gray-600',
    danger: 'bg-gradient-to-r from-neon-red to-red-600 hover:opacity-90',
    ghost: 'bg-transparent border border-gray-600 hover:bg-dark-700',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-6 py-2',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      className={clsx(
        'rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Loading...
        </div>
      ) : children}
    </button>
  );
};

export default Button;
