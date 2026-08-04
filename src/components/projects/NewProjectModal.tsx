import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Project } from '../../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose }) => {
  const { createProject, aiProviders, ttsProviders } = useApp();
  const { addToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState<Project['genre']>('Sci-Fi');
  const [selectedAiProvider, setSelectedAiProvider] = useState<string>('provider-ollama');
  const [selectedTtsProvider, setSelectedTtsProvider] = useState<string>('tts-piper');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProj = createProject(title.trim(), description.trim(), genre);
    addToast(`Created project "${newProj.title}"`, 'Loaded into active workspace', 'success');
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Audio Drama Project"
      subtitle="Establish a new cinematic storytelling manuscript & scene timeline."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border border-border-slate text-on-surface font-display text-xs font-semibold hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded bg-muted-gold text-matte-black font-display text-xs font-bold hover:bg-primary-fixed transition-colors shadow"
          >
            Create Project
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-display text-xs text-on-surface font-semibold uppercase tracking-wider mb-1">
            Project Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Station 9: Signal in the Static"
            className="w-full bg-matte-black border border-border-slate rounded p-2.5 text-xs text-on-surface focus:border-muted-gold outline-none"
          />
        </div>

        <div>
          <label className="block font-display text-xs text-on-surface font-semibold uppercase tracking-wider mb-1">
            Synopsis / Story Brief
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief overview of the plot, tone, acoustic setting, and main characters..."
            className="w-full bg-matte-black border border-border-slate rounded p-2.5 text-xs text-on-surface focus:border-muted-gold outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-display text-xs text-on-surface font-semibold uppercase tracking-wider mb-1">
              Genre
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value as Project['genre'])}
              className="w-full bg-matte-black border border-border-slate rounded p-2.5 text-xs text-on-surface focus:border-muted-gold outline-none"
            >
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Noir">Noir</option>
              <option value="Drama">Drama</option>
              <option value="Horror">Horror</option>
              <option value="Documentary">Documentary</option>
              <option value="Radio Drama">Radio Drama</option>
            </select>
          </div>

          <div>
            <label className="block font-display text-xs text-on-surface font-semibold uppercase tracking-wider mb-1">
              Target AI Provider
            </label>
            <select
              value={selectedAiProvider}
              onChange={(e) => setSelectedAiProvider(e.target.value)}
              className="w-full bg-matte-black border border-border-slate rounded p-2.5 text-xs text-on-surface focus:border-muted-gold outline-none"
            >
              {aiProviders.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-display text-xs text-on-surface font-semibold uppercase tracking-wider mb-1">
              Target TTS Provider
            </label>
            <select
              value={selectedTtsProvider}
              onChange={(e) => setSelectedTtsProvider(e.target.value)}
              className="w-full bg-matte-black border border-border-slate rounded p-2.5 text-xs text-on-surface focus:border-muted-gold outline-none"
            >
              {ttsProviders.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
};
