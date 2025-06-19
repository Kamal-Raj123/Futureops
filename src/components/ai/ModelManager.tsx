import React, { useState, useEffect } from 'react';
import { Plus, Brain, Settings, Play, Trash2, Eye, Upload } from 'lucide-react';
import { usePredictionStore } from '../../stores/predictionStore';
import TrainingManager from './TrainingManager';

export default function ModelManager() {
  const [showCreateModel, setShowCreateModel] = useState(false);
  const [showTrainer, setShowTrainer] = useState<string | null>(null);
  const [newModel, setNewModel] = useState({
    name: '',
    domain: 'weather',
    model_type: 'linear_regression',
    description: '',
  });

  const { models, loading, createModel, loadUserModels } = usePredictionStore();

  useEffect(() => {
    loadUserModels();
  }, [loadUserModels]);

  const handleCreateModel = async () => {
    if (!newModel.name.trim()) return;

    const success = await createModel({
      ...newModel,
      configuration: {
        description: newModel.description,
      },
      training_status: 'pending',
      is_public: false,
    });

    if (success) {
      setShowCreateModel(false);
      setNewModel({
        name: '',
        domain: 'weather',
        model_type: 'linear_regression',
        description: '',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/20';
      case 'training':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'failed':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case 'lstm':
        return '🧠';
      case 'transformer':
        return '🤖';
      case 'linear_regression':
        return '📈';
      default:
        return '⚙️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Backend Training Manager</h2>
          <p className="text-gray-400">Create models and manage training jobs on the backend</p>
        </div>
        <button
          onClick={() => setShowCreateModel(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>Create Model</span>
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Brain className="w-6 h-6 text-blue-400 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Backend Training Architecture</h3>
            <p className="text-gray-300 mb-3">
              This section manages model training on the backend. Models are trained with your custom data 
              and can be deployed for production use. The frontend AI Engine handles real-time predictions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span className="text-gray-300">Upload custom training datasets</span>
              </div>
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-cyan-400" />
                <span className="text-gray-300">Configure training parameters</span>
              </div>
              <div className="flex items-center space-x-2">
                <Play className="w-4 h-4 text-cyan-400" />
                <span className="text-gray-300">Monitor training progress</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-cyan-400" />
                <span className="text-gray-300">Deploy trained models</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Models Grid */}
      {loading ? (
        <div className="text-center py-12">
          <Brain className="w-12 h-12 text-gray-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-400">Loading models...</p>
        </div>
      ) : models.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <div
              key={model.id}
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getModelTypeIcon(model.model_type)}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{model.name}</h3>
                    <p className="text-sm text-gray-400 capitalize">{model.domain}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(model.training_status)}`}>
                  {model.training_status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white capitalize">{model.model_type.replace('_', ' ')}</span>
                </div>
                {model.accuracy_score && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Accuracy:</span>
                    <span className="text-green-400">{(model.accuracy_score * 100).toFixed(1)}%</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Visibility:</span>
                  <span className="text-white">{model.is_public ? 'Public' : 'Private'}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setShowTrainer(model.id)}
                  className="flex-1 flex items-center justify-center space-x-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Train</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-1 bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-2 rounded-lg text-sm transition-colors">
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button className="flex items-center justify-center bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded-lg text-sm transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Brain className="w-24 h-24 text-gray-600 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-white mb-4">No Models Yet</h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Create your first model to start training with your custom data on the backend.
          </p>
          <button
            onClick={() => setShowCreateModel(true)}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
          >
            Create First Model
          </button>
        </div>
      )}

      {/* Create Model Modal */}
      {showCreateModel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900/95 backdrop-blur-sm rounded-2xl max-w-md w-full border border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Create New Model</h3>
              <button
                onClick={() => setShowCreateModel(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Model Name
                </label>
                <input
                  type="text"
                  value={newModel.name}
                  onChange={(e) => setNewModel(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="e.g., Weather Prediction Model"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Domain
                </label>
                <select
                  value={newModel.domain}
                  onChange={(e) => setNewModel(prev => ({ ...prev, domain: e.target.value }))}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="weather">Weather</option>
                  <option value="stocks">Stock Market</option>
                  <option value="elections">Elections</option>
                  <option value="climate">Climate</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Model Type
                </label>
                <select
                  value={newModel.model_type}
                  onChange={(e) => setNewModel(prev => ({ ...prev, model_type: e.target.value }))}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="linear_regression">Linear Regression</option>
                  <option value="lstm">LSTM Neural Network</option>
                  <option value="transformer">Transformer</option>
                  <option value="custom">Custom Architecture</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newModel.description}
                  onChange={(e) => setNewModel(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  rows={3}
                  placeholder="Describe what this model will predict..."
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setShowCreateModel(false)}
                  className="flex-1 px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateModel}
                  disabled={!newModel.name.trim() || loading}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Model'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Training Manager Modal */}
      {showTrainer && (
        <TrainingManager
          modelId={showTrainer}
          onClose={() => setShowTrainer(null)}
        />
      )}
    </div>
  );
}