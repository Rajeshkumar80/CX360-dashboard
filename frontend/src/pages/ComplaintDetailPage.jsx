import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Mail, MessageSquare } from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import AIAssistant from '../components/ai/AIAssistant';
import Timeline from '../components/complaints/Timeline';
import SentimentIndicator from '../components/complaints/SentimentIndicator';
import Customer360 from '../components/customer/Customer360';
import { api } from '../services/api';
import { mockComplaints } from '../services/mockData';
import { formatDistanceToNow } from 'date-fns';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ComplaintDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplaint();
  }, [id]);

  const loadComplaint = async () => {
    try {
      const data = await api.getComplaint(id);
      setComplaint(data);
    } catch (error) {
      const mockComplaint = mockComplaints.find(c => c.id === id);
      setComplaint(mockComplaint);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAI = async (text) => {
    try {
      return await api.generateAIResponse(text);
    } catch (error) {
      return {
        response: `Dear ${complaint.customer},\n\nThank you for reaching out to us regarding your concern. We sincerely apologize for any inconvenience this may have caused.\n\nI have reviewed your case and understand your frustration. Our team is actively working on resolving this issue as our top priority.\n\nWe will provide you with an update within the next 24 hours and ensure this is resolved to your satisfaction.\n\nThank you for your patience and understanding.\n\nBest regards,\nCustomer Support Team`,
        confidence: 0.94,
      };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <p className="text-text-secondary text-lg mb-4">Complaint not found</p>
        <Button onClick={() => navigate('/complaints')}>Back to Complaints</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Complaints
      </Button>

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
            <SentimentIndicator sentiment={complaint.sentiment} />
            <Badge variant="info">{complaint.category}</Badge>
            <Badge variant={complaint.severity === 'High' ? 'high' : complaint.severity === 'Medium' ? 'medium' : 'low'}>
              {complaint.severity}
            </Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Complaint Details */}
        <div className="col-span-2 space-y-6">
          {/* Customer Info */}
          <Card>
            <h2 className="text-lg font-bold mb-4">Customer Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg">
                <User className="w-5 h-5 text-neon-blue" />
                <span className="text-text-primary">{complaint.customer}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg">
                <Mail className="w-5 h-5 text-neon-blue" />
                <span className="text-text-primary">{complaint.email}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg">
                <MessageSquare className="w-5 h-5 text-neon-blue" />
                <span className="text-text-primary">Channel: {complaint.channel}</span>
              </div>
            </div>
          </Card>

          {/* Complaint Description */}
          <Card>
            <h2 className="text-lg font-bold mb-4">Complaint Description</h2>
            <p className="text-text-primary leading-relaxed text-lg">
              {complaint.description}
            </p>
          </Card>

          {/* AI Assistant */}
          <AIAssistant 
            complaintText={complaint.description}
            onGenerate={handleGenerateAI}
          />
        </div>

        {/* Right Column - Timeline & Status */}
        <div className="space-y-6">
          {/* SLA Timer */}
          <Card glow>
            <h2 className="text-lg font-bold mb-4">SLA Deadline</h2>
            <div className="text-center">
              <p className="text-3xl font-bold text-neon-amber mb-2">
                {formatDistanceToNow(new Date(complaint.sla_deadline))}
              </p>
              <p className="text-text-secondary text-sm">remaining</p>
            </div>
          </Card>

          {/* Status */}
          <Card>
            <h2 className="text-lg font-bold mb-4">Status</h2>
            <div className="space-y-3">
              <div className="p-3 bg-dark-700/50 rounded-lg">
                <label className="text-sm text-text-secondary">Current Status</label>
                <p className="text-lg font-semibold text-text-primary">{complaint.status}</p>
              </div>
              <Button className="w-full">Update Status</Button>
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <h2 className="text-lg font-bold mb-4">Activity Timeline</h2>
            <Timeline />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailPage;
