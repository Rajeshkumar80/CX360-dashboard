import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div 
        className={`${sizes[size]} border-4 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin ${className}`}
      />
    </div>
  );
};

export default LoadingSpinner;
