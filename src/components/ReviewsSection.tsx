"use client";

import { useCallback, useMemo, useState } from "react";
import { siteConfig } from "@/lib/site";

type ReviewItem = { name: string; quote: string };

function pickUnique<T>(pool: readonly T[], count: number): T[] {
  const items = [...pool];
  const picked: T[] = [];
  while (picked.length < count && items.length > 0) {
    const index = Math.floor(Math.random() * items.length);
    picked.push(items.splice(index, 1)[0]!);
  }
  return picked;
}

function buildRandomReviews(count: number): ReviewItem[] {
  const { names, quotes } = siteConfig.reviewsSection;
  const pickedNames = pickUnique(names, count);
  const pickedQuotes = pickUnique(quotes, count);
  return pickedNames.map((name, i) => ({
    name,
    quote: pickedQuotes[i] ?? pickedQuotes[0]!,
  }));
}

export function ReviewsSection() {
  const { title, displayCount } = siteConfig.reviewsSection;
  const [reviews, setReviews] = useState<ReviewItem[]>(() => buildRandomReviews(displayCount));

  const initials = useCallback((fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
    }
    return (parts[0]?.[0] ?? "?").toUpperCase();
  }, []);

  const reshuffle = useMemo(
    () => () => setReviews(buildRandomReviews(displayCount)),
    [displayCount],
  );

  return (
    <section id="danh-gia" className="scroll-mt-24 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-2xl font-bold text-[var(--hc-text)] sm:text-3xl">{title}</h2>
        <button
          type="button"
          onClick={reshuffle}
          className="hc-btn-secondary rounded-lg px-4 py-2 text-sm font-semibold"
        >
          Xem phản hồi khác
        </button>
      </div>
      <p className="mt-2 text-sm text-[var(--hc-text-muted)]">
        Hiển thị ngẫu nhiên từ hơn 20 khách hàng đã trải nghiệm dịch vụ.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {reviews.map((item) => (
          <blockquote key={`${item.name}-${item.quote.slice(0, 12)}`} className="hc-card hc-review-card rounded-2xl p-6">
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
