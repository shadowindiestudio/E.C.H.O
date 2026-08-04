import { Story, Voice, GenerationTask } from '../../types';
import { StoryParser } from './StoryParser';
import { SceneParser } from './SceneParser';
import { CharacterDetector } from './CharacterDetector';
import { EmotionAnalyzer } from './EmotionAnalyzer';
import { VoiceAssignmentEngine } from './VoiceAssignmentEngine';
import { ProcessingStatusManager, ProgressCallback } from './ProcessingStatusManager';
import { GenerationQueueManager } from './GenerationQueueManager';
import { DialogueParser } from './DialogueParser';


export class PipelineOrchestrator {
  private dialogueParser = new DialogueParser();
  private storyParser = new StoryParser(this.dialogueParser);
  private sceneParser = new SceneParser();
  private charDetector = new CharacterDetector();
  private emotionAnalyzer = new EmotionAnalyzer();
  private voiceEngine = new VoiceAssignmentEngine();
  private statusManager = new ProcessingStatusManager();
  private queueManager = new GenerationQueueManager();

  subscribeToProgress(callback: ProgressCallback) {
    return this.statusManager.subscribe(callback);
  }

  async processStory(story: Story, availableVoices: Voice[]): Promise<Story> {
    try {
      // 1. Validation
      this.statusManager.update('validating', 10, 'Validating story text...');
      const validation = this.storyParser.validateStory(story.rawText);
      if (!validation.isValid) throw new Error(validation.error);
      
      // Artificial delay for UI feedback
      await this.delay(500);

      // 2. Structure (Paragraphs -> Scenes -> Chapters)
      this.statusManager.update('chapter_detection', 30, 'Detecting chapters and scenes...');
      const paragraphs = this.storyParser.detectParagraphs(story.rawText);
      story.chapters = this.sceneParser.detectChaptersAndScenes(paragraphs);
      await this.delay(500);

      // 3. Characters
      this.statusManager.update('character_detection', 50, 'Extracting characters...');
      story.characters = this.charDetector.detectCharacters(paragraphs);
      await this.delay(500);

      // 4. Emotions
      this.statusManager.update('emotion_detection', 70, 'Analyzing dialogue emotion and pacing...');
      this.emotionAnalyzer.analyzeEmotions(paragraphs);
      await this.delay(500);

      // 5. Voice Assignment
      this.statusManager.update('voice_mapping', 85, 'Assigning AI voices to characters...');
      this.voiceEngine.assignVoices(story.characters, availableVoices);
      await this.delay(500);

      // 6. Generate Tasks
      this.statusManager.update('task_generation', 95, 'Queuing generation tasks...');
      this.createGenerationTasks(story);
      
      // Calculate derived stats
      story.wordCount = story.rawText.split(/\s+/).length;
      story.characterCount = story.characters.length;
      story.estimatedReadingTimeMinutes = Math.ceil(story.wordCount / 150);
      story.updatedAt = new Date().toISOString();

      this.statusManager.complete();
      return story;
    } catch (e: any) {
      this.statusManager.fail(e.message);
      throw e;
    }
  }

  private createGenerationTasks(story: Story) {
    const tasks: GenerationTask[] = [];
    
    for (const chapter of story.chapters) {
      for (const scene of chapter.scenes) {
        for (const p of scene.paragraphs) {
          for (const el of p.elements) {
            tasks.push({
              id: crypto.randomUUID(),
              projectId: story.projectId,
              storyId: story.id,
              elementId: el.id,
              elementType: el.type,
              status: 'queued',
              priority: 'normal',
              payload: el, // Store the raw element data to guide the AI
              createdAt: new Date().toISOString(),
              retryCount: 0
            });
          }
        }
      }
    }
    this.queueManager.enqueue(tasks);
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const pipelineOrchestrator = new PipelineOrchestrator();
