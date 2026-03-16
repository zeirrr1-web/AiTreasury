import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI-News",
  description: "Autonomous AI news platform for real-time global event intelligence."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
