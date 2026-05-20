import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { siteConfig } from "@/lib/site";

export function HeaderBrand() {
  const motto = siteConfig.brand.headerMotto;
  const name = siteConfig.name;

  return (
    <Link href="/" className="flex min-w-0 max-w-[min(100%,520px)] items-center gap-3 sm:gap-4">
      <BrandLogo variant="header" />
      <p className="hc-header-motto hidden min-w-0 sm:block">
        {motto.split(name).map((part, i, arr) =>
          i < arr.length - 1 ? (
            <span key={i}>
              {part}
              <span className="font-bold text-[var(--hc-brand-green)]">{name}</span>
            </span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </p>
    </Link>
  );
}
