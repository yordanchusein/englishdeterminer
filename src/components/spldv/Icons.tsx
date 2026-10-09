import type { ReactNode } from "react";

/*
 * Hand-drawn storybook icons for /spldv — thick ink outline, flat forest
 * palette — used instead of emoji so they look the same on every device.
 */

const O = "#22301e"; // ink outline
const W = 3; // outline width
const PINK = "#e8478f";
const TEAL = "#129e94";
const GOLD = "#f7c548";
const GOLD_D = "#d99a1e";
const LEAF = "#2f744b";
const LEAF_L = "#5fb36f";
const BARK = "#7a5234";
const PARCH = "#fbf1dc";
const VIOLET = "#6a4bc4";
const RED = "#e5484d";
const SKY = "#7cc6f2";

const s = { stroke: O, strokeWidth: W, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

const ICONS = {
  /* ── maths ─────────────────────────────── */
  plus: <path {...s} fill={PINK} d="M19 7h10v12h12v10H29v12H19V29H7V19h12z" />,
  minus: <rect {...s} fill={TEAL} x="7" y="18" width="34" height="12" rx="4" />,
  up: (
    <>
      <rect {...s} fill={GOLD} x="5" y="5" width="38" height="38" rx="10" />
      <path {...s} fill={PARCH} d="M24 11 37 25h-8v12H19V25h-8z" />
    </>
  ),
  down: (
    <>
      <rect {...s} fill={SKY} x="5" y="5" width="38" height="38" rx="10" />
      <path {...s} fill={PARCH} d="M24 37 11 23h8V11h10v12h8z" />
    </>
  ),
  times: <path {...s} fill={VIOLET} d="M12 5l12 12L36 5l7 7-12 12 12 12-7 7-12-12-12 12-7-7 12-12L5 12z" />,

  /* ── things in the stories ─────────────── */
  books: (
    <>
      <rect {...s} fill={PINK} x="5" y="12" width="10" height="31" rx="2" />
      <rect {...s} fill={TEAL} x="15" y="7" width="10" height="36" rx="2" />
      <path {...s} fill={GOLD} d="M27 14l8-3 9 29-8 3z" />
      <path {...s} d="M8 20h4M18 15h4M18 35h4" />
    </>
  ),
  car: (
    <>
      <path {...s} fill={PINK} d="M4 33V25l5-1 5-9h18l6 9 6 1v8z" />
      <path {...s} fill={SKY} d="M17 18h6v6h-9zM27 18h4l4 6h-8z" />
      <circle {...s} fill="#3b3b3b" cx="14" cy="34" r="5" />
      <circle {...s} fill="#3b3b3b" cx="35" cy="34" r="5" />
    </>
  ),
  wheel: (
    <>
      <circle {...s} fill="#3b3b3b" cx="24" cy="24" r="19" />
      <circle {...s} fill="#c9c9c9" cx="24" cy="24" r="11" />
      <path {...s} d="M24 13v22M13 24h22M16 16l16 16M32 16 16 32" />
      <circle {...s} fill={GOLD} cx="24" cy="24" r="4" />
    </>
  ),
  bridge: (
    <>
      <path {...s} fill={BARK} d="M3 22h42v6c-6 0-10 4-11 12H14c-1-8-5-12-11-12z" />
      <path {...s} d="M3 22 9 12M45 22l-6-10M9 12h30M16 12v10M24 12v10M32 12v10" fill="none" />
      <path {...s} fill={SKY} d="M3 40c6-3 10 3 16 0s10-3 16 0 7 2 10 0v5H3z" />
    </>
  ),
  cottage: (
    <>
      <path {...s} fill={PARCH} d="M9 22h30v21H9z" />
      <path {...s} fill={PINK} d="M4 24 24 6l20 18z" />
      <path {...s} fill={BARK} d="M19 43V31h10v12z" />
      <rect {...s} fill={GOLD} x="12" y="27" width="5" height="5" />
      <path {...s} fill={BARK} d="M33 9h5v9l-5-4z" />
    </>
  ),
  flower: (
    <>
      <path {...s} fill="none" stroke={LEAF} d="M24 26v18" />
      <path {...s} fill={LEAF_L} d="M24 40c-8 0-12-6-12-10 6 0 12 4 12 10zM24 36c6 0 10-5 10-9-5 0-10 3-10 9z" />
      <path {...s} fill={PINK} d="M12 8l6 5 6-8 6 8 6-5v10c0 6-5 10-12 10s-12-4-12-10z" />
    </>
  ),
  pouch: (
    <>
      <path {...s} fill={BARK} d="M18 12h12l-3 5c9 3 14 11 14 18 0 6-6 9-17 9S7 41 7 35c0-7 5-15 14-18z" />
      <path {...s} fill={GOLD} d="M17 6h14l-4 6h-6z" />
      <circle {...s} fill={GOLD} cx="24" cy="31" r="7" />
      <path {...s} d="M24 27v8" />
    </>
  ),
  bread: (
    <>
      <path {...s} fill={GOLD_D} d="M5 30c0-12 9-20 19-20s19 8 19 20c-4 3-8 0-9-3-3 4-7 5-10 5s-7-1-10-5c-1 3-5 6-9 3z" />
      <path {...s} fill="none" d="M17 14c2 6 2 12 1 17M31 14c-2 6-2 12-1 17M24 11v19" />
    </>
  ),
  cave: (
    <>
      <path {...s} fill="#8a8f86" d="M3 43c1-14 7-26 15-31 6-4 14-3 19 3 5 6 8 16 8 28z" />
      <path {...s} fill="#1a1f17" d="M15 43c0-9 4-15 9-15s9 6 9 15z" />
      <circle fill={GOLD} cx="21" cy="36" r="1.8" />
      <circle fill={GOLD} cx="27" cy="36" r="1.8" />
    </>
  ),
  basket: (
    <>
      <path {...s} fill="none" d="M15 20c0-8 4-12 9-12s9 4 9 12" />
      <path {...s} fill={GOLD_D} d="M4 20h40l-5 22H9z" />
      <path {...s} d="M17 24l2 14M24 24v14M31 24l-2 14" />
    </>
  ),
  ruler: (
    <>
      <path {...s} fill={GOLD} d="M6 42V6l36 36z" />
      <path {...s} fill={PARCH} d="M14 34V24l10 10z" />
      <path {...s} d="M6 14h5M6 22h4M6 30h5M14 42v-4M22 42v-5M30 42v-4" />
    </>
  ),

  /* ── the three methods ─────────────────── */
  swap: (
    <>
      <path {...s} fill="none" stroke={PINK} strokeWidth={5} d="M10 20c2-7 8-11 15-11 6 0 11 3 14 8" />
      <path {...s} fill={PINK} d="M33 10l9 7-10 4z" />
      <path {...s} fill="none" stroke={TEAL} strokeWidth={5} d="M38 28c-2 7-8 11-15 11-6 0-11-3-14-8" />
      <path {...s} fill={TEAL} d="M15 38l-9-7 10-4z" />
    </>
  ),
  poof: (
    <>
      <path {...s} fill={PARCH} d="M10 34c-5 0-7-4-6-7s5-5 8-4c0-6 5-10 11-9 4-5 13-4 15 3 6 0 9 5 7 10-1 4-5 7-10 7z" />
      <path {...s} fill="none" d="M14 41h6M26 41h12" />
      <path fill={GOLD} stroke={O} strokeWidth={2} d="M40 4l1.5 4 4 1.5-4 1.5L40 15l-1.5-4-4-1.5 4-1.5z" />
    </>
  ),
  swirl: (
    <>
      <circle {...s} fill={VIOLET} cx="24" cy="24" r="19" />
      <path {...s} fill="none" stroke={PARCH} strokeWidth={4} d="M24 24c0-2 3-3 4-1s-1 6-5 6-7-4-6-8 6-8 11-7 9 6 8 11" />
    </>
  ),

  /* ── strategy ──────────────────────────── */
  book: (
    <>
      <path {...s} fill={PARCH} d="M24 12c-6-4-13-5-20-4v30c7-1 14 0 20 4 6-4 13-5 20-4V8c-7-1-14 0-20 4z" />
      <path {...s} d="M24 12v30M9 16c4 0 7 1 10 2M9 23c4 0 7 1 10 2M29 18c3-1 6-2 10-2M29 25c3-1 6-2 10-2" fill="none" />
    </>
  ),
  tag: (
    <>
      <path {...s} fill={GOLD} d="M24 5h17v17L22 41 5 24z" />
      <circle {...s} fill={PARCH} cx="34" cy="13" r="3.5" />
      <path {...s} d="M17 24l7 7M21 20l7 7" fill="none" />
    </>
  ),
  wand: (
    <>
      <path {...s} fill="#3b2a1c" d="M8 43 5 40l22-22 3 3z" />
      <path {...s} fill={GOLD} d="M34 4l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
      <circle fill={PINK} cx="16" cy="12" r="2.5" />
      <circle fill={TEAL} cx="40" cy="32" r="2.5" />
    </>
  ),
  swords: (
    <>
      <path {...s} fill="#d6dde3" d="M8 6l4-1 23 23-4 4L8 9z" />
      <path {...s} fill="#d6dde3" d="M40 6l-4-1-23 23 4 4L40 9z" />
      <path {...s} fill={BARK} d="M30 35l5-5 3 3-5 5zM18 35l-5-5-3 3 5 5z" />
      <path {...s} fill={GOLD} d="M27 32l9 9 3-3-9-9zM21 32l-9 9-3-3 9-9z" />
    </>
  ),

  /* ── places & creatures ────────────────── */
  tree: (
    <>
      <path {...s} fill={BARK} d="M20 30h8v14h-8z" />
      <path {...s} fill={LEAF} d="M24 4c8 0 13 6 13 11 5 2 7 6 6 11-1 6-7 8-12 7-2 2-5 3-7 3s-5-1-7-3c-5 1-11-1-12-7-1-5 1-9 6-11 0-5 5-11 13-11z" />
      <circle fill={GOLD} cx="17" cy="18" r="2" />
      <circle fill={GOLD} cx="30" cy="14" r="2" />
      <circle fill={GOLD} cx="31" cy="26" r="2" />
    </>
  ),
  pine: (
    <>
      <path {...s} fill={BARK} d="M21 38h6v7h-6z" />
      <path {...s} fill={LEAF} d="M24 3l11 14h-5l10 11h-6l9 11H5l9-11H8l10-11h-5z" />
    </>
  ),
  mushroom: (
    <>
      <path {...s} fill={PARCH} d="M18 26h12l2 16c0 2-3 3-8 3s-8-1-8-3z" />
      <path {...s} fill={PINK} d="M4 27C4 14 13 6 24 6s20 8 20 21z" />
      <circle fill="#fff" cx="16" cy="17" r="3" />
      <circle fill="#fff" cx="28" cy="13" r="3.5" />
      <circle fill="#fff" cx="35" cy="21" r="2.5" />
    </>
  ),
  dragon: (
    <>
      <path {...s} fill={GOLD} d="M14 14 10 3l11 8M34 14l4-11-11 8" />
      <path {...s} fill={TEAL} d="M24 8c11 0 18 8 18 18 0 9-7 15-18 15S6 35 6 26C6 16 13 8 24 8z" />
      <path {...s} fill="#7be0d4" d="M14 31c3 5 7 7 10 7s7-2 10-7c-3-2-6-3-10-3s-7 1-10 3z" />
      <circle fill={O} cx="17" cy="21" r="3" />
      <circle fill={O} cx="31" cy="21" r="3" />
      <circle fill={O} cx="21" cy="33" r="1.4" />
      <circle fill={O} cx="27" cy="33" r="1.4" />
    </>
  ),
  owl: (
    <>
      <path {...s} fill={BARK} d="M8 10l6 5c3-2 7-3 10-3s7 1 10 3l6-5v20c0 9-7 15-16 15S8 39 8 30z" />
      <path {...s} fill={PARCH} d="M17 32c2 4 5 6 7 6s5-2 7-6c-2-3-4-4-7-4s-5 1-7 4z" />
      <circle {...s} fill="#fff" cx="17" cy="22" r="6" />
      <circle {...s} fill="#fff" cx="31" cy="22" r="6" />
      <circle fill={O} cx="17" cy="22" r="2.6" />
      <circle fill={O} cx="31" cy="22" r="2.6" />
      <path {...s} fill={GOLD} d="M22 26h4l-2 4z" />
    </>
  ),

  /* ── interface ─────────────────────────── */
  scroll: (
    <>
      <path {...s} fill={PARCH} d="M12 8h26v28c0 3-2 5-5 5H9" />
      <path {...s} fill="#efdcb4" d="M12 8c-3 0-5 2-5 4s2 4 5 4M33 41c3 0 5-2 5-5H28c0 3 2 5 5 5z" />
      <path {...s} d="M17 16h15M17 22h15M17 28h10" fill="none" />
    </>
  ),
  pointer: (
    <>
      <path {...s} fill={PARCH} d="M10 6l26 16-11 3 7 13-6 3-7-13-9 8z" />
      <path fill={GOLD} stroke={O} strokeWidth={2} d="M38 30l1.5 4 4 1.5-4 1.5L38 41l-1.5-4-4-1.5 4-1.5z" />
    </>
  ),
  lantern: (
    <>
      <circle cx="24" cy="28" r="20" fill={GOLD} opacity="0.35" />
      <path {...s} fill="none" d="M18 9c0-4 12-4 12 0" />
      <path {...s} fill={BARK} d="M15 10h18v4H15zM15 40h18v4H15z" />
      <path {...s} fill={GOLD} d="M17 14h14l2 13-2 13H17l-2-13z" />
      <path fill="#fff6cf" d="M24 20c3 4 3 9 0 12-3-3-3-8 0-12z" />
    </>
  ),
  candle: (
    <>
      <path {...s} fill={PARCH} d="M17 20h14v22H17z" />
      <path {...s} fill="#a6a6a6" d="M10 42h28v4H10z" />
      <path {...s} d="M24 20v-4" />
      <path fill="#cfcfcf" stroke={O} strokeWidth={2} d="M24 6c3 3 3 7 0 9-3-2-3-6 0-9z" opacity="0.6" />
    </>
  ),
  crystal: (
    <>
      <path {...s} fill={BARK} d="M12 38h24l3 7H9z" />
      <circle {...s} fill="#b9a6f2" cx="24" cy="22" r="16" />
      <path fill="#fff" opacity="0.7" d="M16 16c2-4 6-6 10-6-4 2-7 5-8 9z" />
      <path fill={GOLD} d="M28 22l1.5 3.5 3.5 1.5-3.5 1.5L28 32l-1.5-3.5L23 27l3.5-1.5z" />
    </>
  ),
  quill: (
    <>
      <path {...s} fill={PARCH} d="M40 4C26 6 16 16 12 32l4 2C26 24 36 16 40 4z" />
      <path {...s} fill="none" d="M15 30C22 22 30 14 37 8" />
      <path {...s} d="M12 32 7 44" />
    </>
  ),
  check: (
    <>
      <circle {...s} fill="#1faa62" cx="24" cy="24" r="19" />
      <path {...s} fill="none" stroke="#fff" strokeWidth={5} d="M14 25l7 7 13-15" />
    </>
  ),
  cross: (
    <>
      <circle {...s} fill={RED} cx="24" cy="24" r="19" />
      <path {...s} fill="none" stroke="#fff" strokeWidth={5} d="M16 16l16 16M32 16 16 32" />
    </>
  ),
  star: <path {...s} fill={GOLD} d="M24 4l6 13 14 1-11 9 4 14-13-8-13 8 4-14L4 18l14-1z" />,
  trophy: (
    <>
      <path {...s} fill="none" d="M13 12H6c0 8 4 12 9 12M35 12h7c0 8-4 12-9 12" />
      <path {...s} fill={GOLD} d="M13 6h22v10c0 8-5 13-11 13S13 24 13 16z" />
      <path {...s} fill={GOLD_D} d="M20 29h8l2 8H18z" />
      <path {...s} fill={BARK} d="M13 37h22v7H13z" />
    </>
  ),
  warning: (
    <>
      <path {...s} fill={GOLD} d="M24 5l21 37H3z" />
      <path {...s} fill="none" strokeWidth={4.5} d="M24 18v11" />
      <circle fill={O} cx="24" cy="35.5" r="2.6" />
    </>
  ),
  target: (
    <>
      <circle {...s} fill="#fff" cx="22" cy="26" r="18" />
      <circle {...s} fill={PINK} cx="22" cy="26" r="12" />
      <circle {...s} fill="#fff" cx="22" cy="26" r="6" />
      <path {...s} d="M22 26 42 6" />
      <path {...s} fill={TEAL} d="M36 6h7v7l-4 1-4-4z" />
    </>
  ),
  bulb: (
    <>
      <path {...s} fill={GOLD} d="M24 4c9 0 15 7 15 14 0 6-4 9-6 13H15c-2-4-6-7-6-13 0-7 6-14 15-14z" />
      <path {...s} fill="#c9c9c9" d="M16 31h16v6H16zM18 37h12v5H18z" />
      <path fill="#fff" opacity="0.7" d="M16 15c1-4 4-6 8-6-3 2-5 4-6 8z" />
    </>
  ),
  flame: (
    <>
      <path {...s} fill="#ff7a45" d="M24 44c-9 0-15-6-15-14 0-9 8-13 9-24 6 4 9 9 9 14 2-2 3-5 3-7 5 4 9 10 9 17 0 8-6 14-15 14z" />
      <path fill={GOLD} d="M24 41c-4 0-7-3-7-7 0-5 4-7 5-12 3 3 5 6 5 9 1-1 2-2 2-3 2 2 3 4 3 6 0 4-3 7-8 7z" />
    </>
  ),
  hourglass: (
    <>
      <path {...s} fill={BARK} d="M9 4h30v5H9zM9 39h30v5H9z" />
      <path {...s} fill="#e9f6ff" d="M13 9h22c0 9-8 11-8 15s8 6 8 15H13c0-9 8-11 8-15s-8-6-8-15z" />
      <path fill={GOLD} d="M17 37c2-4 5-6 7-6s5 2 7 6zM19 15h10c-1 3-3 4-5 6-2-2-4-3-5-6z" />
    </>
  ),
  soundOn: (
    <>
      <path {...s} fill={PARCH} d="M5 18h9l12-10v32L14 30H5z" />
      <path {...s} fill="none" d="M32 17c3 3 3 11 0 14M37 12c6 6 6 18 0 24" />
    </>
  ),
  soundOff: (
    <>
      <path {...s} fill={PARCH} d="M5 18h9l12-10v32L14 30H5z" />
      <path {...s} fill="none" stroke={RED} d="M32 18l12 12M44 18 32 30" />
    </>
  ),
  fullscreen: <path {...s} fill="none" strokeWidth={4} d="M6 17V6h11M31 6h11v11M42 31v11H31M17 42H6V31" />,
  close: <path {...s} fill="none" strokeWidth={5} d="M12 12l24 24M36 12 12 36" />,
  sparkle: <path {...s} strokeWidth={2.5} fill={GOLD} d="M24 3c2 12 6 16 21 21-15 4-19 9-21 21-2-12-6-17-21-21C18 19 22 15 24 3z" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof ICONS;

export default function Icon({ name, className = "h-6 w-6", label }: { name: IconName; className?: string; label?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={`inline-block shrink-0 overflow-visible align-middle ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {ICONS[name]}
    </svg>
  );
}
