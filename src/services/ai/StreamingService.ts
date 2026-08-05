import { ProviderConfiguration, StreamingSession } from '../../types';

export class StreamingService {
  /**
   * TODO: Implement SSE / WebSockets stream parsing for different providers
   */
  startStream(config: ProviderConfiguration, modelId: string, prompt: string, onChunk: (chunk: string) => void): StreamingSession {
    const session: StreamingSession = {
      sessionId: crypto.randomUUID(),
      providerId: config.providerId,
      modelId
    };

    // Simulate streaming
    let count = 0;
    const words = prompt.split(' ');
    
    const interval = setInterval(() => {
      if (count < words.length && count < 20) {
        onChunk(words[count] + ' ');
        count++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return session;
  }
}

export const streamingService = new StreamingService();
