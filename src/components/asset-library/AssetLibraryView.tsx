import React from 'react';
import { useApp } from '../../context/AppContext';
import { BackendPendingBanner } from '../common/BackendPendingBanner';

interface Asset {
  id: string;
  title: string;
  category: string;
  duration: string;
  tags: string[];
}

export const AssetLibraryView: React.FC = () => {
  const { setActiveNav } = useApp();

  const assets: Asset[] = [];

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      <BackendPendingBanner
        moduleName="Cinematic Asset Library & Sound Effects"
        description="Connect your cloud audio asset CDN or local sound folder indexer to browse 10,000+ lossless SFX and ambient background beds."
        onGoToVoiceStudio={() => setActiveNav('voice-studio')}
      />

      <div className="surface-panel p-5 rounded-xl border border-border-slate">
        <h2 className="font-display font-bold text-on-surface text-base mb-3">Sound Effects & Music Stems</h2>

        {assets.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl mb-2 text-border-slate">library_music</span>
            <p className="font-display font-semibold text-on-surface text-sm">No Sound Stems Uploaded</p>
            <p className="text-xs mt-1">Upload sound effects or connect an audio library indexer to browse audio assets.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="bg-matte-black p-3.5 rounded-lg border border-border-slate flex items-center justify-between"
              >
                <div>
                  <h4 className="font-display font-semibold text-xs text-on-surface">{asset.title}</h4>
                  <div className="flex gap-2 text-[10px] text-on-surface-variant mt-1">
                    <span className="text-muted-gold font-mono">{asset.category}</span>
                    <span>• {asset.duration}</span>
                  </div>
                </div>

                <button className="p-2 bg-surface-container-high rounded text-on-surface hover:text-muted-gold transition-colors">
                  <span className="material-symbols-outlined text-base">play_arrow</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
