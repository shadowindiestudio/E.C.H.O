from pydantic import BaseModel
from typing import Optional, List

class VoiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    providerId: str
    providerVoiceId: Optional[str] = None
    language: str = "en"
    gender: Optional[str] = None
    tags: List[str] = []

class VoiceCreate(VoiceBase):
    pass

class VoiceResponse(VoiceBase):
    id: str

    class Config:
        from_attributes = True
