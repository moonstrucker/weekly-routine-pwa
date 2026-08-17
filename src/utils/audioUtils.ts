// Web Audio API & Pure WAV Data URI Dual-Engine Audio Utility

let audioCtx: AudioContext | null = null;
let isAudioUnlocked = false;

/**
 * Dynamically generate a 16-bit PCM WAV Data URI for instantaneous audio playback
 */
function createWavDataUri(
  durationSec: number,
  freqFn: (t: number) => number,
  gainFn: (t: number) => number
): string {
  if (typeof window === 'undefined') return '';
  try {
    const sampleRate = 44100;
    const numSamples = Math.floor(sampleRate * durationSec);
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, 1, true); // Mono channel
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    let phase = 0;
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const freq = freqFn(t);
      const gain = gainFn(t);
      phase += (2 * Math.PI * freq) / sampleRate;
      const sample = Math.sin(phase) * gain;
      const intSample = Math.max(-32768, Math.min(32767, sample * 32767));
      view.setInt16(44 + i * 2, intSample, true);
    }

    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return 'data:audio/wav;base64,' + btoa(binary);
  } catch (e) {
    return '';
  }
}

// Pre-generate audible WAV Data URIs for pop, restore, and fanfare
const POP_WAV = createWavDataUri(
  0.16,
  (t) => 523.25 + (880 - 523.25) * (t / 0.16),
  (t) => Math.exp(-t * 22) * 0.45
);

const RESTORE_WAV = createWavDataUri(
  0.14,
  (t) => 659.25 + (440 - 659.25) * (t / 0.14),
  (t) => Math.exp(-t * 24) * 0.4
);

const FANFARE_WAV = createWavDataUri(
  0.5,
  (t) => {
    if (t < 0.1) return 523.25;
    if (t < 0.2) return 659.25;
    if (t < 0.3) return 783.99;
    return 1046.5;
  },
  (t) => (t > 0.35 ? Math.exp(-(t - 0.35) * 12) * 0.45 : 0.45)
);

/**
 * Initialize and unlock AudioContext on user interaction
 */
export function unlockAudioContext() {
  if (typeof window === 'undefined') return;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().then(() => {
        isAudioUnlocked = true;
      }).catch(() => {});
    } else if (audioCtx && audioCtx.state === 'running') {
      isAudioUnlocked = true;
    }
  } catch (e) {
    console.warn('Could not unlock AudioContext', e);
  }
}

// Auto-register global event listeners to unlock AudioContext on initial interaction
if (typeof window !== 'undefined') {
  const unlockEvents = ['pointerdown', 'touchstart', 'click', 'keydown'];
  const handleFirstInteraction = () => {
    unlockAudioContext();
    unlockEvents.forEach((evt) => window.removeEventListener(evt, handleFirstInteraction));
  };
  unlockEvents.forEach((evt) => window.addEventListener(evt, handleFirstInteraction, { once: true }));
}

/**
 * Helper to play HTML5 Audio Data URI
 */
function playDataUriAudio(dataUri: string, volume: number = 0.5) {
  if (!dataUri) return;
  try {
    const audio = new Audio(dataUri);
    audio.volume = volume;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  } catch (e) {}
}

/**
 * Play a light, crisp pop sound on task completion
 */
export function playTaskCompleteSound() {
  // Engine 1: Instantaneous HTML5 Data URI Audio
  playDataUriAudio(POP_WAV, 0.6);

  // Engine 2: Web Audio API Oscillator (Synchronous execution)
  try {
    unlockAudioContext();
    if (audioCtx) {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    }
  } catch (e) {}
}

/**
 * Play a gentle restore sound when task is restored
 */
export function playTaskRestoreSound() {
  // Engine 1: Instantaneous HTML5 Data URI Audio
  playDataUriAudio(RESTORE_WAV, 0.5);

  // Engine 2: Web Audio API Oscillator
  try {
    unlockAudioContext();
    if (audioCtx) {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    }
  } catch (e) {}
}

/**
 * Play a grand victory fanfare sound when all tasks are completed!
 */
export function playAllCompleteFanfare() {
  // Engine 1: Instantaneous HTML5 Data URI Audio
  playDataUriAudio(FANFARE_WAV, 0.6);

  // Engine 2: Web Audio API Fanfare
  try {
    unlockAudioContext();
    if (audioCtx) {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const now = audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];

      notes.forEach((freq, index) => {
        const startTime = now + index * 0.1;
        const osc = audioCtx!.createOscillator();
        const gain = audioCtx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        const duration = index === notes.length - 1 ? 0.5 : 0.18;
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx!.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    }
  } catch (e) {}
}
