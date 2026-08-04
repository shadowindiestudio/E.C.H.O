import { Project, ProjectStatus, ProjectCharacter, ProjectScene } from '../types';
import { storageService } from './storageService';

const STORAGE_KEY = 'projects_v2';

export const INITIAL_PROJECTS: Project[] = [];

class ProjectService {
  getProjects(): Project[] {
    return storageService.get<Project[]>(STORAGE_KEY, INITIAL_PROJECTS);
  }

  getProjectById(id: string): Project | undefined {
    return this.getProjects().find((p) => p.id === id);
  }

  saveProject(project: Project): Project[] {
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.id === project.id);
    let updated: Project[];

    if (index >= 0) {
      updated = [...projects];
      updated[index] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      updated = [{ ...project, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...projects];
    }

    storageService.set(STORAGE_KEY, updated);
    return updated;
  }

  deleteProject(id: string): Project[] {
    const projects = this.getProjects().filter((p) => p.id !== id);
    storageService.set(STORAGE_KEY, projects);
    return projects;
  }

  createProject(
    title: string,
    description: string,
    genre: Project['genre'],
    targetAiProviderId: string = 'provider-ollama',
    targetTtsProviderId: string = 'tts-piper'
  ): Project {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title,
      description,
      genre,
      status: 'draft',
      targetAiProviderId,
      targetTtsProviderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sceneCount: 1,
      totalDurationEstimateSeconds: 120,
      tags: [genre, 'New Project'],
      characters: [
        { id: `c-${Date.now()}-1`, name: 'Lead Character', role: 'Protagonist', color: '#D4AF37' },
        { id: `c-${Date.now()}-2`, name: 'Narrator', role: 'Narrator', color: '#60A5FA' },
      ],
      scenes: [
        {
          id: `s-${Date.now()}-1`,
          sceneNumber: 1,
          title: 'Scene 1: Introduction',
          location: 'Main Location',
          description: 'Initial scene opening lines.',
          rawScript: 'NARRATOR: Welcome to the prelude of our story.',
          characterIds: [],
          durationEstimateSeconds: 60,
          status: 'draft',
        },
      ],
    };

    this.saveProject(newProj);
    return newProj;
  }
}

export const projectService = new ProjectService();
