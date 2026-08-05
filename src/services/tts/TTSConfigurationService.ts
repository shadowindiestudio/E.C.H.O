import { TTSProviderConfiguration } from '../../types';
import { storageService } from '../storageService';

const TTS_CONFIG_STORAGE_KEY = 'tts_provider_configs_v2';

export class TTSConfigurationService {
  getConfigurations(): TTSProviderConfiguration[] {
    return storageService.get<TTSProviderConfiguration[]>(TTS_CONFIG_STORAGE_KEY, []);
  }

  getConfiguration(providerId: string): TTSProviderConfiguration | undefined {
    return this.getConfigurations().find(c => c.providerId === providerId);
  }

  saveConfiguration(config: TTSProviderConfiguration): void {
    const configs = this.getConfigurations();
    const index = configs.findIndex(c => c.providerId === config.providerId);
    
    if (index >= 0) {
      configs[index] = config;
    } else {
      configs.push(config);
    }
    
    storageService.set(TTS_CONFIG_STORAGE_KEY, configs);
  }

  deleteConfiguration(providerId: string): void {
    const configs = this.getConfigurations().filter(c => c.providerId !== providerId);
    storageService.set(TTS_CONFIG_STORAGE_KEY, configs);
  }

  createDefaultConfiguration(providerId: string): TTSProviderConfiguration {
    return {
      id: crypto.randomUUID(),
      providerId,
      enabled: false,
      apiKey: '',
      baseUrl: '',
      defaultVoiceId: '',
      defaultModelId: '',
      streamingEnabled: false,
      timeoutMs: 30000,
      retryCount: 3,
    };
  }
}

export const ttsConfigurationService = new TTSConfigurationService();
