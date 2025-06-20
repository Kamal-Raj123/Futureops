import React, { useState } from 'react';
import { 
  Globe, 
  Thermometer, 
  Droplets, 
  Wind,
  TreePine,
  Factory,
  Plus,
  AlertTriangle
} from 'lucide-react';
import PredictionCard from '../common/PredictionCard';
import CreatePredictionModal from '../common/CreatePredictionModal';

export default function ClimateChangePlanning() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock climate data
  const climateMetrics = {
    globalTemp: { value: 1.2, change: 0.1, unit: '°C above pre-industrial' },
    co2Levels: { value: 421, change: 2.5, unit: 'ppm' },
    seaLevel: { value: 3.4, change: 0.3, unit: 'mm/year rise' },
    deforestation: { value: 10.2, change: -1.2, unit: 'million hectares/year' }
  };

  const climatePredictions = [
    {
      id: '1',
      title: 'Global Temperature Rise - Next 50 Years',
      domain: 'climate',
      confidence: 91,
      trend: 'up' as const,
      value: 2.1,
      unit: '°C',
      timeframe: '50 years',
      factors: ['CO2 Emissions', 'Deforestation', 'Industrial Activity', 'Renewable Energy Adoption'],
      data: Array.from({ length: 50 }, (_, i) => ({
        x: `Year ${2024 + i}`,
        y: 1.2 + (i * 0.018) + Math.random() * 0.1
      })),
      created: new Date()
    },
    {
      id: '2',
      title: 'Arctic Ice Coverage - Next 20 Years',
      domain: 'climate',
      confidence: 88,
      trend: 'down' as const,
      value: 3.2,
      unit: 'million km²',
      timeframe: '20 years',
      factors: ['Temperature Rise', 'Ocean Currents', 'Albedo Effect', 'Seasonal Variations'],
      data: Array.from({ length: 20 }, (_, i) => ({
        x: `Year ${2024 + i}`,
        y: 4.5 - (i * 0.065) - Math.random() * 0.2
      })),
      created: new Date()
    }
  ];

  const mitigationStrategies = [
    {
      name: 'Renewable Energy Transition',
      impact: 'High',
      timeline: '10-20 years',
      cost: 'High',
      icon: Wind,
      color: 'text-green-400'
    },
    {
      name: 'Reforestation Programs',
      impact: 'Medium',
      timeline: '20-50 years',
      cost: 'Medium',
      icon: TreePine,
      color: 'text-emerald-400'
    },
    {
      name: 'Carbon Capture Technology',
      impact: 'High',
      timeline: '15-30 years',
      cost: 'Very High',
      icon: Factory,
      color: 'text-blue-400'
    },
    {
      name: 'Policy & Regulation',
      impact: 'Very High',
      timeline: '5-10 years',
      cost: 'Low',
      icon: AlertTriangle,
      color: 'text-orange-400'
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Very High':
        return 'text-red-400 bg-red-400/20';
      case 'High':
        return 'text-orange-400 bg-orange-400/20';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-400/20';
      default:
        return 'text-green-400 bg-green-400/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Climate Emergency Dashboard</h2>
            <p className="text-gray-400">Monitor and predict climate change impacts</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>New Climate Prediction</span>
        </button>
      </div>

      {/* Climate Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border border-red-500/30">
          <div className="flex items-center justify-between mb-4">
            <Thermometer className="w-8 h-8 text-red-400" />
            <span className="text-sm text-gray-300">Global Temperature</span>
          </div>
          <div className="text-2xl font-bold text-white">+{climateMetrics.globalTemp.value}°C</div>
          <div className="text-xs text-gray-400">{climateMetrics.globalTemp.unit}</div>
          <div className="text-sm text-red-400 mt-2">
            +{climateMetrics.globalTemp.change}°C this decade
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-500/20 to-slate-500/20 backdrop-blur-sm rounded-xl p-6 border border-gray-500/30">
          <div className="flex items-center justify-between mb-4">
            <Factory className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-300">CO₂ Levels</span>
          </div>
          <div className="text-2xl font-bold text-white">{climateMetrics.co2Levels.value}</div>
          <div className="text-xs text-gray-400">{climateMetrics.co2Levels.unit}</div>
          <div className="text-sm text-red-400 mt-2">
            +{climateMetrics.co2Levels.change} ppm/year
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <Droplets className="w-8 h-8 text-blue-400" />
            <span className="text-sm text-gray-300">Sea Level Rise</span>
          </div>
          <div className="text-2xl font-bold text-white">{climateMetrics.seaLevel.value}</div>
          <div className="text-xs text-gray-400">{climateMetrics.seaLevel.unit}</div>
          <div className="text-sm text-red-400 mt-2">
            +{climateMetrics.seaLevel.change} mm acceleration
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <TreePine className="w-8 h-8 text-green-400" />
            <span className="text-sm text-gray-300">Forest Loss</span>
          </div>
          <div className="text-2xl font-bold text-white">{climateMetrics.deforestation.value}M</div>
          <div className="text-xs text-gray-400">{climateMetrics.deforestation.unit}</div>
          <div className="text-sm text-green-400 mt-2">
            {climateMetrics.deforestation.change}M improvement
          </div>
        </div>
      </div>

      {/* Mitigation Strategies */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
            <Globe className="w-6 h-6 text-orange-400" />
            <span>Mitigation Strategies</span>
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mitigationStrategies.map((strategy) => (
              <div
                key={strategy.name}
                className="p-6 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white/10 rounded-lg">
                    <strategy.icon className={`w-6 h-6 ${strategy.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">{strategy.name}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Impact:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(strategy.impact)}`}>
                          {strategy.impact}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Timeline:</span>
                        <span className="text-white">{strategy.timeline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cost:</span>
                        <span className="text-white">{strategy.cost}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Climate Predictions */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Globe className="w-8 h-8 text-orange-400" />
          <span>Climate Change Predictions</span>
        </h3>
        
        {climatePredictions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {climatePredictions.map((prediction) => (
              <PredictionCard
                key={prediction.id}
                prediction={prediction}
                onDelete={(id) => console.log('Delete prediction:', id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Globe className="w-24 h-24 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">No Climate Predictions Yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Create your first climate prediction to start analyzing environmental trends.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
            >
              Create Climate Prediction
            </button>
          </div>
        )}
      </div>

      {/* Create Prediction Modal */}
      {showCreateModal && (
        <CreatePredictionModal
          domain="climate"
          onClose={() => setShowCreateModal(false)}
          onCreate={(data) => {
            console.log('Create climate prediction:', data);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}