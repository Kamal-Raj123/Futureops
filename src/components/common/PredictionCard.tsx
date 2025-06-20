import React from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar, Target, Trash2, Eye } from 'lucide-react';
import { Prediction } from '../../types';
import Chart from './Chart';

interface PredictionCardProps {
  prediction: Prediction;
  onDelete: (id: string) => void;
}

export default function PredictionCard({ prediction, onDelete }: PredictionCardProps) {
  const getTrendIcon = () => {
    switch (prediction.trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      default:
        return <Minus className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getTrendColor = () => {
    switch (prediction.trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getConfidenceColor = () => {
    if (prediction.confidence >= 80) return 'text-green-400';
    if (prediction.confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDomainColor = () => {
    switch (prediction.domain) {
      case 'weather':
        return 'border-blue-500/30 bg-blue-500/5';
      case 'stocks':
        return 'border-green-500/30 bg-green-500/5';
      case 'climate':
        return 'border-orange-500/30 bg-orange-500/5';
      case 'elections':
        return 'border-purple-500/30 bg-purple-500/5';
      case 'global':
        return 'border-red-500/30 bg-red-500/5';
      default:
        return 'border-white/10 bg-white/5';
    }
  };

  return (
    <div className={`backdrop-blur-sm rounded-xl border overflow-hidden hover:bg-white/10 transition-all duration-300 ${getDomainColor()}`}>
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">{prediction.title}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{prediction.timeframe}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4" />
                <span className={`font-medium ${getConfidenceColor()}`}>
                  {prediction.confidence}% confidence
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <button className="p-2 text-gray-400 hover:text-cyan-400 transition-colors">
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(prediction.id)}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getTrendIcon()}
            <span className={`text-2xl font-bold ${getTrendColor()}`}>
              {prediction.value}{prediction.unit}
            </span>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Predicted Value</p>
            <p className="text-white font-medium capitalize">{prediction.trend} trend</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 border-b border-white/10">
        <Chart data={prediction.data} trend={prediction.trend} />
      </div>

      {/* Key Factors */}
      <div className="p-6">
        <h4 className="text-white font-medium mb-3">Key Influencing Factors</h4>
        <div className="flex flex-wrap gap-2">
          {prediction.factors.map((factor, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-white/10 text-gray-300 text-sm rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              {factor}
            </span>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Created: {prediction.created.toLocaleDateString()}</span>
            <span className="capitalize">{prediction.domain} domain</span>
          </div>
        </div>
      </div>
    </div>
  );
}