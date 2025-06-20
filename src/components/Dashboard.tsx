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
  X
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
              </div>
            </div>
          </div>
        </div>

        {/* Feature Content */}
        <div className="p-6">
          {renderFeatureContent()}
        </div>
      </div>
    </div>
  );
}