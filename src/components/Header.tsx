import React from 'react';
import { useApp } from '../context/AppContext';
import { useCommandPalette } from '../context/CommandPaletteContext';

interface HeaderProps {
  onOpenNewVoiceModal: () => void;
  onOpenNewProjectModal: () => void;
  onToggleMobileSidebar: () => void;
  activeNavTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewVoiceModal,
  onOpenNewProjectModal,
  onToggleMobileSidebar,
  activeNavTitle,
}) => {
  const { searchQuery, setSearchQuery, projects, activeProjectId, setActiveProjectId, activeProject } = useApp();
  const { openCommandPalette } = useCommandPalette();

  return (
    <>
      {/* Mobile Header */}
      <header className="bg-surface text-primary border-b border-border-slate flex justify-between items-center h-14 px-4 w-full z-30 md:hidden shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="text-on-surface-variant hover:text-muted-gold p-1"
            aria-label="Toggle Navigation"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-muted-gold text-lg tracking-tight">E.C.H.O.</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openCommandPalette}
            className="p-1.5 text-on-surface-variant hover:text-muted-gold"
            title="Command Palette"
          >
            <span className="material-symbols-outlined text-xl">terminal</span>
          </button>
          <button
            onClick={onOpenNewVoiceModal}
            className="bg-muted-gold text-matte-black px-3 py-1.5 rounded font-display text-xs font-semibold hover:bg-primary-fixed transition-colors flex items-center gap-1 shadow"
          >
            <span className="material-symbols-outlined text-sm">add</span> New
          </button>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:flex justify-between items-center h-16 px-6 border-b border-border-slate shrink-0 bg-matte-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-4 text-on-surface-variant">
          <span className="font-display text-xl font-bold text-on-surface tracking-tight">
            {activeNavTitle}
          </span>
          <span className="text-border-slate">|</span>

          {/* Active Project Dropdown */}
          <div className="flex items-center gap-2 bg-surface-container-lowest border border-border-slate rounded-lg px-2.5 py-1 text-xs">
            <span className="material-symbols-outlined text-muted-gold text-base">movie</span>
            <select
              value={activeProjectId || ''}
              onChange={(e) => {
                if (e.target.value === 'NEW') {
                  onOpenNewProjectModal();
                } else {
                  setActiveProjectId(e.target.value);
                }
              }}
              className="bg-transparent text-on-surface font-display text-xs font-semibold outline-none cursor-pointer pr-1"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-matte-black text-on-surface">
                  {p.title}
                </option>
              ))}
              <option value="NEW" className="bg-matte-black text-muted-gold font-bold">
                + Create New Project...
              </option>
            </select>
            {activeProject && (
              <span className="text-[10px] bg-muted-gold/10 text-muted-gold px-1.5 py-0.5 rounded uppercase font-mono border border-muted-gold/30">
                {activeProject.genre}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search voices, projects, tags..."
              className="bg-surface-container-lowest border border-border-slate rounded py-1.5 pl-9 pr-4 text-xs focus:border-muted-gold focus:ring-1 focus:ring-muted-gold w-56 text-on-surface transition-all outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Command Palette Trigger */}
          <button
            onClick={openCommandPalette}
            className="flex items-center gap-1.5 bg-surface-container-lowest border border-border-slate hover:border-muted-gold/60 text-on-surface-variant hover:text-on-surface px-3 py-1.5 rounded text-xs transition-colors"
            title="Open Command Palette (Cmd+K)"
          >
            <span className="material-symbols-outlined text-sm">terminal</span>
            <span className="font-mono text-[11px]">⌘K</span>
          </button>

          {/* New Voice Button */}
          <button
            onClick={onOpenNewVoiceModal}
            className="bg-muted-gold text-matte-black px-3.5 py-1.5 rounded font-display text-xs font-bold hover:bg-primary-fixed transition-all flex items-center gap-1.5 shadow-md hover:shadow-yellow-500/10 active:scale-95 shrink-0"
          >
            <span className="material-symbols-outlined text-base">add</span> New Voice
          </button>
        </div>
      </header>
    </>
  );
};
