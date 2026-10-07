import type { Metadata } from "next";
import { Fraunces, Nunito } from "next/font/google";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SPLDV — Kisah dari Hutan Dua Variabel",
  description:
    "Presentasi interaktif Sistem Persamaan Linear Dua Variabel (Matematika TKA 2026) bertema hutan dongeng, lengkap dengan misi soal dan kuis kelas.",
};

export default function SpldvLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="spldv-root" className={`${fraunces.variable} ${nunito.variable} spldv-fonts`}>
      {children}
    </div>
  );
}
