import * as tf from '@tensorflow/tfjs';

export interface PredictionInput {
  features: number[];
  timeframe: number;
  domain: string;
}

export interface PredictionResult {
  value: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  data: { x: string; y: number }[];
  factors: string[];
}

class AIService {
  private models: Map<string, tf.LayersModel> = new Map();
  
  constructor() {
    this.initializeModels();
  }

  private async initializeModels() {
    // Initialize pre-trained models for different domains
    await this.loadDomainModels();
  }

  private async loadDomainModels() {
    const domains = ['weather', 'stocks', 'elections', 'climate'];
    
    for (const domain of domains) {
      try {
        // In production, these would be loaded from your backend
        const model = await this.createSimpleModel(domain);
        this.models.set(domain, model);
      } catch (error) {
        console.warn(`Failed to load model for ${domain}:`, error);
      }
    }
  }

  private async createSimpleModel(domain: string): Promise<tf.LayersModel> {
    // Create a simple neural network for demonstration
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [10], units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'linear' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });

    // Initialize with random weights for demo
    const dummyInput = tf.randomNormal([1, 10]);
    const dummyOutput = tf.randomNormal([1, 1]);
    await model.fit(dummyInput, dummyOutput, { epochs: 1, verbose: 0 });
    
    dummyInput.dispose();
    dummyOutput.dispose();

    return model;
  }

  async makePrediction(input: PredictionInput): Promise<PredictionResult> {
    const model = this.models.get(input.domain);
    
    if (!model) {
      throw new Error(`Model not available for domain: ${input.domain}`);
    }

    try {
      // Prepare input tensor
      const inputTensor = tf.tensor2d([input.features]);
      
      // Make prediction
      const prediction = model.predict(inputTensor) as tf.Tensor;
      const predictionValue = await prediction.data();
      
      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();

      // Generate mock data for visualization
      const data = this.generateTimeSeriesData(predictionValue[0], input.timeframe);
      
      return {
        value: Math.round(predictionValue[0] * 100) / 100,
        confidence: Math.random() * 30 + 70, // 70-100%
        trend: this.determineTrend(data),
        data,
        factors: this.getDomainFactors(input.domain)
      };
    } catch (error) {
      console.error('Prediction error:', error);
      throw new Error('Failed to make prediction');
    }
  }

  private generateTimeSeriesData(baseValue: number, timeframe: number): { x: string; y: number }[] {
    const data = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < Math.min(timeframe, 12); i++) {
      const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
      const value = baseValue * (1 + variation + (i * 0.05)); // Slight upward trend
      
      data.push({
        x: months[i],
        y: Math.max(0, Math.round(value * 100) / 100)
      });
    }
    
    return data;
  }

  private determineTrend(data: { x: string; y: number }[]): 'up' | 'down' | 'stable' {
    if (data.length < 2) return 'stable';
    
    const first = data[0].y;
    const last = data[data.length - 1].y;
    const change = (last - first) / first;
    
    if (change > 0.05) return 'up';
    if (change < -0.05) return 'down';
    return 'stable';
  }

  private getDomainFactors(domain: string): string[] {
    const factors = {
      weather: ['Temperature Patterns', 'Humidity Levels', 'Atmospheric Pressure', 'Wind Patterns'],
      stocks: ['Market Sentiment', 'Economic Indicators', 'Company Performance', 'Trading Volume'],
      elections: ['Polling Data', 'Social Media Sentiment', 'Historical Voting', 'Demographics'],
      climate: ['CO2 Emissions', 'Temperature Anomalies', 'Policy Changes', 'Industrial Activity']
    };
    
    return factors[domain as keyof typeof factors] || ['General Factors'];
  }

  getAvailableDomains(): string[] {
    return Array.from(this.models.keys());
  }

  isModelReady(domain: string): boolean {
    return this.models.has(domain);
  }
}

export const aiService = new AIService();