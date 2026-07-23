import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ToolPDF — Every PDF Tool You'll Ever Need | Free, Private, Browser-Based",
  description: "Free online PDF tools: merge, split, compress, convert, rotate, protect, watermark & more. 27 tools, 100% private — your files never leave your browser. No signup required.",
  keywords: ["PDF tools", "merge PDF", "split PDF", "compress PDF", "convert PDF", "PDF to Word", "unlock PDF", "protect PDF", "watermark PDF", "file reader", "ToolPDF", "free PDF tools", "pdf to excel", "sign pdf", "flatten pdf", "redact pdf", "number pages", "annotate pdf"],
  authors: [{ name: "Osama" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "ToolPDF — Every PDF Tool You'll Ever Need",
    description: "27 PDF tools, 100% private, browser-based. No server uploads.",
    url: "https://toolpdf.com",
    siteName: "ToolPDF",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolPDF — Every PDF Tool You'll Ever Need",
    description: "27 PDF tools, 100% private, browser-based.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
