import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { Check, MapPin, Minus, Phone, Stethoscope, X } from "lucide-react";
import { db } from "@/db";
import { audits, type Audit } from "@/db/schema";
import {
  CATEGORIES,
  barTone,
  computeResults,
  criterionScore,
  formatDate,
} from "@/lib/audit";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Logo } from "@/components/Logo";
import { PrintToolbar } from "@/components/PrintToolbar";
import { RadarChart } from "@/components/RadarChart";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "تقرير PDF — MAPSO.RADAR" };

async function getAudit(id: string): Promise<Audit | null> {
  try {
    const rows = await db.select().from(audits).where(eq(audits.id, id)).limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export default async function PrintReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const audit = await getAudit(id);
  if (!audit) notFound();

  const results = computeResults(audit.answers ?? {});
  const verdict = results.verdict;

  return (
    <div className="print-exact bg-white text-ink">
      <PrintToolbar backHref={`/audit/${audit.id}`} />

      <div className="mx-auto w-full max-w-[794px] px-10 py-12">
        {/* ---------------- الترويسة ---------------- */}
        <header className="flex items-start justify-between border-b-2 border-ink pb-5">
          <div>
            <Logo className="text-2xl" />
            <p className="mt-1 text-[10.5px] text-muted">
              رادار الحضور الرقمي — عيادات الأسنان
            </p>
          </div>
          <div className="text-end">
            <p className="text-[10.5px] text-muted">تقرير الفحص</p>
            <p className="mt-1 font-display text-sm font-semibold">{formatDate(audit.createdAt)}</p>
            <p className="mt-0.5 font-mono text-[10px] text-muted" dir="ltr">
              REF {audit.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </header>

        {/* ---------------- العيادة + النتيجة ---------------- */}
        <section className="mt-8 flex items-start justify-between gap-8">
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-3xl font-bold leading-snug">
              {audit.clinicName}
            </h1>
            <div className="mt-3 space-y-1.5 text-[13px] text-ink/80">
              {audit.doctorName ? (
                <p className="flex items-center gap-2">
                  <Stethoscope className="size-3.5 text-accent-deep" /> {audit.doctorName}
                </p>
              ) : null}
              {audit.city ? (
                <p className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-accent-deep" /> {audit.city}
                </p>
              ) : null}
              {audit.phone ? (
                <p className="flex items-center gap-2" dir="ltr">
                  <Phone className="size-3.5 text-accent-deep" /> {audit.phone}
                </p>
              ) : null}
            </div>
            <div className="mt-3 space-y-1 font-mono text-[10px] text-muted" dir="ltr">
              {audit.instagramUrl ? <p className="truncate">IG — {audit.instagramUrl}</p> : null}
              {audit.mapsUrl ? <p className="truncate">MAP — {audit.mapsUrl}</p> : null}
              {audit.websiteUrl ? <p className="truncate">WEB — {audit.websiteUrl}</p> : null}
            </div>

            <div className="mt-5">
              <span
                className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
                style={{ borderColor: verdict.color }}
              >
                <span className="size-1.5 rounded-full" style={{ backgroundColor: verdict.color }} />
                <span className="text-[13px] font-semibold" style={{ color: verdict.color }}>
                  {verdict.label}
                </span>
              </span>
              <p className="mt-2 max-w-sm text-[12px] leading-relaxed text-muted">{verdict.tagline}</p>
            </div>
          </div>

          {/* دائرة النتيجة — ثابتة */}
          <div className="relative shrink-0" style={{ width: 150, height: 150 }}>
            <svg width="150" height="150" viewBox="0 0 150 150" className="-rotate-90">
              <circle cx="75" cy="75" r="63" fill="none" stroke="rgba(12,14,13,0.1)" strokeWidth="12" />
              <circle
                cx="75"
                cy="75"
                r="63"
                fill="none"
                stroke={verdict.color}
                strokeWidth="12"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={`${results.total} 100`}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center" dir="ltr">
              <div>
                <span className="font-display text-4xl font-bold tabular-nums">{results.total}</span>
                <span className="font-mono text-[11px] text-muted">/100</span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- الرادار + الركائز ---------------- */}
        <section className="mt-10 break-inside-avoid">
          <h2 className="font-display text-base font-bold">
            <span className="me-2 font-mono text-[11px] font-medium text-accent-deep">01</span>
            الركائز الخمس
          </h2>
          <div className="mt-4 flex items-center gap-8">
            <div className="w-[280px] shrink-0">
              <RadarChart
                staticMode
                size={280}
                values={results.categories.map((c) => ({ label: c.shortLabel, percent: c.percent }))}
              />
            </div>
            <div className="flex-1 space-y-3.5">
              {results.categories.map((cat) => (
                <div key={cat.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[12.5px] font-semibold">{cat.title}</p>
                    <p className="text-[10.5px] text-muted">
                      {cat.earned}/{cat.max} نقطة · {cat.percent}%
                    </p>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${cat.percent}%`, backgroundColor: barTone(cat.percent) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- قائمة التحقق ---------------- */}
        <section className="mt-10">
          <h2 className="font-display text-base font-bold">
            <span className="me-2 font-mono text-[11px] font-medium text-accent-deep">02</span>
            قائمة التحقق التفصيلية — 20 معياراً
          </h2>
          <div className="mt-4 space-y-4">
            {CATEGORIES.map((cat) => {
              const catResult = results.categories.find((c) => c.id === cat.id)!;
              return (
                <div key={cat.id} className="break-inside-avoid rounded-xl border border-line">
                  <div className="flex items-center justify-between border-b border-line bg-paper/70 px-4 py-2.5">
                    <p className="flex items-center gap-2 text-[12.5px] font-semibold">
                      <CategoryIcon icon={cat.icon} className="size-4 text-accent-deep" />
                      {cat.title}
                    </p>
                    <span className="text-[10px] text-muted">
                      {catResult.earned} / {catResult.max} نقطة
                    </span>
                  </div>
                  <ul className="px-4 py-1">
                    {cat.criteria.map((c) => {
                      const earned = criterionScore(c, audit.answers ?? {});
                      const full = earned === c.points;
                      const partial = earned > 0 && !full;
                      return (
                        <li
                          key={c.id}
                          className="flex items-start gap-3 border-b border-line/50 py-2 last:border-0"
                        >
                          <span
                            className={`mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full ${
                              full
                                ? "bg-accent-soft text-accent-deep"
                                : partial
                                  ? "bg-warn-soft text-warn"
                                  : "bg-danger-soft text-danger"
                            }`}
                          >
                            {full ? (
                              <Check className="size-3" />
                            ) : partial ? (
                              <Minus className="size-3" />
                            ) : (
                              <X className="size-3" />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[12px] font-medium leading-snug">{c.label}</p>
                            <p className="text-[10.5px] leading-snug text-muted">{c.hint}</p>
                          </div>
                          <span className="shrink-0 font-mono text-[10px] text-muted" dir="ltr">
                            <span
                              className={
                                full
                                  ? "font-semibold text-accent-deep"
                                  : partial
                                    ? "text-warn"
                                    : "text-danger"
                              }
                            >
                              +{earned}
                            </span>
                            /{c.points}
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
        <section className="mt-10 break-inside-avoid">
          <h2 className="font-display text-base font-bold">
            <span className="me-2 font-mono text-[11px] font-medium text-accent-deep">03</span>
            خطة العمل مرتبة بالأولويات
          </h2>
          {results.gaps.length === 0 ? (
            <div className="mt-4 rounded-xl border border-accent/40 bg-accent-soft/60 px-5 py-4">
              <p className="text-[12.5px] font-semibold text-accent-deep">
                نتيجة كاملة — المعايير العشرون محقَّقة جميعها.
              </p>
            </div>
          ) : (
            <ol className="mt-4 space-y-2.5">
              {results.gaps.map((gap, i) => (
                <li
                  key={gap.criterionId}
                  className="break-inside-avoid rounded-xl border border-line px-5 py-3.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-medium text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="rounded-full border border-line bg-paper px-2 py-0.5 text-[9.5px] font-medium text-muted">
                      {gap.categoryTitle}
                    </span>
                    <span className="rounded-full bg-danger-soft px-2 py-0.5 font-mono text-[9.5px] font-medium text-danger" dir="ltr">
                      −{gap.lost}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[12.5px] font-semibold leading-snug">{gap.label}</p>
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">{gap.recommendation}</p>
                </li>
              ))}
            </ol>
          )}
        </section>

        {/* ---------------- التذييل ---------------- */}
        <footer className="mt-12 border-t-2 border-ink pt-4">
          <div className="flex items-center justify-between">
            <div>
              <Logo className="text-base" />
              <p className="mt-0.5 text-[9.5px] text-muted">
                MAPSO.RADAR — فحص الحضور الرقمي لعيادات الأسنان
              </p>
            </div>
            <p className="text-[9.5px] text-muted">
              أُنشئ بتاريخ {formatDate(audit.createdAt)} — 20 معياراً · 5 ركائز · 100 نقطة
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
