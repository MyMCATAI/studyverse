import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Studyverse - AI-Powered Tutoring Platform & Infrastructure for Education Firms",
  description: "Studyverse provides AI-powered tutoring platform infrastructure for education firms. Get student insights, tutor analytics, and operational visibility to transform your tutoring business with advanced technology.",
  keywords: ["Studyverse", "tutoring platform", "education technology", "tutoring infrastructure", "AI tutoring tools", "tutoring business software", "student analytics", "tutor management", "education firms", "tutoring operations"],
  authors: [{ name: "Studyverse Team" }],
  creator: "Studyverse",
  publisher: "Studyverse",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://studyverse.ai'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Studyverse - AI-Powered Tutoring Platform Infrastructure",
    description: "Transform your tutoring firm with AI-powered infrastructure. Get student insights, tutor analytics, and operational visibility that makes education firms 10x better.",
    url: 'https://studyverse.ai',
    siteName: 'Studyverse',
    images: [
      {
        url: '/StudyverseLogo.png',
        width: 1200,
        height: 630,
        alt: 'Studyverse - AI-Powered Tutoring Platform Infrastructure',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studyverse - AI-Powered Tutoring Platform Infrastructure',
    description: 'Transform your tutoring firm with AI-powered infrastructure and student insights.',
    images: ['/StudyverseLogo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} antialiased`}>
        <AuthProvider>
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
