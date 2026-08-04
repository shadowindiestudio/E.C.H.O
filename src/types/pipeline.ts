export type ProcessingStage =
  | 'idle'
  | 'validating'
  | 'chapter_detection'
  | 'scene_detection'
  | 'dialogue_extraction'
  | 'narration_extraction'
  | 'character_detection'
  | 'emotion_detection'
  | 'voice_mapping'
  | 'task_generation'
  | 'completed'
  | 'failed';

export interface PipelineProgress {
  stage: ProcessingStage;
  percent: number;
  message: string;
  error?: string;
}

export type QueueStatus = 'queued' | 'processing' | 'paused' | 'completed' | 'failed' | 'retry' | 'cancelled';

export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface GenerationTask {
  id: string;
  projectId: string;
  storyId: string;
  elementId: string; // The ID of the paragraph, dialogue, etc.
  elementType: 'dialogue' | 'narration' | 'scene_ambient' | 'sound_effect';
  status: QueueStatus;
  priority: TaskPriority;
  providerId?: string;
  modelId?: string;
  payload: any; // The data sent to the AI provider
  resultUrl?: string; // Generated audio URL
  error?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  retryCount: number;
}
