export const siteConfig = {
  name: "HomeCare365",
  domain: "homecare365.vn",
  title: "HomeCare365 — Dọn dẹp & sắp xếp nhà cửa 365 ngày",
  description:
    "Dịch vụ dọn dẹp, sắp xếp nhà cửa chuyên nghiệp. Bạn bận đến mấy vẫn được sống trong căn nhà sạch sẽ, gọn gàng mỗi ngày.",
  tagline: "Chăm sóc 365 ngày",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://homecare365.vn",
  locale: "vi_VN",
  serviceVideo: {
    title: "Dọn dẹp & sắp xếp nhà cửa chuyên nghiệp",
    description:
      "HomeCare365 phục vụ hộ gia đình và cá nhân bận rộn — lo toàn bộ việc lau chùi, dọn dẹp, sắp xếp để bạn có thêm thời gian nghỉ ngơi trong không gian sạch sẽ.",
    youtubeId: process.env.NEXT_PUBLIC_SERVICE_VIDEO_YOUTUBE_ID ?? "",
    mp4Src: process.env.NEXT_PUBLIC_SERVICE_VIDEO_MP4 ?? "",
    posterSrc: process.env.NEXT_PUBLIC_SERVICE_VIDEO_POSTER ?? "/video-poster.svg",
  },
  contact: {
    phone: "1900 xxxx",
    email: "lienhe@homecare365.vn",
    address: "Việt Nam",
  },
} as const;
