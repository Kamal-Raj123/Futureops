import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Settings, Brain, TrendingUp, TrendingDown, Minus, User, LogOut, Zap } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { usePredictionStore } from '../stores/predictionStore';
import PredictionCard from './PredictionCard';
import ParameterCustomizer from './ParameterCustomizer';
import ModelManager from './ai/ModelManager';
import PredictionEngine from './ai/PredictionEngine';
import { predictionDomains, generateMockPrediction } from '../utils/mockData';
import { PredictionDomain } from '../types';

interface DashboardProps {
  onBack: () => void;
}

export default function Dashboard({ onBack }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'predictions' | 'models' | 'engine'>('engine');
  const [selectedDomain, setSelectedDomain] = useState<PredictionDomain | null>(null);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [predictionTitle, setPredictionTitle] = useState('');

  const { user, profile, signOut } = useAuthStore();
  const { predictions, models, loadUserPredictions, createPrediction } = usePredictionStore();

  useEffect(() => {
    if (user) {
      loadUserPredictions();
    }
  }, [user, loadUserPredictions]);

  const handleCreatePrediction = async () => {
    if (selectedDomain && predictionTitle.trim()) {
      // For demo purposes, create a mock prediction
      // In production, this would use the actual AI model
      const mockPrediction = generateMockPrediction(selectedDomain.id, predictionTitle);
      
      const success = await createPrediction({
        title: predictionTitle,
        domain: selectedDomain.id,
        parameters: {
          timeframe: '12 months',
          confidence_threshold: 75,
        },
        prediction_result: {
          value: mockPrediction.value,
          unit: mockPrediction.unit,
          trend: mockPrediction.trend,
          data: mockPrediction.data,
          factors: mockPrediction.factors,
        },
        confidence_score: mockPrediction.confidence,
        status: 'completed',
      });

      if (success) {
        setSelectedDomain(null);
        setPredictionTitle('');
        setShowCustomizer(false);
      }
    }
  };

  const handleDeletePrediction = async (id: string) => {
    // Implementation for deleting predictions
    console.log('Delete prediction:', id);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      default:
        return <Minus className="w-5 h-5 text-yellow-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-3">
                <Brain className="w-8 h-8 text-cyan-400" />
                <h1 className="text-2xl font-bold text-white">Prediction Dashboard</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Navigation Tabs */}
              <div className="flex bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('engine')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'engine'
                      ? 'bg-cyan-500 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>AI Engine</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('predictions')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'predictions'
                      ? 'bg-cyan-500 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Predictions
                </button>
                <button
                  onClick={() => setActiveTab('models')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'models'
                      ? 'bg-cyan-500 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Training
                </button>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-white">
                  <User className="w-5 h-5" />
                  <span className="text-sm">{profile?.full_name || user?.email}</span>
                </div>
                <button
                  onClick={signOut}
                  className="p-2 text-gray-300 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              {activeTab === 'predictions' && (
                <button
                  onClick={() => setShowCustomizer(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Prediction</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'engine' ? (
          <PredictionEngine />
        ) : activeTab === 'predictions' ? (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Predictions</p>
                    <p className="text-3xl font-bold text-white">{predictions.length}</p>
                  </div>
                  <Brain className="w-10 h-10 text-cyan-400" />
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Avg. Confidence</p>
                    <p className="text-3xl font-bold text-white">
                      {predictions.length > 0 
                        ? Math.round(predictions.reduce((acc, p) => acc + (p.confidence_score || 0), 0) / predictions.length)
                        : 0}%
                    </p>
                  </div>
                  <Settings className="w-10 h-10 text-green-400" />
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Models</p>
                    <p className="text-3xl font-bold text-white">{models.length}</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-emerald-400" />
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Subscription</p>
                    <p className="text-3xl font-bold text-white capitalize">
                      {profile?.subscription_tier || 'Free'}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {profile?.subscription_tier?.charAt(0).toUpperCase() || 'F'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Predictions Grid */}
            {predictions.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {predictions.map((prediction) => (
                  <PredictionCard
                    key={prediction.id}
                    prediction={{
                      id: prediction.id,
                      domain: prediction.domain,
                      title: prediction.title,
                      confidence: prediction.confidence_score || 0,
                      trend: prediction.prediction_result?.trend || 'stable',
                      value: prediction.prediction_result?.value || 0,
                      unit: prediction.prediction_result?.unit || '',
                      timeframe: prediction.parameters?.timeframe || '12 months',
                      factors: prediction.prediction_result?.factors || [],
                      data: prediction.prediction_result?.data || [],
                      created: new Date(prediction.created_at),
                    }}
                    onDelete={handleDeletePrediction}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Brain className="w-24 h-24 text-gray-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-4">No Predictions Yet</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Create your first prediction to start exploring the future with AI-powered insights.
                </p>
                <button
                  onClick={() => setShowCustomizer(true)}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
                >
                  Create First Prediction
                </button>
              </div>
            )}
          </>
        ) : (
          <ModelManager />
        )}
      </div>

      {/* Parameter Customizer Modal */}
      {showCustomizer && (
        <ParameterCustomizer
          domains={predictionDomains}
          selectedDomain={selectedDomain}
          onDomainSelect={setSelectedDomain}
          predictionTitle={predictionTitle}
          onTitleChange={setPredictionTitle}
          onClose={() => {
            setShowCustomizer(false);
            setSelectedDomain(null);
            setPredictionTitle('');
          }}
          onCreate={handleCreatePrediction}
        />
      )}
    </div>
  );
}