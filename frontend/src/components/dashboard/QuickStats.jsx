import React from 'react';
import Card from '../common/Card';
import { AlertTriangle, CheckCircle, Clock, MessageSquare } from 'lucide-react';

const QuickStats = ({ complaints }) => {
  const openCount = complaints.filter(c => c.status === 'Open').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const highSeverity = complaints.filter(c => c.severity === 'High').length;

  const stats = [
    { label: 'Open', value: openCount, icon: AlertTriangle, color: 'text-neon-red' },
    { label: 'In Progress', value: inProgressCount, icon: Clock, color: 'text-neon-amber' },
    { label: 'Resolved', value: resolvedCount, icon: CheckCircle, color: 'text-neon-cyan' },
    { label: 'High Severity', value: highSeverity, icon: MessageSquare, color: 'text-neon-red' },
  ];

  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
      <div className="space-y-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-text-secondary text-sm">{stat.label}</span>
              </div>
              <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickStats;
