import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { User, Mail, Clock, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ComplaintDetail = ({ complaint }) => {
  if (!complaint) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neon-blue mb-2">
              {complaint.id}
            </h1>
            <p className="text-text-secondary">
              Submitted {formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant={complaint.sentiment === 'Negative' ? 'danger' : 'success'}>
              {complaint.sentiment}
            </Badge>
            <Badge variant="info">{complaint.category}</Badge>
            <Badge variant={complaint.severity === 'High' ? 'high' : complaint.severity === 'Medium' ? 'medium' : 'low'}>
              {complaint.severity}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Customer Info */}
      <Card>
        <h2 className="text-lg font-bold mb-4">Customer Information</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-text-secondary" />
            <span className="text-text-primary">{complaint.customer}</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-text-secondary" />
            <span className="text-text-primary">{complaint.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-text-secondary" />
            <span className="text-text-primary">Channel: {complaint.channel}</span>
          </div>
        </div>
      </Card>

      {/* Description */}
      <Card>
        <h2 className="text-lg font-bold mb-4">Complaint Description</h2>
        <p className="text-text-primary leading-relaxed">{complaint.description}</p>
      </Card>
    </div>
  );
};

export default ComplaintDetail;
