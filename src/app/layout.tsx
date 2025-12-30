import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Read Something Wonderful | Rare Diseases",
  description: "A curated collection of wonderful reading resources about rare genetic diseases. Stories of hope, science, and the families who changed medicine.",
  keywords: ["rare diseases", "genetic diseases", "patient stories", "medical research", "NGLY1", "cystic fibrosis", "prion disease"],
  authors: [{ name: "InventCures" }],
  openGraph: {
    title: "Read Something Wonderful | Rare Diseases",
    description: "A curated collection of wonderful reading resources about rare genetic diseases.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Read Something Wonderful | Rare Diseases",
    description: "A curated collection of wonderful reading resources about rare genetic diseases.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
