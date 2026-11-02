import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";

import { Navbar } from "@/components/Navbar";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#EEF2F4",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "TheBeyondSearch | Put your marketing on autopilot",
  description:
    "Your AI workforce for search, visibility and organic growth. Put your marketing on autopilot.",
  applicationName: "TheBeyondSearch",
  authors: [{ name: "TheBeyondSearch", url: "https://thebeyondsearch.com" }],
  creator: "TheBeyondSearch",
  publisher: "TheBeyondSearch",
  icons: [
    {
      rel: "icon",
      type: "image/webp",
      sizes: "1254x1254",
      url: "/icons/brands/favicon.webp",
    },
  ],
  openGraph: {
    title: "TheBeyondSearch | Put your marketing on autopilot",
    description:
      "Your AI workforce for search, visibility and organic growth. Put your marketing on autopilot.",
    url: "https://thebeyondsearch.com",
    siteName: "TheBeyondSearch",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TheBeyondSearch | Put your marketing on autopilot",
    description:
      "Your AI workforce for search, visibility and organic growth. Put your marketing on autopilot.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={interTight.variable}>
      <body className="min-h-svh bg-[#EEF2F4] font-sans text-ink antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
