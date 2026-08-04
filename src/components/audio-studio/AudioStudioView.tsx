import React from 'react';
import { useApp } from '../../context/AppContext';
import { BackendPendingBanner } from '../common/BackendPendingBanner';
import { audioPipelineService } from '../../services/audioPipelineService';

export const AudioStudioView: React.FC = () => {
  const { activeProject, setActiveNav } = useApp();
  const tracks = audioPipelineService.getSceneTracks(activeProject?.scenes[0]?.id);

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      <BackendPendingBanner
        moduleName="Audio DAW Timeline & DSP Pipeline"
        description="Connect low-latency WebAssembly or C++ spatial audio rendering pipeline to process multi-channel Atmos stems, reverberation, and spatial panning."
        onGoToVoiceStudio={() => setActiveNav('voice-studio')}
      />

      <div className="surface-panel p-5 rounded-xl border border-border-slate space-y-4">
        <div className="flex justify-between items-center border-b border-border-slate pb-3">
          <div>
            <h2 className="font-display font-bold text-on-surface text-base">
              Multi-Track Timeline Mixer — {activeProject?.scenes[0]?.title || 'No Active Scene'}
            </h2>
            <p className="text-xs text-on-surface-variant">
              Master bus, stems, and volume pan envelopes for current scene.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="bg-surface-container-high border border-border-slate text-on-surface px-3 py-1.5 rounded text-xs font-display font-semibold hover:border-muted-gold">
              ▶ Play Scene
            </button>
            <button className="bg-muted-gold text-matte-black px-3 py-1.5 rounded text-xs font-display font-bold hover:bg-primary-fixed">
              Export Master Mix
            </button>
          </div>
        </div>

        {/* Tracks List */}
        {tracks.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl mb-2 text-border-slate">equalizer</span>
            <p className="font-display font-semibold text-on-surface text-sm">No Audio Stems Active</p>
            <p className="text-xs mt-1">Select or create a project scene to view dialogue multi-tracks and sound effect envelopes.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="bg-matte-black p-3 rounded-lg border border-border-slate flex flex-col md:flex-row items-center gap-4"
              >
                <div className="w-48 shrink-0 flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-xs text-on-surface flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: track.color }} />
                      {track.name}
                    </h4>
                    <span className="text-[10px] text-on-surface-variant">{track.stems.length} Active Stems</span>
                  </div>

                  <div className="flex gap-1">
                    <button className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface border border-border-slate">
                      M
                    </button>
                    <button className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface border border-border-slate">
                      S
                    </button>
                  </div>
                </div>

                {/* Waveform Representation */}
                <div className="flex-1 w-full bg-surface-panel h-12 rounded border border-border-slate/60 p-2 flex items-center gap-1 overflow-hidden">
                  {track.stems[0]?.waveformData && track.stems[0].waveformData.length > 0 ? (
                    track.stems[0].waveformData.map((val: number, i: number) => (
                      <div
                        key={i}
                        className="flex-1 rounded-full transition-all"
                        style={{
                          height: `${val}%`,
                          backgroundColor: track.color,
                          opacity: 0.8,
                        }}
                      />
                    ))
                  ) : (
                    <div className="w-full text-center text-[10px] font-mono text-on-surface-variant/60">
                      Empty Track (No Audio Audio Stem Loaded)
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
