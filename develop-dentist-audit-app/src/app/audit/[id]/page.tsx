import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Check,
  Link2,
  MapPin,
  Minus,
  Phone,
  Plus,
  Printer,
  Stethoscope,
  X,
} from "lucide-react";
import { db } from "@/db";
import { audits, type Audit } from "@/db/schema";
import {
  CATEGORIES,
  barTone,
  computeResults,
  criterionScore,
  formatDate,
} from "@/lib/audit";
import { AnimatedBar } from "@/components/AnimatedBar";
import { CategoryIcon } from "@/components/CategoryIcon";
import { DeleteAuditButton } from "@/components/DeleteAuditButton";
import { RadarChart } from "@/components/RadarChart";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "تقرير الفحص — MAPSO.RADAR" };

async function getAudit(id: string): Promise<Audit | null> {
  try {
    const rows = await db.select().from(audits).where(eq(audits.id, id)).limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export default async function AuditResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const audit = await getAudit(id);
  if (!audit) notFound();

  const results = computeResults(audit.answers ?? {});
  const verdict = results.verdict;

  const links = [
    { href: audit.instagramUrl, label: "إنستغرام" },
    { href: audit.mapsUrl, label: "خرائط جوجل" },
    { href: audit.websiteUrl, label: "الموقع الإلكتروني" },
  ].filter((l) => l.href);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* ---------------- الواجهة ---------------- */}
      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-12">
          <p className="text-[12px] font-medium text-paper/45">
            تقرير الفحص — {formatDate(audit.createdAt)}
          </p>

          <div className="mt-8 grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 className="font-display text-[clamp(2rem,5vw,3.6rem)] font-bold leading-[1.15]">
                {audit.clinicName}
              </h1>

              <div className="mt-5 flex flex-wrap gap-2 text-sm text-paper/75">
                {audit.doctorName ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5">
                    <Stethoscope className="size-3.5 text-accent" />
                    {audit.doctorName}
                  </span>
                ) : null}
                {audit.city ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5">
                    <MapPin className="size-3.5 text-accent" />
                    {audit.city}
                  </span>
                ) : null}
                {audit.phone ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5" dir="ltr">
                    <Phone className="size-3.5 text-accent" />
                    {audit.phone}
                  </span>
                ) : null}
                {links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href!}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 transition hover:border-accent hover:text-accent"
                  >
                    <Link2 className="size-3.5 text-accent" />
                    {l.label}
                  </a>
                ))}
              </div>

              <div className="mt-8">
                <span
                  className="inline-flex items-center gap-2.5 rounded-full border px-5 py-2"
                  style={{ borderColor: verdict.color }}
                >
                  <span className="size-2 rounded-full" style={{ backgroundColor: verdict.color }} />
                  <span className="font-display text-base font-semibold" style={{ color: verdict.color }}>
                    {verdict.label}
                  </span>
                </span>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/60">{verdict.tagline}</p>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href={`/audit/${audit.id}/print`}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-deep"
                >
                  <Printer className="size-4" />
                  طباعة / PDF
                </Link>
                <Link
                  href="/audit/new"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-paper/85 transition hover:border-white/50"
                >
                  <Plus className="size-4" />
                  فحص جديد
                </Link>
                <DeleteAuditButton id={audit.id} redirect="/" variant="full" label="حذف" />
              </div>
            </div>

            <div className="flex justify-center lg:justify-start">
              <RadarChart
                dark
                size={380}
                values={results.categories.map((c) => ({
                  label: c.shortLabel,
                  percent: c.percent,
                }))}
                center={
                  <div className="text-center" dir="ltr">
                    <p className="font-display text-5xl font-bold tabular-nums text-paper">
                      {results.total}
                    </p>
                    <p className="mt-1 text-[10px] text-paper/50">النتيجة / 100</p>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-5">
        {/* ---------------- النتيجة حسب الركيزة ---------------- */}
        <section className="pt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[12px] font-semibold text-accent-deep">01 — الركائز</p>
              <h2 className="mt-2 font-display text-3xl font-bold">النتيجة حسب الركيزة</h2>
            </div>
            <p className="max-w-md text-sm text-muted">
              كل ركيزة مُقيّمة على نقاطها الخاصة — والمجموع الكلي 100 نقطة.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.categories.map((cat) => {
              const catGaps = results.gaps.filter((g) => g.categoryId === cat.id);
              return (
                <div key={cat.id} className="rounded-2xl border border-line bg-white p-6">
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-xl bg-paper text-ink">
                      <CategoryIcon icon={cat.icon} />
                    </span>
                    <span className="text-xs text-muted">
                      {cat.earned} / {cat.max} نقطة
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{cat.title}</h3>
                  <div className="mt-4">
                    <AnimatedBar percent={cat.percent} color={barTone(cat.percent)} />
                    <p className="mt-2 text-[11px] text-muted">{cat.percent}% من الركيزة</p>
                  </div>
                  <div className="mt-4 space-y-1.5">
                    {catGaps.length === 0 ? (
                      <p className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-deep">
                        <Check className="size-3.5" /> ركيزة مكتملة — لا شيء للتصحيح
                      </p>
                    ) : (
                      catGaps.slice(0, 2).map((g) => (
                        <p key={g.criterionId} className="flex items-start gap-1.5 text-xs text-muted">
                          <X className="mt-0.5 size-3.5 shrink-0 text-danger" />
                          <span className="leading-snug">{g.label}</span>
                        </p>
                      ))
                    )}
                  </div>
                </div>
              );
            })}

            <a
              href="#plan"
              className="group flex flex-col justify-between rounded-2xl bg-ink p-6 text-paper transition hover:bg-ink-2"
            >
              <ArrowLeft className="size-7 text-accent" />
              <div className="mt-8">
                <p className="font-display text-xl font-semibold leading-snug">
                  {results.gaps.length} نقطة تحتاج تصحيحاً
                </p>
                <p className="mt-1.5 text-sm text-paper/60">
                  اطّلع على خطة العمل المرتبة بالأولويات بالأسفل
                </p>
              </div>
            </a>
          </div>
        </section>

        {/* ---------------- قائمة التحقق ---------------- */}
        <section className="pt-16">
          <p className="text-[12px] font-semibold text-accent-deep">02 — التفاصيل</p>
          <h2 className="mt-2 font-display text-3xl font-bold">قائمة التحقق الكاملة</h2>

          <div className="mt-8 space-y-6">
            {CATEGORIES.map((cat) => {
              const catResult = results.categories.find((c) => c.id === cat.id)!;
              return (
                <div key={cat.id} className="overflow-hidden rounded-2xl border border-line bg-white">
                  <div className="flex items-center justify-between border-b border-line bg-paper/60 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <CategoryIcon icon={cat.icon} className="size-5 text-accent-deep" />
                      <h3 className="font-display text-base font-semibold">{cat.title}</h3>
                    </div>
                    <span className="text-xs text-muted">
                      {catResult.earned} / {catResult.max} نقطة
                    </span>
                  </div>
                  <ul>
                    {cat.criteria.map((c, i) => {
                      const earned = criterionScore(c, audit.answers ?? {});
                      const full = earned === c.points;
                      const partial = earned > 0 && !full;
                      return (
                        <li
                          key={c.id}
                          className={`flex items-start gap-4 px-6 py-4 ${i > 0 ? "border-t border-line/70" : ""}`}
                        >
                          <span
                            className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${
                              full
                                ? "bg-accent-soft text-accent-deep"
                                : partial
                                  ? "bg-warn-soft text-warn"
                                  : "bg-danger-soft text-danger"
                            }`}
                          >
                            {full ? (
                              <Check className="size-3.5" />
                            ) : partial ? (
                              <Minus className="size-3.5" />
                            ) : (
                              <X className="size-3.5" />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium leading-snug">{c.label}</p>
                            <p className="mt-0.5 text-xs leading-relaxed text-muted">{c.hint}</p>
                          </div>
                          <span className="shrink-0 font-mono text-xs text-muted" dir="ltr">
                            <span className={full ? "font-semibold text-accent-deep" : partial ? "text-warn" : "text-danger"}>
                              +{earned}
                            </span>{" "}
                            / {c.points}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* ---------------- خطة العمل ---------------- */}
        <section id="plan" className="scroll-mt-24 pt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[12px] font-semibold text-accent-deep">03 — الوصفة</p>
              <h2 className="mt-2 font-display text-3xl font-bold">
                خطة العمل مرتبة بالأولويات
              </h2>
            </div>
            <p className="max-w-md text-sm text-muted">
              مرتبة حسب الأثر: النقاط التي تجلب أكبر ظهور تأتي أولاً.
            </p>
          </div>

          {results.gaps.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-accent/30 bg-accent-soft/60 p-8 text-center">
              <Check className="mx-auto size-8 text-accent-deep" />
              <p className="mt-3 font-display text-xl font-semibold text-accent-deep">
                نتيجة كاملة — لا شيء للتصحيح
              </p>
              <p className="mt-1.5 text-sm text-accent-deep/80">
                هذه العيادة تحقق المعايير العشرين كلها. حافظ على وتيرة النشر والردود.
              </p>
            </div>
          ) : (
            <ol className="mt-8 space-y-3">
              {results.gaps.slice(0, 10).map((gap, i) => (
                <li
                  key={gap.criterionId}
                  className="flex items-start gap-5 rounded-2xl border border-line bg-white p-5 transition hover:border-ink/25 sm:p-6"
                >
                  <span className="font-mono text-2xl font-medium text-line">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-line bg-paper px-2.5 py-0.5 text-[10.5px] font-medium text-muted">
                        {gap.categoryTitle}
                      </span>
                      <span className="rounded-full bg-danger-soft px-2.5 py-0.5 text-[10.5px] font-medium text-danger">
                        −{gap.lost} نقطة
                      </span>
                    </div>
                    <p className="mt-2 font-display text-[15px] font-semibold leading-snug">
                      {gap.label}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{gap.recommendation}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        {/* ---------------- دعوة أخيرة ---------------- */}
        <section className="pt-16">
          <div className="rounded-3xl bg-ink px-8 py-10 text-paper sm:px-12">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <h2 className="font-display text-2xl font-bold sm:text-3xl">
                  عيادة أخرى تريد فحصها؟
                </h2>
                <p className="mt-2 text-sm text-paper/60">
                  الرادار جاهز — 6 خطوات، أقل من 4 دقائق.
                </p>
              </div>
              <Link
                href="/audit/new"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-accent-deep"
              >
                <Plus className="size-4" />
                ابدأ الفحص
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
