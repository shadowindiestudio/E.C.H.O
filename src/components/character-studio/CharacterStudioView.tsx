import React from 'react';
import { useApp } from '../../context/AppContext';
import { BackendPendingBanner } from '../common/BackendPendingBanner';
import { Badge } from '../common/Badge';
import { ProjectCharacter } from '../../types';

export const CharacterStudioView: React.FC = () => {
  const { activeProject, setActiveNav, voices } = useApp();

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      <BackendPendingBanner
        moduleName="Character Intelligence & Persona Voice Matching"
        description="Connect character detection LLM services to automatically extract psychological profiles, emotion stability vectors, and assign optimal voice models."
        onGoToVoiceStudio={() => setActiveNav('voice-studio')}
      />

      <div className="surface-panel p-5 rounded-xl border border-border-slate">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-display font-bold text-on-surface text-base">
              Character Roster — {activeProject?.title || 'No Project Selected'}
            </h2>
            <p className="text-xs text-on-surface-variant">
              Manage main cast personas, role hierarchy, and voice bindings.
            </p>
          </div>
          <button className="bg-muted-gold text-matte-black px-3 py-1.5 rounded font-display text-xs font-bold hover:bg-primary-fixed flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">person_add</span> Add Persona
          </button>
        </div>

        {!activeProject || !activeProject.characters || activeProject.characters.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl mb-2 text-border-slate">person_off</span>
            <p className="font-display font-semibold text-on-surface text-sm">No Characters in Project</p>
            <p className="text-xs mt-1">Create a project or add characters to manage character personas and voice bindings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeProject.characters.map((c: ProjectCharacter) => (
              <div
                key={c.id}
                className="bg-matte-black p-4 rounded-xl border border-border-slate space-y-3 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: c.color }}
                />

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display font-bold text-on-surface text-sm">{c.name}</h3>
                    <Badge variant="gold">{c.role}</Badge>
                  </div>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-matte-black"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.name.charAt(0)}
                  </div>
                </div>

                <div className="text-xs space-y-1.5 pt-2 border-t border-border-slate/60">
                  <p className="text-on-surface-variant text-[11px]">Assigned Voice Model:</p>
                  <select
                    defaultValue={c.assignedVoiceId || voices[0]?.id}
                    className="w-full bg-surface-panel border border-border-slate rounded p-1.5 text-xs text-on-surface focus:border-muted-gold outline-none"
                  >
                    {voices.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
