import "./admin.css";

export const metadata = {
  title: "HomeCare365 — Quản lý",
  description: "Bảng điều phối việc và nhân viên HomeCare365",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-app">{children}</div>;
}
