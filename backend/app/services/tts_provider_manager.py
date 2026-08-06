from typing import Dict, Optional, List
from app.providers.tts.base import BaseTTSProvider
from app.providers.tts.elevenlabs import ElevenLabsProvider
from app.providers.tts.openai import OpenAITTSProvider
from app.providers.tts.local import LocalTTSProvider

class TTSProviderManager:
    """
    Registry pattern to load and manage TTS provider clients.
    """
    def __init__(self):
        self._providers: Dict[str, BaseTTSProvider] = {}

    def register(self, provider_id: str, provider: BaseTTSProvider):
        self._providers[provider_id] = provider

    def get(self, provider_id: str) -> Optional[BaseTTSProvider]:
        return self._providers.get(provider_id)

    def remove(self, provider_id: str):
        if provider_id in self._providers:
            del self._providers[provider_id]

    def list_providers(self) -> List[str]:
        return list(self._providers.keys())
    
    def clear(self):
        self._providers.clear()

    @staticmethod
    def create_provider(provider_type: str, provider_id: str, api_key: str = None, base_url: str = None) -> BaseTTSProvider:
        if provider_type == "elevenlabs":
            return ElevenLabsProvider(provider_id, api_key, base_url or "https://api.elevenlabs.io/v1")
        elif provider_type == "openai":
            return OpenAITTSProvider(provider_id, api_key, base_url or "https://api.openai.com/v1")
        elif provider_type in ["piper", "coqui", "xtts", "styletts2", "kokoro", "chatterbox", "f5-tts", "local"]:
            return LocalTTSProvider(provider_id, api_key, base_url or "http://localhost:5000")
        else:
            return LocalTTSProvider(provider_id, api_key, base_url)

tts_provider_manager = TTSProviderManager()
