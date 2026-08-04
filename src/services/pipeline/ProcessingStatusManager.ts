import { PipelineProgress, ProcessingStage } from '../../types';

export type ProgressCallback = (progress: PipelineProgress) => void;

export class ProcessingStatusManager {
  private listeners: Set<ProgressCallback> = new Set();
  private currentProgress: PipelineProgress = {
    stage: 'idle',
    percent: 0,
    message: 'Ready',
  };

  subscribe(callback: ProgressCallback): () => void {
    this.listeners.add(callback);
    callback(this.currentProgress);
    return () => this.listeners.delete(callback);
  }

  update(stage: ProcessingStage, percent: number, message: string) {
    this.currentProgress = { stage, percent, message };
    this.notify();
  }

  fail(error: string) {
    this.currentProgress = {
      stage: 'failed',
      percent: this.currentProgress.percent,
      message: 'Processing failed',
      error,
    };
    this.notify();
  }

  complete() {
    this.currentProgress = { stage: 'completed', percent: 100, message: 'Processing complete' };
    this.notify();
  }

  private notify() {
    this.listeners.forEach((l) => l(this.currentProgress));
  }
}
