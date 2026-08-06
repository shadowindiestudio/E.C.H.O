from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.voice import Voice as VoiceModel
from app.schemas.voice import VoiceCreate, VoiceResponse

router = APIRouter()

@router.post("/", response_model=VoiceResponse)
def create_voice(voice: VoiceCreate, db: Session = Depends(get_db)):
    db_voice = VoiceModel(**voice.model_dump())
    db.add(db_voice)
    db.commit()
    db.refresh(db_voice)
    return db_voice

@router.get("/", response_model=List[VoiceResponse])
def read_voices(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    voices = db.query(VoiceModel).offset(skip).limit(limit).all()
    return voices

@router.get("/{voice_id}", response_model=VoiceResponse)
def read_voice(voice_id: str, db: Session = Depends(get_db)):
    voice = db.query(VoiceModel).filter(VoiceModel.id == voice_id).first()
    if voice is None:
        raise HTTPException(status_code=404, detail="Voice not found")
    return voice

@router.put("/{voice_id}", response_model=VoiceResponse)
def update_voice(voice_id: str, voice_update: VoiceCreate, db: Session = Depends(get_db)):
    db_voice = db.query(VoiceModel).filter(VoiceModel.id == voice_id).first()
    if db_voice is None:
        raise HTTPException(status_code=404, detail="Voice not found")
    
    update_data = voice_update.model_dump()
    for key, value in update_data.items():
        setattr(db_voice, key, value)
    
    db.commit()
    db.refresh(db_voice)
    return db_voice

@router.delete("/{voice_id}")
def delete_voice(voice_id: str, db: Session = Depends(get_db)):
    db_voice = db.query(VoiceModel).filter(VoiceModel.id == voice_id).first()
    if db_voice is None:
        raise HTTPException(status_code=404, detail="Voice not found")
    db.delete(db_voice)
    db.commit()
    return {"status": "ok"}
