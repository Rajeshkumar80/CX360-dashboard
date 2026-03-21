import React, { useState } from 'react';
import { Sparkles, Copy, RefreshCw } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

const AIAssistant = ({ complaintText, onGenerate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [confidence, setConfidence] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await onGenerate(complaintText);
      setResponse(result.response);
      setConfidence(result.confidence);
    } catch (error) {
      console.error('Failed to generate response:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
  };

  return (
    <div className="mt-6">
      {!isExpanded ? (
        <Button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-center gap-2 animate-pulse-slow"
        >
          <Sparkles className="w-5 h-5" />
          AI Assistant
        </Button>
      ) : (
        <Card glow className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-neon-blue" />
              <h3 className="text-lg font-bold text-neon-blue">AI Response Generator</h3>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              ✕
            </button>
          </div>

          {!response ? (
            <div className="text-center py-8">
              <p className="text-text-secondary mb-4">
                Generate an AI-powered professional response to this complaint
              </p>
              <Button onClick={handleGenerate} loading={loading}>
                {loading ? 'Generating...' : 'Generate Response'}
              </Button>
            </div>
          ) : (
            <div className="animate-fade-in">
              {/* Confidence Score */}
              {confidence && (
                <div className="mb-4 p-3 bg-dark-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary">Confidence Score</span>
                    <span className="text-lg font-bold text-neon-cyan">
                      {Math.round(confidence * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-cyan to-neon-blue transition-all duration-1000"
                      style={{ width: `${confidence * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Response Text */}
              <div className="p-4 bg-dark-700 rounded-lg mb-4">
                <p className="text-text-primary whitespace-pre-wrap leading-relaxed">{response}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="primary" onClick={handleCopy} className="flex-1 flex items-center justify-center gap-2">
                  <Copy className="w-4 h-4" />
                  Copy Response
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleGenerate}
                  loading={loading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default AIAssistant;
