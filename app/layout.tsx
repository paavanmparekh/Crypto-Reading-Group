import type { Metadata } from "next";
import { Merriweather, Open_Sans } from "next/font/google"; // Formal academic fonts
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const serif = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-serif",
});

const sans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Cryptography Reading Group | Stony Brook University",
  description: "A weekly seminar for PhD students and researchers to discuss cutting-edge research in cryptography and related areas at Stony Brook University.",
  keywords: ["cryptography", "reading group", "Stony Brook", "PhD", "research", "seminar"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
