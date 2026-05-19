import { siteConfig } from "@/lib/site";

const highlights = [
  "Quy trình dọn dẹp từng khu vực: phòng khách, bếp, phòng ngủ, nhà vệ sinh",
  "Sắp xếp đồ đạc gọn gàng, tối ưu không gian sinh hoạt",
  "Đội ngũ được đào tạo, đúng giờ, an tâm khi bạn bận rộn",
  "Gói linh hoạt: theo buổi, theo tuần hoặc định kỳ 365 ngày",
];

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
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-800 to-slate-900 px-6 text-center text-white">
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/15 ring-2 ring-white/30">
        <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M8 5v14l11-7L8 5z" />
        </svg>
      </span>
      <p className="text-lg font-bold">Video giới thiệu sắp cập nhật</p>
      <p className="mt-2 max-w-sm text-sm text-emerald-100">
        Thêm link YouTube hoặc file MP4 trong cấu hình để hiển thị video tại đây.
      </p>
    </div>
  );
}

export function ServiceVideoSection() {
  return (
    <section id="video-gioi-thieu" className="scroll-mt-24 py-14">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">
            Lĩnh vực phục vụ
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {siteConfig.serviceVideo.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            {siteConfig.serviceVideo.description}
          </p>
          <ul className="mt-6 space-y-3">
            {highlights.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <a
            href="#dat-lich-tu-van"
            className="mt-8 inline-flex rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-500"
          >
            Đặt lịch ngay
          </a>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-xl shadow-slate-900/10">
          <div className="relative aspect-video w-full">
            <VideoPlayer />
          </div>
        </div>
      </div>
    </section>
  );
}
