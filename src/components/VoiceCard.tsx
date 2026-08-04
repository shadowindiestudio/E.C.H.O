import React from 'react';
import { Voice, ViewMode } from '../types';

interface VoiceCardProps {
  voice: Voice;
  isSelected: boolean;
  isPlaying: boolean;
  viewMode: ViewMode;
  onSelect: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onTogglePlay: (e: React.MouseEvent) => void;
}

export const VoiceCard: React.FC<VoiceCardProps> = ({
  voice,
  isSelected,
  isPlaying,
  viewMode,
  onSelect,
  onToggleFavorite,
  onTogglePlay,
}) => {
  if (viewMode === 'list') {
    return (
      <div
        onClick={onSelect}
        className={`p-3 rounded-lg cursor-pointer flex items-center justify-between gap-4 transition-all ${
          isSelected ? 'surface-card-active' : 'surface-card hover:border-muted-gold/60'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-matte-black border border-border-slate flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={voice.avatar}
              alt={voice.name}
              className={`w-full h-full object-cover transition-opacity ${
                isSelected ? 'opacity-100' : 'opacity-70'
              }`}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-on-surface text-sm truncate">
                {voice.name}
              </h3>
              <span className="text-[10px] text-muted-gold bg-muted-gold/10 px-1.5 py-0.5 rounded font-display uppercase tracking-wider">
                {voice.category}
              </span>
            </div>
            <p className="text-on-surface-variant text-xs truncate">{voice.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:flex gap-1">
            {voice.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] text-on-surface-variant/80 bg-matte-black px-2 py-0.5 rounded border border-border-slate/60">
                {tag}
              </span>
            ))}
          </div>

          <span className="text-xs text-on-surface-variant bg-matte-black px-2 py-1 rounded border border-border-slate/80 font-mono">
            {voice.language}
          </span>

          <button
            onClick={onToggleFavorite}
            className="text-on-surface-variant hover:text-muted-gold transition-colors p-1"
            title={voice.isFavorite ? 'Remove favorite' : 'Add favorite'}
          >
            <span
              className={`material-symbols-outlined text-base ${
                voice.isFavorite ? 'text-muted-gold' : ''
              }`}
              style={{ fontVariationSettings: voice.isFavorite ? "'FILL' 1" : "'FILL' 0" }}
            >
              star
            </span>
          </button>

          <button
            onClick={onTogglePlay}
            className={`p-1.5 rounded-full transition-transform active:scale-95 ${
              isPlaying ? 'text-muted-gold animate-pulse' : 'text-on-surface-variant hover:text-muted-gold'
            }`}
            title={isPlaying ? 'Stop voice sample' : 'Play voice sample'}
          >
            <span className="material-symbols-outlined text-2xl">
              {isPlaying ? 'pause_circle' : 'play_circle'}
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onSelect}
      className={`${
        isSelected ? 'surface-card-active shadow-lg shadow-yellow-950/20' : 'surface-card hover:border-muted-gold/60'
      } rounded-lg p-4 cursor-pointer flex flex-col gap-3 group transition-all relative`}
    >
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 rounded-full bg-matte-black border border-border-slate flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
          <img
            src={voice.avatar}
            alt={voice.name}
            className={`w-full h-full object-cover transition-all ${
              isSelected ? 'opacity-100 scale-105' : 'opacity-70 group-hover:opacity-100 group-hover:scale-105'
            }`}
          />
        </div>

        <button
          onClick={onToggleFavorite}
          className="text-on-surface-variant hover:text-muted-gold p-1 transition-colors"
          title={voice.isFavorite ? 'Remove favorite' : 'Add favorite'}
        >
          <span
            className={`material-symbols-outlined text-base ${
              voice.isFavorite ? 'text-muted-gold' : ''
            }`}
            style={{ fontVariationSettings: voice.isFavorite ? "'FILL' 1" : "'FILL' 0" }}
          >
            star
          </span>
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-display font-bold text-on-surface text-base group-hover:text-muted-gold transition-colors truncate">
            {voice.name}
          </h3>
          <span className="text-[10px] text-muted-gold bg-muted-gold/10 px-1.5 py-0.5 rounded font-display uppercase tracking-wider shrink-0">
            {voice.category}
          </span>
        </div>
        <p className="text-on-surface-variant text-xs line-clamp-1">{voice.description}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 my-1">
        {voice.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] text-on-surface-variant/80 bg-matte-black px-2 py-0.5 rounded border border-border-slate/60"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-3 border-t border-border-slate flex justify-between items-center">
        <span className="text-[11px] text-on-surface-variant bg-matte-black px-2 py-1 rounded border border-border-slate/80 font-mono">
          {voice.language}
        </span>

        <button
          onClick={onTogglePlay}
          className={`transition-all p-1 rounded-full ${
            isPlaying
              ? 'text-muted-gold scale-110 animate-pulse'
              : 'text-on-surface-variant group-hover:text-muted-gold hover:scale-105'
          }`}
          title={isPlaying ? 'Stop voice sample' : 'Play voice sample'}
        >
          <span className="material-symbols-outlined text-2xl">
            {isPlaying ? 'pause_circle' : 'play_circle'}
          </span>
        </button>
      </div>
    </div>
  );
};
