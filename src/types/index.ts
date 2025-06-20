export interface PredictionDomain {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface PredictionParameter {
  id: string;
  name: string;
  type: 'slider' | 'select' | 'toggle' | 'input';
  value: any;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  description: string;
}

export interface Prediction {
  id: string;
  domain: string;
  title: string;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  value: number;
  unit: string;
  timeframe: string;
  factors: string[];
  data: { x: string; y: number }[];
  created: Date;
}

export interface PredictionConfig {
  domain: PredictionDomain;
  parameters: PredictionParameter[];
  title: string;
}

export interface AIModel {
  id: string;
  name: string;
  domain: string;
  model_type: 'linear_regression' | 'lstm' | 'transformer' | 'custom';
  training_status: 'pending' | 'training' | 'completed' | 'failed';
  accuracy_score?: number;
  is_public: boolean;
  configuration: any;
  created_at: string;
  updated_at: string;
}

export interface TrainingData {
  id: string;
  model_id: string;
  dataset_name: string;
  data_source: string;
  data_format: 'csv' | 'json' | 'api';
  data_content: any;
  column_mapping: Record<string, string>;
  row_count: number;
  created_at: string;
}

export interface TrainingJob {
  id: string;
  model_id: string;
  job_status: 'queued' | 'running' | 'completed' | 'failed';
  progress_percentage: number;
  training_logs?: string;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  api_usage_count: number;
  created_at: string;
  updated_at: string;
}