import React, { useState } from 'react';
import { Voice } from '../types';
import { useApp } from '../context/AppContext';

interface NewVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVoice: (voice: Voice) => void;
}

export const NewVoiceModal: React.FC<NewVoiceModalProps> = ({
  isOpen,
  onClose,
  onAddVoice,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Voice['category']>('Cinematic');
  const [language, setLanguage] = useState('English (US)');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Neutral'>('Male');
  const [tagsInput, setTagsInput] = useState('');
  const { ttsProviders } = useApp();
  const [providerId, setProviderId] = useState<string>(ttsProviders[0]?.id || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const defaultAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    ];

    const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    const newVoice: Voice = {
      id: `voice-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Custom Generated Character Voice',
      avatar: randomAvatar,
      language,
      category,
      isFavorite: false,
      stability: 75,
      similarity: 85,
      styleExaggeration: 30,
      gender,
      tags: parsedTags.length > 0 ? parsedTags : ['Custom', category],
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddVoice(newVoice);
    setName('');
    setDescription('');
    setTagsInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-surface-panel border border-border-slate w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border-slate bg-surface-container-lowest flex justify-between items-center">
          <div>
            <h2 className="font-display font-bold text-lg text-on-surface">Create New AI Voice</h2>
            <p className="text-xs text-on-surface-variant">Design a unique voice timbre for your cinematic storytelling.</p>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block font-display text-xs text-on-surface font-semibold uppercase tracking-wider mb-1">
              Voice Character Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Commander Valerius"
              className="w-full bg-matte-black border border-border-slate rounded p-2.5 text-xs text-on-surface focus:border-muted-gold outline-none"
            />
          </div>

          <div>
            <label className="block font-display text-xs text-on-surface font-semibold uppercase tracking-wider mb-1">
              Tone Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Deep, Resonant, Galactic Commander"
              className="w-full bg-matte-black border border-border-slate rounded p-2.5 text-xs text-on-surface focus:border-muted-gold outline-none"
            />
          </div>

          <div>
            <label className="block font-display text-xs text-on-surface font-semibold uppercase tracking-wider mb-1">
              TTS Provider Engine
            </label>
            <select
              value={providerId}
              onChange={(e) => setProviderId(e.target.value)}
              className="w-full bg-matte-black border border-border-slate rounded p-2.5 text-xs text-on-surface focus:border-muted-gold outline-none"
            >
              {ttsProviders.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-display text-xs text-on-surface font-semibold uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Voice['category'])}
                className="w-full bg-matte-black border border-border-slate rounded p-2.5 text-xs text-on-surface focus:border-muted-gold outline-none"
              >
                <option value="Cinematic">Cinematic</option>
                <option value="Synthetic">Synthetic</option>
                <option value="Character">Character</option>
                <option value="Narrative">Narrative</option>
                <option value="Radio">Radio</option>
              </select>
            </div>

            <div>
              <label className="block font-display text-xs text-on-surface font-semibold uppercase tracking-wider mb-1">
                Gender Tone
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Neutral')}
                className="w-full bg-matte-black border border-border-slate rounded p-2.5 text-xs text-on-surface focus:border-muted-gold outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Neutral">Neutral</option>
              </select>
            </div>
          </div>
            <div>
              <label className="block font-display text-xs text-on-surface font-semibold uppercase tracking-wider mb-1">
                Language / Accent
              </label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="e.g., English (US)"
                className="w-full bg-matte-black border border-border-slate rounded p-2.5 text-xs text-on-surface focus:border-muted-gold outline-none"
              />
            </div>

            <div>
              <label className="block font-display text-xs text-on-surface font-semibold uppercase tracking-wider mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Sci-Fi, Villain, Low Pitch"
                className="w-full bg-matte-black border border-border-slate rounded p-2.5 text-xs text-on-surface focus:border-muted-gold outline-none"
              />
            </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-border-slate flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-border-slate text-on-surface font-display text-xs font-semibold hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-muted-gold text-matte-black font-display text-xs font-bold hover:bg-primary-fixed transition-colors shadow"
            >
              Synthesize Voice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
