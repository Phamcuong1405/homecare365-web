"use client";

import { useCallback, useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";

const ROTATE_MS = 5000;
const STAGGER_MS = 2000;

type ReviewItem = { name: string; quote: string };

function pickRandomReview(): ReviewItem {
  const { names, quotes } = siteConfig.reviewsSection;
  const name = names[Math.floor(Math.random() * names.length)]!;
  const quote = quotes[Math.floor(Math.random() * quotes.length)]!;
  return { name, quote };
}

function buildRandomReviews(count: number): ReviewItem[] {
  return Array.from({ length: count }, () => pickRandomReview());
}

export function ReviewsSection() {
  const { title, displayCount } = siteConfig.reviewsSection;
  const [reviews, setReviews] = useState<ReviewItem[]>(() => buildRandomReviews(displayCount));
  const [fadeKeys, setFadeKeys] = useState<number[]>(() => Array.from({ length: displayCount }, () => 0));

  const initials = useCallback((fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
    }
    return (parts[0]?.[0] ?? "?").toUpperCase();
  }, []);

  const rotateCard = useCallback((index: number) => {
    setReviews((prev) => {
      const next = [...prev];
      next[index] = pickRandomReview();
      return next;
    });
    setFadeKeys((prev) => {
      const next = [...prev];
      next[index] = (next[index] ?? 0) + 1;
      return next;
    });
  }, []);

  const reshuffleAll = useCallback(() => {
    setReviews(buildRandomReviews(displayCount));
    setFadeKeys(Array.from({ length: displayCount }, (_, k) => k + 1));
  }, [displayCount]);

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    for (let i = 0; i < displayCount; i++) {
      const startDelay = i * STAGGER_MS;
      const timeoutId = window.setTimeout(() => {
        const intervalId = window.setInterval(() => rotateCard(i), ROTATE_MS);
        cleanups.push(() => window.clearInterval(intervalId));
      }, startDelay);
      cleanups.push(() => window.clearTimeout(timeoutId));
    }

    return () => cleanups.forEach((fn) => fn());
  }, [displayCount, rotateCard]);

  return (
    <section id="danh-gia" className="scroll-mt-24 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-2xl font-bold text-[var(--hc-text)] sm:text-3xl">{title}</h2>
        <button
          type="button"
          onClick={reshuffleAll}
          className="hc-btn-secondary rounded-lg px-4 py-2 text-sm font-semibold"
        >
          Xem phản hồi khác
        </button>
      </div>
      <p className="mt-2 text-sm text-[var(--hc-text-muted)]">
        Tự động đổi phản hồi mỗi 5 giây, mỗi thẻ lệch nhau 2 giây — hơn 20 khách hàng đã trải nghiệm dịch vụ.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {reviews.map((item, index) => (
          <blockquote
            key={`${index}-${fadeKeys[index]}`}
            className="hc-card hc-review-card hc-review-card--fade rounded-2xl p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: "var(--hc-gradient-brand)" }}
                aria-hidden
              >
                {initials(item.name)}
              </span>
              <div>
                <p className="font-bold text-[var(--hc-text)]">{item.name}</p>
                <p className="text-xs text-[var(--hc-brand-green)]">Khách hàng HomeCare365</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[var(--hc-text-muted)]">&ldquo;{item.quote}&rdquo;</p>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
