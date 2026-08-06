import uuid
import re
from typing import List, Dict, Any, Tuple
from app.schemas.story import Chapter, Scene, DialogueLine, StoryManuscript

class StoryParser:
    @staticmethod
    def parse_chapters(manuscript: str) -> List[Chapter]:
        lines = manuscript.split('\n')
        chapters = []
        current_chapter = None
        current_text = []
        
        chapter_pattern = re.compile(r'^(chapter\s+\d+|prologue|epilogue)', re.IGNORECASE)
        
        for line in lines:
            if chapter_pattern.match(line.strip()):
                if current_chapter is not None:
                    chapters.append(StoryParser._parse_scenes(current_chapter, '\n'.join(current_text)))
                current_chapter = line.strip()
                current_text = []
            else:
                current_text.append(line)
                
        if current_chapter is None:
            current_chapter = "Chapter 1"
            
        if current_text:
            chapters.append(StoryParser._parse_scenes(current_chapter, '\n'.join(current_text)))
            
        return chapters
        
    @staticmethod
    def _parse_scenes(chapter_title: str, text: str) -> Chapter:
        chapter = Chapter(id=str(uuid.uuid4()), title=chapter_title, scenes=[])
        
        scene_blocks = re.split(r'\n\s*\*\*\*\s*\n', text)
        
        for i, block in enumerate(scene_blocks):
            if not block.strip():
                continue
            scene = Scene(id=str(uuid.uuid4()), name=f"Scene {i+1}", dialogues=[])
            scene.dialogues = StoryParser._parse_dialogues(block)
            chapter.scenes.append(scene)
            
        return chapter

    @staticmethod
    def _parse_dialogues(text: str) -> List[DialogueLine]:
        dialogues = []
        parts = re.split(r'(".*?")', text)
        for part in parts:
            part = part.strip()
            if not part:
                continue
            
            if part.startswith('"') and part.endswith('"'):
                dialogues.append(DialogueLine(
                    id=str(uuid.uuid4()),
                    text=part[1:-1],
                ))
            else:
                dialogues.append(DialogueLine(
                    id=str(uuid.uuid4()),
                    speaker_id="narrator",
                    text=part
                ))
                
        return dialogues
