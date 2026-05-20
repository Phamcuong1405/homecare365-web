import { siteConfig } from "@/lib/site";

function VideoPlayer() {
  const { youtubeId, mp4Src, posterSrc } = siteConfig.serviceVideo;

  if (youtubeId) {
    return (
      <iframe
        title="Video giới thiệu HomeCare365"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    );
  }

  if (mp4Src) {
    return (
      <video
        controls
        playsInline
        preload="metadata"
        poster={posterSrc || undefined}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={mp4Src} type="video/mp4" />
        Trình duyệt không hỗ trợ video.
      </video>
    );
  }

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white"
      style={{ background: "var(--hc-gradient-brand)" }}
    >
      <p className="text-lg font-bold">Video giới thiệu sắp cập nhật</p>
    </div>
  );
}

export function AboutBrandSection() {
  const { about } = siteConfig;

  return (
    <section id="gioi-thieu" className="scroll-mt-24 py-14">
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-wider text-[var(--hc-brand-blue)]">
            {about.eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--hc-text)] sm:text-4xl">
            {about.title}
          </h2>
          <div className="mt-4 space-y-3 text-base leading-relaxed text-[var(--hc-text-muted)]">
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <p className="mt-4 font-semibold text-[var(--hc-text)]">{about.benefitsIntro}</p>
          <ul className="mt-3 space-y-2">
            {about.benefits.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-[var(--hc-text-muted)]">
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: "var(--hc-gradient-brand)" }}
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex w-full min-w-0 justify-center lg:justify-start">
            <a href="#dat-lich-tu-van" className="hc-cta-promo-banner">
              <span className="hc-cta-promo-text">{about.cta}</span>
            </a>
          </div>
        </div>

        <div className="hc-video-frame">
          <div className="relative aspect-video w-full overflow-hidden rounded-[12px] bg-[var(--hc-deep-dark)]">
            <VideoPlayer />
          </div>
        </div>
      </div>
    </section>
  );
}
