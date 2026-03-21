import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Sparkles } from 'lucide-react';

const ResponseGenerator = ({ onGenerate, loading }) => {
  return (
    <Card className="text-center">
      <Sparkles className="w-12 h-12 text-neon-blue mx-auto mb-4" />
      <h3 className="text-xl font-bold mb-2">AI Response Generator</h3>
      <p className="text-text-secondary mb-6">
        Let AI craft the perfect response to customer complaints
      </p>
      <Button onClick={onGenerate} loading={loading} size="lg">
        Generate Response
      </Button>
    </Card>
  );
};

export default ResponseGenerator;
