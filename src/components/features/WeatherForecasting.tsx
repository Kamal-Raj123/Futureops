import React, { useState } from 'react';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Wind, 
  Thermometer,
  Droplets,
  Eye,
  Plus,
  Calendar,
  MapPin
} from 'lucide-react';
import PredictionCard from '../common/PredictionCard';
import CreatePredictionModal from '../common/CreatePredictionModal';

export default function WeatherForecasting() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('New York, NY');

  // Mock weather data
  const currentWeather = {
    temperature: 72,
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    condition: 'Partly Cloudy'
  };

  const weatherPredictions = [
    {
      id: '1',
      title: 'NYC Temperature Forecast - Next 7 Days',
      domain: 'weather',
      confidence: 87,
      trend: 'up' as const,
      value: 78,
      unit: '°F',
      timeframe: '7 days',
      factors: ['Historical Patterns', 'Ocean Currents', 'Atmospheric Pressure', 'Solar Activity'],
      data: Array.from({ length: 7 }, (_, i) => ({
        x: `Day ${i + 1}`,
        y: 70 + Math.random() * 15
      })),
      created: new Date()
    },
    {
      id: '2',
      title: 'Precipitation Probability - This Week',
      domain: 'weather',
      confidence: 92,
      trend: 'down' as const,
      value: 35,
      unit: '%',
      timeframe: '7 days',
      factors: ['Cloud Formation', 'Humidity Levels', 'Wind Patterns', 'Pressure Systems'],
      data: Array.from({ length: 7 }, (_, i) => ({
        x: `Day ${i + 1}`,
        y: 40 - Math.random() * 20
      })),
      created: new Date()
    }
  ];

  const locations = [
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ',
    'Philadelphia, PA'
  ];

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {locations.map(location => (
              <option key={location} value={location} className="bg-slate-800">
                {location}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>New Weather Prediction</span>
        </button>
      </div>

      {/* Current Weather Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <Thermometer className="w-8 h-8 text-blue-400" />
            <span className="text-sm text-gray-300">Temperature</span>
          </div>
          <div className="text-3xl font-bold text-white">{currentWeather.temperature}°F</div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
          <div className="flex items-center justify-between mb-4">
            <Droplets className="w-8 h-8 text-cyan-400" />
            <span className="text-sm text-gray-300">Humidity</span>
          </div>
          <div className="text-3xl font-bold text-white">{currentWeather.humidity}%</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <Wind className="w-8 h-8 text-green-400" />
            <span className="text-sm text-gray-300">Wind Speed</span>
          </div>
          <div className="text-3xl font-bold text-white">{currentWeather.windSpeed} mph</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <Eye className="w-8 h-8 text-purple-400" />
            <span className="text-sm text-gray-300">Visibility</span>
          </div>
          <div className="text-3xl font-bold text-white">{currentWeather.visibility} mi</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
          <div className="flex items-center justify-between mb-4">
            <Sun className="w-8 h-8 text-yellow-400" />
            <span className="text-sm text-gray-300">Condition</span>
          </div>
          <div className="text-lg font-bold text-white">{currentWeather.condition}</div>
        </div>
      </div>

      {/* Weather Predictions */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Cloud className="w-8 h-8 text-blue-400" />
          <span>Weather Predictions</span>
        </h3>
        
        {weatherPredictions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {weatherPredictions.map((prediction) => (
              <PredictionCard
                key={prediction.id}
                prediction={prediction}
                onDelete={(id) => console.log('Delete prediction:', id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Cloud className="w-24 h-24 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">No Weather Predictions Yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Create your first weather prediction to start forecasting meteorological patterns.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
            >
              Create Weather Prediction
            </button>
          </div>
        )}
      </div>

      {/* Create Prediction Modal */}
      {showCreateModal && (
        <CreatePredictionModal
          domain="weather"
          onClose={() => setShowCreateModal(false)}
          onCreate={(data) => {
            console.log('Create weather prediction:', data);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}