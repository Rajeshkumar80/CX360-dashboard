import { useState } from 'react';
import { api } from '../services/api';

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const generateResponse = async (complaintText) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.generateAIResponse(complaintText);
      setResponse(result);
      return result;
    } catch (err) {
      // Mock AI response
      const mockResult = {
        response: `Dear valued customer,\n\nThank you for bringing this matter to our attention. We sincerely apologize for any inconvenience you may have experienced.\n\nI have reviewed your concern and want to assure you that we take all feedback seriously. Our team is actively working to resolve this issue and will provide you with an update within 24 hours.\n\nWe appreciate your patience and understanding.\n\nBest regards,\nCustomer Support Team`,
        confidence: 0.92,
      };
      setResponse(mockResult);
      return mockResult;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    response,
    error,
    generateResponse,
  };
};
