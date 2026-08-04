import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { pipelineOrchestrator } from '../../services/pipeline';
import { Story, PipelineProgress } from '../../types';


export const StoryEditorView: React.FC = () => {
  const { activeProject, activeStory, saveStory, setActiveStoryId, voices } = useApp();

  // Create an initial story if one doesn't exist for the project
  useEffect(() => {
    if (activeProject && !activeStory) {
      const newStory: Story = {
        id: crypto.randomUUID(),
        projectId: activeProject.id,
        title: activeProject.title,
        rawText: '',
        chapters: [],
        characters: [],
        wordCount: 0,
        characterCount: 0,
        estimatedReadingTimeMinutes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      saveStory(newStory);
      setActiveStoryId(newStory.id);
    }
  }, [activeProject, activeStory, saveStory, setActiveStoryId]);

  const [scriptText, setScriptText] = useState(activeStory?.rawText || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<PipelineProgress | null>(null);
  
  // Editor Features State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [history, setHistory] = useState<string[]>([activeStory?.rawText || '']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (activeStory) {
      setScriptText(activeStory.rawText);
      setHistory([activeStory.rawText]);
      setHistoryIndex(0);
    }
  }, [activeStory?.id]);

  // Auto-save debounced
  useEffect(() => {
    const handler = setTimeout(() => {
      if (activeStory && scriptText !== activeStory.rawText) {
        saveStory({ ...activeStory, rawText: scriptText, updatedAt: new Date().toISOString() });
      }
    }, 1500);
    return () => clearTimeout(handler);
  }, [scriptText, activeStory, saveStory]);

  useEffect(() => {
    return pipelineOrchestrator.subscribeToProgress((p) => {
      setProgress(p);
      if (p.stage === 'completed' || p.stage === 'failed') {
        setTimeout(() => {
          setIsProcessing(false);
          setProgress(null);
        }, 3000);
      }
    });
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setScriptText(newText);
    
    // Add to history (basic implementation)
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newText);
    // Keep last 50 states
    if (newHistory.length > 50) newHistory.shift();
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setScriptText(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setScriptText(history[historyIndex + 1]);
    }
  };

  const handleProcessStory = async () => {
    if (!activeStory) return;
    setIsProcessing(true);
    try {
      const updatedStory = await pipelineOrchestrator.processStory(
        { ...activeStory, rawText: scriptText }, 
        voices
      );
      saveStory(updatedStory);
    } catch (e) {
      console.error(e);
    }
  };

  const currentWordCount = scriptText.trim() === '' ? 0 : scriptText.trim().split(/\s+/).length;
  const currentReadTime = Math.ceil(currentWordCount / 150);

  const flatParagraphs = activeStory?.chapters.flatMap(c => c.scenes.flatMap(s => s.paragraphs)) || [];
  const hasParsedContent = flatParagraphs.length > 0;

  if (!activeProject || !activeStory) {
    return (
      <div className="flex-1 p-8 text-center text-on-surface-variant flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-4xl mb-2 text-border-slate">book</span>
        <p className="font-display font-semibold text-on-surface text-sm">No Active Story</p>
        <p className="text-xs mt-1">Select or create a project to start writing.</p>
      </div>
    );
  }

  return (
    <div className={`flex-1 p-4 md:p-6 overflow-y-auto space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-background-dark p-8' : ''}`}>
      
      {/* Pipeline Progress Banner */}
      {progress && progress.stage !== 'idle' && (
        <div className={`p-4 rounded-xl border flex items-center justify-between shadow-lg transition-colors ${progress.stage === 'failed' ? 'bg-red-900/20 border-red-500/50 text-red-200' : progress.stage === 'completed' ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-200' : 'bg-surface-panel border-muted-gold/50 text-on-surface'}`}>
          <div className="flex items-center gap-3">
            <span className={`material-symbols-outlined ${progress.stage !== 'completed' && progress.stage !== 'failed' ? 'animate-spin text-muted-gold' : ''}`}>
              {progress.stage === 'failed' ? 'error' : progress.stage === 'completed' ? 'check_circle' : 'sync'}
            </span>
            <div>
              <p className="text-sm font-display font-bold">{progress.message}</p>
              {progress.error && <p className="text-xs text-red-400 mt-1">{progress.error}</p>}
            </div>
          </div>
          <div className="w-48 bg-background-dark h-2 rounded-full overflow-hidden border border-border-slate">
            <div className={`h-full transition-all duration-300 ${progress.stage === 'failed' ? 'bg-red-500' : progress.stage === 'completed' ? 'bg-emerald-500' : 'bg-muted-gold'}`} style={{ width: `${progress.percent}%` }} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Left: Manuscript Editor */}
        <div className="lg:col-span-2 surface-panel p-5 rounded-xl border border-border-slate flex flex-col min-h-[600px] h-full">
          
          {/* Editor Toolbar */}
          <div className="flex flex-col gap-3 mb-4 border-b border-border-slate pb-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-on-surface text-sm">
                  Manuscript Editor — {activeStory.title}
                </h3>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowSearch(!showSearch)} className="p-1.5 text-on-surface-variant hover:text-on-surface rounded bg-surface-container-high transition-colors" title="Find & Replace">
                  <span className="material-symbols-outlined text-sm">search</span>
                </button>
                <button onClick={handleUndo} disabled={historyIndex === 0} className="p-1.5 text-on-surface-variant hover:text-on-surface rounded bg-surface-container-high disabled:opacity-30 transition-colors" title="Undo">
                  <span className="material-symbols-outlined text-sm">undo</span>
                </button>
                <button onClick={handleRedo} disabled={historyIndex === history.length - 1} className="p-1.5 text-on-surface-variant hover:text-on-surface rounded bg-surface-container-high disabled:opacity-30 transition-colors" title="Redo">
                  <span className="material-symbols-outlined text-sm">redo</span>
                </button>
                <div className="h-6 w-px bg-border-slate mx-1 self-center"></div>
                <button onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))} className="p-1.5 text-on-surface-variant hover:text-on-surface rounded bg-surface-container-high transition-colors" title="Zoom Out">
                  <span className="material-symbols-outlined text-sm">zoom_out</span>
                </button>
                <span className="text-[10px] font-mono self-center text-on-surface-variant w-8 text-center">{zoomLevel}%</span>
                <button onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))} className="p-1.5 text-on-surface-variant hover:text-on-surface rounded bg-surface-container-high transition-colors" title="Zoom In">
                  <span className="material-symbols-outlined text-sm">zoom_in</span>
                </button>
                <div className="h-6 w-px bg-border-slate mx-1 self-center"></div>
                <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-1.5 text-on-surface-variant hover:text-on-surface rounded bg-surface-container-high transition-colors" title="Fullscreen">
                  <span className="material-symbols-outlined text-sm">{isFullscreen ? 'fullscreen_exit' : 'fullscreen'}</span>
                </button>
              </div>
            </div>

            {/* Find & Replace Bar */}
            {showSearch && (
              <div className="flex items-center gap-2 bg-matte-black p-2 rounded border border-border-slate text-xs">
                <input
                  type="text"
                  placeholder="Find..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-on-surface w-32"
                />
                <span className="text-border-slate">|</span>
                <input
                  type="text"
                  placeholder="Replace..."
                  value={replaceTerm}
                  onChange={(e) => setReplaceTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-on-surface w-32"
                />
                <button 
                  onClick={() => {
                    if (searchTerm) {
                      const updated = scriptText.split(searchTerm).join(replaceTerm);
                      setScriptText(updated);
                      setHistory([...history.slice(0, historyIndex + 1), updated]);
                      setHistoryIndex(historyIndex + 1);
                    }
                  }}
                  className="bg-surface-container-highest px-2 py-1 rounded text-on-surface hover:text-muted-gold ml-auto"
                >
                  Replace All
                </button>
              </div>
            )}
            
            {/* Action Bar */}
            <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-mono mt-1">
              <div className="flex gap-4">
                <span>{currentWordCount} words</span>
                <span>{scriptText.length} chars</span>
                <span>~{currentReadTime}m read</span>
              </div>
              <button
                onClick={handleProcessStory}
                disabled={isProcessing || scriptText.trim() === ''}
                className="bg-muted-gold text-matte-black px-4 py-1.5 rounded text-xs font-display font-bold hover:bg-primary-fixed transition-colors shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isProcessing ? 'Processing Pipeline...' : 'Run Pipeline'}
                {!isProcessing && <span className="material-symbols-outlined text-[14px]">auto_awesome</span>}
              </button>
            </div>
          </div>

          <textarea
            ref={textareaRef}
            value={scriptText}
            onChange={handleTextChange}
            style={{ fontSize: `${(zoomLevel / 100) * 12}px` }}
            className="flex-1 w-full bg-matte-black border border-border-slate rounded-lg p-4 font-mono text-on-surface focus:border-muted-gold outline-none resize-none leading-relaxed custom-scrollbar transition-all"
            placeholder="Type manuscript lines here...&#10;&#10;Format hints:&#10;NARRATOR: The rain hammered against the glass.&#10;MARCUS: (Whispering) They're outside."
          />
        </div>

        {/* Right: Pipeline Results */}
        <div className="surface-panel p-5 rounded-xl border border-border-slate flex flex-col h-[600px] overflow-hidden">
          <h3 className="font-display font-bold text-on-surface text-sm border-b border-border-slate pb-3 mb-3">
            Pipeline Analysis
          </h3>

          {!hasParsedContent ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl mb-2 text-border-slate">analytics</span>
              <p className="font-display font-semibold text-xs text-on-surface">No Processed Data</p>
              <p className="text-[11px] mt-1">Run the pipeline to extract characters, dialogue, and emotions.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-1 space-y-6 custom-scrollbar">
              
              {/* Stats Overview */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                <div className="bg-matte-black p-2 rounded border border-border-slate">
                  <span className="text-muted-gold font-bold block">{activeStory.characterCount}</span>
                  <span className="text-[10px] text-on-surface-variant">Characters</span>
                </div>
                <div className="bg-matte-black p-2 rounded border border-border-slate">
                  <span className="text-muted-gold font-bold block">{activeStory.chapters.length}</span>
                  <span className="text-[10px] text-on-surface-variant">Chapters</span>
                </div>
              </div>

              {/* Character List */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-on-surface uppercase tracking-wider">Detected Characters</h4>
                <div className="space-y-1.5">
                  {activeStory.characters.map((char) => (
                    <div key={char.id} className="bg-matte-black p-2 rounded border border-border-slate flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: char.color }} />
                        <span className="font-display font-bold text-on-surface">{char.name}</span>
                      </div>
                      <span className="text-[10px] text-on-surface-variant font-mono">{char.speakingStatistics.dialogueCount} lines</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Elements Stream Preview */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-on-surface uppercase tracking-wider">Dialogue & Narration Stream</h4>
                <div className="space-y-2">
                  {flatParagraphs.slice(0, 50).flatMap(p => p.elements).map((el) => {
                    if (el.type === 'dialogue') {
                      const d = el as any;
                      const charColor = activeStory.characters.find(c => c.name.toUpperCase() === d.characterName.toUpperCase())?.color || '#D4AF37';
                      return (
                        <div key={el.id} className="bg-matte-black/80 border border-border-slate/80 p-2.5 rounded-lg text-xs space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="font-display font-bold text-[11px]" style={{ color: charColor }}>
                              {d.characterName}
                            </span>
                            <Badge variant={d.emotion?.primary === 'intense' || d.emotion?.primary === 'angry' ? 'amber' : 'slate'}>
                              {d.emotion?.primary || 'neutral'}
                            </Badge>
                          </div>
                          <p className="text-on-surface italic text-[11px] font-sans">"{d.text}"</p>
                        </div>
                      );
                    } else {
                      const n = el as any;
                      return (
                        <div key={el.id} className="bg-surface-container-lowest border border-border-slate/30 p-2 rounded text-[10px] text-on-surface-variant italic">
                          [Narration] {n.text.substring(0, 100)}{n.text.length > 100 ? '...' : ''}
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

