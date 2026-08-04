export * from './types/index';

export type ViewMode = 'grid' | 'list';
export type FilterTab = 'all' | 'favorites' | 'recent';

export type NavItem = 
  | 'dashboard' 
  | 'projects' 
  | 'story-editor' 
  | 'character-studio' 
  | 'voice-studio' 
  | 'audio-studio' 
  | 'asset-library' 
  | 'exports' 
  | 'analytics' 
  | 'settings';
