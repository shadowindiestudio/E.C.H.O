import { SceneTimelineTrack, AudioStem, RenderJob } from '../types';

export class AudioPipelineService {
  /**
   * Generates scene multi-track structure with voice, SFX, ambient, and score tracks.
   */
  getSceneTracks(sceneId?: string): SceneTimelineTrack[] {
    if (!sceneId) return [];
    return [
      {
        id: `track-voice-${sceneId}`,
        name: 'Voice Dialogue',
        color: '#D4AF37',
        stems: [],
      },
      {
        id: `track-ambient-${sceneId}`,
        name: 'Atmospheric Bed',
        color: '#60A5FA',
        stems: [],
      },
      {
        id: `track-sfx-${sceneId}`,
        name: 'Sound Effects (SFX)',
        color: '#F472B6',
        stems: [],
      },
    ];
  }
}

export class ExportService {
  getInitialRenderJobs(): RenderJob[] {
    return [];
  }
}

export const audioPipelineService = new AudioPipelineService();
export const exportService = new ExportService();
