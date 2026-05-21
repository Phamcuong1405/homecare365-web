import { membershipTiers } from "@/lib/mobile-app-data";

export default function MembershipPage() {
  return (
    <div className="px-4 pt-4 pb-8">
      <h1 className="text-lg font-bold">Hội viên HomeCare365</h1>
      <p className="mt-1 text-sm text-[var(--m-muted)]">Tích điểm — ưu đãi — đặt lại 1 chạm</p>
      <div className="mt-6 space-y-4">
        {membershipTiers.map((t, i) => (
          <div
            key={t.id}
            className={`m-card p-5 ${i === 2 ? "ring-2 ring-[var(--m-warm-accent)]" : ""}`}
            style={i === 1 ? { background: "var(--m-warm)" } : undefined}
          >
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">{t.name}</h2>
              <span className="text-sm font-semibold text-[var(--m-trust)]">{t.price}</span>
            </div>
            <p className="mt-2 text-sm text-[var(--m-muted)]">{t.benefit}</p>
            <button type="button" className="m-btn-primary mt-4 w-full py-3 text-sm">
              {t.id === "silver" ? "Đang dùng" : "Nâng cấp"}
            </button>
          </div>
        ))}
      </div>
      <div className="m-card mt-6 p-4 text-center text-sm">
        <p className="font-semibold">Mời bạn — nhận 50.000đ</p>
        <button type="button" className="mt-3 text-[var(--m-primary)] font-semibold">
          Chia sẻ mã giới thiệu
        </button>
      </div>
    </div>
  );
}
