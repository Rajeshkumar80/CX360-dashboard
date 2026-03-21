import React from 'react';

const ConfidenceScore = ({ score }) => {
  const percentage = Math.round(score * 100);
  
  const getColor = () => {
    if (percentage >= 80) return 'from-neon-cyan to-neon-blue';
    if (percentage >= 60) return 'from-neon-amber to-yellow-500';
    return 'from-neon-red to-red-600';
  };

  const getTextColor = () => {
    if (percentage >= 80) return 'text-neon-cyan';
    if (percentage >= 60) return 'text-neon-amber';
    return 'text-neon-red';
  };

  return (
    <div className="p-3 bg-dark-700 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-text-secondary">AI Confidence</span>
        <span className={`text-lg font-bold ${getTextColor()}`}>
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getColor()} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ConfidenceScore;
