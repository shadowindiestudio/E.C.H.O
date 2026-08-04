import React, { useState, useEffect } from 'react';
import { useCommandPalette } from '../../context/CommandPaletteContext';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { NavItem } from '../../types';

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Projects' | 'Actions' | 'Voices';
  title: string;
  subtitle?: string;
  icon: string;
  action: () => void;
}

export const CommandPaletteModal: React.FC = () => {
  const { isOpen, closeCommandPalette } = useCommandPalette();
  const { setActiveNav, projects, setActiveProjectId, voices } = useApp();
  const { addToast } = useToast();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!isOpen) return null;

  const handleNavigate = (nav: NavItem) => {
    setActiveNav(nav);
    closeCommandPalette();
    addToast(`Switched view to ${nav.replace('-', ' ').toUpperCase()}`, undefined, 'info', 2000);
  };

  const commandList: CommandItem[] = [
    // Navigation
    { id: 'nav-vs', category: 'Navigation', title: 'Open Voice Studio', subtitle: 'Character voices & audio synthesis', icon: 'mic_external_on', action: () => handleNavigate('voice-studio') },
    { id: 'nav-proj', category: 'Navigation', title: 'Open Projects', subtitle: 'Manage cinematic audio projects', icon: 'folder_open', action: () => handleNavigate('projects') },
    { id: 'nav-se', category: 'Navigation', title: 'Open Story Editor', subtitle: 'Script manuscript & character tagger', icon: 'auto_stories', action: () => handleNavigate('story-editor') },
    { id: 'nav-cs', category: 'Navigation', title: 'Open Character Studio', subtitle: 'Personas and voice mapping', icon: 'face', action: () => handleNavigate('character-studio') },
    { id: 'nav-as', category: 'Navigation', title: 'Open Audio Studio DAW', subtitle: 'Multi-track timeline mixer', icon: 'graphic_eq', action: () => handleNavigate('audio-studio') },
    { id: 'nav-set', category: 'Navigation', title: 'Open Settings & Providers', subtitle: 'Ollama, Gemini, ElevenLabs config', icon: 'settings', action: () => handleNavigate('settings') },
    
    // Actions
    {
      id: 'act-test-ai',
      category: 'Actions',
      title: 'Run AI Provider Health Check',
      subtitle: 'Ping configured AI LLM endpoints',
      icon: 'network_check',
      action: () => {
        closeCommandPalette();
        setActiveNav('settings');
        addToast('Testing connection to active AI providers...', undefined, 'info');
      },
    },

    // Projects
    ...projects.map((p) => ({
      id: `proj-${p.id}`,
      category: 'Projects' as const,
      title: `Project: ${p.title}`,
      subtitle: `${p.genre} • ${p.scenes?.length || 0} Scenes`,
      icon: 'movie',
      action: () => {
        setActiveProjectId(p.id);
        setActiveNav('projects');
        closeCommandPalette();
        addToast(`Loaded Project: ${p.title}`, undefined, 'success');
      },
    })),

    // Voices
    ...voices.map((v) => ({
      id: `voice-${v.id}`,
      category: 'Voices' as const,
      title: `Voice: ${v.name}`,
      subtitle: `${v.category} • ${v.language}`,
      icon: 'record_voice_over',
      action: () => {
        setActiveNav('voice-studio');
        closeCommandPalette();
        addToast(`Selected voice ${v.name} in Voice Studio`, undefined, 'info');
      },
    })),
  ];

  const filtered = commandList.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(q) ||
      (cmd.subtitle && cmd.subtitle.toLowerCase().includes(q)) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={closeCommandPalette}
    >
      <div
        className="bg-surface-panel border border-border-slate w-full max-w-xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-3 border-b border-border-slate flex items-center gap-3 bg-surface-container-lowest">
          <span className="material-symbols-outlined text-muted-gold text-xl">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search voices, projects, settings..."
            className="w-full bg-transparent text-sm text-on-surface focus:outline-none placeholder:text-on-surface-variant/60"
          />
          <kbd className="text-[10px] bg-matte-black text-on-surface-variant px-1.5 py-0.5 rounded border border-border-slate font-mono">
            ESC
          </kbd>
        </div>

        {/* Command Options List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-on-surface-variant">
              No matching commands or resources found for "{query}".
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                    isSelected
                      ? 'bg-surface-container-high border border-muted-gold/50 text-on-surface'
                      : 'hover:bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`material-symbols-outlined text-lg ${
                        isSelected ? 'text-muted-gold' : 'text-on-surface-variant'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-display font-semibold truncate text-on-surface">
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p className="text-[10px] text-on-surface-variant truncate">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-matte-black border border-border-slate/60 text-on-surface-variant shrink-0">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 border-t border-border-slate bg-surface-container-lowest flex items-center justify-between text-[10px] text-on-surface-variant/70 font-mono">
          <div className="flex gap-3">
            <span>
              <kbd className="bg-matte-black px-1 rounded border border-border-slate">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="bg-matte-black px-1 rounded border border-border-slate">↵</kbd> Select
            </span>
          </div>
          <span>E.C.H.O. Command Palette</span>
        </div>
      </div>
    </div>
  );
};
