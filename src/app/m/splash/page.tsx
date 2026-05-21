"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { mobileBrand } from "@/lib/mobile-app-data";

export default function SplashPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t1 = setInterval(() => setProgress((p) => Math.min(p + 12, 100)), 120);
    const t2 = setTimeout(() => {
      const onboarded = localStorage.getItem("hc365_onboarded");
      const loggedIn = localStorage.getItem("hc365_logged_in");
      if (!onboarded) router.replace("/m/onboarding");
      else if (!loggedIn) router.replace("/m/login");
      else router.replace("/m/home");
    }, 2200);
    return () => {
      clearInterval(t1);
      clearTimeout(t2);
    };
  }, [router]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-[#4caf50] to-[#0047ab] px-8 text-white">
      <div className="relative mb-6 animate-pulse">
        <div className="rounded-3xl bg-white/20 p-6 backdrop-blur-sm">
          <Image
            src="/brand/homecare365-logo.png"
            alt="HomeCare365"
            width={140}
            height={90}
            priority
            className="h-auto w-[140px]"
          />
        </div>
        <span className="absolute -right-2 -top-2 text-3xl">🏠</span>
      </div>
      <h1 className="text-2xl font-bold tracking-tight">{mobileBrand.name}</h1>
      <p className="mt-2 text-center text-sm text-white/90">{mobileBrand.slogan}</p>
      <p className="mt-6 text-xs text-white/75">{mobileBrand.taglineSplash}</p>
      <div className="mt-10 h-1.5 w-48 overflow-hidden rounded-full bg-white/25">
        <div
          className="h-full rounded-full bg-white transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
