import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';

interface DashboardViewProps {
  onOpenNewProjectModal: () => void;
  onOpenNewVoiceModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNewProjectModal,
  onOpenNewVoiceModal,
}) => {
  const {
    projects,
    setActiveProjectId,
    setActiveNav,
    voices,
    aiProviders,
    ttsProviders,
  } = useApp();

  const enabledAi = aiProviders.filter((p) => p.enabled);
  const enabledTts = ttsProviders.filter((p) => p.enabled);

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      {/* Quick Launch Banner */}
      <div className="bg-gradient-to-r from-surface-panel via-surface-container-low to-surface-panel border border-muted-gold/40 rounded-xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <Badge variant="gold">Production Command Center</Badge>
          <h2 className="font-display font-bold text-xl text-on-surface mt-2">
            Enhanced Cinematic Human Output (E.C.H.O.)
          </h2>
          <p className="text-xs text-on-surface-variant max-w-xl mt-1 leading-relaxed">
            Open-source AI-powered cinematic audio storytelling platform. Manage character voices, manuscript dialogue, neural TTS pipelines, and Atmos stems.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveNav('voice-studio')}
            className="bg-muted-gold text-matte-black px-4 py-2 rounded-lg font-display text-xs font-bold hover:bg-primary-fixed shadow flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">mic_external_on</span>
            Launch Voice Studio
          </button>
          <button
            onClick={onOpenNewProjectModal}
            className="bg-surface-container-high border border-border-slate text-on-surface hover:border-muted-gold px-4 py-2 rounded-lg font-display text-xs font-semibold"
          >
            + New Project
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface-panel p-4 rounded-xl border border-border-slate flex justify-between items-center">
          <div>
            <span className="text-[10px] font-display uppercase tracking-wider text-on-surface-variant">
              Active Projects
            </span>
            <p className="text-2xl font-display font-bold text-on-surface mt-0.5">{projects.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-border-slate flex items-center justify-center text-muted-gold">
            <span className="material-symbols-outlined">folder</span>
          </div>
        </div>

        <div className="surface-panel p-4 rounded-xl border border-border-slate flex justify-between items-center">
          <div>
            <span className="text-[10px] font-display uppercase tracking-wider text-on-surface-variant">
              Voice Models
            </span>
            <p className="text-2xl font-display font-bold text-on-surface mt-0.5">{voices.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-border-slate flex items-center justify-center text-muted-gold">
            <span className="material-symbols-outlined">record_voice_over</span>
          </div>
        </div>

        <div className="surface-panel p-4 rounded-xl border border-border-slate flex justify-between items-center">
          <div>
            <span className="text-[10px] font-display uppercase tracking-wider text-on-surface-variant">
              AI Providers
            </span>
            <p className="text-2xl font-display font-bold text-emerald-400 mt-0.5">
              {enabledAi.length} Active
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-border-slate flex items-center justify-center text-emerald-400">
            <span className="material-symbols-outlined">smart_toy</span>
          </div>
        </div>

        <div className="surface-panel p-4 rounded-xl border border-border-slate flex justify-between items-center">
          <div>
            <span className="text-[10px] font-display uppercase tracking-wider text-on-surface-variant">
              TTS Engines
            </span>
            <p className="text-2xl font-display font-bold text-emerald-400 mt-0.5">
              {enabledTts.length} Active
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-border-slate flex items-center justify-center text-emerald-400">
            <span className="material-symbols-outlined">volume_up</span>
          </div>
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="surface-panel p-5 rounded-xl border border-border-slate space-y-4">
        <div className="flex justify-between items-center border-b border-border-slate pb-3">
          <h3 className="font-display font-bold text-on-surface text-sm">Recent Audio Productions</h3>
          <button
            onClick={() => setActiveNav('projects')}
            className="text-xs text-muted-gold font-display font-semibold hover:underline"
          >
            View All Projects →
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl mb-2 text-border-slate">folder_off</span>
            <p className="font-display font-semibold text-on-surface text-sm">No Active Audio Projects</p>
            <p className="text-xs mt-1 mb-3">Create your first cinematic project to begin story generation and voice management.</p>
            <button
              onClick={onOpenNewProjectModal}
              className="bg-muted-gold text-matte-black px-4 py-1.5 rounded text-xs font-display font-bold hover:bg-primary-fixed transition-colors shadow"
            >
              + Create First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.slice(0, 3).map((p) => (
              <div
                key={p.id}
                className="bg-matte-black p-4 rounded-xl border border-border-slate hover:border-muted-gold/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="gold">{p.genre}</Badge>
                    <span className="text-[10px] font-mono text-on-surface-variant">{p.scenes.length} Scenes</span>
                  </div>
                  <h4 className="font-display font-bold text-on-surface text-sm">{p.title}</h4>
                  <p className="text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border-slate/60 flex justify-between items-center">
                  <span className="text-[10px] text-on-surface-variant">
                    Updated {new Date(p.updatedAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => {
                      setActiveProjectId(p.id);
                      setActiveNav('story-editor');
                    }}
                    className="text-xs font-display font-bold text-muted-gold hover:underline"
                  >
                    Open Editor →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
