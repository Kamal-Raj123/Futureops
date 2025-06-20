import { create } from 'zustand';
import { AIModelService } from '../lib/aiModels';
import { useAuthStore } from './authStore';
import toast from 'react-hot-toast';

interface PredictionModel {
  id: string;
  name: string;
  domain: string;
  model_type: string;
  configuration: any;
  training_status: string;
  accuracy_score?: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

interface Prediction {
  id: string;
  title: string;
  domain: string;
  parameters: any;
  prediction_result: any;
  confidence_score?: number;
  status: string;
  created_at: string;
  prediction_models?: {
    name: string;
    domain: string;
    model_type: string;
  };
}

interface TrainingJob {
  id: string;
  model_id: string;
  job_status: string;
  progress_percentage: number;
  training_logs?: string;
  error_message?: string;
}

interface PredictionState {
  models: PredictionModel[];
  predictions: Prediction[];
  trainingJobs: TrainingJob[];
  loading: boolean;
  
  // Model operations
  createModel: (modelData: Omit<PredictionModel, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  loadUserModels: () => Promise<void>;
  
  // Prediction operations
  createPrediction: (predictionData: any) => Promise<boolean>;
  loadUserPredictions: () => Promise<void>;
  
  // Training operations
  trainModel: (modelId: string, trainingData: any) => Promise<boolean>;
  getTrainingStatus: (modelId: string) => Promise<TrainingJob | null>;
}

export const usePredictionStore = create<PredictionState>((set, get) => ({
  models: [],
  predictions: [],
  trainingJobs: [],
  loading: false,

  createModel: async (modelData) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      toast.error('Please sign in to create models');
      return false;
    }

    set({ loading: true });
    try {
      const result = await AIModelService.createModel({
        ...modelData,
        user_id: user.id,
      });

      if (result.success) {
        set(state => ({ models: [result.data, ...state.models] }));
        toast.success('Model created successfully!');
        return true;
      } else {
        toast.error('Failed to create model');
        return false;
      }
    } catch (error) {
      toast.error('Failed to create model');
      return false;
    } finally {
      set({ loading: false });
    }
  },

  loadUserModels: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ loading: true });
    try {
      const result = await AIModelService.getUserModels(user.id);
      if (result.success) {
        set({ models: result.data || [] });
      }
    } catch (error) {
      toast.error('Failed to load models');
    } finally {
      set({ loading: false });
    }
  },

  createPrediction: async (predictionData) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      toast.error('Please sign in to create predictions');
      return false;
    }

    set({ loading: true });
    try {
      const result = await AIModelService.generatePrediction({
        ...predictionData,
        user_id: user.id,
      });

      if (result.success) {
        set(state => ({ predictions: [result.data, ...state.predictions] }));
        toast.success('Prediction created successfully!');
        return true;
      } else {
        toast.error('Failed to create prediction');
        return false;
      }
    } catch (error) {
      toast.error('Failed to create prediction');
      return false;
    } finally {
      set({ loading: false });
    }
  },

  loadUserPredictions: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ loading: true });
    try {
      const result = await AIModelService.getUserPredictions(user.id);
      if (result.success) {
        set({ predictions: result.data || [] });
      }
    } catch (error) {
      toast.error('Failed to load predictions');
    } finally {
      set({ loading: false });
    }
  },

  trainModel: async (modelId: string, trainingData: any) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      toast.error('Please sign in to train models');
      return false;
    }

    set({ loading: true });
    try {
      const result = await AIModelService.uploadTrainingData({
        model_id: modelId,
        user_id: user.id,
        ...trainingData,
      });

      if (result.success) {
        toast.success('Training started! Check the model status for progress.');
        // Refresh models to get updated training status
        get().loadUserModels();
        return true;
      } else {
        toast.error('Failed to start training');
        return false;
      }
    } catch (error) {
      toast.error('Failed to start training');
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getTrainingStatus: async (modelId: string) => {
    try {
      const result = await AIModelService.getTrainingStatus(modelId);
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to get training status:', error);
      return null;
    }
  },
}));