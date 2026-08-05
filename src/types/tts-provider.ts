import { Voice } from './voice';

export type TTSProviderCategory = 'local' | 'cloud' | 'custom';

export interface TTSProviderCapability {
  supportsStreaming: boolean;
  supportsVoiceCloning: boolean;
  supportsEmotionControl: boolean;
  supportsPronunciationDictionary: boolean;
  supportsWordTimestamps: boolean;
}

export interface TTSProvider {
  id: string;
  name: string;
  category: TTSProviderCategory;
  description: string;
  capabilities: TTSProviderCapability;
}

export interface TTSProviderConfiguration {
  id: string;
  providerId: string;
  enabled: boolean;
  apiKey: string;
  baseUrl: string;
  defaultVoiceId: string;
  defaultModelId: string;
  streamingEnabled: boolean;
  timeoutMs: number;
  retryCount: number;
}

export interface TTSHealthStatus {
  status: 'connected' | 'disconnected' | 'auth_failed' | 'timeout' | 'invalid_endpoint';
  latencyMs?: number;
  lastTestedAt?: string;
  message?: string;
}

export interface TTSConnection {
  providerId: string;
  config: TTSProviderConfiguration;
  health: TTSHealthStatus;
}

export interface AudioBuffer {
  id: string;
  blobUrl: string;
  durationMs: number;
  sampleRate: number;
  fileSizeMb: number;
  metadata: Record<string, any>;
  createdAt: string;
}

export interface VoiceAssignment {
  id: string;
  characterId: string; // "Narrator", "Main Character", etc.
  voiceId: string;
  providerId: string;
  settingsOverride?: Partial<Voice>;
}

export interface TTSGenerationJob {
  id: string;
  text: string;
  voiceId: string;
  providerId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  result?: AudioBuffer;
  error?: string;
}
