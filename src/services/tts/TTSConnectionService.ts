import { TTSConnection, TTSProviderConfiguration, TTSHealthStatus } from '../../types';

export class TTSConnectionService {
  private connections: Map<string, TTSConnection> = new Map();

  async connect(config: TTSProviderConfiguration): Promise<TTSConnection> {
    const health = await this.checkHealth(config);

    const connection: TTSConnection = {
      providerId: config.providerId,
      config,
      health,
    };

    this.connections.set(config.providerId, connection);
    return connection;
  }

  getConnection(providerId: string): TTSConnection | undefined {
    return this.connections.get(providerId);
  }

  getAllConnections(): TTSConnection[] {
    return Array.from(this.connections.values());
  }

  disconnect(providerId: string): void {
    this.connections.delete(providerId);
  }

  private async checkHealth(config: TTSProviderConfiguration): Promise<TTSHealthStatus> {
    const startTime = Date.now();
    
    try {
      // Local providers often don't need auth, cloud ones usually do.
      const needsAuth = !['piper', 'coqui', 'xtts', 'styletts2', 'kokoro', 'chatterbox', 'f5tts'].includes(config.providerId);
      
      if (needsAuth && (!config.apiKey || config.apiKey.trim() === '')) {
         return { status: 'auth_failed', message: 'API key is missing' };
      }

      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));
      const latencyMs = Date.now() - startTime;

      return {
        status: 'connected',
        latencyMs,
        lastTestedAt: new Date().toISOString(),
        message: 'Connected successfully',
      };

    } catch (error: any) {
      return {
        status: 'disconnected',
        message: error.message || 'Connection failed',
        lastTestedAt: new Date().toISOString()
      };
    }
  }
}

export const ttsConnectionService = new TTSConnectionService();
