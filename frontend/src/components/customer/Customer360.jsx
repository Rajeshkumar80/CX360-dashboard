import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const Customer360 = ({ customer }) => {
  const defaultCustomer = {
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    since: 'Jan 2022',
    totalComplaints: 5,
    satisfaction: 3.8,
    lifetimeValue: '$12,500',
  };

  const data = customer || defaultCustomer;

  return (
    <Card glow>
      <h2 className="text-xl font-bold text-neon-blue mb-6">Customer 360°</h2>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-full flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-bold">{data.name}</h3>
          <p className="text-text-secondary text-sm">Customer since {data.since}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg">
          <Mail className="w-4 h-4 text-text-secondary" />
          <span className="text-text-primary text-sm">{data.email}</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg">
          <Phone className="w-4 h-4 text-text-secondary" />
          <span className="text-text-primary text-sm">{data.phone}</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg">
          <MapPin className="w-4 h-4 text-text-secondary" />
          <span className="text-text-primary text-sm">{data.location}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6">
        <div className="text-center p-3 bg-dark-700/50 rounded-lg">
          <p className="text-2xl font-bold text-neon-blue">{data.totalComplaints}</p>
          <p className="text-text-secondary text-xs">Complaints</p>
        </div>
        <div className="text-center p-3 bg-dark-700/50 rounded-lg">
          <p className="text-2xl font-bold text-neon-cyan">{data.satisfaction}</p>
          <p className="text-text-secondary text-xs">Satisfaction</p>
        </div>
        <div className="text-center p-3 bg-dark-700/50 rounded-lg">
          <p className="text-2xl font-bold text-neon-amber">{data.lifetimeValue}</p>
          <p className="text-text-secondary text-xs">LTV</p>
        </div>
      </div>
    </Card>
  );
};

export default Customer360;
