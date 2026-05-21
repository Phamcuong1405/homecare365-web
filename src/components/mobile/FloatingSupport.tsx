"use client";

import { mobileBrand } from "@/lib/mobile-app-data";
import { phoneTelHref } from "@/lib/site";

export function FloatingSupport() {
  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-2">
      <a
        href={phoneTelHref(mobileBrand.phone)}
        className="m-btn-trust flex h-12 w-12 items-center justify-center rounded-full text-lg shadow-lg"
        aria-label="Gọi hotline"
      >
        📞
      </a>
      <a
        href="https://zalo.me/0867050558"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0068ff] text-sm font-bold text-white shadow-lg"
        aria-label="Zalo"
      >
        Zalo
      </a>
    </div>
  );
}
