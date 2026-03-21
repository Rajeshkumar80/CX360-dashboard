import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from '../common/Card';

const COLORS = ['#2E9BF5', '#FF3366', '#00F5FF', '#FFB020', '#8B5CF6'];

const CategoryChart = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 shadow-neon-card">
          <p className="text-neon-blue font-semibold">{payload[0].payload.category}</p>
          <p className="text-text-primary">{`Count: ${payload[0].value}`}</p>
          <p className="text-text-secondary text-sm">{`${payload[0].payload.percentage}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">Complaints by Category</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A40" />
            <XAxis type="number" stroke="#8F92A1" fontSize={12} />
            <YAxis dataKey="category" type="category" stroke="#8F92A1" fontSize={12} width={120} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default CategoryChart;
