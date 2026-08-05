import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NavItem, Project, ProviderConfig, SystemSettings, Voice, Story, ProviderConfiguration, Provider, TTSProvider, TTSProviderConfiguration } from '../types';
import { projectService } from '../services/projectService';
import { aiProviderManager } from '../services/ai/AIProviderManager';
import { ttsProviderManager } from '../services/tts/TTSProviderManager';
import { storageService } from '../services/storageService';
import { storyService } from '../services/pipeline/StoryService';
import { INITIAL_VOICES } from '../data/voices';

interface AppContextValue {
  activeNav: NavItem;
  setActiveNav: (nav: NavItem) => void;
  projects: Project[];
  activeProjectId: string | null;
  activeProject: Project | null;
  setActiveProjectId: (id: string | null) => void;
  
  stories: Story[];
  activeStoryId: string | null;
  activeStory: Story | null;
  setActiveStoryId: (id: string | null) => void;
  saveStory: (story: Story) => void;

  aiProviders: Provider[];
  aiConfigs: ProviderConfiguration[];
  ttsProviders: TTSProvider[];
  ttsConfigs: TTSProviderConfiguration[];
  systemSettings: SystemSettings;
  voices: Voice[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Actions
  createProject: (title: string, description: string, genre: Project['genre']) => Project;
  saveProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  updateAiConfig: (config: ProviderConfiguration) => void;
  updateTtsConfig: (config: TTSProviderConfiguration) => void;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
  setVoices: React.Dispatch<React.SetStateAction<Voice[]>>;
}

const DEFAULT_SETTINGS: SystemSettings = {
  themeMode: 'dark',
  accentColor: '#D4AF37',
  autoSaveIntervalSeconds: 30,
  defaultAudioFormat: 'WAV 24-bit',
  defaultSampleRate: 48000,
  enableTelemetry: false,
  enableHardwareAcceleration: true,
  maxConcurrentRenderJobs: 4,
  storageUsageBytes: 128 * 1024 * 1024, // 128 MB
  maxStorageLimitBytes: 10 * 1024 * 1024 * 1024, // 10 GB
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeNav, setActiveNav] = useState<NavItem>('voice-studio');
  const [projects, setProjects] = useState<Project[]>(() => projectService.getProjects());
  const [activeProjectId, setActiveProjectId] = useState<string | null>(() => {
    const list = projectService.getProjects();
    return list[0]?.id || null;
  });

  const [stories, setStories] = useState<Story[]>(() => storyService.getStories());
  const [activeStoryId, setActiveStoryId] = useState<string | null>(() => {
    const list = storyService.getStories();
    return list[0]?.id || null;
  });

  const [aiProviders] = useState<Provider[]>(() => aiProviderManager.getAllProviders());
  const [aiConfigs, setAiConfigs] = useState<ProviderConfiguration[]>(() => aiProviderManager.getConfigurations());
  const [ttsProviders] = useState<TTSProvider[]>(() => ttsProviderManager.getAllProviders());
  const [ttsConfigs, setTtsConfigs] = useState<TTSProviderConfiguration[]>(() => ttsProviderManager.getConfigurations());
  
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() =>
    storageService.get<SystemSettings>('system_settings', DEFAULT_SETTINGS)
  );

  // Clear stale legacy storage items if present
  useEffect(() => {
    storageService.remove('voices_v1');
    storageService.remove('projects_v1');
  }, []);

  const [voices, setVoices] = useState<Voice[]>(() =>
    storageService.get<Voice[]>('voices_v2', [])
  );

  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync voices to storage
  useEffect(() => {
    storageService.set('voices_v2', voices);
  }, [voices]);

  // Sync settings to storage
  useEffect(() => {
    storageService.set('system_settings', systemSettings);
  }, [systemSettings]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0] || null;
  const activeStory = stories.find((s) => s.id === activeStoryId) || stories[0] || null;

  const saveStory = useCallback((story: Story) => {
    storyService.saveStory(story);
    setStories(storyService.getStories());
  }, []);

  const createProject = useCallback((title: string, description: string, genre: Project['genre']) => {
    const newProj = projectService.createProject(title, description, genre);
    const updated = projectService.getProjects();
    setProjects(updated);
    setActiveProjectId(newProj.id);
    return newProj;
  }, []);

  const saveProject = useCallback((project: Project) => {
    const updated = projectService.saveProject(project);
    setProjects(updated);
  }, []);

  const deleteProject = useCallback((id: string) => {
    const updated = projectService.deleteProject(id);
    setProjects(updated);
    if (activeProjectId === id) {
      setActiveProjectId(updated[0]?.id || null);
    }
  }, [activeProjectId]);

  const updateAiConfig = useCallback((config: ProviderConfiguration) => {
    aiProviderManager.saveConfiguration(config);
    setAiConfigs(aiProviderManager.getConfigurations());
  }, []);

  const updateTtsConfig = useCallback((config: TTSProviderConfiguration) => {
    ttsProviderManager.saveConfiguration(config);
    setTtsConfigs(ttsProviderManager.getConfigurations());
  }, []);

  const updateSystemSettings = useCallback((newPartial: Partial<SystemSettings>) => {
    setSystemSettings((prev: SystemSettings) => ({ ...prev, ...newPartial }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeNav,
        setActiveNav,
        projects,
        activeProjectId,
        activeProject,
        setActiveProjectId,
        stories,
        activeStoryId,
        activeStory,
        setActiveStoryId,
        saveStory,
        aiProviders,
        aiConfigs,
        ttsProviders,
        ttsConfigs,
        systemSettings,
        voices,
        searchQuery,
        setSearchQuery,
        createProject,
        saveProject,
        deleteProject,
        updateAiConfig,
        updateTtsConfig,
        updateSystemSettings,
        setVoices,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
