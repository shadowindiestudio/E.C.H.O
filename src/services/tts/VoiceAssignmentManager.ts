import { VoiceAssignment } from '../../types';
import { storageService } from '../storageService';

const VOICE_ASSIGNMENTS_KEY = 'tts_voice_assignments_v1';

export class VoiceAssignmentManager {
  
  getAssignments(): VoiceAssignment[] {
    return storageService.get<VoiceAssignment[]>(VOICE_ASSIGNMENTS_KEY, []);
  }

  getAssignment(characterId: string): VoiceAssignment | undefined {
    return this.getAssignments().find(a => a.characterId === characterId);
  }

  assignVoice(assignment: VoiceAssignment): void {
    const assignments = this.getAssignments();
    const index = assignments.findIndex(a => a.characterId === assignment.characterId);
    
    if (index >= 0) {
      assignments[index] = assignment;
    } else {
      assignments.push(assignment);
    }
    
    storageService.set(VOICE_ASSIGNMENTS_KEY, assignments);
  }

  removeAssignment(characterId: string): void {
    const assignments = this.getAssignments().filter(a => a.characterId !== characterId);
    storageService.set(VOICE_ASSIGNMENTS_KEY, assignments);
  }
}

export const voiceAssignmentManager = new VoiceAssignmentManager();
