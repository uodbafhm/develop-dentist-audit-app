import Link from "next/link";
import { Plus, Radar } from "lucide-react";
import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-ink text-accent">
            <Radar className="size-4.5" />
          </span>
          <Logo className="text-xl" />
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/#audits"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:text-ink sm:block"
          >
            الفحوصات الأخيرة
          </Link>
          <Link
            href="/audit/new"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:bg-accent"
          >
            <Plus className="size-4" />
            فحص جديد
          </Link>
        </nav>
      </div>
    </header>
  );
}
