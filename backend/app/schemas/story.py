from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class CharacterInfo(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    inferred_gender: Optional[str] = None
    inferred_age: Optional[str] = None
    suggested_voice_id: Optional[str] = None

class DialogueLine(BaseModel):
    id: str
    speaker_id: Optional[str] = None
    text: str
    emotion: Optional[str] = None
    intensity: Optional[float] = 1.0

class Scene(BaseModel):
    id: str
    name: Optional[str] = None
    description: Optional[str] = None
    dialogues: List[DialogueLine] = []

class Chapter(BaseModel):
    id: str
    title: Optional[str] = None
    scenes: List[Scene] = []

class StoryManuscript(BaseModel):
    title: str
    author: Optional[str] = None
    content: str
    
class StoryAnalysisResult(BaseModel):
    id: str
    chapters: List[Chapter] = []
    characters: List[CharacterInfo] = []
    status: str = "pending"
    error_message: Optional[str] = None
    
class PipelineStatus(BaseModel):
    job_id: str
    status: str
    progress: float
    message: str
