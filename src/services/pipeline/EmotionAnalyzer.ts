import { Paragraph, Dialogue, EmotionProfile } from '../../types';

export class EmotionAnalyzer {
  /**
   * Applies basic heuristics for emotion detection.
   * Placeholder for true AI provider logic.
   */
  analyzeEmotions(paragraphs: Paragraph[]): void {
    for (const p of paragraphs) {
      for (const el of p.elements) {
        if (el.type === 'dialogue') {
          const d = el as Dialogue;
          d.emotion = this.guessEmotion(d.text);
        }
      }
    }
  }

  private guessEmotion(text: string): EmotionProfile {
    const txt = text.toLowerCase();
    if (txt.includes('!')) {
      if (txt.includes('damn') || txt.includes('hell') || txt.includes('stop')) {
        return { primary: 'angry', intensity: 0.8 };
      }
      return { primary: 'excited', intensity: 0.7 };
    }
    if (txt.includes('...') || txt.includes('sigh')) {
      return { primary: 'sad', intensity: 0.6 };
    }
    if (txt.includes('?')) {
      return { primary: 'intense', intensity: 0.5 }; // Confusion/Inquiry
    }
    return { primary: 'neutral', intensity: 0.5 };
  }
}
