export type EmotionType = 
  | 'neutral' 
  | 'intense' 
  | 'whisper' 
  | 'fearful' 
  | 'joyful' 
  | 'sorrowful' 
  | 'commanding' 
  | 'sarcastic'
  | 'angry'
  | 'excited'
  | 'sad';

export interface EmotionProfile {
  primary: EmotionType;
  secondary?: EmotionType;
  intensity: number; // 0 to 1
}

export interface StoryCharacter {
  id: string;
  name: string;
  aliases: string[];
  role: 'Protagonist' | 'Antagonist' | 'Supporting' | 'Narrator' | 'Minor';
  description: string;
  gender?: 'Male' | 'Female' | 'Non-binary' | 'Unknown';
  assignedVoiceId?: string;
  emotionProfile?: EmotionProfile;
  speakingStatistics: {
    dialogueCount: number;
    wordCount: number;
    averageLineLength: number;
  };
  color: string;
}

export interface Dialogue {
  id: string;
  type: 'dialogue';
  characterId?: string;
  characterName: string;
  text: string;
  emotion: EmotionProfile;
  pacingPunctuation: string;
  suggestedPauseMs: number;
  generationTaskId?: string;
}

export interface Narration {
  id: string;
  type: 'narration';
  text: string;
  mood: string;
  generationTaskId?: string;
}

export type ParagraphElement = Dialogue | Narration;

export interface Paragraph {
  id: string;
  paragraphNumber: number;
  elements: ParagraphElement[];
  rawText: string;
}

export interface StoryScene {
  id: string;
  sceneNumber: number;
  title: string;
  summary: string;
  mood: string;
  paragraphs: Paragraph[];
  characterIds: string[]; // Characters present in the scene
  estimatedDurationSeconds: number;
  generationStatus: 'draft' | 'queued' | 'processing' | 'completed' | 'failed';
}

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  scenes: StoryScene[];
}

export interface Story {
  id: string;
  projectId: string;
  title: string;
  rawText: string;
  chapters: Chapter[];
  characters: StoryCharacter[];
  wordCount: number;
  characterCount: number;
  estimatedReadingTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScriptLine {
  id: string;
  lineNumber: number;
  characterName: string;
  characterId?: string;
  dialogueText: string;
  detectedEmotion: EmotionType;
  pacingPunctuation: string;
  suggestedPauseMs: number;
  assignedVoiceId?: string;
  audioGenerated: boolean;
  audioUrl?: string;
}

export interface StoryAnalysisResult {
  detectedCharacters: Array<{
    name: string;
    lineCount: number;
    suggestedCategory: string;
  }>;
  emotionBreakdown: Record<EmotionType, number>;
  totalWordCount: number;
  estimatedSpeechDurationSeconds: number;
}
