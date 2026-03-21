import React from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../common/Badge';
import Card from '../common/Card';
import { formatDistanceToNow } from 'date-fns';
import { Clock, User } from 'lucide-react';

const ComplaintList = ({ complaints }) => {
  const navigate = useNavigate();

  const getSeverityVariant = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'info';
    }
  };

  const getSentimentVariant = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'negative': return 'danger';
      case 'positive': return 'success';
      default: return 'warning';
    }
  };

  return (
    <div className="space-y-4">
      {complaints.map((complaint) => (
        <Card
          key={complaint.id}
          className="cursor-pointer hover:bg-dark-700/50 transition-all duration-200 hover:scale-[1.01]"
          onClick={() => navigate(`/complaints/${complaint.id}`)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-neon-blue font-bold">{complaint.id}</span>
                <Badge variant={getSeverityVariant(complaint.severity)}>
                  {complaint.severity}
                </Badge>
                <Badge variant={getSentimentVariant(complaint.sentiment)}>
                  {complaint.sentiment}
                </Badge>
              </div>
              <p className="text-text-primary mb-2 line-clamp-2">{complaint.description}</p>
              <div className="flex items-center gap-4 text-text-secondary text-sm">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {complaint.customer}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="info">{complaint.category}</Badge>
              <p className="text-text-secondary text-sm mt-2">{complaint.status}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ComplaintList;
