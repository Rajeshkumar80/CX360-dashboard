import React from 'react';
import Card from '../common/Card';
import { User, Shield, Star } from 'lucide-react';

const CustomerProfile = ({ customer }) => {
  const defaultCustomer = {
    name: 'John Smith',
    tier: 'Gold',
    score: 85,
    riskLevel: 'Low',
  };

  const data = customer || defaultCustomer;

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Platinum': return 'text-neon-cyan';
      case 'Gold': return 'text-neon-amber';
      case 'Silver': return 'text-text-secondary';
      default: return 'text-text-primary';
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-full flex items-center justify-center">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold">{data.name}</h3>
          <div className="flex items-center gap-2">
            <Star className={`w-4 h-4 ${getTierColor(data.tier)}`} />
            <span className={`text-sm font-semibold ${getTierColor(data.tier)}`}>
              {data.tier} Member
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
          <span className="text-text-secondary text-sm">Health Score</span>
          <div className="flex items-center gap-2">
            <div className="w-20 bg-dark-800 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-neon-cyan to-neon-blue"
                style={{ width: `${data.score}%` }}
              />
            </div>
            <span className="text-neon-cyan font-bold text-sm">{data.score}</span>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
          <span className="text-text-secondary text-sm">Risk Level</span>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-neon-cyan" />
            <span className="text-neon-cyan text-sm font-semibold">{data.riskLevel}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CustomerProfile;
