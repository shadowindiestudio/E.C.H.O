import { Connection, ProviderConfiguration, Model } from '../../types';
import { healthService } from './HealthService';
import { modelService } from './ModelService';

export class ConnectionService {
  private connections: Map<string, Connection> = new Map();

  async connect(config: ProviderConfiguration): Promise<Connection> {
    const health = await healthService.checkHealth(config);
    let models: Model[] = [];
    
    if (health.status === 'connected') {
      models = await modelService.fetchAvailableModels(config);
    }

    const connection: Connection = {
      providerId: config.providerId,
      config,
      health,
      models
    };

    this.connections.set(config.providerId, connection);
    return connection;
  }

  getConnection(providerId: string): Connection | undefined {
    return this.connections.get(providerId);
  }

  getAllConnections(): Connection[] {
    return Array.from(this.connections.values());
  }

  disconnect(providerId: string): void {
    this.connections.delete(providerId);
  }
}

export const connectionService = new ConnectionService();
