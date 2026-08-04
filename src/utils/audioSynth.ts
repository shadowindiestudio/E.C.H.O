// Web Audio API synthesizer for realistic voice tone audio preview

let audioCtx: AudioContext | null = null;
let currentOscillators: OscillatorNode[] = [];
let currentGainNodes: GainNode[] = [];

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function stopVoiceTone() {
  currentOscillators.forEach(osc => {
    try { osc.stop(); osc.disconnect(); } catch {}
  });
  currentGainNodes.forEach(gain => {
    try { gain.disconnect(); } catch {}
  });
  currentOscillators = [];
  currentGainNodes = [];
}

export function playVoiceTone(voiceCategory: string, onUpdateProgress?: (currentTime: number, duration: number) => void, onEnded?: () => void) {
  stopVoiceTone();
  const ctx = getAudioContext();
  
  const duration = 6; // 6 seconds sample
  const now = ctx.currentTime;

  // Base pitch depending on category / voice type
  let baseFreq = 120; // default male deep
  if (voiceCategory === 'Synthetic') baseFreq = 220;
  else if (voiceCategory === 'Narrative') baseFreq = 180;
  else if (voiceCategory === 'Radio') baseFreq = 110;
  else if (voiceCategory === 'Cinematic') baseFreq = 130;

  // Formant modulation synth to emulate spoken voice phrase
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc1.type = 'sawtooth';
  osc2.type = 'sine';

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(800, now);
  filter.Q.setValueAtTime(3, now);

  // Frequency envelope simulating speech cadence
  osc1.frequency.setValueAtTime(baseFreq, now);
  osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.2, now + 0.8);
  osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + 1.8);
  osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.15, now + 3.2);
  osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.85, now + 4.8);
  osc1.frequency.setValueAtTime(baseFreq, now + duration);

  osc2.frequency.setValueAtTime(baseFreq * 0.5, now);
  osc2.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, now + 2);
  osc2.frequency.setValueAtTime(baseFreq * 0.5, now + duration);

  // Filter frequency shift for vowels
  filter.frequency.exponentialRampToValueAtTime(1500, now + 0.5);
  filter.frequency.exponentialRampToValueAtTime(600, now + 1.5);
  filter.frequency.exponentialRampToValueAtTime(2200, now + 2.8);
  filter.frequency.exponentialRampToValueAtTime(800, now + 4.5);

  // Gain envelope
  gainNode.gain.setValueAtTime(0.001, now);
  gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1);
  gainNode.gain.exponentialRampToValueAtTime(0.18, now + duration - 0.2);
  gainNode.gain.linearRampToValueAtTime(0.001, now + duration);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + duration);
  osc2.stop(now + duration);

  currentOscillators = [osc1, osc2];
  currentGainNodes = [gainNode];

  // Progress ticker
  const interval = setInterval(() => {
    const elapsed = ctx.currentTime - now;
    if (elapsed >= duration) {
      clearInterval(interval);
      if (onEnded) onEnded();
    } else {
      if (onUpdateProgress) onUpdateProgress(elapsed, duration);
    }
  }, 100);

  return () => {
    clearInterval(interval);
    stopVoiceTone();
  };
}
