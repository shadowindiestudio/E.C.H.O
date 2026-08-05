import { Provider } from '../../types';

export class ProviderRegistry {
  private providers: Map<string, Provider> = new Map();

  constructor() {
    this.registerDefaultProviders();
  }

  private registerDefaultProviders() {
    const defaultProviders: Provider[] = [
      { id: 'ollama', name: 'Ollama', category: 'local', description: 'Run LLMs locally' },
      { id: 'lmstudio', name: 'LM Studio', category: 'local', description: 'Local LLM GUI' },
      { id: 'vllm', name: 'vLLM', category: 'local', description: 'High-throughput local server' },
      { id: 'llamacpp', name: 'llama.cpp', category: 'local', description: 'Lightweight local server' },
      { id: 'openai', name: 'OpenAI', category: 'cloud', description: 'GPT-4 and compatible models' },
      { id: 'gemini', name: 'Google Gemini', category: 'cloud', description: 'Gemini Pro and Flash models' },
      { id: 'anthropic', name: 'Anthropic Claude', category: 'cloud', description: 'Claude 3 models' },
      { id: 'openrouter', name: 'OpenRouter', category: 'cloud', description: 'Unified API for multiple models' },
      { id: 'groq', name: 'Groq', category: 'cloud', description: 'LPU Inference Engine' },
      { id: 'together', name: 'Together AI', category: 'cloud', description: 'Fast open-source model inference' },
      { id: 'fireworks', name: 'Fireworks AI', category: 'cloud', description: 'High-speed generative AI platform' },
      { id: 'mistral', name: 'Mistral AI', category: 'cloud', description: 'Open weight models' },
      { id: 'deepseek', name: 'DeepSeek', category: 'cloud', description: 'DeepSeek LLM models' },
      { id: 'xai', name: 'xAI', category: 'cloud', description: 'Grok models' },
      { id: 'azure_openai', name: 'Azure OpenAI', category: 'cloud', description: 'Enterprise OpenAI service' },
      { id: 'openai_compatible', name: 'OpenAI Compatible Endpoint', category: 'custom', description: 'Any API matching OpenAI spec' },
      { id: 'generic_rest', name: 'Generic REST API Endpoint', category: 'custom', description: 'Custom JSON REST payload mapping' },
    ];

    defaultProviders.forEach(p => this.providers.set(p.id, p));
  }

  getProvider(id: string): Provider | undefined {
    return this.providers.get(id);
  }

  getAllProviders(): Provider[] {
    return Array.from(this.providers.values());
  }

  registerProvider(provider: Provider) {
    this.providers.set(provider.id, provider);
  }
}

export const providerRegistry = new ProviderRegistry();
