import React, { useState } from 'react';
import { Voice } from '../types';

interface VoiceSettingsProps {
  voice: Voice | null;
  isPlaying: boolean;
  playbackTime: number;
  playbackDuration: number;
  onTogglePlay: () => void;
  onUpdateVoiceSettings: (updatedVoice: Voice) => void;
  onDeleteVoice?: (id: string) => void;
}

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  voice,
  isPlaying,
  playbackTime,
  playbackDuration,
  onTogglePlay,
  onUpdateVoiceSettings,
  onDeleteVoice,
}) => {
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  if (!voice) {
    return (
      <div className="w-80 surface-panel rounded-lg flex flex-col shrink-0 overflow-hidden items-center justify-center p-6 text-center text-on-surface-variant">
        <span className="material-symbols-outlined text-4xl mb-2 text-border-slate">mic_off</span>
        <p className="font-display text-sm font-semibold text-on-surface">No Voice Selected</p>
        <p className="text-xs mt-1">Select a character voice from the library to configure voice modulation settings.</p>
      </div>
    );
  }

  const handleSliderChange = (key: 'stability' | 'similarity' | 'styleExaggeration', val: number) => {
    onUpdateVoiceSettings({
      ...voice,
      [key]: val,
    });
  };

  const handleReset = () => {
    onUpdateVoiceSettings({
      ...voice,
      stability: 75,
      similarity: 85,
      styleExaggeration: 30,
    });
    setAppliedNotification('Reset to defaults');
    setTimeout(() => setAppliedNotification(null), 2000);
  };

  const handleApply = () => {
    setAppliedNotification('Voice parameters applied');
    setTimeout(() => setAppliedNotification(null), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = playbackDuration > 0 ? (playbackTime / playbackDuration) * 100 : 0;

  return (
    <div className="w-full lg:w-80 surface-panel rounded-lg flex flex-col shrink-0 overflow-hidden relative border border-border-slate">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-border-slate bg-surface-container-lowest flex justify-between items-center">
        <div>
          <h2 className="font-display font-bold text-on-surface text-base">Voice Settings</h2>
          <p className="text-muted-gold text-xs font-mono">{voice.name}</p>
        </div>
        <span className="text-[10px] text-on-surface-variant bg-matte-black border border-border-slate px-2 py-0.5 rounded uppercase font-display">
          {voice.category}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
        {/* Toast alert */}
        {appliedNotification && (
          <div className="bg-muted-gold/15 border border-muted-gold text-muted-gold text-xs px-3 py-2 rounded text-center font-display animate-fade-in">
            ✓ {appliedNotification}
          </div>
        )}

        {/* Visualizer & Scrubber */}
        <div className="flex flex-col items-center justify-center p-4 bg-matte-black/60 rounded-lg border border-border-slate/80">
          <div className="flex items-center justify-center gap-1 h-16 w-full px-2">
            {[30, 60, 45, 90, 75, 40, 85, 100, 65, 50, 95, 70, 40, 80, 60, 90, 55, 35, 75, 85, 45, 60].map((h, idx) => (
              <div
                key={idx}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isPlaying
                    ? 'bg-muted-gold animate-pulse'
                    : (idx / 22) * 100 <= progressPercent
                    ? 'bg-muted-gold/80'
                    : 'bg-border-slate'
                }`}
                style={{
                  height: `${isPlaying ? Math.max(15, Math.round(h * Math.random())) : h}%`,
                }}
              />
            ))}
          </div>

          <div className="mt-3 w-full flex items-center gap-2">
            <button
              onClick={onTogglePlay}
              className="text-muted-gold hover:text-primary-fixed transition-transform active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              <span className="material-symbols-outlined text-3xl">
                {isPlaying ? 'pause_circle' : 'play_circle'}
              </span>
            </button>

            <div className="flex-1 h-1.5 bg-border-slate rounded-full overflow-hidden relative cursor-pointer">
              <div
                className="h-full bg-muted-gold transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <span className="text-[11px] text-on-surface-variant font-mono whitespace-nowrap">
              {formatTime(playbackTime)} / {formatTime(playbackDuration || 6)}
            </span>
          </div>
        </div>

        <hr className="border-border-slate/60" />

        {/* Sliders */}
        <div className="flex flex-col gap-5">
          {/* Stability */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="font-display text-xs text-on-surface font-semibold uppercase tracking-wider">
                Stability
              </label>
              <span className="text-xs text-muted-gold font-mono font-bold">
                {voice.stability}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={voice.stability}
              onChange={(e) => handleSliderChange('stability', parseInt(e.target.value, 10))}
              className="w-full"
            />
            <p className="text-[11px] text-on-surface-variant leading-tight">
              Higher values make the voice output more consistent but less expressive.
            </p>
          </div>

          {/* Similarity */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="font-display text-xs text-on-surface font-semibold uppercase tracking-wider">
                Similarity
              </label>
              <span className="text-xs text-muted-gold font-mono font-bold">
                {voice.similarity}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={voice.similarity}
              onChange={(e) => handleSliderChange('similarity', parseInt(e.target.value, 10))}
              className="w-full"
            />
            <p className="text-[11px] text-on-surface-variant leading-tight">
              Controls how closely the generated synthesis matches original target timbre.
            </p>
          </div>

          {/* Style Exaggeration */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="font-display text-xs text-on-surface font-semibold uppercase tracking-wider">
                Style Exaggeration
              </label>
              <span className="text-xs text-muted-gold font-mono font-bold">
                {voice.styleExaggeration}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={voice.styleExaggeration}
              onChange={(e) => handleSliderChange('styleExaggeration', parseInt(e.target.value, 10))}
              className="w-full"
            />
            <p className="text-[11px] text-on-surface-variant leading-tight">
              Amplifies character nuance and emotional cadence in speech synthesis.
            </p>
          </div>
        </div>

        {/* Metadata Details */}
        <div className="mt-2 pt-3 border-t border-border-slate/60 text-xs text-on-surface-variant space-y-1.5">
          <div className="flex justify-between">
            <span>Language Region:</span>
            <span className="font-mono text-on-surface">{voice.language}</span>
          </div>
          <div className="flex justify-between">
            <span>Voice Category:</span>
            <span className="font-mono text-on-surface">{voice.category}</span>
          </div>
          <div className="flex justify-between">
            <span>Gender Tone:</span>
            <span className="font-mono text-on-surface">{voice.gender || 'Neutral'}</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-border-slate bg-surface-container-lowest flex gap-2">
        <button
          onClick={handleReset}
          className="flex-1 bg-transparent border border-border-slate text-on-surface py-2 rounded text-xs font-display font-semibold hover:bg-surface-container-high transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="flex-1 bg-muted-gold text-matte-black py-2 rounded text-xs font-display font-bold hover:bg-primary-fixed transition-colors shadow"
        >
          Apply
        </button>
        {onDeleteVoice && (
          <button
            onClick={() => onDeleteVoice(voice.id)}
            className="p-2 bg-red-950/40 border border-red-800/40 text-red-400 hover:bg-red-900/60 rounded transition-colors"
            title="Delete Voice"
          >
            <span className="material-symbols-outlined text-base">delete</span>
          </button>
        )}
      </div>
    </div>
  );
};
