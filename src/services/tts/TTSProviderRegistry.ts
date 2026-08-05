import { TTSProvider } from '../../types';

export class TTSProviderRegistry {
  private providers: Map<string, TTSProvider> = new Map();

  constructor() {
    this.registerDefaultProviders();
  }

  private registerDefaultProviders() {
    const defaultCapabilities = {
      supportsStreaming: true,
      supportsVoiceCloning: false,
      supportsEmotionControl: false,
      supportsPronunciationDictionary: false,
      supportsWordTimestamps: false,
    };

    const defaultProviders: TTSProvider[] = [
      { id: 'piper', name: 'Piper', category: 'local', description: 'Fast local neural TTS', capabilities: { ...defaultCapabilities } },
      { id: 'coqui', name: 'Coqui TTS', category: 'local', description: 'Local TTS with cloning', capabilities: { ...defaultCapabilities, supportsVoiceCloning: true } },
      { id: 'xtts', name: 'XTTS', category: 'local', description: 'High quality voice cloning', capabilities: { ...defaultCapabilities, supportsVoiceCloning: true, supportsEmotionControl: true } },
      { id: 'styletts2', name: 'StyleTTS2', category: 'local', description: 'Style-guided TTS', capabilities: { ...defaultCapabilities, supportsEmotionControl: true } },
      { id: 'kokoro', name: 'Kokoro TTS', category: 'local', description: 'Fast local TTS', capabilities: { ...defaultCapabilities } },
      { id: 'chatterbox', name: 'Chatterbox TTS', category: 'local', description: 'Lightweight TTS', capabilities: { ...defaultCapabilities } },
      { id: 'f5tts', name: 'F5-TTS', category: 'local', description: 'Local expressive TTS', capabilities: { ...defaultCapabilities, supportsEmotionControl: true } },
      
      { id: 'elevenlabs', name: 'ElevenLabs', category: 'cloud', description: 'Industry leading voice cloning', capabilities: { ...defaultCapabilities, supportsVoiceCloning: true, supportsEmotionControl: true, supportsPronunciationDictionary: true, supportsWordTimestamps: true } },
      { id: 'openai_tts', name: 'OpenAI TTS', category: 'cloud', description: 'High quality standard voices', capabilities: { ...defaultCapabilities } },
      { id: 'google_cloud_tts', name: 'Google Cloud TTS', category: 'cloud', description: 'Standard cloud voices', capabilities: { ...defaultCapabilities, supportsEmotionControl: true, supportsPronunciationDictionary: true } },
      { id: 'azure_speech', name: 'Azure Speech', category: 'cloud', description: 'Enterprise speech service', capabilities: { ...defaultCapabilities, supportsEmotionControl: true, supportsPronunciationDictionary: true, supportsWordTimestamps: true } },
      { id: 'playht', name: 'PlayHT', category: 'cloud', description: 'Cloud voice cloning', capabilities: { ...defaultCapabilities, supportsVoiceCloning: true, supportsEmotionControl: true } },
      { id: 'cartesia', name: 'Cartesia', category: 'cloud', description: 'Ultra-fast expressive voices', capabilities: { ...defaultCapabilities, supportsEmotionControl: true } },
      { id: 'deepgram', name: 'Deepgram Aura', category: 'cloud', description: 'Real-time conversational TTS', capabilities: { ...defaultCapabilities } },
      
      { id: 'openai_compatible_tts', name: 'OpenAI Compatible TTS', category: 'custom', description: 'Any API matching OpenAI audio format', capabilities: { ...defaultCapabilities } },
      { id: 'generic_rest_tts', name: 'Generic REST Endpoint', category: 'custom', description: 'Custom REST integration', capabilities: { ...defaultCapabilities } },
    ];

    defaultProviders.forEach(p => this.providers.set(p.id, p));
  }

  getProvider(id: string): TTSProvider | undefined {
    return this.providers.get(id);
  }

  getAllProviders(): TTSProvider[] {
    return Array.from(this.providers.values());
  }

  registerProvider(provider: TTSProvider) {
    this.providers.set(provider.id, provider);
  }
}

export const ttsProviderRegistry = new TTSProviderRegistry();
