import React, { useState } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { Send } from 'lucide-react';

const ComplaintForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    customer: '',
    email: '',
    channel: 'Web',
    description: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Input
            label="Customer Name"
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            placeholder="Enter customer name"
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Channel
          </label>
          <select
            name="channel"
            value={formData.channel}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/30 transition-all duration-200"
          >
            <option value="Web">Web</option>
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
            <option value="Chat">Chat</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Complaint Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            placeholder="Describe the complaint in detail..."
            required
            className="w-full px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/30 transition-all duration-200 resize-none"
          />
        </div>

        <Button type="submit" loading={loading} className="w-full flex items-center justify-center gap-2">
          <Send className="w-4 h-4" />
          Submit Complaint
        </Button>
      </form>
    </Card>
  );
};

export default ComplaintForm;
