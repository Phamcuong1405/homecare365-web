export const siteConfig = {
  name: "HomeCare365",
  domain: "homecare365.vn",
  title: "HomeCare365 — Dọn dẹp & sắp xếp nhà cửa 365 ngày",
  description:
    "HomeCare365 lo toàn bộ việc dọn dẹp và sắp xếp cho bạn — sạch nhà, gọn gàng, thư giãn mỗi ngày.",
  tagline: "Chăm sóc 365 ngày",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://homecare365.vn",
  locale: "vi_VN",
  contact: {
    phone: "1900 xxxx",
    email: "lienhe@homecare365.vn",
    address: "Việt Nam",
  },
} as const;
