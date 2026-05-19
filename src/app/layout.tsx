import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [{ url: siteConfig.brand.logoSrc, alt: siteConfig.brand.logoAlt }],
  },
  icons: {
    icon: siteConfig.brand.logoSrc,
    apple: siteConfig.brand.logoSrc,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const brandStyle = {
    ["--hc-bg-cream" as string]: siteConfig.brand.bgCream,
    ["--hc-bg-top" as string]: siteConfig.brand.bgCream,
    ["--hc-bg-mid" as string]: "#f7f9f4",
    ["--hc-bg-bottom" as string]: "#f5f7f2",
    ["--hc-logo-watermark" as string]: `url("${siteConfig.brand.logoWatermarkSrc}")`,
  } satisfies CSSProperties;

  return (
    <html lang="vi" className={`${beVietnamPro.variable} h-full antialiased`} style={brandStyle}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
