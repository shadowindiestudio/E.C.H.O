from typing import Dict, Optional, List
from app.providers.base import BaseAIProvider
from app.providers.openai import OpenAICompatibleProvider
from app.providers.gemini import GeminiProvider
from app.providers.anthropic import AnthropicProvider

class ProviderManager:
    """
    Registry pattern to load and manage AI provider clients.
    """
    def __init__(self):
        self._providers: Dict[str, BaseAIProvider] = {}

    def register(self, provider_id: str, provider: BaseAIProvider):
        self._providers[provider_id] = provider

    def get(self, provider_id: str) -> Optional[BaseAIProvider]:
        return self._providers.get(provider_id)

    def remove(self, provider_id: str):
        if provider_id in self._providers:
            del self._providers[provider_id]

    def list_providers(self) -> List[str]:
        return list(self._providers.keys())
    
    def clear(self):
        self._providers.clear()

    @staticmethod
    def create_provider(provider_type: str, provider_id: str, api_key: str, base_url: Optional[str] = None) -> BaseAIProvider:
        if provider_type == "openai":
            return OpenAICompatibleProvider(provider_id, api_key, base_url or "https://api.openai.com/v1")
        elif provider_type == "gemini":
            return GeminiProvider(provider_id, api_key, base_url or "https://generativelanguage.googleapis.com/v1beta/models")
        elif provider_type == "anthropic":
            return AnthropicProvider(provider_id, api_key, base_url or "https://api.anthropic.com/v1")
        elif provider_type in ["ollama", "openrouter", "custom"]:
            return OpenAICompatibleProvider(provider_id, api_key, base_url)
        else:
            raise ValueError(f"Unknown provider type: {provider_type}")

ai_provider_manager = ProviderManager()
