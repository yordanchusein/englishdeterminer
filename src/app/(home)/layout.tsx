import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";

// Loaded here instead of the root layout so /spldv doesn't download them.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${bricolage.variable} ${jakarta.variable} home-fonts`}>{children}</div>;
}
