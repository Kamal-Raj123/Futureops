import React from 'react';

interface ChartProps {
  data: { x: string; y: number }[];
  trend: 'up' | 'down' | 'stable';
}

export default function Chart({ data, trend }: ChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-gray-400">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.y));
  const minValue = Math.min(...data.map(d => d.y));
  const range = maxValue - minValue || 1;
  
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'stroke-green-400 fill-green-400/20';
      case 'down':
        return 'stroke-red-400 fill-red-400/20';
      default:
        return 'stroke-yellow-400 fill-yellow-400/20';
    }
  };

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((point.y - minValue) / range) * 80;
    return `${x},${y}`;
  }).join(' ');

  const pathD = `M ${data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((point.y - minValue) / range) * 80;
    return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ')}`;

  return (
    <div className="w-full h-48">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Grid lines */}
        <defs>
          <pattern id={`grid-${trend}`} width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
          </pattern>
          <linearGradient id={`gradient-${trend}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#eab308'} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#eab308'} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#grid-${trend})`} />
        
        {/* Area under curve */}
        <path
          d={`${pathD} L 100,100 L 0,100 Z`}
          fill={`url(#gradient-${trend})`}
        />
        
        {/* Main line */}
        <polyline
          fill="none"
          strokeWidth="2"
          points={points}
          className={getTrendColor().split(' ')[0]}
        />
        
        {/* Data points */}
        {data.map((point, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((point.y - minValue) / range) * 80;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1.5"
              className="fill-white stroke-current"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      
      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-400">
        <span>{data[0]?.x}</span>
        {data.length > 2 && <span>{data[Math.floor(data.length / 2)]?.x}</span>}
        <span>{data[data.length - 1]?.x}</span>
      </div>
    </div>
  );
}