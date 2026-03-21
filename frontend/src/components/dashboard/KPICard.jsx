import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../common/Card';

const KPICard = ({ title, value, change, trend, icon: Icon }) => {
  const isPositive = trend === 'up';

  return (
    <Card className="hover:border-gray-600/60 transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-text-secondary text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-text-primary mb-2">{value}</p>
          
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-neon-cyan" />
            ) : (
              <TrendingDown className="w-4 h-4 text-neon-red" />
            )}
            <span className={`text-sm font-semibold ${isPositive ? 'text-neon-cyan' : 'text-neon-red'}`}>
              {change}
            </span>
            <span className="text-text-secondary text-sm">vs last month</span>
          </div>
        </div>

        {Icon && (
          <div className="p-3 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-lg">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default KPICard;
