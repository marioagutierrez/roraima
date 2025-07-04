/* eslint-disable @typescript-eslint/no-explicit-any */
export interface RoraimaAIOptions {
  apiKey: string;
  baseURL?: string;
}

export interface ProcessResponse {
  type?: string;
  content?: string;
  detections?: any[];
  metrics?: {
    cost_estimate?: number;
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
    service?: string;
    latency?: string;
    processing_time?: string;
    audio_duration_seconds?: number;
    tokens_per_second?: string;
  };
  [key: string]: any;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  balance: number;
  total_spent: number;
}

export interface InfoResponse {
  api_name: string;
  version: string;
  token_valid: boolean;
  user: UserInfo;
  endpoint: {
    path: string;
    method: string;
    description: string;
    accepts: string[];
    authentication: string;
  };
  pricing: Record<string, any>;
  examples: Record<string, string>;
  limits: {
    max_file_size: string;
    supported_image_formats: string[];
    supported_audio_formats: string[];
    timeout: string;
  };
  documentation: string;
}

export interface StatsResponse {
  user: {
    id: string;
    name: string;
    balance: number;
  };
  period: string;
  period_description: string;
  summary: {
    total_requests: number;
    successful_requests: number;
    failed_requests: number;
    success_rate: string;
    total_cost: number;
    average_cost_per_request: number;
    max_cost_per_request: number;
    total_tokens: number;
    total_input_tokens: number;
    total_output_tokens: number;
  };
  service_breakdown: Array<{
    service: string;
    description?: string;
    requests: number;
    total_cost: number;
    total_tokens: number;
  }>;
  daily_usage: any[];
  timestamp: string;
}

export interface HealthResponse {
  status: string;
  [key: string]: any;
}

export type ImageInput = string | Buffer | NodeJS.ReadableStream;
export type AudioInput = string | Buffer | NodeJS.ReadableStream;
export type StatsPeriod = '24h' | '7d' | '30d' | '90d' | 'all';

export class RoraimaAIError extends Error {
  status: number;
  data: any;
  
  constructor(message: string, status: number, data?: any);
}

export class RoraimaAI {
  apiKey: string;
  baseURL: string;
  
  constructor(apiKey: string, baseURL?: string);
  
  /**
   * Procesar texto con IA
   */
  processText(prompt: string): Promise<ProcessResponse>;
  
  /**
   * Procesar imagen con IA
   */
  processImage(prompt: string, image: ImageInput): Promise<ProcessResponse>;
  
  /**
   * Procesar audio con IA
   */
  processAudio(prompt: string, audio: AudioInput): Promise<ProcessResponse>;
  
  /**
   * Obtener información de la API y usuario
   */
  getInfo(): Promise<InfoResponse>;
  
  /**
   * Obtener estadísticas de uso
   */
  getStats(period?: StatsPeriod): Promise<StatsResponse>;
  
  /**
   * Verificar el estado del servicio
   */
  getHealth(): Promise<HealthResponse>;
  
  /**
   * Obtener el saldo actual del usuario
   */
  getBalance(): Promise<number>;
}

export default RoraimaAI; 