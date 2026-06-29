import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interview Preparation Hub | Immersive 3D Practice Platform",
  description:
    "Master your interview skills with our immersive 3D platform. Practice aptitude questions, read real interview experiences from TCS, Infosys, Wipro & Accenture, and level up your career.",
  keywords: [
    "interview preparation",
    "aptitude test",
    "TCS NQT",
    "Infosys",
    "Wipro",
    "Accenture",
    "placement preparation",
    "quantitative aptitude",
    "logical reasoning",
    "verbal ability",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
