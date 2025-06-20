import React, { useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  BarChart3,
  Activity,
  Zap,
  Globe,
  Users
} from 'lucide-react';
import { usePredictionStore } from '../../stores/predictionStore';
import { useAuthStore } from '../../stores/authStore';

export default function Overview() {
  const { predictions, models, loading } = usePredictionStore();
  const { profile } = useAuthStore();

  const stats = [
    {
      name: 'Total Predictions',
      value: predictions.length,
      icon: Brain,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/20'
    },
    {
      name: 'Active Models',
      value: models.length,
      icon: Target,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20'
    },
    {
      name: 'Avg. Confidence',
      value: predictions.length > 0 
        ? Math.round(predictions.reduce((acc, p) => acc + (p.confidence_score || 0), 0) / predictions.length)
        : 0,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20',
      suffix: '%'
    },
    {
      name: 'API Usage',
      value: profile?.api_usage_count || 0,
      icon: Activity,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/20'
    }
  ];

  const recentPredictions = predictions.slice(0, 5);

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case 'weather':
        return <Globe className="w-5 h-5 text-blue-400" />;
      case 'stocks':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'elections':
        return <Users className="w-5 h-5 text-purple-400" />;
      case 'climate':
        return <Globe className="w-5 h-5 text-orange-400" />;
      default:
        return <Brain className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!
            </h2>
            <p className="text-gray-300">
              Ready to explore the future with AI-powered predictions?
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {stat.value}{stat.suffix || ''}
                </div>
                <div className="text-sm text-gray-400">{stat.name}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Predictions */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
              <span>Recent Predictions</span>
            </h3>
          </div>
          <div className="p-6">
            {recentPredictions.length > 0 ? (
              <div className="space-y-4">
                {recentPredictions.map((prediction) => (
                  <div
                    key={prediction.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center space-x-3">
                      {getDomainIcon(prediction.domain)}
                      <div>
                        <div className="text-white font-medium">{prediction.title}</div>
                        <div className="text-sm text-gray-400 capitalize">{prediction.domain}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-medium">
                        {prediction.confidence_score}% confidence
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(prediction.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No predictions yet</p>
                <p className="text-sm text-gray-500">Start by creating your first prediction</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <Zap className="w-6 h-6 text-purple-400" />
              <span>Quick Actions</span>
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30 text-left hover:bg-blue-500/30 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <Globe className="w-6 h-6 text-blue-400" />
                <div>
                  <div className="text-white font-medium">Weather Forecast</div>
                  <div className="text-sm text-gray-400">Create weather predictions</div>
                </div>
              </div>
            </button>
            
            <button className="w-full p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30 text-left hover:bg-green-500/30 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <div>
                  <div className="text-white font-medium">Stock Analysis</div>
                  <div className="text-sm text-gray-400">Analyze market trends</div>
                </div>
              </div>
            </button>
            
            <button className="w-full p-4 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-lg border border-purple-500/30 text-left hover:bg-purple-500/30 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-purple-400" />
                <div>
                  <div className="text-white font-medium">Election Trends</div>
                  <div className="text-sm text-gray-400">Political sentiment analysis</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}