export interface Voice {
  id: string;
  name: string;
  description: string;
  avatar: string;
  language: string;
  category: 'Cinematic' | 'Synthetic' | 'Character' | 'Narrative' | 'Radio';
  isFavorite: boolean;
  stability: number; // 0-100
  similarity: number; // 0-100
  styleExaggeration: number; // 0-100
  sampleUrl?: string;
  gender?: 'Male' | 'Female' | 'Neutral';
  tags: string[];
  createdAt: string;
  providerId?: string; // e.g. elevenlabs, xtts, piper, google
  providerVoiceId?: string;
  
  // Advanced Voice Settings
  accent?: string;
  pitch?: number;
  speed?: number;
  volume?: number;
  emotion?: string;
  pauseDuration?: number;
  pronunciationDictionary?: Record<string, string>;
  speakingStyle?: string;
  voiceNotes?: string;
  age?: 'Child' | 'Young Adult' | 'Adult' | 'Senior';
}

export type VoiceViewMode = 'grid' | 'list';
export type VoiceFilterTab = 'all' | 'favorites' | 'recent';
