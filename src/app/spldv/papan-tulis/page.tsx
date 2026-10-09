import type { Metadata } from "next";
import Whiteboard from "@/components/spldv/Whiteboard";

export const metadata: Metadata = { title: "Papan Mantra — Papan Tulis SPLDV" };

export default function WhiteboardPage() {
  return <Whiteboard />;
}
