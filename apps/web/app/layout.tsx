import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Home — Find Your Perfect Home in Ghana",
  description:
    "Home is an AI-powered property discovery platform. Describe your ideal home naturally and we'll find the best matches for you across Ghana.",
  keywords: [
    "property rental Ghana",
    "houses for rent Accra",
    "AI property search",
    "apartments Ghana",
    "find home Ghana",
  ],
  openGraph: {
    title: "Home — AI-Powered Property Discovery",
    description:
      "Describe your ideal home naturally. Our AI finds the best properties in Ghana for you.",
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
