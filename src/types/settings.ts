export interface SystemSettings {
  themeMode: 'dark' | 'light' | 'system';
  accentColor: string; // e.g. '#D4AF37'
  autoSaveIntervalSeconds: number;
  defaultAudioFormat: 'WAV 24-bit' | 'MP3 320kbps' | 'FLAC';
  defaultSampleRate: 44100 | 48000 | 96000;
  enableTelemetry: boolean;
  enableHardwareAcceleration: boolean;
  maxConcurrentRenderJobs: number;
  storageUsageBytes: number;
  maxStorageLimitBytes: number;
}
