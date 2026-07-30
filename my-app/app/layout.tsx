import type { Metadata } from "next";
import { Inter, Fraunces, IBM_Plex_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/context/AuthContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-ui",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-voice",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-data",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "NutriScan — Scan today, stay healthy",
  description:
    "A food label ingredient analyzer and healthy alternative recommendation platform. Scan a label, get a plain-language verdict in seconds.",
  keywords: [
    "food label",
    "nutrition",
    "health",
    "OCR",
    "scan",
    "ingredients",
    "healthy alternatives",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${ibmPlexMono.variable} dark`}>
      <body className="min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#0F1114",
                border: "1px solid #262B33",
                color: "#F3F5F7",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
