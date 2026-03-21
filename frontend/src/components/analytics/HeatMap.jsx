import React from 'react';
import Card from '../common/Card';

const HeatMap = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'];
  
  // Generate mock heatmap data
  const generateIntensity = () => Math.floor(Math.random() * 5);
  
  const getColor = (intensity) => {
    const colors = [
      'bg-dark-700',
      'bg-neon-blue/20',
      'bg-neon-blue/40',
      'bg-neon-blue/60',
      'bg-neon-blue/80',
    ];
    return colors[intensity] || colors[0];
  };

  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">Complaint Activity Heatmap</h3>
      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Column headers */}
          <div className="flex mb-2">
            <div className="w-12" />
            {hours.map(hour => (
              <div key={hour} className="flex-1 text-center text-xs text-text-secondary">
                {hour}
              </div>
            ))}
          </div>
          
          {/* Heatmap rows */}
          {days.map(day => (
            <div key={day} className="flex items-center mb-1">
              <div className="w-12 text-xs text-text-secondary">{day}</div>
              {hours.map((hour, hIdx) => {
                const intensity = generateIntensity();
                return (
                  <div key={hIdx} className="flex-1 px-0.5">
                    <div 
                      className={`h-8 rounded ${getColor(intensity)} transition-all duration-200 hover:scale-110 cursor-pointer`}
                      title={`${day} ${hour}: ${intensity * 12} complaints`}
                    />
                  </div>
                );
              })}
            </div>
          ))}
          
          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-4">
            <span className="text-xs text-text-secondary">Less</span>
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className={`w-4 h-4 rounded ${getColor(i)}`} />
            ))}
            <span className="text-xs text-text-secondary">More</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HeatMap;
