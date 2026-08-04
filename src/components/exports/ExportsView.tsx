import React from 'react';
import { useApp } from '../../context/AppContext';
import { BackendPendingBanner } from '../common/BackendPendingBanner';
import { exportService } from '../../services/audioPipelineService';
import { Badge } from '../common/Badge';

export const ExportsView: React.FC = () => {
  const { setActiveNav } = useApp();
  const renderJobs = exportService.getInitialRenderJobs();

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      <BackendPendingBanner
        moduleName="Export Queue & Master Audio Synthesizer"
        description="Connect your cloud audio rendering nodes or FFmpeg cluster to synthesize multi-track master files, Dolby Atmos stems, and subtitle tracks."
        onGoToVoiceStudio={() => setActiveNav('voice-studio')}
      />

      <div className="surface-panel p-5 rounded-xl border border-border-slate space-y-4">
        <h2 className="font-display font-bold text-on-surface text-base">Render Queue & Export History</h2>

        {renderJobs.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl mb-2 text-border-slate">download_done</span>
            <p className="font-display font-semibold text-on-surface text-sm">No Render Jobs in Queue</p>
            <p className="text-xs mt-1">Export a master mix from the Audio Studio or Story Editor to view render jobs here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {renderJobs.map((job) => (
              <div
                key={job.id}
                className="bg-matte-black p-4 rounded-xl border border-border-slate flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-sm text-on-surface">{job.projectTitle}</h4>
                    <Badge variant={job.status === 'completed' ? 'emerald' : 'gold'}>{job.format}</Badge>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 font-mono">
                    Job ID: {job.id} • Created: {new Date(job.createdAt).toLocaleTimeString()}
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto shrink-0 justify-between">
                  {job.status === 'completed' ? (
                    <span className="text-xs font-mono text-emerald-400">
                      Completed ({job.outputSizeMb} MB)
                    </span>
                  ) : (
                    <div className="w-32 bg-surface-panel h-2 rounded-full overflow-hidden border border-border-slate">
                      <div
                        className="bg-muted-gold h-full"
                        style={{ width: `${job.progressPercent}%` }}
                      />
                    </div>
                  )}

                  <button
                    disabled={job.status !== 'completed'}
                    className={`px-3 py-1.5 rounded font-display text-xs font-bold transition-all ${
                      job.status === 'completed'
                        ? 'bg-muted-gold text-matte-black hover:bg-primary-fixed shadow'
                        : 'bg-surface-container-high text-on-surface-variant/50 cursor-not-allowed'
                    }`}
                  >
                    Download Master
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
