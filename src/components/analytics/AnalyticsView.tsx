import React from 'react';
import { useApp } from '../../context/AppContext';
import { BackendPendingBanner } from '../common/BackendPendingBanner';

export const AnalyticsView: React.FC = () => {
  const { setActiveNav, aiConfigs, ttsProviders, ttsConfigs } = useApp();

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      <BackendPendingBanner
        moduleName="Telemetry & Generation Quota Analytics"
        description="Connect Prometheus or OpenTelemetry metric pipelines to monitor audio latency distribution, GPU inference consumption, and API token quotas."
        onGoToVoiceStudio={() => setActiveNav('voice-studio')}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="surface-panel p-5 rounded-xl border border-border-slate">
          <span className="text-[10px] uppercase font-display text-on-surface-variant">Active AI LLM Models</span>
          <p className="text-2xl font-display font-bold text-muted-gold mt-1">
            {aiConfigs.filter((p) => p.enabled).length} Enabled
          </p>
        </div>

        <div className="surface-panel p-5 rounded-xl border border-border-slate">
          <span className="text-[10px] uppercase font-display text-on-surface-variant">Active TTS Engines</span>
          <p className="text-2xl font-display font-bold text-muted-gold mt-1">
            {ttsConfigs.filter((p) => p.enabled).length} Active
          </p>
        </div>

        <div className="surface-panel p-5 rounded-xl border border-border-slate">
          <span className="text-[10px] uppercase font-display text-on-surface-variant">Avg Inference Latency</span>
          <p className="text-2xl font-display font-bold text-emerald-400 mt-1">~120 ms</p>
        </div>
      </div>
    </div>
  );
};
