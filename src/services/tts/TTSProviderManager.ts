import { TTSProvider, TTSProviderConfiguration, TTSConnection } from '../../types';
import { ttsProviderRegistry } from './TTSProviderRegistry';
import { ttsConfigurationService } from './TTSConfigurationService';
import { ttsConnectionService } from './TTSConnectionService';

export class TTSProviderManager {
  getAllProviders(): TTSProvider[] {
    return ttsProviderRegistry.getAllProviders();
  }

  getProvider(providerId: string): TTSProvider | undefined {
    return ttsProviderRegistry.getProvider(providerId);
  }

  getConfigurations(): TTSProviderConfiguration[] {
    return ttsConfigurationService.getConfigurations();
  }

  getConfiguration(providerId: string): TTSProviderConfiguration {
    let config = ttsConfigurationService.getConfiguration(providerId);
    if (!config) {
      config = ttsConfigurationService.createDefaultConfiguration(providerId);
      ttsConfigurationService.saveConfiguration(config);
    }
    return config;
  }

  saveConfiguration(config: TTSProviderConfiguration): void {
    ttsConfigurationService.saveConfiguration(config);
  }

  async testConnection(providerId: string): Promise<TTSConnection> {
    const config = this.getConfiguration(providerId);
    return await ttsConnectionService.connect(config);
  }

  getConnection(providerId: string): TTSConnection | undefined {
    return ttsConnectionService.getConnection(providerId);
  }
}

export const ttsProviderManager = new TTSProviderManager();
