import { GenerationTask, QueueStatus } from '../../types';

export class GenerationQueueManager {
  private queue: GenerationTask[] = [];

  enqueue(tasks: GenerationTask[]) {
    this.queue.push(...tasks);
    this.processQueue(); // Fire and forget in background
  }

  getQueue(): GenerationTask[] {
    return this.queue;
  }

  updateTaskStatus(taskId: string, status: QueueStatus, resultUrl?: string, error?: string) {
    const task = this.queue.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      if (resultUrl) task.resultUrl = resultUrl;
      if (error) task.error = error;
      if (status === 'completed') task.completedAt = new Date().toISOString();
      if (status === 'processing') task.startedAt = new Date().toISOString();
    }
  }

  private async processQueue() {
    // Basic queue processor logic. In reality, this would be a robust worker.
    const pendingTasks = this.queue.filter(t => t.status === 'queued');
    for (const task of pendingTasks) {
      this.updateTaskStatus(task.id, 'processing');
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.updateTaskStatus(task.id, 'completed', 'mock_audio_url.wav');
    }
  }
}
