export interface AudioStem {
  id: string;
  title: string;
  type: 'voice' | 'sfx' | 'ambient' | 'music';
  url: string;
  durationSeconds: number;
  volume: number; // 0-100
  pan: number; // -100 to 100
  isMuted: boolean;
  isSolo: boolean;
  waveformData?: number[];
}

export interface SceneTimelineTrack {
  id: string;
  name: string;
  color: string;
  stems: AudioStem[];
}

export interface RenderJob {
  id: string;
  projectId: string;
  projectTitle: string;
  format: 'WAV 24-bit' | 'MP3 320kbps' | 'Dolby Atmos Stem' | 'FLAC';
  status: 'queued' | 'rendering' | 'completed' | 'failed';
  progressPercent: number;
  createdAt: string;
  completedAt?: string;
  outputSizeMb?: number;
  downloadUrl?: string;
}
