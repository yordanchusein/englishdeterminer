import type { CSSProperties } from "react";

/* Deterministic pseudo-random so server and client render the same sky. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ─── Stars ─────────────────────────────────────────────── */
export function Stars({ count = 70, seed = 7, className = "" }: { count?: number; seed?: number; className?: string }) {
  const r = seeded(seed);
  const stars = Array.from({ length: count }, () => ({
    x: r() * 100,
    y: r() * 100,
    s: 2 + r() * 4,
    d: r() * 3,
  }));
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      {stars.map((st, i) => (
        <span
          key={i}
          className="tw-star absolute rounded-full bg-white"
          style={{
            left: `${st.x}%`,
            top: `${st.y}%`,
            width: st.s,
            height: st.s,
            boxShadow: `0 0 ${st.s * 2}px rgba(255,255,255,0.9)`,
            animation: `twinkle ${2 + st.d}s ease-in-out ${st.d}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Sparkle (4-point star) ────────────────────────────── */
export function Sparkle({ className = "", fill = "#F7C548", style }: { className?: string; fill?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} aria-hidden>
      <path d="M20 0 C22 14 26 18 40 20 C26 22 22 26 20 40 C18 26 14 22 0 20 C14 18 18 14 20 0Z" fill={fill} />
    </svg>
  );
}

/* ─── Moon ──────────────────────────────────────────────── */
export function Moon({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
        <defs>
          <radialGradient id="moonGlow">
            <stop offset="0.45" stopColor="#fff6cf" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fff6cf" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle className="moon-glow" cx="100" cy="100" r="100" fill="url(#moonGlow)" />
        <circle cx="100" cy="100" r="56" fill="#fff3c4" />
        <circle cx="80" cy="84" r="10" fill="#f1dfa0" />
        <circle cx="118" cy="118" r="14" fill="#f1dfa0" />
        <circle cx="122" cy="80" r="6" fill="#f1dfa0" />
      </svg>
    </div>
  );
}

/* ─── Great Tree (the forest's heart: a glowing tree-house) ─ */
export function GreatTree({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const bark = "#4a3423";
  const barkDark = "#33241a";
  const leaf = ["#1c4f35", "#245f3f", "#2f744b"];
  const glow = "#ffd66b";
  return (
    <svg viewBox="0 0 400 320" className={className} style={style} aria-hidden>
      {/* canopy, back to front */}
      <g className="tree-canopy" style={{ transformOrigin: "200px 150px" }}>
        <circle cx="110" cy="110" r="70" fill={leaf[0]} />
        <circle cx="290" cy="105" r="72" fill={leaf[0]} />
        <circle cx="200" cy="70" r="80" fill={leaf[1]} />
        <circle cx="150" cy="140" r="62" fill={leaf[1]} />
        <circle cx="255" cy="140" r="64" fill={leaf[1]} />
        <circle cx="200" cy="120" r="58" fill={leaf[2]} />
        <circle cx="70" cy="150" r="40" fill={leaf[1]} />
        <circle cx="335" cy="150" r="40" fill={leaf[1]} />
      </g>
      {/* trunk + roots */}
      <path
        d="M165 320 C170 270 172 230 168 190 C150 180 130 178 112 168 C140 168 160 166 172 172 C176 150 182 136 188 128 L212 128 C218 140 224 152 228 172 C244 164 266 166 290 166 C270 176 248 182 232 192 C228 232 232 272 238 320Z"
        fill={bark}
      />
      <path d="M150 320 C160 300 166 296 170 290 M250 320 C240 300 234 296 232 290" stroke={barkDark} strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M190 160 C186 200 192 240 188 280 M214 170 C218 210 212 250 216 290" stroke={barkDark} strokeWidth="3" fill="none" opacity="0.6" />
      {/* door */}
      <path d="M182 320 V282 a18 18 0 0 1 36 0 V320Z" fill="#1a120c" />
      <path className="tree-win" d="M186 320 V284 a14 14 0 0 1 28 0 V320Z" fill={glow} opacity="0.9" />
      <circle cx="208" cy="302" r="2.5" fill="#7a4f12" />
      {/* round windows */}
      <g className="tree-win" fill={glow}>
        <circle cx="200" cy="222" r="11" />
        <circle cx="152" cy="118" r="8" />
        <circle cx="246" cy="104" r="9" />
        <circle cx="196" cy="62" r="7" />
      </g>
      <g stroke={barkDark} strokeWidth="2.5" fill="none">
        <circle cx="200" cy="222" r="11" />
        <path d="M189 222 H211 M200 211 V233" />
      </g>
      {/* hanging lanterns */}
      {[
        [96, 160, 26],
        [310, 158, 30],
        [130, 186, 20],
        [272, 190, 22],
      ].map(([x, y, len], i) => (
        <g key={i} className="tree-lantern" style={{ transformOrigin: `${x}px ${y}px` }}>
          <line x1={x} y1={y} x2={x} y2={y + len} stroke={barkDark} strokeWidth="2" />
          <circle cx={x} cy={y + len + 7} r="11" fill={glow} opacity="0.3" />
          <rect x={x - 6} y={y + len} width="12" height="14" rx="4" fill={glow} stroke={barkDark} strokeWidth="2" />
        </g>
      ))}
      {/* mushrooms at the roots */}
      <g stroke="#22301e" strokeWidth="2.5">
        <rect x="128" y="300" width="8" height="18" rx="3" fill="#fbf1dc" />
        <path d="M118 304 C118 288 146 288 146 304Z" fill="#e8478f" />
        <rect x="262" y="304" width="7" height="14" rx="3" fill="#fbf1dc" />
        <path d="M254 307 C254 294 277 294 277 307Z" fill="#f7c548" />
      </g>
    </svg>
  );
}

/* ─── Tree lines: rows of pines along the bottom ───────── */
export function TreeLine({
  className = "",
  fill = "#0b231d",
  seed = 1,
  count = 26,
  min = 40,
  max = 100,
}: {
  className?: string;
  fill?: string;
  seed?: number;
  count?: number;
  min?: number;
  max?: number;
}) {
  const r = seeded(seed);
  const trees = Array.from({ length: count }, (_, i) => {
    const h = min + r() * (max - min);
    const w = h * (0.42 + r() * 0.12);
    const x = (i / (count - 1)) * 1200 + (r() - 0.5) * 30;
    return { x, h, w };
  });
  return (
    <svg viewBox="0 0 1200 140" preserveAspectRatio="none" className={className} aria-hidden>
      {trees.map((t, i) => {
        const base = 140;
        const top = base - t.h - 12;
        const hw = t.w / 2;
        return (
          <path
            key={i}
            fill={fill}
            d={`M${t.x} ${top} L${t.x + hw * 0.7} ${top + t.h * 0.38} H${t.x + hw * 0.4} L${t.x + hw} ${top + t.h * 0.75} H${t.x + hw * 0.55} L${t.x + hw * 1.15} ${base} H${t.x - hw * 1.15} L${t.x - hw * 0.55} ${top + t.h * 0.75} H${t.x - hw} L${t.x - hw * 0.4} ${top + t.h * 0.38} H${t.x - hw * 0.7}Z`}
          />
        );
      })}
      <rect x="0" y="128" width="1200" height="12" fill={fill} />
    </svg>
  );
}

/* ─── Rolling hills ─────────────────────────────────────── */
const HILLS = {
  far: { d: "M0 140 C140 60 260 110 380 80 C520 40 640 120 800 70 C920 40 1040 90 1200 60 V300 H0Z", fill: "#22553b" },
  mid: { d: "M0 170 C120 120 260 160 420 120 C560 90 700 150 860 120 C1000 95 1100 140 1200 110 V300 H0Z", fill: "#17402f" },
  near: { d: "M0 200 C160 160 300 210 480 180 C640 150 800 210 980 175 C1080 160 1150 180 1200 170 V300 H0Z", fill: "#133a2c" },
  front: { d: "M0 240 C200 205 380 250 600 225 C820 200 1000 245 1200 220 V300 H0Z", fill: "#0b231d" },
} as const;

export function Hills({ layer, className = "" }: { layer: keyof typeof HILLS; className?: string }) {
  const h = HILLS[layer];
  return (
    <svg viewBox="0 0 1200 300" preserveAspectRatio="none" className={className} aria-hidden>
      <path d={h.d} fill={h.fill} />
    </svg>
  );
}

/* ─── Trees ─────────────────────────────────────────────── */
export function Pine({ className = "", fill = "#0b231d", style }: { className?: string; fill?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 60 120" className={className} style={style} aria-hidden>
      <rect x="26" y="96" width="8" height="24" fill={fill} />
      <path d="M30 0 L56 52 H42 L58 82 H40 L60 104 H0 L20 82 H2 L18 52 H4Z" fill={fill} />
    </svg>
  );
}

export function Mushroom({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 60 60" className={className} style={style} aria-hidden>
      <rect x="22" y="30" width="16" height="28" rx="6" fill="#fbf1dc" stroke="#22301e" strokeWidth="3" />
      <path d="M4 32 C4 10 56 10 56 32Z" fill="#e8478f" stroke="#22301e" strokeWidth="3" />
      <circle cx="20" cy="22" r="4" fill="#fff" />
      <circle cx="36" cy="18" r="5" fill="#fff" />
      <circle cx="46" cy="27" r="3" fill="#fff" />
    </svg>
  );
}

/* ─── Characters: Peri x & Naga y ───────────────────────── */
export function FairyX({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} aria-hidden>
      <g className="fx-wings" style={{ transformOrigin: "60px 62px" }}>
        <ellipse cx="34" cy="50" rx="26" ry="16" transform="rotate(-30 34 50)" fill="#ffd1e6" stroke="#22301e" strokeWidth="3" />
        <ellipse cx="86" cy="50" rx="26" ry="16" transform="rotate(30 86 50)" fill="#ffd1e6" stroke="#22301e" strokeWidth="3" />
      </g>
      <circle cx="60" cy="64" r="30" fill="#e8478f" stroke="#22301e" strokeWidth="4" />
      <text x="60" y="78" textAnchor="middle" fontSize="40" fontWeight="900" fontStyle="italic" fill="#fff" fontFamily="Georgia, serif">
        x
      </text>
      <path d="M48 30 L52 20 L60 28 L68 20 L72 30Z" fill="#f7c548" stroke="#22301e" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

export function DragonY({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} aria-hidden>
      <g className="dy-wing" style={{ transformOrigin: "36px 56px" }}>
        <path d="M36 56 L6 26 L14 50 L2 52 L30 70Z" fill="#7be0d4" stroke="#22301e" strokeWidth="3" strokeLinejoin="round" />
      </g>
      <path d="M86 92 C108 96 112 78 104 70" fill="none" stroke="#22301e" strokeWidth="9" strokeLinecap="round" />
      <path d="M86 92 C108 96 112 78 104 70" fill="none" stroke="#129e94" strokeWidth="5" strokeLinecap="round" />
      <circle cx="60" cy="66" r="30" fill="#129e94" stroke="#22301e" strokeWidth="4" />
      <path d="M44 38 L40 24 L52 34 M76 38 L80 24 L68 34" stroke="#22301e" strokeWidth="4" fill="#f7c548" strokeLinejoin="round" />
      <text x="60" y="80" textAnchor="middle" fontSize="40" fontWeight="900" fontStyle="italic" fill="#fff" fontFamily="Georgia, serif">
        y
      </text>
    </svg>
  );
}
