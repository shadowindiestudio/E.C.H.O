import uuid
import asyncio
import json
from typing import Dict, Any, List, Optional
from app.schemas.story import StoryManuscript, StoryAnalysisResult, PipelineStatus, CharacterInfo
from app.services.story_parser import StoryParser
from app.services.ai_service import AIService
from app.schemas.ai import AIRequest
from app.services.tts_service import TTSService

class PipelineOrchestrator:
    def __init__(self):
        self.jobs: Dict[str, StoryAnalysisResult] = {}
        self.statuses: Dict[str, PipelineStatus] = {}

    def _validate_manuscript(self, manuscript: StoryManuscript):
        if not manuscript.content or len(manuscript.content.strip()) == 0:
            raise ValueError("Manuscript content cannot be empty.")

    async def _extract_characters_with_ai(self, text: str, provider_id: str) -> List[CharacterInfo]:
        try:
            prompt = f"Extract character names from this text. Return a JSON list of objects with 'name', 'description', 'gender'. Text: {text[:2000]}..."
            request = AIRequest(prompt=prompt, model="default", system_prompt="You are a helpful assistant that returns ONLY valid JSON list.", stream=False)
            response = await AIService.generate(provider_id, request)
            
            content = response.content.strip()
            if content.startswith("```json"):
                content = content[7:-3].strip()
            elif content.startswith("```"):
                content = content[3:-3].strip()
                
            try:
                data = json.loads(content)
                chars = []
                for item in data:
                    chars.append(CharacterInfo(
                        id=str(uuid.uuid4()),
                        name=item.get("name", "Unknown"),
                        description=item.get("description", ""),
                        inferred_gender=item.get("gender", "")
                    ))
                return chars
            except json.JSONDecodeError:
                return []
        except Exception:
            return []

    async def _analyze_emotions_and_speakers(self, result: StoryAnalysisResult, provider_id: str):
        # Placeholder for full analysis: we'd go through dialogues and ask AI to attribute speaker/emotion
        # For this prototype, we'll assign the first character to dialogues randomly if they have quotes.
        if not result.characters:
            return
            
        char_ids = [c.id for c in result.characters]
        
        for chapter in result.chapters:
            for scene in chapter.scenes:
                for diag in scene.dialogues:
                    if diag.speaker_id == "narrator":
                        continue
                    
                    # Basic placeholder attribution
                    diag.speaker_id = char_ids[hash(diag.text) % len(char_ids)]
                    diag.emotion = "neutral"

    async def _assign_voices(self, result: StoryAnalysisResult, tts_provider_id: Optional[str]):
        if not tts_provider_id or not result.characters:
            return
            
        try:
            voices = await TTSService.get_voices(tts_provider_id)
            if not voices:
                return
                
            voice_ids = [v.voice_id for v in voices]
            
            for i, char in enumerate(result.characters):
                char.suggested_voice_id = voice_ids[i % len(voice_ids)]
        except Exception:
            pass

    async def start_pipeline(self, manuscript: StoryManuscript, ai_provider_id: Optional[str] = None, tts_provider_id: Optional[str] = None) -> str:
        self._validate_manuscript(manuscript)
        
        job_id = str(uuid.uuid4())
        
        result = StoryAnalysisResult(id=job_id)
        self.jobs[job_id] = result
        self.statuses[job_id] = PipelineStatus(job_id=job_id, status="processing", progress=0.0, message="Starting pipeline...")
        
        asyncio.create_task(self._process_manuscript(job_id, manuscript, ai_provider_id, tts_provider_id))
        
        return job_id

    async def _process_manuscript(self, job_id: str, manuscript: StoryManuscript, ai_provider_id: Optional[str], tts_provider_id: Optional[str]):
        try:
            self.statuses[job_id].message = "Parsing chapters and scenes..."
            self.statuses[job_id].progress = 0.1
            
            chapters = StoryParser.parse_chapters(manuscript.content)
            self.jobs[job_id].chapters = chapters
            
            self.statuses[job_id].progress = 0.3
            
            if ai_provider_id:
                self.statuses[job_id].message = "Extracting characters using AI..."
                characters = await self._extract_characters_with_ai(manuscript.content, ai_provider_id)
                self.jobs[job_id].characters = characters
            else:
                self.statuses[job_id].message = "Skipping AI character extraction (no provider)..."
                
            self.statuses[job_id].progress = 0.6
            
            if ai_provider_id:
                self.statuses[job_id].message = "Analyzing dialogue and emotions..."
                await self._analyze_emotions_and_speakers(self.jobs[job_id], ai_provider_id)
                
            self.statuses[job_id].progress = 0.8
            
            if tts_provider_id:
                self.statuses[job_id].message = "Assigning TTS voices to characters..."
                await self._assign_voices(self.jobs[job_id], tts_provider_id)

            self.statuses[job_id].progress = 0.9
            
            self.statuses[job_id].status = "completed"
            self.statuses[job_id].progress = 1.0
            self.statuses[job_id].message = "Pipeline completed successfully."
            self.jobs[job_id].status = "completed"
            
        except Exception as e:
            self.statuses[job_id].status = "error"
            self.statuses[job_id].message = f"Pipeline failed: {str(e)}"
            self.jobs[job_id].status = "error"
            self.jobs[job_id].error_message = str(e)

    def get_status(self, job_id: str) -> PipelineStatus:
        if job_id not in self.statuses:
            raise KeyError("Job not found")
        return self.statuses[job_id]

    def get_result(self, job_id: str) -> StoryAnalysisResult:
        if job_id not in self.jobs:
            raise KeyError("Job not found")
        return self.jobs[job_id]

pipeline_orchestrator = PipelineOrchestrator()
