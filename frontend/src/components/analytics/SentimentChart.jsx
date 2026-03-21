import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../common/Card';

const COLORS = {
  Negative: '#FF3366',
  Positive: '#00F5FF',
  Neutral: '#FFB020',
};

const sentimentData = [
  { name: 'Negative', value: 45 },
  { name: 'Positive', value: 30 },
  { name: 'Neutral', value: 25 },
];

const SentimentChart = ({ data = sentimentData }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 shadow-neon-card">
          <p className="text-text-primary font-semibold">{payload[0].name}</p>
          <p className="text-text-secondary">{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">Sentiment Distribution</h3>
      <div className="h-72 flex items-center">
        <div className="w-2/3">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/3 space-y-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[item.name] }} 
              />
              <span className="text-text-secondary text-sm">{item.name}</span>
              <span className="text-text-primary font-bold ml-auto">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default SentimentChart;
