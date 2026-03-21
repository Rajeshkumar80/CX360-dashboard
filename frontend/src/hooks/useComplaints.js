import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { mockComplaints } from '../services/mockData';

export const useComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const data = await api.getComplaints();
      setComplaints(data);
      setError(null);
    } catch (err) {
      console.log('Using mock data:', err.message);
      setComplaints(mockComplaints);
    } finally {
      setLoading(false);
    }
  };

  const submitComplaint = async (complaintData) => {
    try {
      const newComplaint = await api.submitComplaint(complaintData);
      setComplaints(prev => [newComplaint, ...prev]);
      return newComplaint;
    } catch (err) {
      // Mock submission
      const mockNew = {
        id: `C-2024-${String(complaints.length + 1).padStart(3, '0')}`,
        ...complaintData,
        category: 'Service',
        sentiment: 'Neutral',
        severity: 'Medium',
        status: 'Open',
        created_at: new Date().toISOString(),
        sla_deadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      };
      setComplaints(prev => [mockNew, ...prev]);
      return mockNew;
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return {
    complaints,
    loading,
    error,
    refetch: fetchComplaints,
    submitComplaint,
  };
};
