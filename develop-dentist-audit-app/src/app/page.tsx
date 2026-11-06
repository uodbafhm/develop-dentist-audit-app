import Link from "next/link";
import { desc } from "drizzle-orm";
import {
  ArrowLeft,
  ChevronLeft,
  ClipboardCheck,
  Plus,
  ScanLine,
  Sparkles,
} from "lucide-react";
import { db } from "@/db";
import { audits, type Audit } from "@/db/schema";
import { CATEGORIES, formatDate, verdictFor } from "@/lib/audit";
import { CategoryIcon } from "@/components/CategoryIcon";
import { DeleteAuditButton } from "@/components/DeleteAuditButton";
import { RadarBackdrop } from "@/components/RadarBackdrop";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let rows: Audit[] = [];
  let dbReady = true;
  try {
    rows = await db.select().from(audits).orderBy(desc(audits.createdAt)).limit(50);
  } catch (error) {
    console.error("تعذر تحميل الفحوصات:", error);
    dbReady = false;
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* ---------------- الواجهة ---------------- */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <div className="pointer-events-none absolute -left-40 -top-24 h-[560px] w-[560px] opacity-70 sm:opacity-90 lg:-left-10">
          <RadarBackdrop className="inset-0" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-16 sm:pt-24">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-[12px] font-medium text-paper/60">
              <span className="size-1.5 animate-pulse rounded-full bg-accent" />
              ماسح الحضور الرقمي لعيادات الأسنان
            </p>
            <h1 className="mt-6 font-display text-[clamp(2.4rem,6vw,4.4rem)] font-bold leading-[1.15]">
              مرّر كل عيادة أسنان
              <br />
              تحت <span className="text-accent">الرادار</span>.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/65 sm:text-lg">
              إنستغرام، فيديو العيادة من الخارج إلى الداخل، ملف خرائط جوجل، الموقع الإلكتروني
              والحجز، والردود على المرضى — فحص شامل من 20 معياراً، ونتيجة واضحة من 100، وخطة عمل
              مرتبة بالأولويات جاهزة بصيغة PDF.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/audit/new"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(0,168,107,0.4)] transition hover:bg-accent-deep"
              >
                <Plus className="size-4" />
                ابدأ الفحص
              </Link>
              <a
                href="#piliers"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium text-paper/85 transition hover:border-white/50 hover:text-paper"
              >
                شاهد الركائز الخمس
                <ArrowLeft className="size-4" />
              </a>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
            {[
              ["20", "معيار تحقّق"],
              ["05", "ركائز رقمية"],
              ["/100", "النتيجة العامة"],
              ["PDF", "تقرير قابل للطباعة"],
            ].map(([big, small]) => (
              <div key={small} className="bg-ink px-5 py-5">
                <p className="font-display text-2xl font-bold tabular-nums">{big}</p>
                <p className="mt-1 text-[11px] text-paper/45">{small}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- الركائز ---------------- */}
      <section id="piliers" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold text-accent-deep">01 — الركائز</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              خمس ركائز، عشرون معياراً
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted">
            النتيجة العامة هي مجموع 100 نقطة موزعة على خمس ركائز تحدد فعلاً مدى ظهور عيادة الأسنان
            على الإنترنت.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => {
            const max = cat.criteria.reduce((n, c) => n + c.points, 0);
            return (
              <div
                key={cat.id}
                className="group rounded-2xl border border-line bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-ink/25 hover:shadow-[0_20px_50px_rgba(12,14,13,0.08)]"
              >
                <div className="flex items-start justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-ink text-accent transition group-hover:bg-accent group-hover:text-white">
                    <CategoryIcon icon={cat.icon} />
                  </span>
                  <span className="text-[11px] text-muted">{max} نقطة</span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{cat.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{cat.blurb}</p>
                <p className="mt-4 text-[11px] text-muted">
                  {cat.criteria.length} معايير —
                  <span className="text-accent-deep">
                    {" "}
                    {cat.criteria.map((c) => c.points).join(" + ")}
                  </span>
                </p>
              </div>
            );
          })}

          {/* بطاقة البدء */}
          <Link
            href="/audit/new"
            className="group flex flex-col justify-between rounded-2xl bg-accent p-6 text-white transition duration-300 hover:-translate-y-1 hover:bg-accent-deep hover:shadow-[0_20px_50px_rgba(0,168,107,0.35)]"
          >
            <ScanLine className="size-8" />
            <div className="mt-8">
              <p className="font-display text-xl font-semibold leading-snug">افحص عيادة الآن</p>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-white/80">
                6 خطوات، أقل من 4 دقائق
                <ArrowLeft className="size-4 transition group-hover:-translate-x-1" />
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* ---------------- المنهجية ---------------- */}
      <section className="mx-auto max-w-6xl px-5 pt-20">
        <p className="text-[12px] font-semibold text-accent-deep">02 — المنهجية</p>
        <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">افحص. شخّص. اعمل.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: ScanLine,
              num: "01",
              title: "أدخِل",
              text: "اسم العيادة، المدينة، وروابط إنستغرام وخرائط جوجل والموقع — الهدف محدَّد.",
            },
            {
              icon: ClipboardCheck,
              num: "02",
              title: "افحص",
              text: "20 معياراً واقعياً: نشاط المنشورات، فيديو العيادة، صور الاستقبال إلى كرسي الأسنان، الحجز، التقييمات، وردود الطبيب.",
            },
            {
              icon: Sparkles,
              num: "03",
              title: "اعمل",
              text: "نتيجة /100، تقييم واضح، وخطة عمل مرتبة بالأولويات — قابلة للتصدير بصيغة PDF أنيقة للعميل.",
            },
          ].map((m) => (
            <div key={m.num} className="rounded-2xl border border-line bg-white p-6">
              <div className="flex items-center justify-between">
                <m.icon className="size-6 text-accent-deep" />
                <span className="font-mono text-[11px] text-muted">{m.num}</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{m.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- الفحوصات الأخيرة ---------------- */}
      <section id="audits" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold text-accent-deep">03 — السجل</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">الفحوصات الأخيرة</h2>
          </div>
          <Link
            href="/audit/new"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-accent"
          >
            <Plus className="size-4" />
            فحص جديد
          </Link>
        </div>

        {!dbReady ? (
          <div className="mt-8 rounded-2xl border border-warn/40 bg-warn-soft px-5 py-4 text-sm">
            <span className="text-[11px] font-semibold text-warn">قاعدة البيانات</span>
            <p className="mt-1 text-muted">
              قاعدة البيانات ليست جاهزة بعد — سيُنشأ الجدول تلقائياً عند بدء التشغيل. أعد تحميل
              الصفحة بعد ثوانٍ.
            </p>
          </div>
        ) : rows.length === 0 ? (
          <div className="mt-8 grid place-items-center rounded-3xl border-2 border-dashed border-line bg-white/60 px-6 py-20 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-ink text-accent">
              <ScanLine className="size-6" />
            </span>
            <p className="mt-5 font-display text-xl font-semibold">لا توجد فحوصات بعد</p>
            <p className="mt-1.5 max-w-sm text-sm text-muted">
              ابدأ أول فحص: في 4 دقائق ستحصل على النتيجة الكاملة لعيادة أسنان.
            </p>
            <Link
              href="/audit/new"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-deep"
            >
              <Plus className="size-4" />
              ابدأ أول فحص
            </Link>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white">
            {rows.map((a, i) => {
              const verdict = verdictFor(a.totalScore);
              return (
                <div
                  key={a.id}
                  className={`flex items-center gap-4 px-5 py-4 transition hover:bg-paper/70 ${
                    i > 0 ? "border-t border-line" : ""
                  }`}
                >
                  <span
                    className="grid size-11 shrink-0 place-items-center rounded-xl font-display text-sm font-bold"
                    style={{ backgroundColor: verdict.softColor, color: verdict.color }}
                  >
                    {a.clinicName.slice(0, 2)}
                  </span>
                  <Link href={`/audit/${a.id}`} className="min-w-0 flex-1">
                    <p className="truncate font-display text-[15px] font-semibold">{a.clinicName}</p>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {[a.city, a.doctorName].filter(Boolean).join(" — ") || "عيادة أسنان"} ·{" "}
                      {formatDate(a.createdAt)}
                    </p>
                  </Link>
                  <span
                    className="hidden rounded-full px-3 py-1 text-[11px] font-medium sm:inline"
                    style={{ backgroundColor: verdict.softColor, color: verdict.color }}
                  >
                    {a.totalScore}/100 · {verdict.label}
                  </span>
                  <Link
                    href={`/audit/${a.id}`}
                    aria-label={`عرض تقرير ${a.clinicName}`}
                    className="grid size-9 place-items-center rounded-full border border-line bg-white text-muted transition hover:border-ink hover:text-ink"
                  >
                    <ChevronLeft className="size-4" />
                  </Link>
                  <DeleteAuditButton id={a.id} />
                </div>
              );
            })}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
