import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { ttsProviderManager } from '../../services/tts/TTSProviderManager';
import { aiProviderManager } from '../../services/ai/AIProviderManager';
import { ProviderConfig, SystemSettings, ProviderConfiguration, TTSProviderConfiguration } from '../../types';
import { Badge } from '../common/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const SettingsView: React.FC = () => {
  const {
    aiProviders,
    aiConfigs,
    updateAiConfig,
    ttsProviders,
    ttsConfigs,
    updateTtsConfig,
    systemSettings,
    updateSystemSettings,
  } = useApp();

  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'ai' | 'tts' | 'general'>('ai');
  const [testingId, setTestingId] = useState<string | null>(null);

  // Test AI Provider Connection
  const handleTestAiConnection = async (providerId: string) => {
    setTestingId(providerId);
    try {
      const res = await aiProviderManager.testConnection(providerId);
      
      if (res.health.status === 'connected') {
        addToast(
          `Connected`,
          `${res.health.message} (${res.health.latencyMs || 0}ms)`,
          'success'
        );
      } else {
        addToast(`Connection Failed`, res.health.message || 'Unknown error', 'error');
      }
    } catch (err) {
      addToast('Test Failed', String(err), 'error');
    } finally {
      setTestingId(null);
    }
  };

  // Test TTS Provider Synthesis
  const handleTestTtsSynthesis = async (providerId: string) => {
    setTestingId(providerId);
    try {
      const res = await ttsProviderManager.testConnection(providerId);

      if (res.health.status === 'connected') {
        addToast(
          `TTS Engine Ready`,
          `${res.health.message} (${res.health.latencyMs || 0}ms)`,
          'success'
        );
      } else {
        addToast(`TTS Test Failed`, res.health.message || 'Unknown error', 'error');
      }
    } catch (err) {
      addToast('TTS Test Error', String(err), 'error');
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      {/* Settings Navigation Tabs */}
      <div className="surface-panel rounded-xl p-3 flex border border-border-slate gap-2 bg-surface-container-lowest flex-wrap">
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-display text-xs font-bold transition-all ${
            activeTab === 'ai'
              ? 'bg-muted-gold text-matte-black shadow'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-base">psychology</span>
          AI LLM Providers ({aiConfigs.filter((p) => p.enabled).length})
        </button>

        <button
          onClick={() => setActiveTab('tts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-display text-xs font-bold transition-all ${
            activeTab === 'tts'
              ? 'bg-muted-gold text-matte-black shadow'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-base">spatial_audio_off</span>
          TTS Voice Engines ({ttsConfigs.filter((p) => p.enabled).length})
        </button>

        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-display text-xs font-bold transition-all ${
            activeTab === 'general'
              ? 'bg-muted-gold text-matte-black shadow'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-base">tune</span>
          System & Storage
        </button>
      </div>

      {/* AI Providers Tab */}
      {activeTab === 'ai' && (
        <div className="space-y-4">
          <div className="bg-surface-panel p-4 rounded-xl border border-border-slate flex justify-between items-center">
            <div>
              <h2 className="font-display font-bold text-on-surface text-base">AI Story & Script Providers</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Configure LLM endpoints for manuscript generation, character detection, and dialogue sentiment analysis.
              </p>
            </div>
            <span className="text-[10px] bg-muted-gold/10 text-muted-gold border border-muted-gold/30 px-2 py-1 rounded font-mono">
              Modular Provider Architecture Active
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {aiProviders.map((provider) => {
              const config = aiConfigs.find(c => c.providerId === provider.id) || {
                id: crypto.randomUUID(),
                providerId: provider.id,
                enabled: false,
                apiKey: '',
                baseUrl: '',
                defaultModelId: '',
                temperature: 0.7,
                topP: 1.0,
                timeoutMs: 30000,
                retryCount: 3,
                streamingEnabled: true,
                favoriteModelIds: [],
                recentlyUsedModelIds: []
              } as ProviderConfiguration;
              
              const connection = aiProviderManager.getConnection(provider.id);

              return (
                <div
                  key={provider.id}
                  className={`surface-panel p-5 rounded-xl border transition-all flex flex-col justify-between ${
                    config.enabled ? 'border-border-slate' : 'border-border-slate/40 opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-muted-gold">smart_toy</span>
                        <h3 className="font-display font-bold text-on-surface text-sm">{provider.name}</h3>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.enabled}
                          onChange={(e) =>
                            updateAiConfig({ ...config, enabled: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-matte-black peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-muted-gold"></div>
                      </label>
                    </div>
                    
                    <p className="text-[10px] text-on-surface-variant mb-4">{provider.description}</p>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-display uppercase text-on-surface-variant mb-1">
                          Endpoint URL
                        </label>
                        <input
                          type="text"
                          value={config.baseUrl}
                          onChange={(e) =>
                            updateAiConfig({ ...config, baseUrl: e.target.value })
                          }
                          className="w-full bg-matte-black border border-border-slate rounded p-2 text-xs font-mono text-on-surface focus:border-muted-gold outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-display uppercase text-on-surface-variant mb-1">
                          API Key
                        </label>
                        <input
                          type="password"
                          placeholder={provider.category === 'local' ? 'Optional for local endpoints' : 'Enter API Key...'}
                          value={config.apiKey}
                          onChange={(e) =>
                            updateAiConfig({ ...config, apiKey: e.target.value })
                          }
                          className="w-full bg-matte-black border border-border-slate rounded p-2 text-xs font-mono text-on-surface focus:border-muted-gold outline-none"
                        />
                      </div>

                      {provider.id === 'openai' && (
                        <div>
                          <label className="block text-[10px] font-display uppercase text-on-surface-variant mb-1">
                            Organization ID (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="Enter Organization ID..."
                            value={config.organizationId || ''}
                            onChange={(e) =>
                              updateAiConfig({ ...config, organizationId: e.target.value })
                            }
                            className="w-full bg-matte-black border border-border-slate rounded p-2 text-xs font-mono text-on-surface focus:border-muted-gold outline-none"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-display uppercase text-on-surface-variant mb-1">
                            Default Model
                          </label>
                          <select
                            value={config.defaultModelId}
                            onChange={(e) =>
                              updateAiConfig({ ...config, defaultModelId: e.target.value })
                            }
                            className="w-full bg-matte-black border border-border-slate rounded p-2 text-xs font-mono text-on-surface focus:border-muted-gold outline-none"
                          >
                            <option value="">Select model...</option>
                            {connection?.models?.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-display uppercase text-on-surface-variant mb-1">
                            Temperature
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="2"
                            step="0.1"
                            value={config.temperature}
                            onChange={(e) =>
                              updateAiConfig({ ...config, temperature: parseFloat(e.target.value) || 0 })
                            }
                            className="w-full bg-matte-black border border-border-slate rounded p-2 text-xs font-mono text-on-surface focus:border-muted-gold outline-none"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <input 
                          type="checkbox" 
                          id={`stream-${provider.id}`} 
                          checked={config.streamingEnabled} 
                          onChange={(e) => updateAiConfig({ ...config, streamingEnabled: e.target.checked })}
                          className="accent-muted-gold"
                        />
                        <label htmlFor={`stream-${provider.id}`} className="text-[10px] text-on-surface-variant cursor-pointer">
                          Enable Streaming Output
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Status & Test Action */}
                  <div className="mt-4 pt-3 border-t border-border-slate/60 flex items-center justify-between">
                    <div className="min-w-0 flex-1 pr-2">
                      {connection?.health?.lastTestedAt ? (
                        <span
                          className={`text-[10px] font-mono truncate block ${
                            connection.health.status === 'connected' ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {connection.health.status === 'connected' ? '✓ Connected' : '✕ Error'}: {connection.health.message}
                        </span>
                      ) : (
                        <span className="text-[10px] text-on-surface-variant/60 font-mono">Not tested yet</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleTestAiConnection(provider.id)}
                      disabled={testingId === provider.id}
                      className="bg-surface-container-high hover:bg-border-slate text-on-surface border border-border-slate px-3 py-1 rounded text-xs font-display font-semibold transition-colors shrink-0"
                    >
                      {testingId === provider.id ? <LoadingSpinner size="sm" label="" /> : 'Test Connection'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* TTS Providers Tab */}
      {activeTab === 'tts' && (
        <div className="space-y-4">
          <div className="bg-surface-panel p-4 rounded-xl border border-border-slate flex justify-between items-center">
            <div>
              <h2 className="font-display font-bold text-on-surface text-base">Text-To-Speech (TTS) Engines</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Configure neural speech synthesis engines (offline neural models or cloud studio APIs).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {ttsProviders.map((provider) => {
              const config = ttsConfigs?.find(c => c.providerId === provider.id) || {
                id: crypto.randomUUID(),
                providerId: provider.id,
                enabled: false,
                apiKey: '',
                baseUrl: '',
                defaultVoiceId: '',
                defaultModelId: '',
                streamingEnabled: false,
                timeoutMs: 30000,
                retryCount: 3,
              } as TTSProviderConfiguration;
              
              const connection = ttsProviderManager.getConnection(provider.id);

              return (
              <div
                key={provider.id}
                className={`surface-panel p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  config.enabled ? 'border-border-slate' : 'border-border-slate/40 opacity-70'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-muted-gold">record_voice_over</span>
                      <h3 className="font-display font-bold text-on-surface text-sm">{provider.name}</h3>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.enabled}
                        onChange={(e) =>
                          updateTtsConfig({ ...config, enabled: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-matte-black peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-muted-gold"></div>
                    </label>
                  </div>
                  
                  <p className="text-[10px] text-on-surface-variant mb-4">{provider.description}</p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-display uppercase text-on-surface-variant mb-1">
                        Endpoint / Host URL
                      </label>
                      <input
                        type="text"
                        value={config.baseUrl}
                        onChange={(e) =>
                          updateTtsConfig({ ...config, baseUrl: e.target.value })
                        }
                        className="w-full bg-matte-black border border-border-slate rounded p-2 text-xs font-mono text-on-surface focus:border-muted-gold outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-display uppercase text-on-surface-variant mb-1">
                        API Key
                      </label>
                      <input
                        type="password"
                        placeholder="Enter API Key..."
                        value={config.apiKey}
                        onChange={(e) =>
                          updateTtsConfig({ ...config, apiKey: e.target.value })
                        }
                        className="w-full bg-matte-black border border-border-slate rounded p-2 text-xs font-mono text-on-surface focus:border-muted-gold outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border-slate/60 flex items-center justify-between">
                  <div className="min-w-0 flex-1 pr-2">
                    {connection?.health?.lastTestedAt ? (
                      <span
                        className={`text-[10px] font-mono truncate block ${
                          connection.health.status === 'connected' ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {connection.health.status === 'connected' ? '✓ Ready' : '✕ Error'}: {connection.health.message}
                      </span>
                    ) : (
                      <span className="text-[10px] text-on-surface-variant/60 font-mono">Not tested yet</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleTestTtsSynthesis(provider.id)}
                    disabled={testingId === provider.id}
                    className="bg-surface-container-high hover:bg-border-slate text-on-surface border border-border-slate px-3 py-1 rounded text-xs font-display font-semibold transition-colors shrink-0"
                  >
                    {testingId === provider.id ? <LoadingSpinner size="sm" label="" /> : 'Test Synthesis'}
                  </button>
                </div>
              </div>
            )})}
          </div>
        </div>
      )}

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="surface-panel p-6 rounded-xl border border-border-slate space-y-6 max-w-3xl">
          <h2 className="font-display font-bold text-on-surface text-base border-b border-border-slate pb-3">
            System & Storage Preferences
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-semibold text-on-surface">Auto-Save Script Interval</p>
                <p className="text-on-surface-variant text-[11px]">Frequency of background manuscript persistence</p>
              </div>
              <select
                value={systemSettings.autoSaveIntervalSeconds}
                onChange={(e) =>
                  updateSystemSettings({ autoSaveIntervalSeconds: parseInt(e.target.value, 10) })
                }
                className="bg-matte-black border border-border-slate rounded p-2 font-mono text-on-surface"
              >
                <option value={15}>15 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-semibold text-on-surface">Default Audio Master Format</p>
                <p className="text-on-surface-variant text-[11px]">Primary render codec for scene exports</p>
              </div>
              <select
                value={systemSettings.defaultAudioFormat}
                onChange={(e) =>
                  updateSystemSettings({
                    defaultAudioFormat: e.target.value as SystemSettings['defaultAudioFormat'],
                  })
                }
                className="bg-matte-black border border-border-slate rounded p-2 font-mono text-on-surface"
              >
                <option value="WAV 24-bit">WAV 24-bit (Uncompressed)</option>
                <option value="MP3 320kbps">MP3 320kbps</option>
                <option value="FLAC">FLAC Lossless</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-semibold text-on-surface">Hardware Acceleration</p>
                <p className="text-on-surface-variant text-[11px]">Use WebAudio hardware DSP acceleration for synthesis preview</p>
              </div>
              <input
                type="checkbox"
                checked={systemSettings.enableHardwareAcceleration}
                onChange={(e) => updateSystemSettings({ enableHardwareAcceleration: e.target.checked })}
                className="w-4 h-4 accent-muted-gold cursor-pointer"
              />
            </div>

            <div className="pt-4 border-t border-border-slate">
              <div className="flex justify-between items-center mb-1">
                <span className="font-display font-semibold text-on-surface">Storage Quota</span>
                <span className="font-mono text-on-surface-variant">128 MB / 10 GB (1.2%)</span>
              </div>
              <div className="h-2 bg-matte-black border border-border-slate rounded-full overflow-hidden">
                <div className="h-full bg-muted-gold w-[1.2%]" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
