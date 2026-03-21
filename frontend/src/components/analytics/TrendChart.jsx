import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';

const TrendChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 shadow-neon-card">
          <p className="text-neon-blue font-semibold">{label}</p>
          <p className="text-text-primary">{`Complaints: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">Complaint Volume Trend</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2E9BF5" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2E9BF5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A40" />
            <XAxis dataKey="date" stroke="#8F92A1" fontSize={12} />
            <YAxis stroke="#8F92A1" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="complaints"
              stroke="#2E9BF5"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorComplaints)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TrendChart;
