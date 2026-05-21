"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { onboardingSlides } from "@/lib/mobile-app-data";

export default function OnboardingPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const slide = onboardingSlides[index];

  function finish() {
    localStorage.setItem("hc365_onboarded", "1");
    router.replace("/m/login");
  }

  function next() {
    if (index < onboardingSlides.length - 1) setIndex((i) => i + 1);
    else finish();
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--m-bg)] px-6 pb-10 pt-14">
      <button
        type="button"
        onClick={finish}
        className="self-end text-sm font-medium text-[var(--m-muted)]"
      >
        Bỏ qua
      </button>
      <div className="m-card mx-auto mt-8 flex flex-1 max-w-md flex-col items-center justify-center p-8 text-center">
        <span className="text-7xl">{slide.emoji}</span>
        <h2 className="mt-6 text-xl font-bold text-[var(--m-text)]">{slide.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--m-muted)]">{slide.desc}</p>
      </div>
      <div className="mt-8 flex justify-center gap-2">
        {onboardingSlides.map((_, i) => (
          <span
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-[var(--m-primary)]" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
      <button type="button" onClick={next} className="m-btn-primary mt-8 w-full py-4 text-base">
        {index < onboardingSlides.length - 1 ? "Tiếp tục" : "Bắt đầu"}
      </button>
    </div>
  );
}
