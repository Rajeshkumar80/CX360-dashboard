import React from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

const SentimentIndicator = ({ sentiment }) => {
  const config = {
    Negative: { 
      icon: TrendingDown, 
      color: 'text-neon-red', 
      bg: 'bg-neon-red/20',
      label: 'Negative Sentiment' 
    },
    Positive: { 
      icon: TrendingUp, 
      color: 'text-neon-cyan', 
      bg: 'bg-neon-cyan/20',
      label: 'Positive Sentiment' 
    },
    Neutral: { 
      icon: Minus, 
      color: 'text-neon-amber', 
      bg: 'bg-neon-amber/20',
      label: 'Neutral Sentiment' 
    },
  };

  const { icon: Icon, color, bg, label } = config[sentiment] || config.Neutral;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${bg}`}>
      <Icon className={`w-5 h-5 ${color}`} />
      <span className={`text-sm font-bold ${color}`}>{label}</span>
    </div>
  );
};

export default SentimentIndicator;
