"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { mobileBrand } from "@/lib/mobile-app-data";

export default function LoginPage() {
  const router = useRouter();

  function login(method: string) {
    localStorage.setItem("hc365_logged_in", "1");
    localStorage.setItem("hc365_user_name", method === "guest" ? "Khách" : "Bạn");
    router.replace("/m/home");
  }

  return (
    <div className="min-h-dvh bg-[var(--m-bg)] px-6 pb-10 pt-12">
      <div className="text-center">
        <Image
          src="/brand/homecare365-logo.png"
          alt=""
          width={120}
          height={78}
          className="mx-auto h-auto w-[120px]"
        />
        <h1 className="mt-4 text-xl font-bold">Chào mừng đến {mobileBrand.name}</h1>
        <p className="mt-1 text-sm text-[var(--m-muted)]">{mobileBrand.slogan}</p>
      </div>

      <div className="m-card mt-8 space-y-3 p-5">
        <button
          type="button"
          onClick={() => login("google")}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3.5 text-sm font-semibold"
        >
          <span>G</span> Đăng nhập Google
        </button>
        <button
          type="button"
          onClick={() => login("apple")}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3.5 text-sm font-semibold text-white"
        >
           Continue with Apple
        </button>
        <button
          type="button"
          onClick={() => login("facebook")}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1877f2] py-3.5 text-sm font-semibold text-white"
        >
          Facebook
        </button>
        <div className="relative py-2 text-center text-xs text-[var(--m-muted)]">
          <span className="bg-white px-2">hoặc</span>
          <div className="absolute inset-x-0 top-1/2 -z-10 border-t border-gray-200" />
        </div>
        <input className="m-input" type="tel" placeholder="Số điện thoại" inputMode="tel" />
        <button
          type="button"
          onClick={() => login("otp")}
          className="m-btn-trust w-full py-3.5 text-sm"
        >
          Nhận mã OTP
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-[var(--m-muted)]">
        Đăng nhập = đồng ý Điều khoản & Chính sách bảo mật
      </p>
      <button
        type="button"
        onClick={() => login("guest")}
        className="mt-6 w-full text-center text-sm font-medium text-[var(--m-primary)]"
      >
        Tiếp tục không đăng nhập (demo)
      </button>
    </div>
  );
}
