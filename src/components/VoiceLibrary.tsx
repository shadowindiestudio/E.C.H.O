import React, { useState } from 'react';
import { Voice, ViewMode, FilterTab } from '../types';
import { VoiceCard } from './VoiceCard';

interface VoiceLibraryProps {
  voices: Voice[];
  selectedVoiceId: string | null;
  playingVoiceId: string | null;
  searchQuery: string;
  onSelectVoice: (id: string) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onTogglePlay: (id: string, e: React.MouseEvent) => void;
}

export const VoiceLibrary: React.FC<VoiceLibraryProps> = ({
  voices,
  selectedVoiceId,
  playingVoiceId,
  searchQuery,
  onSelectVoice,
  onToggleFavorite,
  onTogglePlay,
}) => {
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const categories = ['All', 'Cinematic', 'Synthetic', 'Character', 'Narrative', 'Radio'];

  // Filtering
  const filteredVoices = voices.filter((voice) => {
    // Tab filter
    if (filterTab === 'favorites' && !voice.isFavorite) return false;
    if (filterTab === 'recent') {
      const isRecent = new Date(voice.createdAt) >= new Date('2026-07-28');
      if (!isRecent) return false;
    }

    // Category filter
    if (categoryFilter !== 'All' && voice.category !== categoryFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = voice.name.toLowerCase().includes(q);
      const matchDesc = voice.description.toLowerCase().includes(q);
      const matchCategory = voice.category.toLowerCase().includes(q);
      const matchTag = voice.tags.some((t) => t.toLowerCase().includes(q));
      return matchName || matchDesc || matchCategory || matchTag;
    }

    return true;
  });

  return (
    <div className="flex-1 surface-panel rounded-lg flex flex-col overflow-hidden border border-border-slate min-w-0">
      {/* Top Filter Bar */}
      <div className="px-4 py-3 border-b border-border-slate flex flex-wrap gap-3 justify-between items-center bg-surface-container-lowest shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          {/* Main Filter Tabs */}
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1 rounded text-xs font-display uppercase tracking-wider transition-colors ${
              filterTab === 'all'
                ? 'bg-dark-slate text-muted-gold border border-muted-gold font-semibold'
                : 'bg-dark-slate text-on-surface-variant border border-border-slate hover:bg-surface-container-high'
            }`}
          >
            All Voices
          </button>
          <button
            onClick={() => setFilterTab('favorites')}
            className={`px-3 py-1 rounded text-xs font-display uppercase tracking-wider transition-colors ${
              filterTab === 'favorites'
                ? 'bg-dark-slate text-muted-gold border border-muted-gold font-semibold'
                : 'bg-dark-slate text-on-surface-variant border border-border-slate hover:bg-surface-container-high'
            }`}
          >
            Favorites ★
          </button>
          <button
            onClick={() => setFilterTab('recent')}
            className={`px-3 py-1 rounded text-xs font-display uppercase tracking-wider transition-colors ${
              filterTab === 'recent'
                ? 'bg-dark-slate text-muted-gold border border-muted-gold font-semibold'
                : 'bg-dark-slate text-on-surface-variant border border-border-slate hover:bg-surface-container-high'
            }`}
          >
            Recent
          </button>
        </div>

        {/* View Mode & Count */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-on-surface-variant font-mono">
            {filteredVoices.length} {filteredVoices.length === 1 ? 'Voice' : 'Voices'}
          </span>

          <div className="flex border border-border-slate rounded overflow-hidden p-0.5 bg-matte-black">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-surface-container-high text-muted-gold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="Grid View"
            >
              <span className="material-symbols-outlined text-base">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded text-xs transition-colors ${
                viewMode === 'list'
                  ? 'bg-surface-container-high text-muted-gold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="List View"
            >
              <span className="material-symbols-outlined text-base">view_list</span>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Category Filter */}
      <div className="px-4 py-2 border-b border-border-slate/50 bg-matte-black/40 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
        <span className="text-on-surface-variant/70 uppercase text-[10px] font-display mr-1">Category:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-2.5 py-0.5 rounded-full transition-colors whitespace-nowrap ${
              categoryFilter === cat
                ? 'bg-muted-gold/20 text-muted-gold border border-muted-gold/40 font-semibold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards List / Grid Container */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredVoices.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-2 text-border-slate">graphic_eq</span>
            <p className="font-display font-semibold text-on-surface">No Voices Found</p>
            <p className="text-xs mt-1">Try resetting your search query or category filter criteria.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredVoices.map((voice) => (
              <VoiceCard
                key={voice.id}
                voice={voice}
                isSelected={voice.id === selectedVoiceId}
                isPlaying={voice.id === playingVoiceId}
                viewMode="grid"
                onSelect={() => onSelectVoice(voice.id)}
                onToggleFavorite={(e) => onToggleFavorite(voice.id, e)}
                onTogglePlay={(e) => onTogglePlay(voice.id, e)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredVoices.map((voice) => (
              <VoiceCard
                key={voice.id}
                voice={voice}
                isSelected={voice.id === selectedVoiceId}
                isPlaying={voice.id === playingVoiceId}
                viewMode="list"
                onSelect={() => onSelectVoice(voice.id)}
                onToggleFavorite={(e) => onToggleFavorite(voice.id, e)}
                onTogglePlay={(e) => onTogglePlay(voice.id, e)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
