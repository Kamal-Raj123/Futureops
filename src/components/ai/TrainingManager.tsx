import React, { useState, useEffect } from 'react';
import { Upload, Settings, Play, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import { backendService, TrainingJobRequest, TrainingJobStatus } from '../../services/backendService';
import { usePredictionStore } from '../../stores/predictionStore';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

interface TrainingManagerProps {
  modelId: string;
  onClose: () => void;
}

export default function TrainingManager({ modelId, onClose }: TrainingManagerProps) {
  const [step, setStep] = useState(1);
  const [trainingData, setTrainingData] = useState<File | null>(null);
  const [dataFormat, setDataFormat] = useState<'csv' | 'json'>('csv');
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [trainingConfig, setTrainingConfig] = useState({
    epochs: 100,
    batchSize: 32,
    learningRate: 0.001,
    validationSplit: 0.2,
  });
  const [trainingJobs, setTrainingJobs] = useState<TrainingJobStatus[]>([]);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      loadTrainingJobs();
    }
  }, [user]);

  useEffect(() => {
    if (currentJobId) {
      const interval = setInterval(async () => {
        const status = await backendService.getTrainingJobStatus(currentJobId);
        if (status) {
          setTrainingJobs(prev => 
            prev.map(job => job.id === currentJobId ? status : job)
          );
          
          if (status.status === 'completed' || status.status === 'failed') {
            clearInterval(interval);
            if (status.status === 'completed') {
              toast.success('Model training completed successfully!');
            } else {
              toast.error('Model training failed');
            }
          }
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [currentJobId]);

  const loadTrainingJobs = async () => {
    if (!user) return;
    
    try {
      const jobs = await backendService.getUserTrainingJobs(user.id);
      setTrainingJobs(jobs);
    } catch (error) {
      console.error('Failed to load training jobs:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTrainingData(file);
      
      // Parse CSV headers for column mapping
      if (file.type === 'text/csv') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          if (lines.length > 0) {
            const headers = lines[0].split(',').map(h => h.trim());
            const mapping: Record<string, string> = {};
            headers.forEach(header => {
              mapping[header] = '';
            });
            setColumnMapping(mapping);
          }
        };
        reader.readAsText(file);
      }
    }
  };

  const handleStartTraining = async () => {
    if (!trainingData) {
      toast.error('Please upload training data');
      return;
    }

    setLoading(true);
    try {
      const request: TrainingJobRequest = {
        modelId,
        datasetName: trainingData.name,
        dataFormat,
        trainingConfig,
        columnMapping
      };

      const jobId = await backendService.submitTrainingJob(request);
      setCurrentJobId(jobId);
      setStep(4); // Move to monitoring step
      
      toast.success('Training job submitted successfully!');
      await loadTrainingJobs();
    } catch (error) {
      toast.error('Failed to start training');
      console.error('Training error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'running':
        return <Loader className="w-5 h-5 text-blue-400 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/20';
      case 'failed':
        return 'text-red-400 bg-red-400/20';
      case 'running':
        return 'text-blue-400 bg-blue-400/20';
      default:
        return 'text-yellow-400 bg-yellow-400/20';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-sm rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Backend Training Manager</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum ? 'bg-cyan-500 text-white' : 'bg-white/20 text-gray-400'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNum ? 'bg-cyan-500' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Upload Data */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Upload Training Data</h3>
              
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-4">
                  Upload your training dataset (CSV or JSON format)
                </p>
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="training-data-upload"
                />
                <label
                  htmlFor="training-data-upload"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg cursor-pointer transition-all duration-300"
                >
                  <Upload className="w-5 h-5" />
                  <span>Choose File</span>
                </label>
                {trainingData && (
                  <p className="text-green-400 mt-2">
                    Selected: {trainingData.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data Format
                </label>
                <select
                  value={dataFormat}
                  onChange={(e) => setDataFormat(e.target.value as 'csv' | 'json')}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!trainingData}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  Next: Map Columns
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Column Mapping */}
          {step === 2 && Object.keys(columnMapping).length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Map Data Columns</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(columnMapping).map((column) => (
                  <div key={column} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {column}
                    </label>
                    <select
                      value={columnMapping[column]}
                      onChange={(e) => setColumnMapping(prev => ({
                        ...prev,
                        [column]: e.target.value
                      }))}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">Select mapping...</option>
                      <option value="feature">Feature (Input)</option>
                      <option value="target">Target (Output)</option>
                      <option value="timestamp">Timestamp</option>
                      <option value="ignore">Ignore</option>
                    </select>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                >
                  Next: Configure Training
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Training Configuration */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Training Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Epochs
                  </label>
                  <input
                    type="number"
                    value={trainingConfig.epochs}
                    onChange={(e) => setTrainingConfig(prev => ({
                      ...prev,
                      epochs: parseInt(e.target.value)
                    }))}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Batch Size
                  </label>
                  <input
                    type="number"
                    value={trainingConfig.batchSize}
                    onChange={(e) => setTrainingConfig(prev => ({
                      ...prev,
                      batchSize: parseInt(e.target.value)
                    }))}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Learning Rate
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={trainingConfig.learningRate}
                    onChange={(e) => setTrainingConfig(prev => ({
                      ...prev,
                      learningRate: parseFloat(e.target.value)
                    }))}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Validation Split
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={trainingConfig.validationSplit}
                    onChange={(e) => setTrainingConfig(prev => ({
                      ...prev,
                      validationSplit: parseFloat(e.target.value)
                    }))}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleStartTraining}
                  disabled={loading}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
                >
                  <Play className="w-5 h-5" />
                  <span>{loading ? 'Starting Training...' : 'Start Training'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Training Status */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Training Jobs</h3>
              
              {trainingJobs.length > 0 ? (
                <div className="space-y-4">
                  {trainingJobs.map((job) => (
                    <div key={job.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(job.status)}
                          <span className="text-white font-medium">Training Job</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                      
                      {job.status === 'running' && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>{job.progress}%</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {job.logs && (
                        <div className="bg-black/30 rounded p-3 text-sm text-gray-300 font-mono">
                          {job.logs}
                        </div>
                      )}
                      
                      {job.error && (
                        <div className="bg-red-500/20 border border-red-500/30 rounded p-3 text-sm text-red-400">
                          {job.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No training jobs found</p>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}