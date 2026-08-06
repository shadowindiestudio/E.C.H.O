from sqlalchemy import Column, String, Text
from sqlalchemy.types import JSON
from app.database.session import Base
import uuid

class Voice(Base):
    __tablename__ = "voices"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    providerId = Column(String, index=True)
    providerVoiceId = Column(String, nullable=True)
    language = Column(String, default="en")
    gender = Column(String, nullable=True)
    tags = Column(JSON, default=list)
