import { siteConfig } from "@/lib/site";

export const mobileBrand = {
  name: "HomeCare365",
  slogan: "Nhà sạch mỗi ngày – Sống khỏe mỗi phút",
  taglineSplash: "Chăm sóc không gian sống của bạn",
  phone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
} as const;

export const onboardingSlides = [
  {
    emoji: "🏠",
    title: "Tiết kiệm thời gian dọn dẹp",
    desc: "Gia đình hạnh phúc trong căn nhà sạch — bạn có thêm thời gian cho bản thân.",
  },
  {
    emoji: "✨",
    title: "Đội ngũ được đào tạo bài bản",
    desc: "Nhân viên vệ sinh chuyên nghiệp, xác minh danh tính, làm việc có checklist.",
  },
  {
    emoji: "💚",
    title: "Thời gian cho gia đình",
    desc: "Mẹ chơi cùng con, không lo việc nhà — HomeCare365 đồng hành mỗi ngày.",
  },
] as const;

export const trustStats = [
  { value: "10.000+", label: "Khách hàng" },
  { value: "98%", label: "Hài lòng" },
  { value: "100%", label: "Xác minh NV" },
  { value: "BH", label: "Bảo hiểm TS" },
] as const;

export const quickServices = [
  { id: "hourly", icon: "🧹", title: "Dọn nhà theo giờ", priceFrom: "120.000đ/giờ" },
  { id: "deep", icon: "✨", title: "Tổng vệ sinh", priceFrom: "Từ 1.5tr" },
  { id: "sofa", icon: "🛋️", title: "Giặt sofa", priceFrom: "Từ 350k" },
  { id: "mattress", icon: "🛏️", title: "Giặt nệm", priceFrom: "Từ 280k" },
  { id: "curtain", icon: "🪟", title: "Giặt rèm", priceFrom: "Từ 200k" },
  { id: "ac", icon: "❄️", title: "Vệ sinh máy lạnh", priceFrom: "Từ 150k" },
  { id: "elder", icon: "👵", title: "Chăm người già", priceFrom: "Liên hệ" },
  { id: "recurring", icon: "📅", title: "Giúp việc định kỳ", priceFrom: "Ưu đãi" },
] as const;

export const promos = [
  { title: "Giảm 20% đơn đầu", sub: "Voucher NEW20", color: "#4caf50" },
  { title: "Combo gia đình", sub: "Tiết kiệm đến 30%", color: "#0047ab" },
  { title: "Cuối tuần", sub: "Đặt T7-CN giảm 15%", color: "#f9a825" },
] as const;

export const membershipTiers = [
  { id: "silver", name: "Silver", benefit: "Giảm 5% mọi đơn", price: "Miễn phí" },
  { id: "gold", name: "Gold", benefit: "Ưu tiên lịch + giảm 10%", price: "99.000đ/tháng" },
  { id: "platinum", name: "Platinum", benefit: "CSKH riêng + giá tốt nhất", price: "199.000đ/tháng" },
] as const;

export const uspBadges = [
  { icon: "🛡️", title: "An toàn", desc: "NV verified, check-in" },
  { icon: "✅", title: "Sạch sâu", desc: "Checklist chuẩn" },
  { icon: "⚡", title: "Nhanh", desc: "Có mặt ~30 phút" },
  { icon: "💎", title: "Tin cậy", desc: "Bảo hiểm tài sản" },
] as const;

export function getServiceById(id: string) {
  const quick = quickServices.find((s) => s.id === id);
  if (quick) {
    const web = siteConfig.servicesSection.items.find((w) =>
      w.title.toLowerCase().includes(quick.title.split(" ")[0].toLowerCase()),
    );
    return {
      ...quick,
      desc: web?.desc ?? "Dịch vụ chuyên nghiệp, linh hoạt theo nhu cầu gia đình bạn.",
      includes: [
        "Công việc theo checklist chuẩn",
        "Dụng cụ & hóa chất an toàn",
        "Nhân viên có mặt đúng giờ",
        "Cam kết chất lượng & bảo hiểm",
      ],
    };
  }
  return null;
}
