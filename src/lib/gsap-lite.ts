"use client";

/**
 * GSAP for /spldv: only the plugins that lesson uses, so it doesn't ship
 * Flip, Draggable and ScrambleText (those stay in ./gsap for the home page).
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, TextPlugin);
  gsap.config({ nullTargetWarn: false });
  if (process.env.NODE_ENV !== "production") (window as unknown as { gsap: typeof gsap }).gsap = gsap;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
