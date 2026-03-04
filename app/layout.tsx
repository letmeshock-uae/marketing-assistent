import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Datum Marketing Agent",
  description: "AI-powered marketing assistant for Datum team",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
