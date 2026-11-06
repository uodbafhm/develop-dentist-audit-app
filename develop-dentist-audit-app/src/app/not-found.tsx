import Link from "next/link";
import { ArrowRight, Radar } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-6 text-paper">
      <div className="text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl border border-white/15 bg-ink-2 text-accent">
          <Radar className="size-7" />
        </span>
        <p className="mt-8 text-[11px] text-paper/50">خطأ 404 — الإشارة مقطوعة</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">خارج نطاق الرادار</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-paper/60">
          هذا التقرير غير موجود أو تم حذفه. عُد إلى مركز التحكم.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-deep"
        >
          <ArrowRight className="size-4" />
          العودة إلى الرئيسية
        </Link>
        <p className="mt-10 opacity-70">
          <Logo className="text-lg" />
        </p>
      </div>
    </main>
  );
}
