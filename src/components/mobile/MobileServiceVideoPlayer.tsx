"use client";

import { useEffect, useRef } from "react";

type MobileServiceVideoPlayerProps = {
  videoSrc: string;
  title: string;
  onClose?: () => void;
  showClose?: boolean;
};

export function MobileServiceVideoPlayer({
  videoSrc,
  title,
  onClose,
  showClose = true,
}: MobileServiceVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.load();

    const play = () => {
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      void video.play().catch(() => {});
    };

    video.addEventListener("loadeddata", play);
    if (video.readyState >= 2) play();

    return () => {
      video.removeEventListener("loadeddata", play);
      video.pause();
    };
  }, [videoSrc]);

  return (
    <div className="m-service-video-panel m-card overflow-hidden animate-in fade-in">
      <div className="flex items-center justify-between border-b border-black/5 px-3 py-2">
        <p className="line-clamp-1 flex-1 text-sm font-semibold text-[var(--m-text)]">{title}</p>
        {showClose && onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="ml-2 rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-[var(--m-muted)]"
            aria-label="Đóng video"
          >
            Đóng ✕
          </button>
        ) : null}
      </div>
      <div className="m-service-video-wrap relative aspect-video w-full bg-black">
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={`Video: ${title}`}
        />
      </div>
    </div>
  );
}
