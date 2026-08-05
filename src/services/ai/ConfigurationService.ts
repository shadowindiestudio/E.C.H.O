import { ProviderConfiguration } from '../../types';
import { storageService } from '../storageService';

const AI_CONFIG_STORAGE_KEY = 'ai_provider_configs_v1';

export class ConfigurationService {
  getConfigurations(): ProviderConfiguration[] {
    return storageService.get<ProviderConfiguration[]>(AI_CONFIG_STORAGE_KEY, []);
  }

  getConfiguration(providerId: string): ProviderConfiguration | undefined {
    return this.getConfigurations().find(c => c.providerId === providerId);
  }

  saveConfiguration(config: ProviderConfiguration): void {
    const configs = this.getConfigurations();
    const index = configs.findIndex(c => c.providerId === config.providerId);
    
    if (index >= 0) {
      configs[index] = config;
    } else {
      configs.push(config);
    }
    
    storageService.set(AI_CONFIG_STORAGE_KEY, configs);
  }

  deleteConfiguration(providerId: string): void {
    const configs = this.getConfigurations().filter(c => c.providerId !== providerId);
    storageService.set(AI_CONFIG_STORAGE_KEY, configs);
  }

  createDefaultConfiguration(providerId: string): ProviderConfiguration {
    return {
      id: crypto.randomUUID(),
      providerId,
      enabled: false,
      apiKey: '',
      baseUrl: '',
      defaultModelId: '',
      temperature: 0.7,
      topP: 1.0,
      timeoutMs: 30000,
      retryCount: 3,
      streamingEnabled: true,
      favoriteModelIds: [],
      recentlyUsedModelIds: []
    };
  }
}

export const configurationService = new ConfigurationService();
