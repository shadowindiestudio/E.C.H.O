import { Paragraph } from '../../types';
import { DialogueParser } from './DialogueParser';


export class StoryParser {
  constructor(private dialogueParser: DialogueParser) {}

  /**
   * Splits raw text into paragraph blocks
   */
  detectParagraphs(rawText: string): Paragraph[] {
    const blocks = rawText.split(/\n\s*\n/).filter(b => b.trim().length > 0);
    
    return blocks.map((block, index) => {
      const elements = this.dialogueParser.parseElements(block);
      
      return {
        id: crypto.randomUUID(),
        paragraphNumber: index + 1,
        elements,
        rawText: block,
      };
    });
  }

  validateStory(rawText: string): { isValid: boolean; error?: string } {
    if (!rawText || rawText.trim().length === 0) {
      return { isValid: false, error: 'Story text cannot be empty.' };
    }
    // More complex validation can be added here
    return { isValid: true };
  }
}
