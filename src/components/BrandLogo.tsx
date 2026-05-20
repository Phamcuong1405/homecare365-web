import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

type BrandLogoProps = {
  variant?: "full" | "header";
  className?: string;
  linkHome?: boolean;
};

export function BrandLogo({ variant = "full", className = "", linkHome = false }: BrandLogoProps) {
  const isHeader = variant === "header";
  const src = siteConfig.brand.logoSrc;
  const width = isHeader ? 200 : 320;
  const height = isHeader ? 62 : 100;

  const image = (
    <Image
      src={src}
      alt={siteConfig.brand.logoAlt}
      width={width}
      height={height}
      className={`h-auto w-auto object-contain ${isHeader ? "max-h-16" : "max-h-28"} ${className}`}
      priority
    />
  );

  if (linkHome) {
    return (
      <Link href="/" className="inline-flex shrink-0 items-center">
        {image}
      </Link>
    );
  }

  return image;
}
