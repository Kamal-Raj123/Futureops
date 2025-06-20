import React, { useState } from 'react';
import { 
  Target, 
  Globe, 
  Shield, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Plus,
  BarChart3,
  Users
} from 'lucide-react';
import PredictionCard from '../common/PredictionCard';
import CreatePredictionModal from '../common/CreatePredictionModal';

export default function GlobalStrategies() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('Global');

  // Mock global strategy data
  const globalMetrics = {
    gdpGrowth: { value: 3.2, change: 0.5, unit: '%' },
    tradeVolume: { value: 28.5, change: 2.1, unit: 'trillion USD' },
    geopoliticalRisk: { value: 68, change: 5, unit: 'risk index' },
    energySecurity: { value: 72, change: -3, unit: 'security score' }
  };

  const globalPredictions = [
    {
      id: '1',
      title: 'Global Economic Recovery - Post-Pandemic Analysis',
      domain: 'global',
      confidence: 79,
      trend: 'up' as const,
      value: 4.1,
      unit: '% GDP growth',
      timeframe: '2 years',
      factors: ['Trade Relations', 'Supply Chain Recovery', 'Monetary Policy', 'Geopolitical Stability'],
      data: Array.from({ length: 24 }, (_, i) => ({
        x: `Month ${i + 1}`,
        y: 2.8 + (i * 0.05) + Math.random() * 0.3
      })),
      created: new Date()
    },
    {
      id: '2',
      title: 'Geopolitical Risk Assessment - Next 5 Years',
      domain: 'global',
      confidence: 85,
      trend: 'up' as const,
      value: 75,
      unit: ' risk score',
      timeframe: '5 years',
      factors: ['Regional Conflicts', 'Trade Wars', 'Cyber Threats', 'Resource Competition'],
      data: Array.from({ length: 60 }, (_, i) => ({
        x: `Month ${i + 1}`,
        y: 65 + (i * 0.15) + Math.random() * 5
      })),
      created: new Date()
    }
  ];

  const strategicSectors = [
    {
      name: 'Energy Security',
      score: 72,
      trend: -3,
      priority: 'High',
      icon: Shield,
      color: 'text-orange-400'
    },
    {
      name: 'Supply Chain Resilience',
      score: 68,
      trend: 8,
      priority: 'Critical',
      icon: Globe,
      color: 'text-blue-400'
    },
    {
      name: 'Cyber Defense',
      score: 81,
      trend: 5,
      priority: 'High',
      icon: Shield,
      color: 'text-purple-400'
    },
    {
      name: 'Economic Diplomacy',
      score: 75,
      trend: 2,
      priority: 'Medium',
      icon: DollarSign,
      color: 'text-green-400'
    }
  ];

  const regionalAnalysis = [
    { region: 'North America', stability: 85, growth: 3.2, risk: 'Low' },
    { region: 'Europe', stability: 78, growth: 2.8, risk: 'Medium' },
    { region: 'Asia-Pacific', stability: 72, growth: 4.5, risk: 'Medium' },
    { region: 'Middle East', stability: 58, growth: 2.1, risk: 'High' },
    { region: 'Africa', stability: 65, growth: 3.8, risk: 'Medium' },
    { region: 'Latin America', stability: 70, growth: 2.9, risk: 'Medium' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'text-red-400 bg-red-400/20';
      case 'High':
        return 'text-orange-400 bg-orange-400/20';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-400/20';
      default:
        return 'text-green-400 bg-green-400/20';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'text-red-400 bg-red-400/20';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-400/20';
      default:
        return 'text-green-400 bg-green-400/20';
    }
  };

  const regions = [
    'Global',
    'North America',
    'Europe',
    'Asia-Pacific',
    'Middle East',
    'Africa',
    'Latin America'
  ];

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {regions.map(region => (
              <option key={region} value={region} className="bg-slate-800">
                {region}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>New Strategic Analysis</span>
        </button>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <span className="text-sm text-gray-300">Global GDP Growth</span>
          </div>
          <div className="text-2xl font-bold text-white">{globalMetrics.gdpGrowth.value}%</div>
          <div className="text-sm text-green-400 mt-2">
            +{globalMetrics.gdpGrowth.change}% vs last year
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-blue-400" />
            <span className="text-sm text-gray-300">Trade Volume</span>
          </div>
          <div className="text-2xl font-bold text-white">${globalMetrics.tradeVolume.value}T</div>
          <div className="text-sm text-green-400 mt-2">
            +{globalMetrics.tradeVolume.change}T increase
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-400" />
            <span className="text-sm text-gray-300">Geopolitical Risk</span>
          </div>
          <div className="text-2xl font-bold text-white">{globalMetrics.geopoliticalRisk.value}</div>
          <div className="text-sm text-red-400 mt-2">
            +{globalMetrics.geopoliticalRisk.change} risk increase
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-purple-400" />
            <span className="text-sm text-gray-300">Energy Security</span>
          </div>
          <div className="text-2xl font-bold text-white">{globalMetrics.energySecurity.value}</div>
          <div className="text-sm text-red-400 mt-2">
            {globalMetrics.energySecurity.change} security decline
          </div>
        </div>
      </div>

      {/* Strategic Sectors */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
            <Target className="w-6 h-6 text-red-400" />
            <span>Strategic Sectors Analysis</span>
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {strategicSectors.map((sector) => (
              <div
                key={sector.name}
                className="p-6 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-white/10 rounded-lg">
                      <sector.icon className={`w-6 h-6 ${sector.color}`} />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{sector.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(sector.priority)}`}>
                        {sector.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Current Score:</span>
                    <span className="text-2xl font-bold text-white">{sector.score}/100</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500`}
                      style={{ width: `${sector.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Trend:</span>
                    <div className={`flex items-center space-x-1 ${
                      sector.trend >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {sector.trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span>{Math.abs(sector.trend)} points</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Analysis */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
            <Globe className="w-6 h-6 text-red-400" />
            <span>Regional Stability Analysis</span>
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {regionalAnalysis.map((region) => (
              <div
                key={region.region}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex-1">
                  <div className="text-white font-medium mb-2">{region.region}</div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Stability: </span>
                      <span className="text-white font-medium">{region.stability}/100</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Growth: </span>
                      <span className="text-white font-medium">{region.growth}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Risk: </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(region.risk)}`}>
                        {region.risk}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="w-16 h-16 relative">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        strokeDasharray={`${region.stability}, 100`}
                      />
                      <defs>
                        <linearGradient id="gradient">
                          <stop offset="0%" stopColor="#ef4444" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{region.stability}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Global Strategy Predictions */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Target className="w-8 h-8 text-red-400" />
          <span>Global Strategy Predictions</span>
        </h3>
        
        {globalPredictions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {globalPredictions.map((prediction) => (
              <PredictionCard
                key={prediction.id}
                prediction={prediction}
                onDelete={(id) => console.log('Delete prediction:', id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Target className="w-24 h-24 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">No Strategic Predictions Yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Create your first global strategy analysis to start predicting geopolitical trends.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
            >
              Create Strategic Analysis
            </button>
          </div>
        )}
      </div>

      {/* Create Prediction Modal */}
      {showCreateModal && (
        <CreatePredictionModal
          domain="global"
          onClose={() => setShowCreateModal(false)}
          onCreate={(data) => {
            console.log('Create global strategy prediction:', data);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}