import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Logo className="text-3xl" />
          <p className="text-[11px] text-paper/45">فحص كامل — 20 معياراً · 5 ركائز · نتيجة /100</p>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-sm text-paper/50">
            © 2026 MAPSO — رادار الحضور الرقمي لعيادات الأسنان. فحوصاتك محفوظة في قاعدة بياناتك
            الخاصة.
          </p>
        </div>
      </div>
    </footer>
  );
}
