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

/** Video lấy từ web — siteConfig.servicesSection.items */
const WEB_VIDEOS = {
  hourly: "/videos/services/don-dep-tong-the.mp4",
  deep: "/videos/services/tong-ve-sinh-nha.mp4",
  fabric: "/videos/services/sap-xep-khong-gian.mp4",
  office: "/videos/services/don-dep-van-phong.mp4",
  postBuild: "/videos/services/goi-dinh-ky-365.mp4",
  recurring: "/videos/services/cham-soc-dinh-ky.mp4",
  pet: "/videos/services/cham-soc-thu-cung.mp4",
  childcare: "/videos/services/cham-soc-tre.mp4",
} as const;

export const quickServices = [
  {
    id: "hourly",
    icon: "🧹",
    title: "Dọn nhà theo giờ",
    desc: siteConfig.servicesSection.items[0].desc,
    priceFrom: "120.000đ/giờ",
    videoSrc: WEB_VIDEOS.hourly,
    jobTasksLabel: "Ghi chú công việc",
    jobTasks: [
      "Dọn dẹp nhà theo giờ theo công việc được khách hàng giao trong khoảng thời gian khách yêu cầu",
      "Sau khi thống nhất nội dung sẽ lên phương án triển khai công việc",
    ],
  },
  {
    id: "deep",
    icon: "✨",
    title: "Tổng vệ sinh",
    desc: siteConfig.servicesSection.items[1].desc,
    priceFrom: "Từ 1.5tr",
    videoSrc: WEB_VIDEOS.deep,
    jobTasksLabel: "Ghi chú công việc",
    jobTasks: [
      "Dọn dẹp toàn bộ các phòng trong nhà",
      "Dọn dẹp toàn bộ phần diện tích bên ngoài như sân, vườn, vỉa hè",
      "Lên kế hoạch chi tiết, trao đổi những phần cần thực hiện dọn dẹp và lên phương án thống nhất, sau đó triển khai công việc",
    ],
  },
  {
    id: "sofa",
    icon: "🛋️",
    title: "Giặt sofa",
    desc: "Loại bỏ bụi bẩn và mùi khó chịu trên sofa.",
    priceFrom: "Từ 350k",
    videoSrc: WEB_VIDEOS.fabric,
    jobTasksLabel: "Ghi chú công việc",
    jobTasks: [
      "Giặt lại toàn bộ sofa hiện có trong phòng khách hoặc những vật dụng tương tự trong nhà",
      "Giặt xong bố trí sắp đặt theo phương án của chủ nhà",
      "Lau dọn toàn bộ khu vực phòng khách để hoàn thành công việc",
    ],
  },
  {
    id: "mattress",
    icon: "🛏️",
    title: "Giặt nệm",
    desc: siteConfig.servicesSection.items[2].desc,
    priceFrom: "Từ 280k",
    videoSrc: WEB_VIDEOS.fabric,
    jobTasksLabel: "Ghi chú công việc",
    jobTasks: [
      "Giặt lại nệm",
      "Giặt lại chăn ga gối, các loại đồ bông trong phòng",
      "Sắp xếp lại đồ dùng trong phòng ngủ",
      "Lau chùi dọn dẹp để hoàn tất công việc",
    ],
  },
  {
    id: "pet",
    icon: "🐾",
    title: "Chăm sóc thú cưng",
    desc: "Chăm sóc thú cưng tại nhà — an toàn, nhẹ nhàng, đúng giờ.",
    priceFrom: "Từ 150k",
    videoSrc: WEB_VIDEOS.pet,
    jobTasks: [
      "Tắm cho thú cưng",
      "Dắt đi dạo",
      "Cho ăn và trông coi thú cưng",
    ],
  },
  {
    id: "childcare",
    icon: "👶",
    title: "Chăm sóc trẻ khi ba mẹ vắng nhà",
    desc: "Trông coi bé an toàn, vui vẻ — ba mẹ yên tâm khi vắng nhà.",
    priceFrom: "Từ 200k",
    videoSrc: WEB_VIDEOS.childcare,
    jobTasks: [
      "Trông coi trẻ",
      "Đưa đón",
      "Cho ăn",
      "Tắm rửa",
      "Thay đồ",
      "Chơi cùng bé",
    ],
  },
  {
    id: "office",
    icon: "🏢",
    title: "Dọn văn phòng",
    desc: siteConfig.servicesSection.items[3].desc,
    priceFrom: "Liên hệ",
    videoSrc: WEB_VIDEOS.office,
    jobTasksLabel: "Ghi chú công việc",
    jobTasks: [
      "Khảo sát và nắm thông tin công việc khách hàng yêu cầu",
      "Sắp xếp, dọn dẹp, lau chùi toàn bộ phòng",
      "Nếu được yêu cầu lắp đặt hoặc thay thế sẽ lên phương án và báo lại với khách hàng nội dung thực hiện",
    ],
  },
  {
    id: "recurring",
    icon: "📅",
    title: "Giúp việc định kỳ",
    desc: siteConfig.servicesSection.items[5].desc,
    priceFrom: "Ưu đãi",
    videoSrc: WEB_VIDEOS.recurring,
  },
] as const;

export type QuickService = (typeof quickServices)[number];

export function getQuickServiceById(id: string): QuickService | undefined {
  return quickServices.find((s) => s.id === id);
}

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
  const quick = getQuickServiceById(id);
  if (quick) {
    const includes =
      "jobTasks" in quick && quick.jobTasks
        ? [...quick.jobTasks]
        : [
            "Công việc theo checklist chuẩn",
            "Dụng cụ & hóa chất an toàn",
            "Nhân viên có mặt đúng giờ",
            "Cam kết chất lượng & bảo hiểm",
          ];
    return { ...quick, includes };
  }
  return null;
}
