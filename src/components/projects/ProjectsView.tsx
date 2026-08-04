import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Project, ProjectCharacter } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

interface ProjectsViewProps {
  onOpenNewProjectModal: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onOpenNewProjectModal }) => {
  const { projects, activeProjectId, setActiveProjectId, deleteProject, setActiveNav } = useApp();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const genres = ['All', 'Sci-Fi', 'Noir', 'Drama', 'Radio Drama', 'Fantasy', 'Horror'];

  const filteredProjects = projects.filter((p) => {
    if (selectedGenre !== 'All' && p.genre !== selectedGenre) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t: string) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      addToast(`Deleted project "${projectToDelete.title}"`, undefined, 'info');
      setProjectToDelete(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto space-y-6">
      {/* Top Header Controls */}
      <div className="surface-panel rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between border border-border-slate">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="bg-matte-black border border-border-slate rounded py-1.5 pl-9 pr-3 text-xs w-full text-on-surface focus:border-muted-gold outline-none"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-2.5 py-1 rounded text-xs font-display uppercase tracking-wider transition-colors ${
                  selectedGenre === g
                    ? 'bg-muted-gold/20 text-muted-gold border border-muted-gold/40 font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex border border-border-slate rounded p-0.5 bg-matte-black">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded text-xs ${
                viewMode === 'grid' ? 'bg-surface-container-high text-muted-gold' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-base">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded text-xs ${
                viewMode === 'list' ? 'bg-surface-container-high text-muted-gold' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-base">view_list</span>
            </button>
          </div>

          <button
            onClick={onOpenNewProjectModal}
            className="bg-muted-gold text-matte-black px-4 py-2 rounded font-display text-xs font-bold hover:bg-primary-fixed transition-colors shadow flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">add</span>
            New Project
          </button>
        </div>
      </div>

      {/* Projects Display */}
      {filteredProjects.length === 0 ? (
        <div className="surface-panel rounded-xl p-12 text-center text-on-surface-variant flex flex-col items-center">
          <span className="material-symbols-outlined text-5xl mb-2 text-border-slate">folder_off</span>
          <p className="font-display font-semibold text-on-surface text-base">No Projects Found</p>
          <p className="text-xs mt-1 max-w-sm">
            Create a new audio drama production or adjust your filter criteria.
          </p>
          <button
            onClick={onOpenNewProjectModal}
            className="mt-4 bg-muted-gold text-matte-black px-4 py-2 rounded font-display text-xs font-bold"
          >
            Create New Project
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((p) => {
            const isActive = p.id === activeProjectId;
            return (
              <div
                key={p.id}
                className={`rounded-xl p-5 transition-all flex flex-col justify-between group relative border ${
                  isActive
                    ? 'bg-surface-panel border-muted-gold shadow-lg shadow-yellow-950/20'
                    : 'bg-surface-panel/80 border-border-slate hover:border-muted-gold/50'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <Badge variant={p.status === 'completed' ? 'emerald' : 'gold'}>{p.genre}</Badge>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-on-surface-variant font-mono uppercase bg-matte-black px-2 py-0.5 rounded border border-border-slate">
                        {p.status.replace('_', ' ')}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectToDelete(p);
                        }}
                        className="text-on-surface-variant hover:text-red-400 p-1 transition-colors"
                        title="Delete Project"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-on-surface text-base group-hover:text-muted-gold transition-colors line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  {/* Character Badges */}
                  <div className="mt-4 pt-3 border-t border-border-slate/60 flex flex-wrap gap-1">
                    {p.characters.slice(0, 3).map((c: ProjectCharacter) => (
                      <span
                        key={c.id}
                        className="text-[10px] bg-matte-black px-2 py-0.5 rounded border border-border-slate text-on-surface-variant flex items-center gap-1"
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                        {c.name}
                      </span>
                    ))}
                    {p.characters.length > 3 && (
                      <span className="text-[10px] text-on-surface-variant/70 font-mono">
                        +{p.characters.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border-slate flex justify-between items-center text-xs">
                  <div className="text-on-surface-variant text-[11px] font-mono">
                    {p.sceneCount} Scenes • ~{Math.round(p.totalDurationEstimateSeconds / 60)} min
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setActiveProjectId(p.id);
                        setActiveNav('story-editor');
                      }}
                      className="px-3 py-1 bg-surface-container-high border border-border-slate hover:border-muted-gold text-on-surface rounded font-display text-xs font-semibold transition-colors"
                    >
                      Script Editor
                    </button>
                    <button
                      onClick={() => {
                        setActiveProjectId(p.id);
                        addToast(`Loaded active workspace: ${p.title}`, undefined, 'info', 2000);
                      }}
                      className={`px-3 py-1 rounded font-display text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-muted-gold text-matte-black shadow'
                          : 'bg-matte-black text-muted-gold border border-muted-gold/40 hover:bg-muted-gold hover:text-matte-black'
                      }`}
                    >
                      {isActive ? 'Active' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((p) => {
            const isActive = p.id === activeProjectId;
            return (
              <div
                key={p.id}
                className={`p-4 rounded-xl flex items-center justify-between gap-4 border transition-all ${
                  isActive ? 'bg-surface-panel border-muted-gold' : 'bg-surface-panel/80 border-border-slate'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-border-slate flex items-center justify-center text-muted-gold shrink-0 font-bold font-display">
                    {p.title.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-on-surface text-sm truncate">
                        {p.title}
                      </h3>
                      <Badge variant="gold">{p.genre}</Badge>
                    </div>
                    <p className="text-xs text-on-surface-variant truncate mt-0.5">{p.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs font-mono text-on-surface-variant">
                    {p.sceneCount} Scenes • {p.characters.length} Voices
                  </span>
                  <button
                    onClick={() => {
                      setActiveProjectId(p.id);
                      setActiveNav('story-editor');
                    }}
                    className="px-3 py-1.5 bg-surface-container-high border border-border-slate rounded text-xs font-display font-semibold hover:border-muted-gold text-on-surface"
                  >
                    Story Editor
                  </button>
                  <button
                    onClick={() => setProjectToDelete(p)}
                    className="p-1.5 text-on-surface-variant hover:text-red-400"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        title="Confirm Project Deletion"
        subtitle={`Are you sure you want to delete "${projectToDelete?.title}"?`}
        footer={
          <>
            <button
              onClick={() => setProjectToDelete(null)}
              className="px-4 py-2 rounded border border-border-slate text-on-surface text-xs font-display font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 rounded bg-red-600 text-white text-xs font-display font-bold hover:bg-red-500"
            >
              Delete Project
            </button>
          </>
        }
      >
        <p className="text-xs text-on-surface-variant leading-relaxed">
          This action will permanently remove the manuscript script, scene breakdowns, and character voice assignments associated with this project. This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};
