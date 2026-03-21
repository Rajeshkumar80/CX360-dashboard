import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import ComplaintForm from '../components/complaints/ComplaintForm';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useComplaints } from '../hooks/useComplaints';

const NewComplaint = () => {
  const navigate = useNavigate();
  const { submitComplaint } = useComplaints();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const result = await submitComplaint(formData);
      setSubmitted(result);
    } catch (error) {
      console.error('Failed to submit complaint:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <Card glow className="text-center py-12">
          <div className="w-16 h-16 bg-neon-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-neon-cyan" />
          </div>
          <h2 className="text-2xl font-bold text-neon-cyan mb-2">Complaint Submitted!</h2>
          <p className="text-text-secondary mb-4">Your complaint has been registered successfully.</p>
          
          <div className="space-y-3 mb-8 text-left max-w-md mx-auto">
            <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
              <span className="text-text-secondary">Complaint ID</span>
              <span className="text-neon-blue font-mono font-bold">{submitted.id}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
              <span className="text-text-secondary">Category</span>
              <Badge variant="info">{submitted.category}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
              <span className="text-text-secondary">Sentiment</span>
              <Badge variant={submitted.sentiment === 'Negative' ? 'danger' : 'success'}>
                {submitted.sentiment}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
              <span className="text-text-secondary">Severity</span>
              <Badge variant={submitted.severity === 'High' ? 'high' : 'medium'}>
                {submitted.severity}
              </Badge>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate(`/complaints/${submitted.id}`)}>
              View Complaint
            </Button>
            <Button variant="ghost" onClick={() => setSubmitted(null)}>
              Submit Another
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-neon-blue mb-2">New Complaint</h1>
        <p className="text-text-secondary">
          Submit a new customer complaint for AI-powered processing
        </p>
      </div>

      {/* Form */}
      <ComplaintForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default NewComplaint;
