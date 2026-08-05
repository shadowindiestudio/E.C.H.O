export type ProviderCategory = 'local' | 'cloud' | 'custom';

export interface ProviderCapability {
  supportsStreaming: boolean;
  supportsVision: boolean;
  supportsFunctionCalling: boolean;
  supportsJsonMode: boolean;
  supportsAudio: boolean;
}

export interface Model {
  id: string;
  name: string;
  providerId: string;
  contextLength?: number;
  pricingPlaceholder?: string;
  capabilities: ProviderCapability;
  tags: string[];
}

export interface ProviderConfiguration {
  id: string;
  providerId: string;
  enabled: boolean;
  apiKey: string;
  baseUrl: string;
  organizationId?: string;
  defaultModelId: string;
  temperature: number;
  topP: number;
  maxTokens?: number;
  timeoutMs: number;
  retryCount: number;
  streamingEnabled: boolean;
  favoriteModelIds: string[];
  recentlyUsedModelIds: string[];
}

export interface HealthStatus {
  status: 'connected' | 'disconnected' | 'auth_failed' | 'timeout' | 'invalid_endpoint';
  latencyMs?: number;
  lastTestedAt?: string;
  message?: string;
  providerVersion?: string;
}

export interface Provider {
  id: string;
  name: string;
  category: ProviderCategory;
  description: string;
}

export interface Connection {
  providerId: string;
  config: ProviderConfiguration;
  health: HealthStatus;
  models: Model[];
}

export interface APIResponse {
  content: string;
  modelId: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs: number;
}

export interface StreamingSession {
  sessionId: string;
  providerId: string;
  modelId: string;
  // TODO: Add streaming callback signatures
}

export interface AITaskRequest {
  systemPrompt?: string;
  prompt: string;
  expectedFormat?: 'text' | 'json';
  // Context and other payload details
}
