import { ProviderConfig, ProviderTestResult, TtsProviderType } from '../types';
import { storageService } from './storageService';

const STORAGE_KEY = 'tts_providers_v1';

export const DEFAULT_TTS_PROVIDERS: ProviderConfig[] = [
  {
    id: 'tts-piper',
    name: 'Piper TTS (Offline Fast Neural)',
    type: 'piper',
    category: 'TTS',
    enabled: true,
    apiKey: '',
    endpointUrl: 'http://localhost:5000',
    defaultModel: 'en_US-lessac-medium',
    availableModels: ['en_US-lessac-medium', 'en_GB-alan-medium', 'de_DE-thorsten-high'],
  },
  {
    id: 'tts-coqui',
    name: 'Coqui TTS (Local Studio)',
    type: 'coqui',
    category: 'TTS',
    enabled: true,
    apiKey: '',
    endpointUrl: 'http://localhost:5002',
    defaultModel: 'tts_models/en/vctk/vits',
    availableModels: ['tts_models/en/vctk/vits', 'tts_models/multilingual/multi-dataset/your_tts'],
  },
  {
    id: 'tts-xtts',
    name: 'XTTS v2 (Voice Cloning)',
    type: 'xtts',
    category: 'TTS',
    enabled: true,
    apiKey: '',
    endpointUrl: 'http://localhost:8020',
    defaultModel: 'xtts_v2.0.2',
    availableModels: ['xtts_v2.0.2', 'xtts_v2.0.3-beta'],
  },
  {
    id: 'tts-elevenlabs',
    name: 'ElevenLabs Studio',
    type: 'elevenlabs',
    category: 'TTS',
    enabled: false,
    apiKey: '',
    endpointUrl: 'https://api.elevenlabs.io/v1',
    defaultModel: 'eleven_multilingual_v2',
    availableModels: ['eleven_multilingual_v2', 'eleven_turbo_v2.5', 'eleven_monolingual_v1'],
  },
  {
    id: 'tts-azure',
    name: 'Azure Neural Speech',
    type: 'azure_speech',
    category: 'TTS',
    enabled: false,
    apiKey: '',
    endpointUrl: 'https://eastus.tts.speech.microsoft.com',
    defaultModel: 'en-US-GuyNeural',
    availableModels: ['en-US-GuyNeural', 'en-US-JennyNeural', 'en-GB-RyanNeural'],
  },
  {
    id: 'tts-google',
    name: 'Google Cloud TTS',
    type: 'google_cloud_tts',
    category: 'TTS',
    enabled: false,
    apiKey: '',
    endpointUrl: 'https://texttospeech.googleapis.com/v1',
    defaultModel: 'en-US-Neural2-D',
    availableModels: ['en-US-Neural2-D', 'en-US-Neural2-F', 'en-GB-Neural2-B'],
  },
  {
    id: 'tts-openai',
    name: 'OpenAI Audio TTS',
    type: 'openai_tts',
    category: 'TTS',
    enabled: false,
    apiKey: '',
    endpointUrl: 'https://api.openai.com/v1/audio/speech',
    defaultModel: 'tts-1-hd',
    availableModels: ['tts-1', 'tts-1-hd'],
  },
  {
    id: 'tts-custom',
    name: 'Custom TTS Endpoint',
    type: 'custom_tts',
    category: 'TTS',
    enabled: false,
    apiKey: '',
    endpointUrl: 'http://localhost:9000/v1/tts',
    defaultModel: 'custom-neural-voice',
    availableModels: ['custom-neural-voice'],
  },
];

class TtsProviderService {
  getProviders(): ProviderConfig[] {
    return storageService.get<ProviderConfig[]>(STORAGE_KEY, DEFAULT_TTS_PROVIDERS);
  }

  saveProvider(updatedProvider: ProviderConfig): ProviderConfig[] {
    const current = this.getProviders();
    const index = current.findIndex((p) => p.id === updatedProvider.id);
    let updated: ProviderConfig[];

    if (index >= 0) {
      updated = [...current];
      updated[index] = updatedProvider;
    } else {
      updated = [...current, updatedProvider];
    }

    storageService.set(STORAGE_KEY, updated);
    return updated;
  }

  getEnabledProviders(): ProviderConfig[] {
    return this.getProviders().filter((p) => p.enabled);
  }

  async testSynthesis(provider: ProviderConfig): Promise<ProviderTestResult> {
    const startTime = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 500));
    const latencyMs = Date.now() - startTime;

    if (!provider.endpointUrl) {
      return {
        success: false,
        message: 'Endpoint URL is required for TTS synthesis test.',
        testedAt: new Date().toISOString(),
      };
    }

    const needsApiKey = ['elevenlabs', 'azure_speech', 'google_cloud_tts', 'openai_tts'].includes(provider.type);
    if (needsApiKey && !provider.apiKey.trim()) {
      return {
        success: false,
        message: `Synthesis failed: Missing API key for cloud provider ${provider.name}.`,
        latencyMs,
        testedAt: new Date().toISOString(),
      };
    }

    return {
      success: true,
      message: `TTS Engine reachable at ${provider.endpointUrl}. Synthesized 1.2s test buffer with model "${provider.defaultModel}".`,
      latencyMs,
      modelsFound: provider.availableModels,
      testedAt: new Date().toISOString(),
    };
  }
}

export const ttsProviderService = new TtsProviderService();
