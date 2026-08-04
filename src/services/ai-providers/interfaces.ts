import { EmotionProfile, StoryCharacter, StoryScene, Chapter } from '../../types';

export interface StoryAnalysisProvider {
  /**
   * TODO: Implement AI generation (e.g. Gemini, OpenAI) to identify chapters and scenes from raw text.
   */
  detectStructure(rawText: string): Promise<{ chapters: Chapter[] }>;
}

export interface CharacterDetectionProvider {
  /**
   * TODO: Implement AI generation to detect unique characters, their traits, aliases, and speaking styles.
   */
  detectCharacters(rawText: string): Promise<StoryCharacter[]>;
}

export interface EmotionProvider {
  /**
   * TODO: Implement AI generation to detect complex emotions in text (dialogue and narration).
   */
  analyzeEmotion(text: string, context?: string): Promise<EmotionProfile>;
}

export interface VoiceAssignmentProvider {
  /**
   * TODO: Implement AI generation to match detected character traits and emotions to the most appropriate voice ID.
   */
  assignVoice(character: StoryCharacter, availableVoiceIds: string[]): Promise<string>;
}
