import gsap from "gsap";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";

// registers only what the confetti needs, so pages can pick their own GSAP setup
if (typeof window !== "undefined") gsap.registerPlugin(Physics2DPlugin);

const COLORS = ["#FF7A45", "#2B8CFF", "#E6457A", "#25A06B", "#FFC83D", "#7C5CE6", "#0FA3B1", "#FFFFFF"];

function layer() {
  let el = document.getElementById("confetti-layer");
  if (!el) {
    el = document.createElement("div");
    el.id = "confetti-layer";
    el.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:200;overflow:hidden";
    document.body.appendChild(el);
  }
  return el;
}

function piece(x: number, y: number) {
  const p = document.createElement("div");
  const size = gsap.utils.random(8, 16);
  const round = Math.random() > 0.6;
  p.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${
    round ? size : size * 0.45
  }px;background:${gsap.utils.random(COLORS)};border-radius:${round ? "50%" : "2px"};`;
  layer().appendChild(p);
  return p;
}

/**
 * Confetti is often fired from a component's GSAP context (e.g. a quiz card).
 * Starting the tweens in a microtask keeps them out of that context, so when
 * the component unmounts its revert can't freeze half-flown pieces on screen.
 */
const detached = (fn: () => void) => queueMicrotask(fn);

/** Radial burst from a point (e.g. the clicked answer). */
export function burst(x: number, y: number, count = 70) {
  detached(() => {
    for (let i = 0; i < count; i++) {
    const p = piece(x, y);
    gsap.to(p, {
      duration: gsap.utils.random(1.4, 2.4),
      physics2D: {
        velocity: gsap.utils.random(350, 900),
        angle: gsap.utils.random(200, 340),
        gravity: 1100,
      },
      rotation: gsap.utils.random(-720, 720),
      rotationX: gsap.utils.random(-360, 360),
      opacity: 0,
      ease: "power1.in",
      onComplete: () => p.remove(),
      onInterrupt: () => p.remove(),
    });
    }
  });
}

/** Rain from the top of the screen (results screen). */
export function rain(count = 160) {
  const w = window.innerWidth;
  detached(() => {
    for (let i = 0; i < count; i++) {
    const p = piece(gsap.utils.random(0, w), -30);
    gsap.to(p, {
      delay: gsap.utils.random(0, 1.6),
      duration: gsap.utils.random(2.5, 4.5),
      y: window.innerHeight + 80,
      x: `+=${gsap.utils.random(-160, 160)}`,
      rotation: gsap.utils.random(-900, 900),
      rotationY: gsap.utils.random(-720, 720),
      ease: "none",
      onComplete: () => p.remove(),
      onInterrupt: () => p.remove(),
    });
    }
  });
}

export function burstFrom(el: Element | null, count?: number) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, count);
}
