"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Printer } from "lucide-react";

export function PrintToolbar({ backHref }: { backHref: string }) {
  useEffect(() => {
    const t = setTimeout(() => window.print(), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="no-print fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-full bg-ink px-3 py-2 text-paper shadow-[0_18px_50px_rgba(12,14,13,0.35)]">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-paper/80 transition hover:text-paper"
        >
          <ArrowRight className="size-4" />
          العودة إلى التقرير
        </Link>
        <span className="hidden text-[11px] text-paper/50 sm:inline">
          تلميح — اختر «حفظ بصيغة PDF» من نافذة الطباعة
        </span>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent-deep"
        >
          <Printer className="size-4" />
          طباعة / PDF
        </button>
      </div>
    </div>
  );
}
