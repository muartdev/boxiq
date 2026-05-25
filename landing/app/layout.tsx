import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Boxiq — Daily Logic Puzzle",
  description: "A calm daily logic puzzle game built around balance, symbols, and deduction.",
  openGraph: {
    title: "Boxiq — Daily Logic Puzzle",
    description: "A calm daily logic puzzle game built around balance, symbols, and deduction.",
    type: "website",
    locale: "en_US",
    siteName: "Boxiq",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
