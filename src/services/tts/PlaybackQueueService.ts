import { AudioBuffer } from '../../types';

export class PlaybackQueueService {
  private queue: AudioBuffer[] = [];
  private currentIdx: number = -1;
  private isPlaying: boolean = false;
  private audioElement: HTMLAudioElement | null = null;

  addToQueue(buffer: AudioBuffer): void {
    this.queue.push(buffer);
    if (this.currentIdx === -1) {
      this.currentIdx = 0;
    }
  }

  play(): void {
    if (this.currentIdx >= 0 && this.currentIdx < this.queue.length) {
      const buffer = this.queue[this.currentIdx];
      if (!this.audioElement) {
        this.audioElement = new Audio(buffer.blobUrl);
        this.audioElement.onended = () => this.next();
      } else {
        this.audioElement.src = buffer.blobUrl;
      }
      this.audioElement.play();
      this.isPlaying = true;
    }
  }

  pause(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.isPlaying = false;
    }
  }

  stop(): void {
    this.pause();
    if (this.audioElement) {
      this.audioElement.currentTime = 0;
    }
    this.currentIdx = -1;
  }

  next(): void {
    if (this.currentIdx < this.queue.length - 1) {
      this.currentIdx++;
      this.play();
    } else {
      this.stop();
    }
  }
}

export const playbackQueueService = new PlaybackQueueService();
