export const siteConfig = {
  name: "HomeCare365",
  domain: "homecare365.vn",
  title: "HomeCare365 — Chăm sóc sức khỏe tại nhà 24/7",
  description:
    "Dịch vụ chăm sóc người cao tuổi, bệnh nhân và phục hồi tại nhà. Đội ngũ chuyên nghiệp, theo dõi 365 ngày qua web và app.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://homecare365.vn",
  locale: "vi_VN",
  contact: {
    phone: "1900 xxxx",
    email: "lienhe@homecare365.vn",
    address: "Việt Nam",
  },
} as const;
