import React, { useState } from 'react';
import { 
  Users, 
  Vote, 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
  Plus,
  PieChart
} from 'lucide-react';
import PredictionCard from '../common/PredictionCard';
import CreatePredictionModal from '../common/CreatePredictionModal';

export default function ElectionTrendAnalysis() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('United States');

  // Mock election data
  const electionMetrics = {
    voterTurnout: { value: 66.8, change: 2.3, unit: '%' },
    registeredVoters: { value: 240.5, change: 5.2, unit: 'million' },
    pollingAccuracy: { value: 87.2, change: -1.8, unit: '%' },
    socialSentiment: { value: 72.4, change: 4.1, unit: '% positive' }
  };

  const electionPredictions = [
    {
      id: '1',
      title: '2024 Presidential Election - Swing States Analysis',
      domain: 'elections',
      confidence: 82,
      trend: 'up' as const,
      value: 52.3,
      unit: '%',
      timeframe: '6 months',
      factors: ['Polling Data', 'Historical Voting Patterns', 'Economic Indicators', 'Social Media Sentiment'],
      data: Array.from({ length: 24 }, (_, i) => ({
        x: `Week ${i + 1}`,
        y: 48 + Math.random() * 8
      })),
      created: new Date()
    },
    {
      id: '2',
      title: 'Congressional Midterm Predictions - House Seats',
      domain: 'elections',
      confidence: 76,
      trend: 'stable' as const,
      value: 218,
      unit: ' seats',
      timeframe: '3 months',
      factors: ['Incumbent Advantage', 'District Demographics', 'Campaign Funding', 'National Mood'],
      data: Array.from({ length: 12 }, (_, i) => ({
        x: `Month ${i + 1}`,
        y: 215 + Math.random() * 6
      })),
      created: new Date()
    }
  ];

  const swingStates = [
    { state: 'Pennsylvania', electoral: 20, lean: 'Toss-up', margin: 0.8 },
    { state: 'Michigan', electoral: 16, lean: 'Lean D', margin: 2.1 },
    { state: 'Wisconsin', electoral: 10, lean: 'Toss-up', margin: 0.3 },
    { state: 'Arizona', electoral: 11, lean: 'Lean R', margin: 1.5 },
    { state: 'Georgia', electoral: 16, lean: 'Toss-up', margin: 0.9 },
    { state: 'North Carolina', electoral: 15, lean: 'Lean R', margin: 2.3 }
  ];

  const demographicTrends = [
    { group: 'Young Voters (18-29)', support: 68, change: 5.2, color: 'text-blue-400' },
    { group: 'Suburban Women', support: 58, change: 3.1, color: 'text-purple-400' },
    { group: 'College Educated', support: 62, change: 1.8, color: 'text-green-400' },
    { group: 'Rural Voters', support: 42, change: -2.4, color: 'text-orange-400' }
  ];

  const getLeanColor = (lean: string) => {
    switch (lean) {
      case 'Lean D':
        return 'text-blue-400 bg-blue-400/20';
      case 'Lean R':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-yellow-400 bg-yellow-400/20';
    }
  };

  const regions = [
    'United States',
    'California',
    'Texas',
    'Florida',
    'New York',
    'Pennsylvania'
  ];

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>New Election Analysis</span>
        </button>
      </div>

      {/* Election Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <Vote className="w-8 h-8 text-blue-400" />
            <span className="text-sm text-gray-300">Voter Turnout</span>
          </div>
          <div className="text-2xl font-bold text-white">{electionMetrics.voterTurnout.value}%</div>
          <div className="text-sm text-green-400 mt-2">
            +{electionMetrics.voterTurnout.change}% vs last election
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-green-400" />
            <span className="text-sm text-gray-300">Registered Voters</span>
          </div>
          <div className="text-2xl font-bold text-white">{electionMetrics.registeredVoters.value}M</div>
          <div className="text-sm text-green-400 mt-2">
            +{electionMetrics.registeredVoters.change}M new registrations
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-purple-400" />
            <span className="text-sm text-gray-300">Polling Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-white">{electionMetrics.pollingAccuracy.value}%</div>
          <div className="text-sm text-red-400 mt-2">
            {electionMetrics.pollingAccuracy.change}% vs 2020
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-orange-400" />
            <span className="text-sm text-gray-300">Social Sentiment</span>
          </div>
          <div className="text-2xl font-bold text-white">{electionMetrics.socialSentiment.value}%</div>
          <div className="text-sm text-green-400 mt-2">
            +{electionMetrics.socialSentiment.change}% positive
          </div>
        </div>
      </div>

      {/* Swing States Analysis */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-purple-400" />
            <span>Swing States Analysis</span>
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {swingStates.map((state) => (
              <div
                key={state.state}
                className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-white">{state.state}</div>
                  <div className="text-sm text-gray-400">{state.electoral} EV</div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Current Lean:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLeanColor(state.lean)}`}>
                    {state.lean}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Margin:</span>
                  <span className="text-white font-medium">±{state.margin}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demographic Trends */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
            <PieChart className="w-6 h-6 text-purple-400" />
            <span>Demographic Trends</span>
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {demographicTrends.map((trend) => (
              <div
                key={trend.group}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex-1">
                  <div className="text-white font-medium mb-1">{trend.group}</div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-500`}
                      style={{ width: `${trend.support}%` }}
                    />
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-white font-bold">{trend.support}%</div>
                  <div className={`text-sm flex items-center space-x-1 ${
                    trend.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {trend.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{Math.abs(trend.change)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Election Predictions */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Users className="w-8 h-8 text-purple-400" />
          <span>Election Trend Predictions</span>
        </h3>
        
        {electionPredictions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {electionPredictions.map((prediction) => (
              <PredictionCard
                key={prediction.id}
                prediction={prediction}
                onDelete={(id) => console.log('Delete prediction:', id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="w-24 h-24 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">No Election Predictions Yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Create your first election analysis to start predicting political trends.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
            >
              Create Election Analysis
            </button>
          </div>
        )}
      </div>

      {/* Create Prediction Modal */}
      {showCreateModal && (
        <CreatePredictionModal
          domain="elections"
          onClose={() => setShowCreateModal(false)}
          onCreate={(data) => {
            console.log('Create election prediction:', data);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}