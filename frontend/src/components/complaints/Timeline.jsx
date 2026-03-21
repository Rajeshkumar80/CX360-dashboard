import React from 'react';
import { CheckCircle, Clock, AlertTriangle, MessageSquare } from 'lucide-react';

const Timeline = ({ events }) => {
  const defaultEvents = [
    { time: '2 hours ago', label: 'Complaint Submitted', icon: MessageSquare, color: 'text-neon-blue' },
    { time: '1.5 hours ago', label: 'AI Classification Complete', icon: AlertTriangle, color: 'text-neon-amber' },
    { time: '1 hour ago', label: 'Assigned to Agent', icon: Clock, color: 'text-neon-cyan' },
    { time: '30 minutes ago', label: 'Response Sent', icon: CheckCircle, color: 'text-neon-cyan' },
  ];

  const timelineEvents = events || defaultEvents;

  return (
    <div className="space-y-4">
      {timelineEvents.map((event, index) => {
        const Icon = event.icon;
        return (
          <div key={index} className="flex items-start gap-4">
            <div className="relative">
              <div className={`p-2 bg-dark-700 rounded-full ${event.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              {index < timelineEvents.length - 1 && (
                <div className="absolute left-1/2 top-full w-px h-6 bg-gray-700 -translate-x-1/2" />
              )}
            </div>
            <div className="flex-1 pb-6">
              <p className="text-text-primary font-medium">{event.label}</p>
              <p className="text-text-secondary text-sm">{event.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
