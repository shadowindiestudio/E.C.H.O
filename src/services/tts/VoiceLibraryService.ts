import { Voice } from '../../types';
import { storageService } from '../storageService';

const VOICE_LIBRARY_STORAGE_KEY = 'tts_voice_library_v1';

export class VoiceLibraryService {
  private defaultVoices: Voice[] = [
    {
      id: 'default-narrator',
      name: 'Default Narrator',
      description: 'A clear, neutral voice perfect for general narration.',
      avatar: 'https://ui-avatars.com/api/?name=Narrator&background=random',
      language: 'en-US',
      category: 'Narrative',
      isFavorite: false,
      stability: 75,
      similarity: 85,
      styleExaggeration: 0,
      tags: ['neutral', 'clear', 'professional'],
      createdAt: new Date().toISOString(),
      providerId: 'elevenlabs',
    }
  ];

  getAllVoices(): Voice[] {
    const saved = storageService.get<Voice[]>(VOICE_LIBRARY_STORAGE_KEY, []);
    if (saved.length === 0) {
       this.saveVoices(this.defaultVoices);
       return this.defaultVoices;
    }
    return saved;
  }

  getVoice(id: string): Voice | undefined {
    return this.getAllVoices().find(v => v.id === id);
  }

  saveVoices(voices: Voice[]): void {
    storageService.set(VOICE_LIBRARY_STORAGE_KEY, voices);
  }

  addVoice(voice: Voice): void {
    const voices = this.getAllVoices();
    voices.push(voice);
    this.saveVoices(voices);
  }

  updateVoice(updatedVoice: Voice): void {
    const voices = this.getAllVoices();
    const index = voices.findIndex(v => v.id === updatedVoice.id);
    if (index >= 0) {
      voices[index] = updatedVoice;
      this.saveVoices(voices);
    }
  }

  deleteVoice(id: string): void {
    const voices = this.getAllVoices().filter(v => v.id !== id);
    this.saveVoices(voices);
  }

  searchVoices(query: string, category?: string, isFavorite?: boolean): Voice[] {
    let voices = this.getAllVoices();
    
    if (category && category !== 'all') {
      voices = voices.filter(v => v.category === category);
    }
    
    if (isFavorite) {
      voices = voices.filter(v => v.isFavorite);
    }

    if (query) {
      const q = query.toLowerCase();
      voices = voices.filter(v => 
        v.name.toLowerCase().includes(q) || 
        v.description.toLowerCase().includes(q) ||
        v.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return voices;
  }
}

export const voiceLibraryService = new VoiceLibraryService();
