import { StoryCharacter, Voice } from '../../types';

export class VoiceAssignmentEngine {
  /**
   * Naive voice assignment based on character characteristics vs voice metadata.
   */
  assignVoices(characters: StoryCharacter[], availableVoices: Voice[]): void {
    if (availableVoices.length === 0) return;

    let voiceIndex = 0;
    for (const char of characters) {
      if (!char.assignedVoiceId) {
        // Fallback round-robin assignment
        char.assignedVoiceId = availableVoices[voiceIndex % availableVoices.length].id;
        voiceIndex++;
      }
    }
  }
}
