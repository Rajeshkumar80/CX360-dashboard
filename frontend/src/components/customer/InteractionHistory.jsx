import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { MessageSquare, Phone, Mail, Globe } from 'lucide-react';

const InteractionHistory = ({ interactions }) => {
  const defaultInteractions = [
    { type: 'Email', date: '2024-01-15', summary: 'Billing dispute - resolved', status: 'Resolved' },
    { type: 'Phone', date: '2024-01-10', summary: 'Product inquiry', status: 'Resolved' },
    { type: 'Chat', date: '2024-01-05', summary: 'Delivery tracking update', status: 'Resolved' },
    { type: 'Web', date: '2023-12-28', summary: 'Account settings change', status: 'Resolved' },
  ];

  const data = interactions || defaultInteractions;

  const getIcon = (type) => {
    switch (type) {
      case 'Email': return Mail;
      case 'Phone': return Phone;
      case 'Chat': return MessageSquare;
      default: return Globe;
    }
  };

  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">Interaction History</h3>
      <div className="space-y-3">
        {data.map((interaction, index) => {
          const Icon = getIcon(interaction.type);
          return (
            <div key={index} className="flex items-center gap-4 p-3 bg-dark-700/50 rounded-lg hover:bg-dark-700 transition-colors">
              <div className="p-2 bg-neon-blue/20 rounded-lg">
                <Icon className="w-4 h-4 text-neon-blue" />
              </div>
              <div className="flex-1">
                <p className="text-text-primary text-sm font-medium">{interaction.summary}</p>
                <p className="text-text-secondary text-xs">{interaction.date} · {interaction.type}</p>
              </div>
              <Badge variant="success">{interaction.status}</Badge>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default InteractionHistory;
