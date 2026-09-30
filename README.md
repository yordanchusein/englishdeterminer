# Determiners — Small Words, Big Job

An interactive English grammar presentation about **determiners**, built for a class presentation on one screen. Mountain-themed, animation-heavy (GSAP), with a 20-question class challenge.

## What's inside

- **Preloader** — clouds part while a hiker climbs to the summit.
- **Lesson** — "What is a determiner?", then a pinned horizontal trail through 7 types (articles, demonstratives, possessives, quantifiers, numbers, distributives, interrogatives), each with a live animated demo, rules, examples and a common mistake.
- **Recap** — flip cards summarising every type.
- **Summit Challenge** — 20 high-school level questions in 3 levels (multiple choice, drag & drop, spot the error, multi-gap), with timer, combo streaks, confetti, explanations and a results screen.

## Presenter controls

| Key | Action |
| --- | --- |
| `→` / `Space` / `←` | Next / previous section |
| `Enter` | Start the quiz / next question |
| `A–D` or `1–4` | Answer (drag & drop: place chip) |
| `Backspace` | Clear last gap (drag & drop) |
| `P` | Pause timer |
| `Esc` | Leave the quiz (progress kept) |
| `F` / `M` | Fullscreen / sound |

## Running

```bash
npm install
npm run dev
```

For the actual presentation use the production build — it is much smoother and works offline (fonts and libraries are bundled):

```bash
npm run build
npm run start
```

## Stack

Next.js · Tailwind CSS · GSAP (ScrollTrigger, SplitText, Flip, Draggable, ScrambleText, Physics2D) · Lenis
