import React from 'react';
import { NavItem } from '../types';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeNav, setActiveNav, projects, voices, aiConfigs, ttsProviders, ttsConfigs } = useApp();

  const enabledAiCount = aiConfigs.filter((p) => p.enabled).length;
  const enabledTtsCount = ttsConfigs.filter((p) => p.enabled).length;

  const navItems: { id: NavItem; label: string; icon: string; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'projects', label: 'Projects', icon: 'folder_open', badge: projects.length },
    { id: 'story-editor', label: 'Story Editor', icon: 'auto_stories' },
    { id: 'character-studio', label: 'Character Studio', icon: 'face' },
    { id: 'voice-studio', label: 'Voice Studio', icon: 'mic_external_on', badge: voices.length },
    { id: 'audio-studio', label: 'Audio Studio', icon: 'graphic_eq' },
    { id: 'asset-library', label: 'Asset Library', icon: 'library_music' },
    { id: 'exports', label: 'Exports', icon: 'ios_share' },
  ];

  const bottomItems: { id: NavItem; label: string; icon: string }[] = [
    { id: 'analytics', label: 'Analytics', icon: 'analytics' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col py-4 px-3 bg-surface-container-lowest border-r border-outline-variant/40 select-none">
      {/* Brand Header */}
      <div className="px-3 mb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-muted-gold to-yellow-600 flex items-center justify-center font-bold text-matte-black shadow-lg shadow-yellow-900/20">
          E
        </div>
        <div>
          <h1 className="font-display text-lg font-bold text-muted-gold tracking-tight leading-none">
            E.C.H.O.
          </h1>
          <p className="font-display text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">
            Cinematic Studio v1.0
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveNav(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-all ${
                    isActive
                      ? 'text-muted-gold border-l-2 border-muted-gold bg-surface-container-low shadow-sm font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-lg ${
                        isActive ? 'text-muted-gold' : ''
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-matte-black text-on-surface-variant border border-border-slate">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Provider Status Widget */}
      <div className="my-3 px-3 py-2 bg-matte-black/60 rounded-lg border border-border-slate/60 text-[11px] text-on-surface-variant">
        <div className="flex items-center justify-between font-display text-[10px] uppercase font-semibold text-muted-gold mb-1">
          <span>Providers Active</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="flex justify-between font-mono text-[10px]">
          <span>AI LLMs: <strong className="text-on-surface">{enabledAiCount}</strong></span>
          <span>TTS Engines: <strong className="text-on-surface">{enabledTtsCount}</strong></span>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="pt-2 border-t border-outline-variant/30 space-y-1">
        <ul className="space-y-1">
          {bottomItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveNav(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'text-muted-gold border-l-2 border-muted-gold bg-surface-container-low font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside className="hidden md:flex w-64 h-full shrink-0 flex-col z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 max-w-xs h-full bg-surface-container-lowest shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
