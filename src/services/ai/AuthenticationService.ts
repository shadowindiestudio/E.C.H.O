import { ProviderConfiguration } from '../../types';

export class AuthenticationService {
  /**
   * TODO: Implement real authentication header generation for different providers.
   */
  getAuthHeaders(config: ProviderConfiguration): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (config.apiKey) {
      if (config.providerId === 'anthropic') {
        headers['x-api-key'] = config.apiKey;
        headers['anthropic-version'] = '2023-06-01';
      } else if (config.providerId === 'gemini') {
        // Gemini often uses query param ?key= but can also use headers
        headers['x-goog-api-key'] = config.apiKey;
      } else {
        headers['Authorization'] = `Bearer ${config.apiKey}`;
      }
    }

    if (config.organizationId) {
      if (config.providerId === 'openai') {
        headers['OpenAI-Organization'] = config.organizationId;
      }
    }

    return headers;
  }

  async validateAuthentication(config: ProviderConfiguration): Promise<boolean> {
    // TODO: Implement actual validation ping to the provider
    if (config.providerId === 'ollama' || config.providerId === 'lmstudio') return true; // Local usually needs no auth
    if (!config.apiKey || config.apiKey.trim() === '') return false;
    return true;
  }
}

export const authenticationService = new AuthenticationService();
