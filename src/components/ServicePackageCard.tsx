type ServicePackageCardProps = {
  title: string;
  desc: string;
  videoSrc: string;
};

export function ServicePackageCard({ title, desc, videoSrc }: ServicePackageCardProps) {
  return (
    <article className="hc-card flex flex-col overflow-hidden rounded-2xl p-5">
      <div className="hc-gradient-bar mb-3 w-12" />
      <h3 className="font-bold text-[var(--hc-text)]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--hc-text-muted)]">{desc}</p>
      <div className="hc-service-video-wrap mt-4">
        <video
          src={videoSrc}
          controls
          playsInline
          preload="metadata"
          className="hc-service-video"
          aria-label={`Video minh họa: ${title}`}
        >
          Trình duyệt không hỗ trợ video.
        </video>
      </div>
    </article>
  );
}
