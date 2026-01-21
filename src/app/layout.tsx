import type { Metadata } from "next";
import Script from "next/script";
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
  metadataBase: new URL(siteDetails.siteUrl), // ⚡ Necesario para OG/Twitter
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
        
        {/* Google Analytics sin @next/third-parties */}
        {siteDetails.googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${siteDetails.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${siteDetails.googleAnalyticsId}');
              `}
            </Script>
          </>
        )}

        {/* Header */}
        <HeaderWrapper />

        {/* Contenido principal */}
        <main className="flex-1 flow-root">
          {children}
        </main>

        {/* Footer */}
        <FooterMain />

        {/* Google reCAPTCHA */}
        <Script
          src="https://www.google.com/recaptcha/api.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
