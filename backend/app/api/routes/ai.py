from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from fastapi.responses import StreamingResponse
from typing import List, Dict, Any
from app.schemas.ai import AIRequest, AIResponse, AIProviderConfig
from app.services.ai_service import AIService
from app.services.provider_manager import ai_provider_manager

router = APIRouter()

class ProviderSetupRequest(AIProviderConfig):
    provider_type: str

@router.post("/config", response_model=Dict[str, str])
async def configure_provider(config: ProviderSetupRequest):
    try:
        AIService.configure_provider(config, config.provider_type)
        return {"status": "success", "message": f"Provider {config.provider_id} configured successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/providers", response_model=List[str])
async def list_providers():
    return ai_provider_manager.list_providers()

@router.get("/{provider_id}/models", response_model=List[str])
async def get_provider_models(provider_id: str):
    return await AIService.get_models(provider_id)

@router.get("/{provider_id}/health")
async def check_provider_health(provider_id: str):
    return await AIService.check_health(provider_id)

@router.post("/{provider_id}/generate", response_model=AIResponse)
async def generate_content(provider_id: str, request: AIRequest):
    if request.stream:
        raise HTTPException(status_code=400, detail="Use /generate/stream for streaming responses")
    return await AIService.generate(provider_id, request)

@router.post("/{provider_id}/generate/stream")
async def generate_content_stream(provider_id: str, request: AIRequest):
    request.stream = True
    async def event_generator():
        async for chunk in AIService.generate_stream(provider_id, request):
            yield chunk

    return StreamingResponse(event_generator(), media_type="text/plain")
