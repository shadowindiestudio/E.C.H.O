export type ProjectStatus = 'draft' | 'in_progress' | 'rendering' | 'completed' | 'archived';

export interface ProjectCharacter {
  id: string;
  name: string;
  role: 'Protagonist' | 'Antagonist' | 'Supporting' | 'Narrator' | 'Minor';
  assignedVoiceId?: string;
  assignedVoiceName?: string;
  color: string;
}

export interface ProjectScene {
  id: string;
  sceneNumber: number;
  title: string;
  location: string;
  description: string;
  rawScript: string;
  characterIds: string[];
  durationEstimateSeconds: number;
  status: 'draft' | 'processed' | 'rendered';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  genre: 'Sci-Fi' | 'Fantasy' | 'Noir' | 'Drama' | 'Horror' | 'Documentary' | 'Radio Drama' | 'Custom';
  status: ProjectStatus;
  targetAiProviderId: string;
  targetTtsProviderId: string;
  createdAt: string;
  updatedAt: string;
  sceneCount: number;
  totalDurationEstimateSeconds: number;
  characters: ProjectCharacter[];
  scenes: ProjectScene[];
  tags: string[];
}
