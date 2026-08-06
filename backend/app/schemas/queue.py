from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class QueueItem(BaseModel):
    item_id: str
    job_id: str
    chapter_id: str
    scene_id: str
    dialogue_id: str
    status: str = "pending"
    audio_url: Optional[str] = None
    error_message: Optional[str] = None

class QueueStatus(BaseModel):
    items: List[QueueItem]
