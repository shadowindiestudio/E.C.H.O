import { AudioBuffer } from '../../types';

export class AudioCacheService {
  private cache: Map<string, AudioBuffer> = new Map();

  cacheAudio(id: string, buffer: AudioBuffer): void {
    this.cache.set(id, buffer);
  }

  getAudio(id: string): AudioBuffer | undefined {
    return this.cache.get(id);
  }

  hasAudio(id: string): boolean {
    return this.cache.has(id);
  }

  clearCache(): void {
    // In a real app, we should also URL.revokeObjectURL for blobs
    this.cache.forEach(buffer => {
       if (buffer.blobUrl && buffer.blobUrl.startsWith('blob:')) {
           URL.revokeObjectURL(buffer.blobUrl);
       }
    });
    this.cache.clear();
  }
}

export const audioCacheService = new AudioCacheService();
