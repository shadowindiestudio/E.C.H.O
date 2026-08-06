from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse, Response
from typing import List, Dict, Any
from app.schemas.tts import TTSRequest, TTSVoice, TTSProviderConfig
from app.services.tts_service import TTSService
from app.services.tts_provider_manager import tts_provider_manager

router = APIRouter()

@router.post("/config", response_model=Dict[str, str])
async def configure_provider(config: TTSProviderConfig):
    try:
        TTSService.configure_provider(config)
        return {"status": "success", "message": f"TTS Provider {config.provider_id} configured successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/providers", response_model=List[str])
async def list_providers():
    return tts_provider_manager.list_providers()

@router.get("/{provider_id}/voices", response_model=List[TTSVoice])
async def get_provider_voices(provider_id: str):
    return await TTSService.get_voices(provider_id)

@router.get("/{provider_id}/health")
async def check_provider_health(provider_id: str):
    return await TTSService.check_health(provider_id)

@router.post("/{provider_id}/generate")
async def generate_audio(provider_id: str, request: TTSRequest):
    if request.stream:
        raise HTTPException(status_code=400, detail="Use /generate/stream for streaming responses")
    audio_bytes = await TTSService.generate_audio(provider_id, request)
    return Response(content=audio_bytes, media_type="audio/mpeg")

@router.post("/{provider_id}/generate/stream")
async def generate_audio_stream(provider_id: str, request: TTSRequest):
    request.stream = True
    async def event_generator():
        async for chunk in TTSService.generate_audio_stream(provider_id, request):
            yield chunk

    return StreamingResponse(event_generator(), media_type="audio/mpeg")
