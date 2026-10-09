import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Determiners — Small Words, Big Job",
  description: "An interactive English presentation about determiners, with a 20-question class challenge.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased">
      <body>{children}</body>
    </html>
  );
}
