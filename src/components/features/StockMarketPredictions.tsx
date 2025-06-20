import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  PieChart,
  Activity,
  Plus,
  Search
} from 'lucide-react';
import PredictionCard from '../common/PredictionCard';
import CreatePredictionModal from '../common/CreatePredictionModal';

export default function StockMarketPredictions() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock stock data
  const marketOverview = {
    sp500: { value: 4150.25, change: 1.2 },
    nasdaq: { value: 12850.75, change: -0.8 },
    dow: { value: 33750.50, change: 0.5 },
    vix: { value: 18.25, change: -2.1 }
  };

  const stockPredictions = [
    {
      id: '1',
      title: 'AAPL Stock Price - Next 30 Days',
      domain: 'stocks',
      confidence: 84,
      trend: 'up' as const,
      value: 185,
      unit: '$',
      timeframe: '30 days',
      factors: ['Earnings Report', 'Market Sentiment', 'Tech Sector Trends', 'Economic Indicators'],
      data: Array.from({ length: 30 }, (_, i) => ({
        x: `Day ${i + 1}`,
        y: 175 + Math.random() * 20
      })),
      created: new Date()
    },
    {
      id: '2',
      title: 'TSLA Volatility Analysis - This Quarter',
      domain: 'stocks',
      confidence: 78,
      trend: 'down' as const,
      value: 220,
      unit: '$',
      timeframe: '3 months',
      factors: ['Production Numbers', 'EV Market Competition', 'Regulatory Changes', 'CEO Statements'],
      data: Array.from({ length: 12 }, (_, i) => ({
        x: `Week ${i + 1}`,
        y: 240 - Math.random() * 40
      })),
      created: new Date()
    }
  ];

  const popularStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.25, change: 2.1 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2650.75, change: -1.5 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 335.50, change: 0.8 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.30, change: 3.2 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3150.25, change: -0.3 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 425.75, change: 4.5 }
  ];

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>New Stock Prediction</span>
        </button>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-blue-400" />
            <span className="text-sm text-gray-300">S&P 500</span>
          </div>
          <div className="text-2xl font-bold text-white">{marketOverview.sp500.value}</div>
          <div className={`text-sm flex items-center space-x-1 ${
            marketOverview.sp500.change >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {marketOverview.sp500.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(marketOverview.sp500.change)}%</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-purple-400" />
            <span className="text-sm text-gray-300">NASDAQ</span>
          </div>
          <div className="text-2xl font-bold text-white">{marketOverview.nasdaq.value}</div>
          <div className={`text-sm flex items-center space-x-1 ${
            marketOverview.nasdaq.change >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {marketOverview.nasdaq.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(marketOverview.nasdaq.change)}%</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <PieChart className="w-8 h-8 text-green-400" />
            <span className="text-sm text-gray-300">Dow Jones</span>
          </div>
          <div className="text-2xl font-bold text-white">{marketOverview.dow.value}</div>
          <div className={`text-sm flex items-center space-x-1 ${
            marketOverview.dow.change >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {marketOverview.dow.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(marketOverview.dow.change)}%</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-orange-400" />
            <span className="text-sm text-gray-300">VIX</span>
          </div>
          <div className="text-2xl font-bold text-white">{marketOverview.vix.value}</div>
          <div className={`text-sm flex items-center space-x-1 ${
            marketOverview.vix.change >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {marketOverview.vix.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(marketOverview.vix.change)}%</span>
          </div>
        </div>
      </div>

      {/* Popular Stocks */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
            <DollarSign className="w-6 h-6 text-green-400" />
            <span>Popular Stocks</span>
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularStocks.map((stock) => (
              <div
                key={stock.symbol}
                className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedStock(stock.symbol)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-white">{stock.symbol}</div>
                  <div className={`text-sm flex items-center space-x-1 ${
                    stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{Math.abs(stock.change)}%</span>
                  </div>
                </div>
                <div className="text-sm text-gray-400 mb-1">{stock.name}</div>
                <div className="text-lg font-semibold text-white">${stock.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stock Predictions */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <TrendingUp className="w-8 h-8 text-green-400" />
          <span>Stock Market Predictions</span>
        </h3>
        
        {stockPredictions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {stockPredictions.map((prediction) => (
              <PredictionCard
                key={prediction.id}
                prediction={prediction}
                onDelete={(id) => console.log('Delete prediction:', id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <TrendingUp className="w-24 h-24 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">No Stock Predictions Yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Create your first stock market prediction to start analyzing financial trends.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
            >
              Create Stock Prediction
            </button>
          </div>
        )}
      </div>

      {/* Create Prediction Modal */}
      {showCreateModal && (
        <CreatePredictionModal
          domain="stocks"
          onClose={() => setShowCreateModal(false)}
          onCreate={(data) => {
            console.log('Create stock prediction:', data);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}