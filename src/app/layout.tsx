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
  const { brand } = siteConfig;
  const brandStyle = {
    ["--hc-bg-cream" as string]: brand.bgCream,
    ["--hc-bg-top" as string]: brand.bgCream,
    ["--hc-bg-mid" as string]: brand.bgCream,
    ["--hc-bg-bottom" as string]: brand.bgCream,
    ["--hc-brand-blue" as string]: brand.blue,
    ["--hc-brand-blue-light" as string]: brand.blueLight,
    ["--hc-brand-green" as string]: brand.green,
    ["--hc-brand" as string]: brand.green,
    ["--hc-primary" as string]: brand.green,
    ["--hc-primary-hover" as string]: brand.greenDark,
    ["--hc-deep" as string]: brand.blue,
    ["--hc-deep-dark" as string]: brand.blue,
    ["--hc-logo-watermark" as string]: `url("${brand.logoWatermarkSrc}")`,
  } satisfies CSSProperties;

  return (
    <html lang="vi" className={`${beVietnamPro.variable} h-full antialiased`} style={brandStyle}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
