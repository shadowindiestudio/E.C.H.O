from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class TTSProviderConfig(BaseModel):
    provider_id: str
    provider_type: str
    api_key: Optional[str] = None
    base_url: Optional[str] = None
    enabled: bool = True

class TTSVoice(BaseModel):
    voice_id: str
    name: str
    provider_id: str
    language: str = "en"
    gender: Optional[str] = None
    preview_url: Optional[str] = None
    tags: List[str] = []

class TTSRequest(BaseModel):
    text: str
    voice_id: str
    model_id: Optional[str] = None
    speed: float = 1.0
    pitch: float = 1.0
    stream: bool = False
    
class TTSAudioResponse(BaseModel):
    audio_content: str  # base64 encoded audio or URL
    content_type: str = "audio/mpeg"
