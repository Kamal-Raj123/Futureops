import React from 'react';
import { Brain, ChevronLeft, ChevronRight } from 'lucide-react';
import { FeatureType, sidebarFeatures } from '../Dashboard';

interface SidebarProps {
  features: typeof sidebarFeatures;
  activeFeature: FeatureType;
  onFeatureSelect: (feature: FeatureType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ 
  features, 
  activeFeature, 
  onFeatureSelect, 
  isOpen, 
  onToggle 
}: SidebarProps) {
  return (
    <div className={`fixed left-0 top-0 h-full bg-slate-900/95 backdrop-blur-sm border-r border-white/10 transition-all duration-300 z-50 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold text-white">Prediction Power</span>
            </div>
          )}
          {!isOpen && (
            <div className="flex justify-center w-full">
              <Brain className="w-8 h-8 text-cyan-400" />
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1 text-gray-400 hover:text-white transition-colors hidden lg:block"
          >
            {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          const isActive = activeFeature === feature.id;
          
          return (
            <button
              key={feature.id}
              onClick={() => onFeatureSelect(feature.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              title={!isOpen ? feature.name : undefined}
            >
              <IconComponent className={`w-6 h-6 ${isActive ? feature.color : ''}`} />
              {isOpen && (
                <div className="text-left">
                  <div className="font-medium">{feature.name}</div>
                  <div className="text-xs text-gray-400">{feature.description}</div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-gray-400 mb-1">Subscription</div>
            <div className="text-white font-medium capitalize">
              {/* This would come from user profile */}
              Free Plan
            </div>
          </div>
        </div>
      )}
    </div>
  );
}