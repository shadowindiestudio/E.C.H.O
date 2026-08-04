import { Story } from '../../types';
import { storageService } from '../storageService';

const STORIES_STORAGE_KEY = 'stories_v1';

export class StoryService {
  getStories(): Story[] {
    return storageService.get<Story[]>(STORIES_STORAGE_KEY, []);
  }

  getStory(id: string): Story | undefined {
    return this.getStories().find(s => s.id === id);
  }

  saveStory(story: Story): void {
    const stories = this.getStories();
    const existingIndex = stories.findIndex(s => s.id === story.id);
    
    if (existingIndex >= 0) {
      stories[existingIndex] = story;
    } else {
      stories.push(story);
    }
    
    storageService.set(STORIES_STORAGE_KEY, stories);
  }

  deleteStory(id: string): void {
    const stories = this.getStories().filter(s => s.id !== id);
    storageService.set(STORIES_STORAGE_KEY, stories);
  }
}

export const storyService = new StoryService();
