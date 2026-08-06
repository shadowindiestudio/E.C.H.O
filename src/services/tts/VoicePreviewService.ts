import { Voice, AudioBuffer, TTSProviderConfiguration } from '../../types';
import { audioCacheService } from './AudioCacheService';
import { ttsProviderManager } from './TTSProviderManager';

export class VoicePreviewService {
  /**
   * Generates a voice preview using the selected TTS provider.
   */
  async generatePreview(voice: Voice, text: string = "Hello, this is a voice preview."): Promise<AudioBuffer> {
    const textHash = typeof btoa !== 'undefined' ? btoa(encodeURIComponent(text)).slice(0, 15) : encodeURIComponent(text).slice(0, 15);
    const previewId = `preview_${voice.id}_${textHash}`;
    
    // Check cache
    if (audioCacheService.hasAudio(previewId)) {
       return audioCacheService.getAudio(previewId)!;
    }

    const providerId = voice.providerId;
    if (!providerId) {
      throw new Error(`Voice '${voice.name}' has no provider configured.`);
    }

    const config = ttsProviderManager.getConfiguration(providerId);
    if (!config || !config.enabled) {
      throw new Error(`TTS Provider '${providerId}' is not configured or is disabled.`);
    }

    let audioBlob: Blob;
    try {
      audioBlob = await this.fetchWithRetry(config, voice, text);
    } catch (err: any) {
      throw new Error(`TTS generation failed: ${err.message}`);
    }

    const blobUrl = URL.createObjectURL(audioBlob);
    
    const buffer: AudioBuffer = {
      id: previewId,
      blobUrl,
      durationMs: 3000, // Estimated duration; a real implementation might decode the audio to get exact duration
      sampleRate: 44100,
      fileSizeMb: audioBlob.size / (1024 * 1024),
      metadata: { text, voiceId: voice.id, providerId },
      createdAt: new Date().toISOString()
    };

    audioCacheService.cacheAudio(previewId, buffer);
    return buffer;
  }

  private async fetchWithRetry(config: TTSProviderConfiguration, voice: Voice, text: string): Promise<Blob> {
    const maxRetries = config.retryCount || 1;
    let lastError: any;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await this.fetchFromProvider(config, voice, text);
      } catch (err: any) {
        lastError = err;
        if (err.name === 'AbortError' || err.message.includes('HTTP 401') || err.message.includes('HTTP 403')) {
          throw err; // Don't retry auth errors or manual aborts
        }
        if (i < maxRetries) {
           await new Promise(res => setTimeout(res, 1000 * Math.pow(2, i))); // exponential backoff
        }
      }
    }
    throw lastError;
  }

  private async fetchFromProvider(config: TTSProviderConfiguration, voice: Voice, text: string): Promise<Blob> {
    const providerId = config.providerId;
    const abortController = new AbortController();
    const timeoutMs = config.timeoutMs || 30000;
    const timeout = setTimeout(() => abortController.abort(), timeoutMs);
    
    let response: Response;
    
    try {
      if (providerId === 'elevenlabs') {
        const voiceId = voice.providerVoiceId || config.defaultVoiceId || 'pNInz6obpgDQGcFmaJcg';
        response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': config.apiKey || ''
          },
          body: JSON.stringify({
            text,
            model_id: config.defaultModelId || 'eleven_monolingual_v1',
            voice_settings: {
              stability: (voice.stability || 75) / 100,
              similarity_boost: (voice.similarity || 85) / 100,
              style: (voice.styleExaggeration || 30) / 100,
              use_speaker_boost: true
            }
          }),
          signal: abortController.signal
        });
      } else if (providerId === 'openai_tts' || providerId === 'openai_compatible_tts') {
        const baseUrl = config.baseUrl || 'https://api.openai.com/v1';
        response = await fetch(`${baseUrl.replace(/\/$/, '')}/audio/speech`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          },
          body: JSON.stringify({
            model: config.defaultModelId || 'tts-1',
            input: text,
            voice: voice.providerVoiceId || config.defaultVoiceId || 'alloy',
            response_format: 'mp3',
            speed: voice.speed || 1.0
          }),
          signal: abortController.signal
        });
      } else if (providerId === 'google_cloud_tts') {
        response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${config.apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            input: { text },
            voice: { 
              name: voice.providerVoiceId || config.defaultVoiceId || 'en-US-Standard-D',
              languageCode: voice.language || 'en-US' 
            },
            audioConfig: { audioEncoding: 'MP3' }
          }),
          signal: abortController.signal
        });
      } else if (providerId === 'azure_speech') {
        const region = config.baseUrl || 'eastus';
        const url = region.includes('http') ? region : `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': config.apiKey || '',
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-24khz-160kbitrate-mono-mp3'
          },
          body: `<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' name='${voice.providerVoiceId || config.defaultVoiceId || 'en-US-JennyNeural'}'>${text}</voice></speak>`,
          signal: abortController.signal
        });
      } else {
        // generic or local (piper, coqui, xtts, etc.)
        const url = config.baseUrl || 'http://localhost:5002/api/tts';
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (config.apiKey) {
          headers['Authorization'] = `Bearer ${config.apiKey}`;
        }
        response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            text,
            voice: voice.providerVoiceId || config.defaultVoiceId,
            speed: voice.speed || 1.0,
            pitch: voice.pitch || 0
          }),
          signal: abortController.signal
        });
      }
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const errText = await response.text().catch(() => 'Unknown error');
      throw new Error(`HTTP ${response.status}: ${errText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      if (data.audioContent) {
        return this.base64ToBlob(data.audioContent, 'audio/mpeg');
      }
      if (data.audio) {
        return this.base64ToBlob(data.audio, 'audio/mpeg');
      }
      throw new Error('JSON response did not contain expected audio data (audioContent or audio).');
    }

    return await response.blob();
  }

  private base64ToBlob(base64: string, type: string): Blob {
    const binStr = atob(base64);
    const len = binStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binStr.charCodeAt(i);
    }
    return new Blob([bytes], { type });
  }
}

export const voicePreviewService = new VoicePreviewService();
