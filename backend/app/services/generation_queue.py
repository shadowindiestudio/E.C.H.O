import uuid
import asyncio
from typing import Dict, List, Optional
from app.schemas.queue import QueueItem, QueueStatus
from app.services.pipeline_orchestrator import pipeline_orchestrator
from app.services.tts_service import TTSService
from app.schemas.tts import TTSRequest
from app.schemas.story import StoryAnalysisResult
from app.services.tts_provider_manager import tts_provider_manager

class GenerationQueue:
    def __init__(self):
        self.items: Dict[str, QueueItem] = {}
        self.queue: asyncio.Queue = asyncio.Queue()
        self.is_running = False
        
    async def start_worker(self):
        if self.is_running:
            return
        self.is_running = True
        asyncio.create_task(self._worker())
        
    async def _worker(self):
        while self.is_running:
            item_id = await self.queue.get()
            item = self.items[item_id]
            try:
                item.status = "processing"
                result = pipeline_orchestrator.get_result(item.job_id)
                dialogue = self._find_dialogue(result, item.chapter_id, item.scene_id, item.dialogue_id)
                if not dialogue:
                    raise ValueError("Dialogue not found")
                    
                voice_id = None
                if dialogue.speaker_id and dialogue.speaker_id != "narrator":
                    for char in result.characters:
                        if char.id == dialogue.speaker_id:
                            voice_id = char.suggested_voice_id
                            break
                            
                if not voice_id:
                    voice_id = "default"
                    
                tts_providers = tts_provider_manager.list_providers()
                if not tts_providers:
                    raise ValueError("No TTS providers configured")
                    
                provider_id = tts_providers[0]
                
                request = TTSRequest(text=dialogue.text, voice_id=voice_id)
                audio_bytes = await TTSService.generate_audio(provider_id, request)
                
                item.audio_url = f"/api/audio/{item_id}.mp3"
                item.status = "completed"
            except Exception as e:
                item.status = "error"
                item.error_message = str(e)
            finally:
                self.queue.task_done()
                
    def _find_dialogue(self, result: StoryAnalysisResult, chapter_id: str, scene_id: str, dialogue_id: str):
        for chapter in result.chapters:
            if chapter.id == chapter_id:
                for scene in chapter.scenes:
                    if scene.id == scene_id:
                        for d in scene.dialogues:
                            if d.id == dialogue_id:
                                return d
        return None

    def add_to_queue(self, job_id: str, chapter_id: str, scene_id: str, dialogue_id: str) -> str:
        item_id = str(uuid.uuid4())
        item = QueueItem(
            item_id=item_id,
            job_id=job_id,
            chapter_id=chapter_id,
            scene_id=scene_id,
            dialogue_id=dialogue_id
        )
        self.items[item_id] = item
        self.queue.put_nowait(item_id)
        
        if not self.is_running:
            asyncio.create_task(self.start_worker())
            
        return item_id
        
    def get_status(self) -> QueueStatus:
        return QueueStatus(items=list(self.items.values()))
        
    def get_item(self, item_id: str) -> Optional[QueueItem]:
        return self.items.get(item_id)

generation_queue = GenerationQueue()
