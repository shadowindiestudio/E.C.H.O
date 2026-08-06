from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.schemas.story import StoryManuscript, StoryAnalysisResult, PipelineStatus, CharacterInfo
from app.services.pipeline_orchestrator import pipeline_orchestrator
from app.schemas.queue import QueueItem, QueueStatus
from app.services.generation_queue import generation_queue

router = APIRouter()

class PipelineStartRequest(BaseModel):
    manuscript: StoryManuscript
    ai_provider_id: Optional[str] = None
    tts_provider_id: Optional[str] = None

class QueueAddRequest(BaseModel):
    job_id: str
    chapter_id: str
    scene_id: str
    dialogue_id: str

@router.post("/process", response_model=Dict[str, str])
async def start_processing(request: PipelineStartRequest):
    try:
        job_id = await pipeline_orchestrator.start_pipeline(request.manuscript, request.ai_provider_id, request.tts_provider_id)
        return {"job_id": job_id, "message": "Pipeline started"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status/{job_id}", response_model=PipelineStatus)
async def get_processing_status(job_id: str):
    try:
        return pipeline_orchestrator.get_status(job_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Job not found")

@router.get("/result/{job_id}", response_model=StoryAnalysisResult)
async def get_processing_result(job_id: str):
    try:
        return pipeline_orchestrator.get_result(job_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Job not found")

@router.post("/character/extract", response_model=List[CharacterInfo])
async def extract_characters_direct(request: PipelineStartRequest):
    if not request.ai_provider_id:
        raise HTTPException(status_code=400, detail="ai_provider_id is required for direct extraction")
    try:
        chars = await pipeline_orchestrator._extract_characters_with_ai(request.manuscript.content, request.ai_provider_id)
        return chars
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/queue/add", response_model=Dict[str, str])
async def add_to_queue(request: QueueAddRequest):
    try:
        item_id = generation_queue.add_to_queue(
            job_id=request.job_id,
            chapter_id=request.chapter_id,
            scene_id=request.scene_id,
            dialogue_id=request.dialogue_id
        )
        return {"item_id": item_id, "message": "Added to queue"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/queue/status", response_model=QueueStatus)
async def get_queue_status():
    return generation_queue.get_status()

@router.get("/queue/{item_id}", response_model=QueueItem)
async def get_queue_item(item_id: str):
    item = generation_queue.get_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found in queue")
    return item

class AnalyzeEmotionsRequest(BaseModel):
    result: StoryAnalysisResult
    ai_provider_id: str

@router.post("/emotion/analyze", response_model=StoryAnalysisResult)
async def analyze_emotions_direct(request: AnalyzeEmotionsRequest):
    try:
        await pipeline_orchestrator._analyze_emotions_and_speakers(request.result, request.ai_provider_id)
        return request.result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class VoiceAssignRequest(BaseModel):
    result: StoryAnalysisResult
    tts_provider_id: str

@router.post("/voice/assign", response_model=StoryAnalysisResult)
async def assign_voices_direct(request: VoiceAssignRequest):
    try:
        await pipeline_orchestrator._assign_voices(request.result, request.tts_provider_id)
        return request.result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
