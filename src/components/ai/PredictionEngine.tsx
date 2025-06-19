import React, { useState, useEffect } from 'react';
import { Brain, Zap, Target, TrendingUp, Loader } from 'lucide-react';
import { aiService, PredictionInput, PredictionResult } from '../../services/aiService';
import { predictionDomains } from '../../utils/mockData';
import Chart from '../Chart';
import toast from 'react-hot-toast';

export default function PredictionEngine() {
  const [selectedDomain, setSelectedDomain] = useState('weather');
  const [predictionInput, setPredictionInput] = useState({
    timeframe: 12,
    confidence: 75,
    features: [25, 60, 1013, 15, 8, 45, 12, 3, 78, 22] // Sample features
  });
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);

  useEffect(() => {
    // Check if AI models are ready
    const checkModels = () => {
      const ready = aiService.isModelReady(selectedDomain);
      setModelReady(ready);
    };

    checkModels();
    const interval = setInterval(checkModels, 1000);
    return () => clearInterval(interval);
  }, [selectedDomain]);

  const handlePredict = async () => {
    if (!modelReady) {
      toast.error('AI model is still loading. Please wait...');
      return;
    }

    setLoading(true);
    try {
      const input: PredictionInput = {
        features: predictionInput.features,
        timeframe: predictionInput.timeframe,
        domain: selectedDomain
      };

      const result = await aiService.makePrediction(input);
      setPrediction(result);
      toast.success('Prediction generated successfully!');
    } catch (error) {
      toast.error('Failed to generate prediction');
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFeature = (index: number, value: number) => {
    const newFeatures = [...predictionInput.features];
    newFeatures[index] = value;
    setPredictionInput(prev => ({ ...prev, features: newFeatures }));
  };

  const getDomainInfo = () => {
    return predictionDomains.find(d => d.id === selectedDomain);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">AI Prediction Engine</h2>
        <p className="text-gray-400">Generate real-time predictions using frontend AI models</p>
      </div>

      {/* Domain Selection */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4">Select Prediction Domain</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {predictionDomains.map((domain) => (
            <button
              key={domain.id}
              onClick={() => setSelectedDomain(domain.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                selectedDomain === domain.id
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto mb-2 rounded-lg ${domain.color} flex items-center justify-center`}>
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <p className="text-white font-medium">{domain.name}</p>
                <div className="flex items-center justify-center mt-2">
                  {aiService.isModelReady(domain.id) ? (
                    <div className="flex items-center space-x-1 text-green-400 text-xs">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Ready</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-yellow-400 text-xs">
                      <Loader className="w-3 h-3 animate-spin" />
                      <span>Loading</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Input Parameters */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4">Prediction Parameters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Time Horizon (months)
            </label>
            <input
              type="range"
              min="3"
              max="24"
              value={predictionInput.timeframe}
              onChange={(e) => setPredictionInput(prev => ({ ...prev, timeframe: parseInt(e.target.value) }))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>3 months</span>
              <span className="text-white font-medium">{predictionInput.timeframe} months</span>
              <span>24 months</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confidence Threshold (%)
            </label>
            <input
              type="range"
              min="50"
              max="95"
              value={predictionInput.confidence}
              onChange={(e) => setPredictionInput(prev => ({ ...prev, confidence: parseInt(e.target.value) }))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>50%</span>
              <span className="text-white font-medium">{predictionInput.confidence}%</span>
              <span>95%</span>
            </div>
          </div>
        </div>

        {/* Feature Inputs */}
        <div className="mt-6">
          <h4 className="text-lg font-medium text-white mb-3">Input Features</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {predictionInput.features.map((feature, index) => (
              <div key={index}>
                <label className="block text-xs text-gray-400 mb-1">
                  Feature {index + 1}
                </label>
                <input
                  type="number"
                  value={feature}
                  onChange={(e) => updateFeature(index, parseFloat(e.target.value) || 0)}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Predict Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handlePredict}
            disabled={loading || !modelReady}
            className="flex items-center space-x-2 mx-auto px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Generating Prediction...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Generate Prediction</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Prediction Results */}
      {prediction && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <span>Prediction Results</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Metrics */}
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Predicted Value</span>
                  <span className="text-2xl font-bold text-white">
                    {prediction.value}
                    {getDomainInfo()?.id === 'weather' && '°F'}
                    {getDomainInfo()?.id === 'stocks' && '$'}
                    {getDomainInfo()?.id === 'elections' && '%'}
                    {getDomainInfo()?.id === 'climate' && ' ppm'}
                  </span>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Confidence</span>
                  <span className="text-xl font-bold text-green-400">
                    {Math.round(prediction.confidence)}%
                  </span>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Trend</span>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className={`w-5 h-5 ${
                      prediction.trend === 'up' ? 'text-green-400' : 
                      prediction.trend === 'down' ? 'text-red-400' : 'text-yellow-400'
                    }`} />
                    <span className="text-white capitalize">{prediction.trend}</span>
                  </div>
                </div>
              </div>

              {/* Key Factors */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-white font-medium mb-3">Key Factors</h4>
                <div className="flex flex-wrap gap-2">
                  {prediction.factors.map((factor, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="text-white font-medium mb-3">Prediction Timeline</h4>
              <Chart data={prediction.data} trend={prediction.trend} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}