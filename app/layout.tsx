import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InternNest — Your city. Your internship. Your people.",
  description:
    "Find subleases, navigate transit, and connect with fellow interns — all in one place. Built for interns, by interns.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
