const audioCtx = () => new (window.AudioContext || (window as any).webkitAudioContext)();

let ctx: AudioContext | null = null;
const getCtx = () => {
  if (!ctx) ctx = audioCtx();
  return ctx;
};

function isSoundEnabled(): boolean {
  try {
    const stored =
      localStorage.getItem("randomizr_sound_enabled") ??
      localStorage.getItem("pickr_sound_enabled");
    return stored === null ? true : JSON.parse(stored);
  } catch {
    return true;
  }
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  if (!isSoundEnabled()) return;
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

// Drumroll using filtered noise bursts that build in intensity
let drumrollTimers: number[] = [];
function stopDrumroll() {
  drumrollTimers.forEach((t) => clearTimeout(t));
  drumrollTimers = [];
}

function drumroll(duration = 1500) {
  if (!isSoundEnabled()) return;
  stopDrumroll();
  const c = getCtx();
  const start = performance.now();
  const tick = () => {
    const elapsed = performance.now() - start;
    if (elapsed >= duration) return;
    // intensity ramps up
    const intensity = 0.3 + (elapsed / duration) * 0.7;
    const interval = 80 - intensity * 50; // gets faster
    // short noise burst
    const bufferSize = 0.04 * c.sampleRate;
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const src = c.createBufferSource();
    src.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 180;
    filter.Q.value = 1.5;
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.18 * intensity, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.05);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(c.destination);
    src.start();
    src.stop(c.currentTime + 0.05);
    const id = window.setTimeout(tick, interval);
    drumrollTimers.push(id);
  };
  tick();
}

function tada() {
  if (!isSoundEnabled()) return;
  // Cheerful ascending fanfare
  playTone(523, 0.12, 'triangle', 0.18); // C5
  setTimeout(() => playTone(659, 0.12, 'triangle', 0.18), 90); // E5
  setTimeout(() => playTone(784, 0.12, 'triangle', 0.18), 180); // G5
  setTimeout(() => {
    playTone(1047, 0.45, 'triangle', 0.22); // C6
    playTone(1319, 0.45, 'sine', 0.14); // E6 harmony
  }, 280);
}

export const sounds = {
  click: () => playTone(800, 0.08, 'sine', 0.1),
  tick: () => playTone(1200, 0.05, 'sine', 0.08),
  win: () => {
    stopDrumroll();
    tada();
  },
  spin: () => playTone(400, 0.1, 'triangle', 0.08),
  countdown: () => playTone(600, 0.2, 'square', 0.08),
  flip: () => playTone(500, 0.15, 'triangle', 0.1),
  roll: () => drumroll(1700),
  drumroll,
  stopDrumroll,
  tada,
  mystic: () => {
    playTone(220, 0.5, 'sine', 0.1);
    setTimeout(() => playTone(330, 0.5, 'sine', 0.1), 200);
    setTimeout(() => playTone(440, 0.8, 'sine', 0.15), 400);
  },
};

// Trigger a global "winner picked" hype effect: screen shake + neon pulse
export function triggerWinHype() {
  const root = document.documentElement;
  root.classList.remove("hype-shake");
  // force reflow
  void root.offsetWidth;
  root.classList.add("hype-shake");
  window.setTimeout(() => root.classList.remove("hype-shake"), 700);
}
