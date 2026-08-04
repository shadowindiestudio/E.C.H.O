import React from 'react';

interface BackendPendingBannerProps {
  moduleName: string;
  description?: string;
  onGoToVoiceStudio: () => void;
}

export const BackendPendingBanner: React.FC<BackendPendingBannerProps> = ({
  moduleName,
  description,
  onGoToVoiceStudio,
}) => {
  return (
    <div className="w-full bg-gradient-to-r from-surface-panel via-surface-container-low to-surface-panel border border-muted-gold/40 rounded-xl p-5 mb-6 shadow-xl relative overflow-hidden">
      {/* Decorative subtle background icon */}
      <div className="absolute right-4 -bottom-6 text-muted-gold/5 pointer-events-none select-none">
        <span className="material-symbols-outlined text-9xl">settings_input_component</span>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-muted-gold/10 border border-muted-gold/30 flex items-center justify-center text-muted-gold shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-2xl">cable</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-display uppercase tracking-widest text-muted-gold bg-muted-gold/10 px-2 py-0.5 rounded border border-muted-gold/30">
                Backend Connection Pending
              </span>
              <span className="text-xs font-mono text-on-surface-variant">• {moduleName}</span>
            </div>

            <h3 className="font-display font-bold text-base text-on-surface mt-1">
              This module will become available after its backend is connected.
            </h3>

            {description && (
              <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onGoToVoiceStudio}
          className="bg-muted-gold text-matte-black px-4 py-2 rounded-lg font-display text-xs font-bold hover:bg-primary-fixed transition-all shadow-md hover:shadow-yellow-500/10 flex items-center gap-2 shrink-0 active:scale-95"
        >
          <span className="material-symbols-outlined text-base">mic_external_on</span>
          Go to Voice Studio
        </button>
      </div>
    </div>
  );
};
