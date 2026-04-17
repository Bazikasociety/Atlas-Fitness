import type { Metadata } from "next";
import { Anton, Inter, Caveat } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { SmoothScroll } from "@/components/ui/smooth-scroll";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Atlas Fitness — Coach Sportif Personnel",
    template: "%s | Atlas Fitness",
  },
  description:
    "Coaching sportif personnalisé. Musculation, nutrition, développement mental. Yann Bazika — Coach certifié.",
  keywords: [
    "coach sportif",
    "musculation",
    "nutrition",
    "coaching personnalisé",
    "Atlas Fitness",
    "Yann Bazika",
    "mindset",
  ],
  authors: [{ name: "Yann Bazika" }],
  creator: "Atlas Fitness",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Atlas Fitness",
    title: "Atlas Fitness — Coach Sportif Personnel",
    description:
      "Coaching sportif personnalisé. Musculation, nutrition, développement mental.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atlas Fitness — Coach Sportif Personnel",
    description:
      "Coaching sportif personnalisé. Musculation, nutrition, développement mental.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${anton.variable} ${inter.variable} ${caveat.variable} antialiased bg-[#0A0A0A] text-[#FAFAFA] overflow-x-hidden`}
      >
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
