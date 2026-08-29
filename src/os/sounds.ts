let ctx: AudioContext | null = null;
let muted = false;
try {
  muted = localStorage.getItem('portfolioos-muted') === '1';
} catch { /* ignore */ }

function ac(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, delay: number, dur: number, type: OscillatorType = 'sine', vol = 0.06) {
  const a = ac();
  const t = a.currentTime + delay;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export const sounds = {
  isMuted: () => muted,
  setMuted(m: boolean) {
    muted = m;
    try { localStorage.setItem('portfolioos-muted', m ? '1' : '0'); } catch { /* ignore */ }
  },
  click()    { if (!muted) tone(900, 0, 0.05, 'square', 0.025); },
  startup()  { if (muted) return; tone(523.25, 0, 0.35); tone(659.25, 0.12, 0.35); tone(783.99, 0.24, 0.55); },
  shutdown() { if (muted) return; tone(783.99, 0, 0.3); tone(659.25, 0.12, 0.3); tone(523.25, 0.24, 0.5); },
  error()    { if (muted) return; tone(220, 0, 0.15, 'sawtooth', 0.05); tone(174, 0.14, 0.3, 'sawtooth', 0.05); },
};