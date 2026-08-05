import { Provider, ProviderConfiguration, Connection } from '../../types';
import { providerRegistry } from './ProviderRegistry';
import { configurationService } from './ConfigurationService';
import { connectionService } from './ConnectionService';

export class AIProviderManager {
  getAllProviders(): Provider[] {
    return providerRegistry.getAllProviders();
  }

  getProvider(providerId: string): Provider | undefined {
    return providerRegistry.getProvider(providerId);
  }

  getConfigurations(): ProviderConfiguration[] {
    return configurationService.getConfigurations();
  }

  getConfiguration(providerId: string): ProviderConfiguration {
    let config = configurationService.getConfiguration(providerId);
    if (!config) {
      config = configurationService.createDefaultConfiguration(providerId);
      configurationService.saveConfiguration(config);
    }
    return config;
  }

  saveConfiguration(config: ProviderConfiguration): void {
    configurationService.saveConfiguration(config);
  }

  async testConnection(providerId: string): Promise<Connection> {
    const config = this.getConfiguration(providerId);
    return await connectionService.connect(config);
  }

  getConnection(providerId: string): Connection | undefined {
    return connectionService.getConnection(providerId);
  }
}

export const aiProviderManager = new AIProviderManager();
