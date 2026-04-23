import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCReactProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";


const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Resonance",
    template: "%s | Resonance"
  },
  description: "AI-powered text-to-speech and voice cloning platform",
  
  // Open Graph
  openGraph: {
    title: "Resonance",
    description: "AI-powered text-to-speech and voice cloning platform",
    url: "https://resonance.ayubb.me", 
    siteName: "Resonance",
    images: [
      {
        url: "/og-image.png", 
        width: 1200,
        height: 630,
        alt: "Resonance - AI-powered text-to-speech platform",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Resonance",
    description: "AI-powered text-to-speech and voice cloning platform",
    images: ["/og-image.png"],  
  },
  
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <TRPCReactProvider>
        <html lang="en">
          <body
            className={`${inter.variable} ${geistMono.variable} antialiased`}
          >
            <NuqsAdapter>

            {children}
            </NuqsAdapter>
            <Toaster />
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
