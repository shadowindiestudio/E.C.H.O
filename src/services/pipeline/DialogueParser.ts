import { ParagraphElement, Dialogue, Narration, EmotionProfile } from '../../types';


export class DialogueParser {
  /**
   * Parses a raw text block into Narration and Dialogue elements.
   * Basic heuristic fallback implementation.
   */
  parseElements(text: string): ParagraphElement[] {
    const elements: ParagraphElement[] = [];
    
    // Very basic heuristic for standard "Name: Dialogue" format
    const match = text.match(/^([A-Z\s\.]+):\s*(.*)$/i);
    
    if (match) {
      const charName = match[1].trim();
      const dialogue = match[2].trim();
      
      const defaultEmotion: EmotionProfile = { primary: 'neutral', intensity: 0.5 };
      elements.push({
        id: crypto.randomUUID(),
        type: 'dialogue',
        characterName: charName,
        text: dialogue,
        emotion: defaultEmotion,
        pacingPunctuation: '.',
        suggestedPauseMs: 500,
      } as Dialogue);
    } else {
      elements.push({
        id: crypto.randomUUID(),
        type: 'narration',
        text: text,
        mood: 'neutral',
      } as Narration);
    }

    return elements;
  }
}
