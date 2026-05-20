export const siteConfig = {
  name: "HomeCare365",
  domain: "homecare365.vn",
  title: "HomeCare365 - Dịch Vụ Dọn Dẹp Nhà Cửa Chuyên Nghiệp",
  description:
    "HomeCare365 cung cấp dịch vụ dọn dẹp nhà cửa, tổng vệ sinh và vệ sinh văn phòng chuyên nghiệp. Giúp bạn tiết kiệm thời gian, tận hưởng không gian sống sạch sẽ và thoải mái hơn mỗi ngày.",
  keywords: [
    "dịch vụ dọn dẹp nhà cửa",
    "giúp việc theo giờ",
    "tổng vệ sinh nhà cửa",
    "vệ sinh sofa",
    "dọn nhà chuyên nghiệp",
    "dịch vụ vệ sinh Hà Nội",
    "dọn dẹp văn phòng",
    "HomeCare365",
  ],
  tagline: "Chăm sóc 365 ngày",
  brand: {
    logoFile: "/brand/homecare365-logo.png",
    logoVersion: "official-v2",
    logoSrc: "/brand/homecare365-logo.png",
    logoWatermarkSrc: "/brand/homecare365-logo.png",
    logoAlt: "Home Care 365 — Sạch từ tâm, ấm từng nhà",
    slogan: "SẠCH TỪ TÂM – ẤM TỪNG NHÀ",
    headerMotto: "Trao việc nhà cho HomeCare365 – Giữ thời gian cho chính bạn",
    bgCream: "#f9faf5",
    blue: "#0047ab",
    blueLight: "#0066cc",
    green: "#4caf50",
    greenDark: "#3d9a42",
    gradientMid: "#1e9e6a",
  },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://homecare365.vn",
  locale: "vi_VN",
  hero: {
    headline: "Nhà sạch mỗi ngày, cuộc sống nhẹ nhàng hơn",
    subheadline: [
      "Để HomeCare365 chăm nhà, bạn chăm chính mình.",
      "Tiết kiệm thời gian dọn dẹp, tận hưởng không gian sống sạch sẽ, an toàn cho cả gia đình.",
    ],
    shortDesc: [
      "Dịch vụ dọn dẹp chuyên nghiệp – nhanh chóng – tận tâm.",
      "Phù hợp cho gia đình bận rộn, người đi làm, mẹ bỉm và người lớn tuổi.",
    ],
    ctas: [
      { label: "Đặt lịch dọn dẹp ngay", href: "#dat-lich-tu-van", primary: true },
      { label: "Nhận tư vấn miễn phí", href: "#dat-lich-tu-van", primary: false },
      { label: "Báo giá trong 30 giây", href: "#dat-lich-tu-van", primary: false },
    ],
    trustBadges: [
      "Nhân viên chuyên nghiệp",
      "Dụng cụ & quy trình an toàn",
      "Linh hoạt theo lịch của bạn",
      "Hỗ trợ nhanh mỗi ngày",
    ],
  },
  about: {
    eyebrow: "HomeCare365 là ai?",
    title: "Không chỉ dọn nhà — chúng tôi giúp bạn tận hưởng cuộc sống",
    paragraphs: [
      "Cuộc sống hiện đại khiến nhiều người không còn đủ thời gian cho bản thân và gia đình. Sau một ngày dài làm việc, việc dọn dẹp nhà cửa đôi khi trở thành áp lực khiến bạn mệt mỏi hơn.",
      "HomeCare365 ra đời để giúp bạn giải quyết điều đó.",
      "Chúng tôi mang đến dịch vụ dọn dẹp chuyên nghiệp, giúp không gian sống luôn sạch sẽ, gọn gàng và thoải mái — để bạn có thêm thời gian nghỉ ngơi, chăm sóc gia đình và tận hưởng cuộc sống theo cách mình mong muốn.",
    ],
    benefitsIntro: "Một ngôi nhà sạch không chỉ đẹp hơn, mà còn giúp:",
    benefits: [
      "Không khí trong lành hơn",
      "Hạn chế vi khuẩn và bụi bẩn",
      "Tốt cho trẻ nhỏ và người lớn tuổi",
      "Giảm căng thẳng sau ngày dài làm việc",
    ],
    cta: "Đặt lịch ngay hôm nay để trải nghiệm không gian sống sạch sẽ và thư thái hơn.",
  },
  serviceVideo: {
    title: "Không chỉ dọn nhà — chúng tôi giúp bạn tận hưởng cuộc sống",
    description:
      "Xem video giới thiệu và cảm nhận sự khác biệt khi có HomeCare365 đồng hành chăm sóc không gian sống của bạn.",
    youtubeId: process.env.NEXT_PUBLIC_SERVICE_VIDEO_YOUTUBE_ID ?? "5adnwOwVym4",
    mp4Src: process.env.NEXT_PUBLIC_SERVICE_VIDEO_MP4 ?? "",
    posterSrc: process.env.NEXT_PUBLIC_SERVICE_VIDEO_POSTER ?? "/video-poster.svg",
  },
  servicesSection: {
    title: "Dịch vụ phù hợp cho mọi gia đình",
    subtitle: "Giải pháp dọn dẹp & vệ sinh linh hoạt theo nhu cầu của bạn.",
    items: [
      {
        icon: "🧹",
        title: "Dọn dẹp nhà theo giờ",
        desc: "Nhanh chóng – linh hoạt – tiết kiệm chi phí.",
        videoSrc: "/videos/services/don-dep-tong-the.mp4",
      },
      {
        icon: "✨",
        title: "Tổng vệ sinh nhà cửa",
        desc: "Làm sạch chuyên sâu toàn bộ không gian sống.",
        videoSrc: "/videos/services/tong-ve-sinh-nha.mp4",
      },
      {
        icon: "🛋️",
        title: "Vệ sinh sofa – nệm – rèm",
        desc: "Loại bỏ bụi bẩn và mùi khó chịu hiệu quả.",
        videoSrc: "/videos/services/sap-xep-khong-gian.mp4",
      },
      {
        icon: "🏢",
        title: "Dọn dẹp văn phòng",
        desc: "Không gian sạch sẽ giúp tăng hiệu suất làm việc.",
        videoSrc: "/videos/services/don-dep-van-phong.mp4",
      },
      {
        icon: "🧼",
        title: "Dọn nhà sau xây dựng",
        desc: "Xử lý bụi bẩn và vệ sinh hoàn thiện chuyên nghiệp.",
        videoSrc: "/videos/services/goi-dinh-ky-365.mp4",
      },
      {
        icon: "📅",
        title: "Dịch vụ chăm sóc nhà định kỳ theo tuần, tháng, năm",
        desc: "Đặt lịch cố định linh hoạt — đội ngũ quen nhà bạn, nhà luôn sạch ổn định lâu dài.",
        videoSrc: "/videos/services/cham-soc-dinh-ky.mp4",
      },
    ],
  },
  benefitsSection: {
    title: "Vì sao khách hàng chọn HomeCare365?",
    items: [
      { icon: "⏰", title: "Tiết kiệm thời gian", desc: "Không còn mất hàng giờ cho việc lau dọn mỗi ngày." },
      { icon: "💚", title: "Chăm sóc sức khỏe gia đình", desc: "Không gian sạch sẽ giúp hạn chế bụi bẩn và vi khuẩn." },
      { icon: "😊", title: "Giảm áp lực việc nhà", desc: "Bạn có nhiều thời gian nghỉ ngơi và chăm sóc bản thân hơn." },
      { icon: "🏡", title: "Không gian sống thoải mái", desc: "Ngôi nhà gọn gàng giúp tinh thần dễ chịu hơn mỗi ngày." },
    ],
  },
  reviewsSection: {
    title: "Khách hàng nói gì về HomeCare365?",
    items: [
      "Nhà sạch rất kỹ, nhân viên lịch sự và đúng giờ. Từ ngày dùng dịch vụ mình có nhiều thời gian cho con hơn.",
      "Mình làm văn phòng rất bận nên thuê định kỳ mỗi tuần. Cảm giác về nhà cực kỳ thoải mái.",
      "Dịch vụ chuyên nghiệp và hỗ trợ nhanh. Rất phù hợp cho gia đình có người lớn tuổi.",
    ],
  },
  finalCta: {
    title: "Bạn xứng đáng được nghỉ ngơi sau một ngày dài",
    paragraphs: [
      "Đừng để việc dọn dẹp chiếm hết thời gian của bạn.",
      "Hãy để HomeCare365 chăm sóc ngôi nhà, để bạn tận hưởng cuộc sống trọn vẹn hơn.",
    ],
    ctas: [
      { label: "Đặt lịch ngay", href: "#dat-lich-tu-van", primary: true },
      { label: "Nhận báo giá miễn phí", href: "#dat-lich-tu-van", primary: false },
    ],
  },
  contact: {
    phone: "+84 867050558",
    email: "homecare365.vn@gmail.com",
    address: "Việt Nam",
  },
} as const;

/** @deprecated dùng siteConfig.servicesSection.items */
export const servicePackages = siteConfig.servicesSection.items;

export function phoneTelHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, "")}`;
}
