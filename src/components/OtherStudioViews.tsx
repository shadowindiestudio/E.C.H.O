import React from 'react';
import { NavItem } from '../types';

interface OtherStudioViewsProps {
  navItem: NavItem;
  onNavigateToVoiceStudio: () => void;
}

export const OtherStudioViews: React.FC<OtherStudioViewsProps> = ({
  navItem,
  onNavigateToVoiceStudio,
}) => {
  const getTitleAndDesc = () => {
    switch (navItem) {
      case 'dashboard':
        return {
          title: 'Dashboard Overview',
          desc: 'Monitor real-time AI voice generation pipelines, active audio renders, and resource metrics.',
        };
      case 'projects':
        return {
          title: 'Cinematic Projects',
          desc: 'Manage your active audio storytelling productions, scripts, and audio timeline sessions.',
        };
      case 'story-editor':
        return {
          title: 'AI Story Editor',
          desc: 'Draft scripts with automatic dialogue detection, character tagging, and speech pacing analysis.',
        };
      case 'character-studio':
        return {
          title: 'Character Studio',
          desc: 'Define character personas, psychological traits, visual avatars, and default voice profiles.',
        };
      case 'audio-studio':
        return {
          title: 'Audio Studio & DAW',
          desc: 'Multi-track audio sequencing, spatial positioning, background score layering, and acoustic mastering.',
        };
      case 'asset-library':
        return {
          title: 'Asset Library',
          desc: 'Sound effects, ambient tracks, acoustic reverbs, and licensed audio stems for story production.',
        };
      case 'exports':
        return {
          title: 'Export Center',
          desc: 'Render high-resolution spatial audio formats (Dolby Atmos, WAV 24-bit, MP3) and subtitle stems.',
        };
      case 'analytics':
        return {
          title: 'Audience & Usage Analytics',
          desc: 'Track listener engagement, speech synthesis quota usage, and character voice popularity.',
        };
      case 'settings':
        return {
          title: 'Suite Settings & API Keys',
          desc: 'Configure system performance, dark theme parameters, Gemini API integrations, and workspace access.',
        };
      default:
        return {
          title: 'Voice Studio Module',
          desc: 'Manage character voice profiles.',
        };
    }
  };

  const { title, desc } = getTitleAndDesc();

  return (
    <div className="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-center text-center">
      <div className="max-w-md surface-panel p-8 rounded-xl border border-border-slate shadow-xl flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-muted-gold/10 border border-muted-gold/30 flex items-center justify-center text-muted-gold mb-4">
          <span className="material-symbols-outlined text-3xl">auto_awesome</span>
        </div>
        <h2 className="font-display font-bold text-xl text-on-surface mb-2">{title}</h2>
        <p className="text-xs text-on-surface-variant leading-relaxed mb-6">{desc}</p>

        <div className="flex gap-3">
          <button
            onClick={onNavigateToVoiceStudio}
            className="bg-muted-gold text-matte-black px-4 py-2 rounded font-display text-xs font-bold hover:bg-primary-fixed transition-colors shadow flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">mic_external_on</span>
            Open Voice Studio
          </button>
        </div>
      </div>
    </div>
  );
};
