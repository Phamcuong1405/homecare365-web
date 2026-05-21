const items = [
  { title: "Nhắc lịch vệ sinh", body: "Đến lịch giặt sofa tuần này", time: "2h" },
  { title: "Voucher sinh nhật", body: "Giảm 15% đơn tiếp theo", time: "1 ngày" },
  { title: "Flash sale cuối tuần", body: "Đặt T7-CN giảm thêm 10%", time: "3 ngày" },
];

export default function NotificationsPage() {
  return (
    <div className="px-4 pt-4">
      <h1 className="text-lg font-bold">Thông báo</h1>
      <div className="mt-4 space-y-2">
        {items.map((n) => (
          <div key={n.title} className="m-card p-4">
            <div className="flex justify-between">
              <p className="font-semibold text-sm">{n.title}</p>
              <span className="text-xs text-[var(--m-muted)]">{n.time}</span>
            </div>
            <p className="mt-1 text-sm text-[var(--m-muted)]">{n.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
