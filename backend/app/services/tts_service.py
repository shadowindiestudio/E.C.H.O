from typing import AsyncGenerator, Dict, Any, List
from fastapi import HTTPException
from app.schemas.tts import TTSRequest, TTSVoice, TTSProviderConfig
from app.services.tts_provider_manager import tts_provider_manager

class TTSService:
    @staticmethod
    def configure_provider(config: TTSProviderConfig):
        if not config.enabled:
            tts_provider_manager.remove(config.provider_id)
            return
            
        provider = tts_provider_manager.create_provider(
            provider_type=config.provider_type,
            provider_id=config.provider_id,
            api_key=config.api_key,
            base_url=config.base_url
        )
        tts_provider_manager.register(config.provider_id, provider)

    @staticmethod
    def get_provider(provider_id: str):
        provider = tts_provider_manager.get(provider_id)
        if not provider:
            raise HTTPException(status_code=404, detail=f"TTS Provider {provider_id} not found or not configured")
        return provider

    @staticmethod
    async def get_voices(provider_id: str) -> List[TTSVoice]:
        provider = TTSService.get_provider(provider_id)
        try:
            return await provider.get_voices()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to fetch voices: {str(e)}")

    @staticmethod
    async def generate_audio(provider_id: str, request: TTSRequest) -> bytes:
        provider = TTSService.get_provider(provider_id)
        try:
            return await provider.generate_audio(request)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Audio generation failed: {str(e)}")

    @staticmethod
    async def generate_audio_stream(provider_id: str, request: TTSRequest) -> AsyncGenerator[bytes, None]:
        provider = TTSService.get_provider(provider_id)
        try:
            async for chunk in provider.generate_audio_stream(request):
                yield chunk
        except Exception as e:
            yield f"Error: {str(e)}".encode("utf-8")

    @staticmethod
    async def check_health(provider_id: str) -> Dict[str, Any]:
        provider = tts_provider_manager.get(provider_id)
        if not provider:
            return {"provider_id": provider_id, "status": "not_configured"}
        try:
            is_healthy = await provider.check_health()
            return {"provider_id": provider_id, "status": "healthy" if is_healthy else "unhealthy"}
        except Exception as e:
            return {"provider_id": provider_id, "status": "error", "error": str(e)}
