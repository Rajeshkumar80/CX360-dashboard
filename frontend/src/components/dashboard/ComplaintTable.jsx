import React from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../common/Badge';
import Card from '../common/Card';
import { formatDistanceToNow } from 'date-fns';

const ComplaintTable = ({ complaints }) => {
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
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-4 px-4 text-text-secondary font-semibold text-sm uppercase tracking-wide">
                ID
              </th>
              <th className="text-left py-4 px-4 text-text-secondary font-semibold text-sm uppercase tracking-wide">
                Customer
              </th>
              <th className="text-left py-4 px-4 text-text-secondary font-semibold text-sm uppercase tracking-wide">
                Category
              </th>
              <th className="text-left py-4 px-4 text-text-secondary font-semibold text-sm uppercase tracking-wide">
                Sentiment
              </th>
              <th className="text-left py-4 px-4 text-text-secondary font-semibold text-sm uppercase tracking-wide">
                Severity
              </th>
              <th className="text-left py-4 px-4 text-text-secondary font-semibold text-sm uppercase tracking-wide">
                Status
              </th>
              <th className="text-left py-4 px-4 text-text-secondary font-semibold text-sm uppercase tracking-wide">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr
                key={complaint.id}
                onClick={() => navigate(`/complaints/${complaint.id}`)}
                className="border-b border-gray-800 hover:bg-dark-700/50 cursor-pointer transition-colors"
              >
                <td className="py-4 px-4">
                  <span className="font-mono text-neon-blue font-semibold">
                    {complaint.id}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-text-primary font-medium">
                    {complaint.customer}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <Badge variant="info">{complaint.category}</Badge>
                </td>
                <td className="py-4 px-4">
                  <Badge variant={getSentimentVariant(complaint.sentiment)}>
                    {complaint.sentiment}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <Badge variant={getSeverityVariant(complaint.severity)}>
                    {complaint.severity}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <span className="text-text-secondary">{complaint.status}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-text-secondary text-sm">
                    {formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ComplaintTable;
