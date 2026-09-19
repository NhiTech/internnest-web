import type { Metadata, Viewport } from "next";
import "./globals.css";

const DESC =
  "Find subleases, navigate transit, and connect with fellow interns — all in one place. Built for interns, by interns.";

export const metadata: Metadata = {
  metadataBase: new URL("https://internnest-web.pages.dev"),
  title: "InternNest — Your city. Your internship. Your people.",
  description: DESC,
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "InternNest" },
  openGraph: {
    title: "InternNest — Your city. Your internship. Your people.",
    description: DESC,
    url: "https://internnest-web.pages.dev",
    siteName: "InternNest",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "InternNest",
    description: DESC,
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0F",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#08080D] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
