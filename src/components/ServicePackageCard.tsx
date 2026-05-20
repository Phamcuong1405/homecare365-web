"use client";

import { useEffect, useRef } from "react";

type ServicePackageCardProps = {
  icon?: string;
  title: string;
  desc: string;
  videoSrc?: string;
};

export function ServicePackageCard({ icon, title, desc, videoSrc }: ServicePackageCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playLoop = () => {
      video.muted = true;
      video.loop = true;
      void video.play().catch(() => {});
    };

    video.addEventListener("loadeddata", playLoop);
    if (video.readyState >= 2) playLoop();

    return () => video.removeEventListener("loadeddata", playLoop);
  }, [videoSrc]);

  return (
    <article className="hc-card flex flex-col overflow-hidden rounded-2xl p-5">
      <div className="hc-gradient-bar mb-3 w-12" />
      <h3 className="font-bold text-[var(--hc-text)]">
        {icon ? <span className="mr-1.5">{icon}</span> : null}
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--hc-text-muted)]">{desc}</p>
      {videoSrc ? (
        <div className="hc-service-video-wrap mt-4">
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="hc-service-video"
            aria-label={`Video minh họa: ${title}`}
          >
            Trình duyệt không hỗ trợ video.
          </video>
        </div>
      ) : null}
    </article>
  );
}
