/**
 * Tiny Web Audio synth — no audio files, so it works offline.
 */
let ctx: AudioContext | null = null;
let muted = false;
const listeners = new Set<(m: boolean) => void>();

function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export const isMuted = () => muted;
export function setMuted(m: boolean) {
  muted = m;
  listeners.forEach((l) => l(m));
}
export function onMuteChange(l: (m: boolean) => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function tone(
  freq: number,
  {
    type = "sine" as OscillatorType,
    start = 0,
    dur = 0.15,
    vol = 0.2,
    to,
  }: { type?: OscillatorType; start?: number; dur?: number; vol?: number; to?: number } = {},
) {
  const c = ac();
  if (!c || muted) return;
  const t = c.currentTime + start;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

function noise({ dur = 0.4, vol = 0.12, from = 400, to = 3000 } = {}) {
  const c = ac();
  if (!c || muted) return;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 1.2;
  const t = c.currentTime;
  filter.frequency.setValueAtTime(from, t);
  filter.frequency.exponentialRampToValueAtTime(to, t + dur * 0.6);
  filter.frequency.exponentialRampToValueAtTime(from, t + dur);
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + dur * 0.4);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter).connect(gain).connect(c.destination);
  src.start(t);
}

export const sfx = {
  click: () => tone(720, { type: "triangle", dur: 0.06, vol: 0.12 }),
  pop: () => tone(900, { type: "sine", dur: 0.12, vol: 0.18, to: 300 }),
  whoosh: () => noise({ dur: 0.45, vol: 0.1 }),
  tick: () => tone(1250, { type: "square", dur: 0.04, vol: 0.05 }),
  correct: () => {
    tone(523.25, { type: "triangle", dur: 0.14, vol: 0.2 });
    tone(659.25, { type: "triangle", start: 0.09, dur: 0.14, vol: 0.2 });
    tone(783.99, { type: "triangle", start: 0.18, dur: 0.28, vol: 0.22 });
  },
  combo: () => {
    [659.25, 783.99, 987.77, 1318.5].forEach((f, i) =>
      tone(f, { type: "square", start: i * 0.07, dur: 0.12, vol: 0.07 }),
    );
  },
  wrong: () => {
    tone(180, { type: "sawtooth", dur: 0.18, vol: 0.12, to: 120 });
    tone(140, { type: "sawtooth", start: 0.16, dur: 0.3, vol: 0.12, to: 90 });
  },
  timeUp: () => {
    tone(440, { type: "square", dur: 0.15, vol: 0.08 });
    tone(330, { type: "square", start: 0.18, dur: 0.3, vol: 0.08 });
  },
  level: () => {
    noise({ dur: 0.6, vol: 0.08, from: 200, to: 1800 });
    [392, 523.25, 659.25].forEach((f, i) =>
      tone(f, { type: "triangle", start: 0.25 + i * 0.12, dur: 0.3, vol: 0.16 }),
    );
  },
  sparkle: () => {
    [1318.5, 1567.98, 2093].forEach((f, i) => tone(f, { type: "sine", start: i * 0.05, dur: 0.22, vol: 0.07 }));
  },
  page: () => noise({ dur: 0.3, vol: 0.07, from: 1800, to: 5000 }),
  fanfare: () => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      tone(f, { type: "triangle", start: i * 0.13, dur: 0.25, vol: 0.2 }),
    );
    tone(1046.5, { type: "triangle", start: 0.6, dur: 0.9, vol: 0.2 });
    tone(783.99, { type: "sine", start: 0.6, dur: 0.9, vol: 0.12 });
  },
};
