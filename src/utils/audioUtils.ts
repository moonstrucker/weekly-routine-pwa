// Web Audio API & Fallback Audio Utility for Task Completion Sounds

let audioCtx: AudioContext | null = null;
let isAudioUnlocked = false;

/**
 * Initialize and unlock AudioContext on first user interaction
 */
export function unlockAudioContext() {
  if (isAudioUnlocked && audioCtx && audioCtx.state === 'running') return;

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

// Auto-register global event listeners to unlock AudioContext on initial tap
if (typeof window !== 'undefined') {
  const unlockEvents = ['pointerdown', 'touchstart', 'click', 'keydown'];
  const handleFirstInteraction = () => {
    unlockAudioContext();
    unlockEvents.forEach((evt) => window.removeEventListener(evt, handleFirstInteraction));
  };
  unlockEvents.forEach((evt) => window.addEventListener(evt, handleFirstInteraction, { once: true }));
}

function getAudioContext(): AudioContext | null {
  unlockAudioContext();
  return audioCtx;
}

// Generated lightweight WAV Data URI for fallback pop sound (100% reliable across browsers)
const POP_SOUND_DATA_URI =
  'data:audio/wav;base64,UklGRjQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRAAAAAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA';

function playFallbackPop() {
  try {
    const audio = new Audio(POP_SOUND_DATA_URI);
    audio.volume = 0.3;
    audio.play().catch(() => {});
  } catch (e) {
    // Ignore fallback errors
  }
}

/**
 * Play a light, crisp pop sound on task completion
 */
export function playTaskCompleteSound() {
  try {
    const ctx = getAudioContext();

    if (!ctx) {
      playFallbackPop();
      return;
    }

    const playSound = () => {
      const now = ctx.currentTime;

      // Note 1: Bright sine tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.18);

      // Note 2: Sparkle tone
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1046.5, now + 0.06); // C6
      osc2.frequency.exponentialRampToValueAtTime(1318.51, now + 0.2); // E6

      gain2.gain.setValueAtTime(0.18, now + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.06);
      osc2.stop(now + 0.22);
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => playSound()).catch(() => playFallbackPop());
    } else {
      playSound();
    }
  } catch (e) {
    console.warn('Audio playback failed', e);
    playFallbackPop();
  }
}

/**
 * Play a gentle restore sound when task is restored
 */
export function playTaskRestoreSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const playSound = () => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.12); // A4

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => playSound()).catch(() => {});
    } else {
      playSound();
    }
  } catch (e) {
    console.warn('Audio restore playback failed', e);
  }
}

/**
 * Play a grand victory fanfare sound when all tasks are completed!
 */
export function playAllCompleteFanfare() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const playFanfare = () => {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, index) => {
        const startTime = now + index * 0.1;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        const duration = index === notes.length - 1 ? 0.6 : 0.2;
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => playFanfare()).catch(() => {});
    } else {
      playFanfare();
    }
  } catch (e) {
    console.warn('Fanfare playback failed', e);
  }
}
