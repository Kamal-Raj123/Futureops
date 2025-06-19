import { supabase } from '../lib/supabase';

export interface TrainingJobRequest {
  modelId: string;
  datasetName: string;
  dataFormat: 'csv' | 'json';
  trainingConfig: {
    epochs: number;
    batchSize: number;
    learningRate: number;
    validationSplit: number;
  };
  columnMapping: Record<string, string>;
}

export interface TrainingJobStatus {
  id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  logs?: string;
  error?: string;
}

class BackendService {
  async submitTrainingJob(request: TrainingJobRequest): Promise<string> {
    try {
      // Create training job record
      const { data, error } = await supabase
        .from('model_training_jobs')
        .insert({
          model_id: request.modelId,
          job_status: 'queued',
          progress_percentage: 0,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Upload training data
      await this.uploadTrainingData(request);

      // In a real implementation, this would trigger a backend training process
      // For now, we'll simulate the training process
      this.simulateTraining(data.id);

      return data.id;
    } catch (error) {
      console.error('Failed to submit training job:', error);
      throw new Error('Failed to submit training job');
    }
  }

  private async uploadTrainingData(request: TrainingJobRequest) {
    const { error } = await supabase
      .from('training_data')
      .insert({
        model_id: request.modelId,
        dataset_name: request.datasetName,
        data_format: request.dataFormat,
        column_mapping: request.columnMapping,
        data_content: {
          training_config: request.trainingConfig
        },
        row_count: 0, // Would be calculated from actual data
        created_at: new Date().toISOString()
      });

    if (error) throw error;
  }

  private async simulateTraining(jobId: string) {
    // Simulate training progress
    const progressSteps = [10, 25, 50, 75, 90, 100];
    
    for (const progress of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      
      await supabase
        .from('model_training_jobs')
        .update({
          progress_percentage: progress,
          job_status: progress === 100 ? 'completed' : 'running',
          training_logs: `Training progress: ${progress}%`,
          ...(progress === 100 && { completed_at: new Date().toISOString() })
        })
        .eq('id', jobId);
    }

    // Update model status
    const { data: job } = await supabase
      .from('model_training_jobs')
      .select('model_id')
      .eq('id', jobId)
      .single();

    if (job) {
      await supabase
        .from('prediction_models')
        .update({
          training_status: 'completed',
          accuracy_score: 0.85 + Math.random() * 0.1 // Random accuracy between 85-95%
        })
        .eq('id', job.model_id);
    }
  }

  async getTrainingJobStatus(jobId: string): Promise<TrainingJobStatus | null> {
    try {
      const { data, error } = await supabase
        .from('model_training_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        status: data.job_status,
        progress: data.progress_percentage,
        logs: data.training_logs,
        error: data.error_message
      };
    } catch (error) {
      console.error('Failed to get training job status:', error);
      return null;
    }
  }

  async getUserTrainingJobs(userId: string): Promise<TrainingJobStatus[]> {
    try {
      const { data, error } = await supabase
        .from('model_training_jobs')
        .select(`
          *,
          prediction_models (
            name,
            domain
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(job => ({
        id: job.id,
        status: job.job_status,
        progress: job.progress_percentage,
        logs: job.training_logs,
        error: job.error_message
      }));
    } catch (error) {
      console.error('Failed to get user training jobs:', error);
      return [];
    }
  }

  // Edge function for handling training requests
  async callTrainingAPI(endpoint: string, data: any) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const response = await fetch(`${supabaseUrl}/functions/v1/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  }
}

export const backendService = new BackendService();