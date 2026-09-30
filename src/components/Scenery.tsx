import type { CSSProperties } from "react";

/* ─── Cloud ─────────────────────────────────────────────── */
export function Cloud({
  className = "",
  style,
  fill = "#fff",
  ...rest
}: {
  className?: string;
  style?: CSSProperties;
  fill?: string;
  [data: `data-${string}`]: string | number | undefined;
}) {
  return (
    <svg viewBox="0 0 220 110" className={className} style={style} aria-hidden {...rest}>
      <g fill={fill}>
        <ellipse cx="110" cy="80" rx="100" ry="28" />
        <circle cx="70" cy="62" r="34" />
        <circle cx="118" cy="46" r="44" />
        <circle cx="162" cy="66" r="30" />
      </g>
    </svg>
  );
}

/* ─── Sun ───────────────────────────────────────────────── */
export function Sun({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
        <g className="sun-rays" style={{ transformOrigin: "100px 100px" }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <rect
              key={i}
              x="96"
              y="-6"
              width="8"
              height="34"
              rx="4"
              fill="#FFC83D"
              transform={`rotate(${i * 30} 100 100)`}
            />
          ))}
        </g>
        <circle cx="100" cy="100" r="58" fill="#FFD66B" />
        <circle cx="100" cy="100" r="46" fill="#FFC83D" />
      </svg>
    </div>
  );
}

/* ─── Birds ─────────────────────────────────────────────── */
export function Bird({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 40 16" className={className} style={style} aria-hidden>
      <path
        className="bird-wing"
        d="M2 12 Q 11 2 20 10 Q 29 2 38 12"
        fill="none"
        stroke="#13294B"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ transformOrigin: "20px 10px" }}
      />
    </svg>
  );
}

/* ─── Mountain layers ───────────────────────────────────── */
const FAR =
  "M0 400 L0 250 L120 180 L200 220 L330 90 L420 170 L520 120 L640 210 L760 60 L880 180 L980 130 L1100 200 L1220 80 L1340 170 L1440 140 L1440 400 Z";
const SNOW = [
  "M300 120 L330 90 L364 120 L350 112 L338 124 L324 112 L312 122 Z",
  "M736 90 L760 60 L790 90 L778 84 L766 96 L754 84 L744 94 Z",
  "M1190 110 L1220 80 L1260 110 L1246 102 L1234 114 L1220 102 L1206 112 Z",
];
const MID =
  "M0 400 L0 280 L90 230 L180 270 L300 180 L400 250 L480 220 L600 290 L700 200 L820 260 L940 190 L1040 250 L1150 210 L1260 270 L1360 220 L1440 250 L1440 400 Z";
const NEAR =
  "M0 400 L0 320 C150 270 260 300 380 310 C520 322 600 260 760 280 C900 298 1000 330 1120 300 C1240 270 1340 290 1440 300 L1440 400 Z";
const FRONT =
  "M0 400 L0 362 C300 342 500 372 720 356 C960 340 1200 372 1440 350 L1440 400 Z";

// deterministic pseudo-random so SSR and client match
const rand = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
// rounded so server and browser float math produce identical markup
const r1 = (n: number) => Math.round(n * 10) / 10;
const TREES = Array.from({ length: 56 }).map((_, i) => {
  const x = r1(i * 26 + rand(i) * 14 - 6);
  const h = r1(34 + rand(i + 100) * 46);
  const w = r1(h * 0.34);
  const base = r1(364 - Math.sin(i / 5) * 6);
  return `M${r1(x - w)} ${base} L${x} ${r1(base - h)} L${r1(x + w)} ${base} Z M${r1(x - w * 0.8)} ${r1(
    base - h * 0.4,
  )} L${x} ${r1(base - h * 1.12)} L${r1(x + w * 0.8)} ${r1(base - h * 0.4)} Z`;
});

export type MountainPalette = {
  far: string;
  snow: string;
  mid: string;
  near: string;
  front: string;
};

export const dayPalette: MountainPalette = {
  far: "#A9C8EE",
  snow: "#FFFFFF",
  mid: "#6FA8D6",
  near: "#79C27F",
  front: "#2F7A55",
};

export function MountainLayer({
  layer,
  palette = dayPalette,
  className = "",
  style,
}: {
  layer: "far" | "mid" | "near" | "front";
  palette?: MountainPalette;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 1440 400"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      style={style}
      aria-hidden
    >
      {layer === "far" && (
        <>
          <path d={FAR} fill={palette.far} />
          {SNOW.map((d) => (
            <path key={d} d={d} fill={palette.snow} />
          ))}
        </>
      )}
      {layer === "mid" && <path d={MID} fill={palette.mid} />}
      {layer === "near" && <path d={NEAR} fill={palette.near} />}
      {layer === "front" && (
        <g fill={palette.front}>
          <path d={FRONT} />
          {TREES.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      )}
    </svg>
  );
}

/** Small decorative silhouette used at the bottom of panels/cards. */
export function Ridge({ color, className = "" }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className={className} aria-hidden>
      <path d={MID} fill={color} />
    </svg>
  );
}

/* ─── Highlighted text: **word** → coloured pill ────────── */
export function Highlight({ text, color }: { text: string; color: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") ? (
          <span key={i} className="hl" style={{ background: color }}>
            {p.slice(2, -2)}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}
