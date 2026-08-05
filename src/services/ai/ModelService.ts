import { Model, ProviderConfiguration } from '../../types';

export class ModelService {
  /**
   * TODO: Implement actual model fetching logic per provider.
   */
  async fetchAvailableModels(config: ProviderConfiguration): Promise<Model[]> {
    // Placeholder implementation
    const defaultCapabilities = {
      supportsStreaming: true,
      supportsVision: false,
      supportsFunctionCalling: false,
      supportsJsonMode: false,
      supportsAudio: false
    };

    if (config.providerId === 'ollama') {
      return [
        { id: 'llama3:8b', name: 'Llama 3 (8B)', providerId: 'ollama', capabilities: defaultCapabilities, tags: ['local', 'fast'] },
        { id: 'mistral:7b', name: 'Mistral (7B)', providerId: 'ollama', capabilities: defaultCapabilities, tags: ['local'] },
      ];
    }
    
    if (config.providerId === 'openai') {
      return [
        { id: 'gpt-4o', name: 'GPT-4o', providerId: 'openai', capabilities: { ...defaultCapabilities, supportsVision: true, supportsFunctionCalling: true, supportsJsonMode: true }, tags: ['advanced', 'vision'] },
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini', providerId: 'openai', capabilities: { ...defaultCapabilities, supportsFunctionCalling: true, supportsJsonMode: true }, tags: ['fast', 'cheap'] },
      ];
    }
    
    if (config.providerId === 'gemini') {
      return [
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', providerId: 'gemini', capabilities: { ...defaultCapabilities, supportsVision: true, supportsFunctionCalling: true }, tags: ['advanced', 'long-context'] },
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', providerId: 'gemini', capabilities: { ...defaultCapabilities, supportsVision: true }, tags: ['fast'] },
      ];
    }

    return [
      { id: 'default-model', name: 'Default Model', providerId: config.providerId, capabilities: defaultCapabilities, tags: [] }
    ];
  }

  searchModels(models: Model[], query: string): Model[] {
    const q = query.toLowerCase();
    return models.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.id.toLowerCase().includes(q) ||
      m.tags.some(t => t.toLowerCase().includes(q))
    );
  }
}

export const modelService = new ModelService();
