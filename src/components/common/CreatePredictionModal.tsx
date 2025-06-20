import React, { useState } from 'react';
import { X, Brain, Calendar, Target, Settings } from 'lucide-react';

interface CreatePredictionModalProps {
  domain: string;
  onClose: () => void;
  onCreate: (data: any) => void;
}

export default function CreatePredictionModal({ domain, onClose, onCreate }: CreatePredictionModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    timeframe: '12 months',
    confidence_threshold: 75,
    historical_weight: 60,
    realtime_updates: true,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onCreate({
      ...formData,
      domain,
      parameters: {
        timeframe: formData.timeframe,
        confidence_threshold: formData.confidence_threshold,
        historical_weight: formData.historical_weight,
        realtime_updates: formData.realtime_updates
      }
    });
  };

  const getDomainInfo = () => {
    switch (domain) {
      case 'weather':
        return {
          name: 'Weather Forecasting',
          color: 'text-blue-400',
          bgColor: 'from-blue-500/20 to-cyan-500/20',
          borderColor: 'border-blue-500/30'
        };
      case 'stocks':
        return {
          name: 'Stock Market Prediction',
          color: 'text-green-400',
          bgColor: 'from-green-500/20 to-emerald-500/20',
          borderColor: 'border-green-500/30'
        };
      case 'climate':
        return {
          name: 'Climate Change Analysis',
          color: 'text-orange-400',
          bgColor: 'from-orange-500/20 to-red-500/20',
          borderColor: 'border-orange-500/30'
        };
      case 'elections':
        return {
          name: 'Election Trend Analysis',
          color: 'text-purple-400',
          bgColor: 'from-purple-500/20 to-violet-500/20',
          borderColor: 'border-purple-500/30'
        };
      case 'global':
        return {
          name: 'Global Strategy Analysis',
          color: 'text-red-400',
          bgColor: 'from-red-500/20 to-pink-500/20',
          borderColor: 'border-red-500/30'
        };
      default:
        return {
          name: 'Prediction Analysis',
          color: 'text-cyan-400',
          bgColor: 'from-cyan-500/20 to-purple-500/20',
          borderColor: 'border-cyan-500/30'
        };
    }
  };

  const domainInfo = getDomainInfo();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-sm rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className={`bg-gradient-to-r ${domainInfo.bgColor} border-b ${domainInfo.borderColor} p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className={`w-8 h-8 ${domainInfo.color}`} />
              <div>
                <h2 className="text-2xl font-bold text-white">Create New Prediction</h2>
                <p className="text-gray-300">{domainInfo.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Target className={`w-5 h-5 ${domainInfo.color}`} />
              <span>Basic Information</span>
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Prediction Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder={`e.g., ${domainInfo.name} for Q1 2025`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                rows={3}
                placeholder="Describe what you want to predict..."
              />
            </div>
          </div>

          {/* Parameters */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Settings className={`w-5 h-5 ${domainInfo.color}`} />
              <span>Prediction Parameters</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Time Horizon
                </label>
                <select
                  value={formData.timeframe}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeframe: e.target.value }))}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="1 week">1 Week</option>
                  <option value="1 month">1 Month</option>
                  <option value="3 months">3 Months</option>
                  <option value="6 months">6 Months</option>
                  <option value="12 months">12 Months</option>
                  <option value="2 years">2 Years</option>
                  <option value="5 years">5 Years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confidence Threshold: {formData.confidence_threshold}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={formData.confidence_threshold}
                  onChange={(e) => setFormData(prev => ({ ...prev, confidence_threshold: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Historical Data Weight: {formData.historical_weight}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={formData.historical_weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, historical_weight: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Real-time Updates
                </label>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, realtime_updates: !prev.realtime_updates }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.realtime_updates ? 'bg-cyan-500' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.realtime_updates ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-8 py-3 bg-gradient-to-r ${domainInfo.bgColor} text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 border ${domainInfo.borderColor}`}
            >
              Create Prediction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}