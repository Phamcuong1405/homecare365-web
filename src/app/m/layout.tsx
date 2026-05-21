import type { Metadata, Viewport } from "next";
import "./mobile.css";

export const metadata: Metadata = {
  title: "HomeCare365 App",
  description: "Đặt lịch dọn dẹp nhanh — HomeCare365",
  appleWebApp: { capable: true, title: "HomeCare365" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#4caf50",
};

export default function MobileAppLayout({ children }: { children: React.ReactNode }) {
  return <div className="m-app">{children}</div>;
}
