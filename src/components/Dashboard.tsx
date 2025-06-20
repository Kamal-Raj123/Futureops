import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  User, 
  LogOut, 
  Cloud, 
  TrendingUp, 
  Globe, 
  Users, 
  Target,
  BarChart3,
  Settings,
  Home,
  Menu,
  X,
  ChevronDown,
  Crown
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { usePredictionStore } from '../stores/predictionStore';
import Sidebar from './layout/Sidebar';
import WeatherForecasting from './features/WeatherForecasting';
import StockMarketPredictions from './features/StockMarketPredictions';
import ClimateChangePlanning from './features/ClimateChangePlanning';
import ElectionTrendAnalysis from './features/ElectionTrendAnalysis';
import GlobalStrategies from './features/GlobalStrategies';
import Overview from './features/Overview';

interface DashboardProps {
  onBack: () => void;
}

export type FeatureType = 'overview' | 'weather' | 'stocks' | 'climate' | 'elections' | 'global';

export const sidebarFeatures = [
  {
    id: 'overview' as FeatureType,
    name: 'Overview',
    icon: Home,
    description: 'Dashboard overview and analytics',
    color: 'text-cyan-400'
  },
  {
    id: 'weather' as FeatureType,
    name: 'Weather Forecasting',
    icon: Cloud,
    description: 'Advanced meteorological predictions',
    color: 'text-blue-400'
  },
  {
    id: 'stocks' as FeatureType,
    name: 'Stock Market',
    icon: TrendingUp,
    description: 'Financial market analysis and predictions',
    color: 'text-green-400'
  },
  {
    id: 'climate' as FeatureType,
    name: 'Climate Change',
    icon: Globe,
    description: 'Environmental impact forecasting',
    color: 'text-orange-400'
  },
  {
    id: 'elections' as FeatureType,
    name: 'Election Trends',
    icon: Users,
    description: 'Political sentiment and voting analysis',
    color: 'text-purple-400'
  },
  {
    id: 'global' as FeatureType,
    name: 'Global Strategies',
    icon: Target,
    description: 'Geopolitical and economic strategies',
    color: 'text-red-400'
  }
];

export default function Dashboard({ onBack }: DashboardProps) {
  const [activeFeature, setActiveFeature] = useState<FeatureType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, profile, signOut } = useAuthStore();
  const { loadUserPredictions, loadUserModels } = usePredictionStore();

  useEffect(() => {
    if (user) {
      loadUserPredictions();
      loadUserModels();
    }
  }, [user, loadUserPredictions, loadUserModels]);

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'overview':
        return <Overview />;
      case 'weather':
        return <WeatherForecasting />;
      case 'stocks':
        return <StockMarketPredictions />;
      case 'climate':
        return <ClimateChangePlanning />;
      case 'elections':
        return <ElectionTrendAnalysis />;
      case 'global':
        return <GlobalStrategies />;
      default:
        return <Overview />;
    }
  };

  const currentFeature = sidebarFeatures.find(f => f.id === activeFeature);

  const getSubscriptionColor = (tier: string) => {
    switch (tier) {
      case 'enterprise':
        return 'text-purple-400 bg-purple-400/20';
      case 'pro':
        return 'text-green-400 bg-green-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getSubscriptionIcon = (tier: string) => {
    switch (tier) {
      case 'enterprise':
      case 'pro':
        return <Crown className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex">
      {/* Sidebar */}
      <Sidebar
        features={sidebarFeatures}
        activeFeature={activeFeature}
        onFeatureSelect={setActiveFeature}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 text-gray-300 hover:text-white transition-colors lg:hidden"
                >
                  {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                <div className="flex items-center space-x-3">
                  {currentFeature && (
                    <>
                      <currentFeature.icon className={`w-8 h-8 ${currentFeature.color}`} />
                      <div>
                        <h1 className="text-2xl font-bold text-white">{currentFeature.name}</h1>
                        <p className="text-gray-400 text-sm">{currentFeature.description}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-white text-sm font-medium">
                          {profile?.full_name || user?.email}
                        </div>
                        <div className="flex items-center space-x-1">
                          {getSubscriptionIcon(profile?.subscription_tier || 'free')}
                          <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getSubscriptionColor(profile?.subscription_tier || 'free')}`}>
                            {profile?.subscription_tier || 'free'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl z-50">
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {profile?.full_name || 'User'}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {user?.email}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border-b border-white/10">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Subscription</span>
                            <div className="flex items-center space-x-2">
                              {getSubscriptionIcon(profile?.subscription_tier || 'free')}
                              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getSubscriptionColor(profile?.subscription_tier || 'free')}`}>
                                {profile?.subscription_tier || 'free'} Plan
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">API Usage</span>
                            <span className="text-white text-sm font-medium">
                              {profile?.api_usage_count || 0} calls
                            </span>
                          </div>

                          {profile?.subscription_tier === 'free' && (
                            <button className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-lg text-sm font-medium transition-all duration-300">
                              Upgrade to Pro
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            // Add settings navigation here
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            signOut();
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Content */}
        <div className="p-6">
          {renderFeatureContent()}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {profileDropdownOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setProfileDropdownOpen(false)}
        />
      )}
    </div>
  );
}