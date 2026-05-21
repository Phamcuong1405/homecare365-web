import { FloatingSupport } from "@/components/mobile/FloatingSupport";
import { MobileTabBar } from "@/components/mobile/MobileTabBar";

export default function MobileMainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="min-h-dvh pb-24">{children}</main>
      <FloatingSupport />
      <MobileTabBar />
    </>
  );
}
