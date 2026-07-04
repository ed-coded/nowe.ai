import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { brand } from "@/lib/branding";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: brand.metadata.title,
  description: brand.metadata.description,
  keywords: [...brand.metadata.keywords],
  openGraph: {
    title: brand.metadata.ogTitle,
    description: brand.metadata.ogDescription,
    type: "website",
    locale: "en_GH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
