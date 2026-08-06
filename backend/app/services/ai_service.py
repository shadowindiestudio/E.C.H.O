from typing import AsyncGenerator, Dict, Any, List
from fastapi import HTTPException
from app.schemas.ai import AIRequest, AIResponse, AIProviderConfig
from app.services.provider_manager import ai_provider_manager

class AIService:
    @staticmethod
    def configure_provider(config: AIProviderConfig, provider_type: str):
        if not config.enabled:
            ai_provider_manager.remove(config.provider_id)
            return
            
        provider = ai_provider_manager.create_provider(
            provider_type=provider_type,
            provider_id=config.provider_id,
            api_key=config.api_key,
            base_url=config.base_url
        )
        ai_provider_manager.register(config.provider_id, provider)

    @staticmethod
    def get_provider(provider_id: str):
        provider = ai_provider_manager.get(provider_id)
        if not provider:
            raise HTTPException(status_code=404, detail=f"Provider {provider_id} not found or not configured")
        return provider

    @staticmethod
    async def generate(provider_id: str, request: AIRequest) -> AIResponse:
        provider = AIService.get_provider(provider_id)
        try:
            return await provider.generate_content(request)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

    @staticmethod
    async def generate_stream(provider_id: str, request: AIRequest) -> AsyncGenerator[str, None]:
        provider = AIService.get_provider(provider_id)
        try:
            async for chunk in provider.generate_content_stream(request):
                yield chunk
        except Exception as e:
            yield f"Error: {str(e)}"

    @staticmethod
    async def get_models(provider_id: str) -> List[str]:
        provider = AIService.get_provider(provider_id)
        try:
            return await provider.get_available_models()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to fetch models: {str(e)}")

    @staticmethod
    async def check_health(provider_id: str) -> Dict[str, Any]:
        provider = AIService.get_provider(provider_id)
        try:
            is_healthy = await provider.check_health()
            return {"provider_id": provider_id, "status": "healthy" if is_healthy else "unhealthy"}
        except Exception as e:
            return {"provider_id": provider_id, "status": "error", "error": str(e)}
