import React, { useState } from 'react';
import { Voice, NavItem } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { VoiceLibrary } from './components/VoiceLibrary';
import { VoiceSettings } from './components/VoiceSettings';
import { NewVoiceModal } from './components/NewVoiceModal';
import { NewProjectModal } from './components/projects/NewProjectModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProjectsView } from './components/projects/ProjectsView';
import { StoryEditorView } from './components/story-editor/StoryEditorView';
import { CharacterStudioView } from './components/character-studio/CharacterStudioView';
import { AudioStudioView } from './components/audio-studio/AudioStudioView';
import { AssetLibraryView } from './components/asset-library/AssetLibraryView';
import { ExportsView } from './components/exports/ExportsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';

import { AppProvider, useApp } from './context/AppContext';
import { CommandPaletteProvider } from './context/CommandPaletteContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { ToastContainer } from './components/common/ToastContainer';
import { CommandPaletteModal } from './components/common/CommandPaletteModal';

import { playVoiceTone, stopVoiceTone } from './utils/audioSynth';
import { voicePreviewService } from './services/tts/VoicePreviewService';
import { playbackQueueService } from './services/tts/PlaybackQueueService';

function AppContent() {
  const { activeNav, setActiveNav, voices, setVoices, searchQuery } = useApp();
  const { addToast } = useToast();

  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [playbackDuration, setPlaybackDuration] = useState<number>(6);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [isNewVoiceModalOpen, setIsNewVoiceModalOpen] = useState<boolean>(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState<boolean>(false);

  const selectedVoice = (selectedVoiceId && voices.find((v) => v.id === selectedVoiceId)) || voices[0] || null;

  // Handle Play/Pause Audio Tone
  const handleTogglePlayVoice = async (id: string | null, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!id) return;

    if (playingVoiceId === id) {
      playbackQueueService.stop();
      setPlayingVoiceId(null);
      setPlaybackTime(0);
      return;
    }

    const voice = voices.find((v) => v.id === id);
    if (!voice) return;

    setPlayingVoiceId(id);
    setSelectedVoiceId(id);

    try {
      const preview = await voicePreviewService.generatePreview(voice, "This is a preview of the selected TTS voice.");
      playbackQueueService.addToQueue(preview);
      playbackQueueService.play();
      
      // In a full implementation, PlaybackQueueService should emit timeupdate events
      // For now, we simulate a 3-second playback duration
      setPlaybackDuration(3);
      setPlaybackTime(0);
      
      setTimeout(() => {
        setPlayingVoiceId(null);
        setPlaybackTime(0);
        playbackQueueService.stop();
      }, 3000);
      
    } catch (err) {
      addToast('Preview Error', String(err), 'error');
      setPlayingVoiceId(null);
    }
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setVoices((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isFavorite: !v.isFavorite } : v))
    );
  };

  // Update voice settings sliders
  const handleUpdateVoiceSettings = (updatedVoice: Voice) => {
    setVoices((prev) => prev.map((v) => (v.id === updatedVoice.id ? updatedVoice : v)));
  };

  // Add new voice
  const handleAddVoice = (newVoice: Voice) => {
    setVoices((prev) => [newVoice, ...prev]);
    setSelectedVoiceId(newVoice.id);
    addToast(`Created Voice: ${newVoice.name}`, undefined, 'success');
  };

  // Delete voice
  const handleDeleteVoice = (id: string) => {
    const voiceToDelete = voices.find((v) => v.id === id);
    const remaining = voices.filter((v) => v.id !== id);
    setVoices(remaining);
    if (selectedVoiceId === id) {
      setSelectedVoiceId(remaining[0]?.id || null);
    }
    if (voiceToDelete) {
      addToast(`Deleted voice: ${voiceToDelete.name}`, undefined, 'info');
    }
  };

  const navTitles: Record<NavItem, string> = {
    dashboard: 'Dashboard Overview',
    projects: 'Cinematic Projects',
    'story-editor': 'Story Editor',
    'character-studio': 'Character Studio',
    'voice-studio': 'Voice Studio',
    'audio-studio': 'Audio Studio',
    'asset-library': 'Asset Library',
    exports: 'Exports Center',
    analytics: 'Analytics & Quotas',
    settings: 'Settings & Providers',
  };

  return (
    <div className="flex h-screen overflow-hidden bg-matte-black font-sans text-on-surface">
      {/* Navigation Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <Header
          onOpenNewVoiceModal={() => setIsNewVoiceModalOpen(true)}
          onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          activeNavTitle={navTitles[activeNav] || 'Studio Workspace'}
        />

        {/* View Switcher */}
        {activeNav === 'voice-studio' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 gap-4 min-h-0">
            <VoiceLibrary
              voices={voices}
              selectedVoiceId={selectedVoiceId}
              playingVoiceId={playingVoiceId}
              searchQuery={searchQuery}
              onSelectVoice={(id) => setSelectedVoiceId(id)}
              onToggleFavorite={handleToggleFavorite}
              onTogglePlay={(id, e) => handleTogglePlayVoice(id, e)}
            />

            <VoiceSettings
              voice={selectedVoice}
              isPlaying={playingVoiceId === selectedVoiceId}
              playbackTime={playingVoiceId === selectedVoiceId ? playbackTime : 0}
              playbackDuration={playbackDuration}
              onTogglePlay={() => handleTogglePlayVoice(selectedVoiceId)}
              onUpdateVoiceSettings={handleUpdateVoiceSettings}
              onDeleteVoice={handleDeleteVoice}
            />
          </div>
        )}

        {activeNav === 'dashboard' && (
          <DashboardView
            onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
            onOpenNewVoiceModal={() => setIsNewVoiceModalOpen(true)}
          />
        )}

        {activeNav === 'projects' && (
          <ProjectsView
            onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
          />
        )}

        {activeNav === 'story-editor' && <StoryEditorView />}
        {activeNav === 'character-studio' && <CharacterStudioView />}
        {activeNav === 'audio-studio' && <AudioStudioView />}
        {activeNav === 'asset-library' && <AssetLibraryView />}
        {activeNav === 'exports' && <ExportsView />}
        {activeNav === 'analytics' && <AnalyticsView />}
        {activeNav === 'settings' && <SettingsView />}
      </main>

      {/* Modals & Overlay Containers */}
      <NewVoiceModal
        isOpen={isNewVoiceModalOpen}
        onClose={() => setIsNewVoiceModalOpen(false)}
        onAddVoice={handleAddVoice}
      />

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />

      <CommandPaletteModal />
      <ToastContainer />
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <CommandPaletteProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </CommandPaletteProvider>
    </ToastProvider>
  );
}

export default App;
