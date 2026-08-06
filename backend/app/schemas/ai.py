from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class AIProviderConfig(BaseModel):
    provider_id: str
    api_key: str
    base_url: Optional[str] = None
    enabled: bool = True
    models: List[str] = []

class AIRequest(BaseModel):
    prompt: str
    model: str
    system_prompt: Optional[str] = None
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = None
    stream: bool = False

class AIResponse(BaseModel):
    id: str
    model: str
    content: str
    usage: Optional[Dict[str, Any]] = None
