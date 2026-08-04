export type AiProviderType = 
  | 'ollama'
  | 'openai_compatible'
  | 'google_gemini'
  | 'anthropic_claude'
  | 'openrouter'
  | 'custom_openai';

export type TtsProviderType = 
  | 'piper'
  | 'coqui'
  | 'xtts'
  | 'elevenlabs'
  | 'azure_speech'
  | 'google_cloud_tts'
  | 'openai_tts'
  | 'custom_tts';

export interface ProviderConfig {
  id: string;
  name: string;
  type: AiProviderType | TtsProviderType;
  category: 'AI' | 'TTS';
  enabled: boolean;
  apiKey: string;
  endpointUrl: string;
  defaultModel: string;
  availableModels: string[];
  options?: Record<string, string | number | boolean>;
  lastTestedAt?: string;
  lastTestSuccess?: boolean;
  lastTestMessage?: string;
}

export interface ProviderTestResult {
  success: boolean;
  message: string;
  latencyMs?: number;
  modelsFound?: string[];
  testedAt: string;
}
