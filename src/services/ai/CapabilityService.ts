import { ProviderCapability } from '../../types';

export class CapabilityService {
  /**
   * TODO: Compare required capabilities against what a model offers
   */
  supportsRequirements(modelCapabilities: ProviderCapability, required: Partial<ProviderCapability>): boolean {
    if (required.supportsStreaming && !modelCapabilities.supportsStreaming) return false;
    if (required.supportsVision && !modelCapabilities.supportsVision) return false;
    if (required.supportsFunctionCalling && !modelCapabilities.supportsFunctionCalling) return false;
    if (required.supportsJsonMode && !modelCapabilities.supportsJsonMode) return false;
    if (required.supportsAudio && !modelCapabilities.supportsAudio) return false;
    
    return true;
  }
}

export const capabilityService = new CapabilityService();
