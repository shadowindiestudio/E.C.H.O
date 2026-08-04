import { Paragraph, StoryCharacter, Dialogue } from '../../types';


export class CharacterDetector {
  /**
   * Extracts characters based on dialogue attribution.
   */
  detectCharacters(paragraphs: Paragraph[]): StoryCharacter[] {
    const characterMap = new Map<string, StoryCharacter>();

    for (const p of paragraphs) {
      for (const el of p.elements) {
        if (el.type === 'dialogue') {
          const d = el as Dialogue;
          const normalizedName = d.characterName.toUpperCase();
          
          if (!characterMap.has(normalizedName)) {
            characterMap.set(normalizedName, {
              id: crypto.randomUUID(),
              name: d.characterName,
              aliases: [normalizedName],
              role: 'Supporting', // default, to be refined by AI
              description: 'Auto-detected character',
              speakingStatistics: {
                dialogueCount: 0,
                wordCount: 0,
                averageLineLength: 0,
              },
              color: this.assignColor(characterMap.size),
            });
          }

          const char = characterMap.get(normalizedName)!;
          char.speakingStatistics.dialogueCount++;
          char.speakingStatistics.wordCount += d.text.split(' ').length;
        }
      }
    }

    return Array.from(characterMap.values());
  }

  private assignColor(index: number): string {
    const colors = ['#D4AF37', '#60A5FA', '#F472B6', '#34D399', '#A78BFA', '#FBBF24'];
    return colors[index % colors.length];
  }
}
