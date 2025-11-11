import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreshPeptide - Research Platform",
  description: "Educational peptide research and demonstration platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
