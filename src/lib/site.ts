export const siteConfig = {
  name: "HomeCare365",
  domain: "homecare365.vn",
  title: "HomeCare365 — Dọn dẹp & sắp xếp nhà cửa 365 ngày",
  description:
    "Dịch vụ dọn dẹp, sắp xếp nhà cửa chuyên nghiệp. Bạn bận đến mấy vẫn được sống trong căn nhà sạch sẽ, gọn gàng mỗi ngày.",
  tagline: "Chăm sóc 365 ngày",
  brand: {
    /** File gốc: E:\EDIT VIDEO\WEB\55597f9f-0ec7-4ce9-8f70-b2fcf2e06349.png */
    logoFile: "/brand/homecare365-logo.png",
    logoVersion: "official-v2",
    logoSrc: "/brand/homecare365-logo.png",
    logoWatermarkSrc: "/brand/homecare365-logo.png",
    logoAlt: "Home Care 365 — Sạch từ tâm, ấm từng nhà",
    slogan: "SẠCH TỪ TÂM – ẤM TỪNG NHÀ",
    headerMotto: "Trao việc nhà cho HomeCare365 – Giữ thời gian cho chính bạn",
    /** Màu lấy từ file logo gốc */
    bgCream: "#f9faf5",
    blue: "#0047ab",
    blueLight: "#0066cc",
    green: "#4caf50",
    greenDark: "#3d9a42",
    /** Giữa gradient xanh dương → xanh lá (màu tổng thể trang) */
    gradientMid: "#1e9e6a",
  },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://homecare365.vn",
  locale: "vi_VN",
  serviceVideo: {
    title: "Dọn dẹp & sắp xếp nhà cửa chuyên nghiệp",
    description:
      "HomeCare365 phục vụ hộ gia đình và cá nhân bận rộn — lo toàn bộ việc lau chùi, dọn dẹp, sắp xếp để bạn có thêm thời gian nghỉ ngơi trong không gian sạch sẽ.",
    youtubeId: process.env.NEXT_PUBLIC_SERVICE_VIDEO_YOUTUBE_ID ?? "5adnwOwVym4",
    mp4Src: process.env.NEXT_PUBLIC_SERVICE_VIDEO_MP4 ?? "",
    posterSrc: process.env.NEXT_PUBLIC_SERVICE_VIDEO_POSTER ?? "/video-poster.svg",
  },
  contact: {
    phone: "+84 867050558",
    email: "homecare365.vn@gmail.com",
    address: "Việt Nam",
  },
} as const;

/** Số gọi trực tiếp (tel:) — bỏ khoảng trắng, giữ dấu + */
export function phoneTelHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, "")}`;
}
