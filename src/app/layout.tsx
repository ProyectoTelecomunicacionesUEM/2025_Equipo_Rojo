
import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Source_Sans_3, Manrope } from "next/font/google";

import HeaderWrapper from "@/components/HeaderWrapper";
import FooterMain from "@/components/FooterMain";
import { siteDetails } from "@/data/siteDetails";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"] });
const sourceSans = Source_Sans_3({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: siteDetails.metadata.title,
  description: siteDetails.metadata.description,
  openGraph: {
    title: siteDetails.metadata.title,
    description: siteDetails.metadata.description,
    url: siteDetails.siteUrl,
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 675,
        alt: siteDetails.siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteDetails.metadata.title,
    description: siteDetails.metadata.description,
    images: ["/images/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${manrope.className} ${sourceSans.className} antialiased min-h-screen flex flex-col bg-background`}>
        {siteDetails.googleAnalyticsId && (
          <GoogleAnalytics gaId={siteDetails.googleAnalyticsId} />
        )}

        {/* Header (        {/* Header (uno solo, arriba) */}
        <HeaderWrapper />

        {/* Contenido principal (un solo main) */}
        <main className="flex-1 flow-root">
          {children}
        </main>

        {/* Footer (abajo) */}
        <FooterMain />
      </body>
    </html>
  );

}
