"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheck,
  ClipboardCheck,
  Loader2,
  Plus,
  Radar,
  X,
} from "lucide-react";
import {
  CATEGORIES,
  TOTAL_CRITERIA,
  barTone,
  computeResults,
  type Answers,
  type CategoryDef,
  type CriterionDef,
} from "@/lib/audit";
import { CategoryIcon } from "./CategoryIcon";
import { Logo } from "./Logo";

// ------------------------------------------------------------------

interface InfoState {
  clinicName: string;
  doctorName: string;
  city: string;
  phone: string;
  instagramUrl: string;
  mapsUrl: string;
  websiteUrl: string;
}

const INFO_FIELDS: {
  key: keyof InfoState;
  label: string;
  placeholder: string;
  required?: boolean;
  full?: boolean;
}[] = [
  { key: "clinicName", label: "اسم العيادة", placeholder: "عيادة الأطلس لطب الأسنان", required: true },
  { key: "doctorName", label: "اسم الطبيب(ة)", placeholder: "د. ياسمين برادة" },
  { key: "city", label: "المدينة / الحي", placeholder: "الدار البيضاء — المعاريف" },
  { key: "phone", label: "الهاتف", placeholder: "+212 6 00 00 00 00" },
  { key: "instagramUrl", label: "رابط إنستغرام", placeholder: "https://instagram.com/clinic", },
  { key: "mapsUrl", label: "رابط ملف خرائط جوجل", placeholder: "https://maps.google.com/…" },
  { key: "websiteUrl", label: "رابط الموقع الإلكتروني", placeholder: "https://clinic.ma", full: true },
];

type Step =
  | { kind: "info"; id: "info"; title: string; subtitle: string }
  | { kind: "category"; id: string; category: CategoryDef; title: string; subtitle: string }
  | { kind: "recap"; id: "recap"; title: string; subtitle: string };

const STEPS: Step[] = [
  {
    kind: "info",
    id: "info",
    title: "العيادة",
    subtitle: "بعض المعلومات لتحديد العيادة المراد فحصها.",
  },
  ...CATEGORIES.map((category) => ({
    kind: "category" as const,
    id: category.id,
    category,
    title: category.title,
    subtitle: category.blurb,
  })),
  {
    kind: "recap",
    id: "recap",
    title: "الملخص",
    subtitle: "راجع الفحص قبل إنشاء التقرير.",
  },
];

// ------------------------------------------------------------------

export function AuditWizard() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [info, setInfo] = useState<InfoState>({
    clinicName: "",
    doctorName: "",
    city: "",
    phone: "",
    instagramUrl: "",
    mapsUrl: "",
    websiteUrl: "",
  });
  const [answers, setAnswers] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = STEPS[stepIndex];

  const answeredCount = useMemo(
    () =>
      CATEGORIES.reduce(
        (n, cat) =>
          n +
          cat.criteria.filter((c) =>
            c.type === "boolean" ? typeof answers[c.id] === "boolean" : typeof answers[c.id] === "string",
          ).length,
        0,
      ),
    [answers],
  );
  const progress = Math.round((answeredCount / TOTAL_CRITERIA) * 100);

  const stepValid = useMemo(() => {
    if (step.kind === "info") return info.clinicName.trim().length > 0;
    if (step.kind === "recap") return true;
    return step.category.criteria.every((c) =>
      c.type === "boolean" ? typeof answers[c.id] === "boolean" : typeof answers[c.id] === "string",
    );
  }, [step, info, answers]);

  function isDone(s: Step): boolean {
    if (s.kind === "info") return info.clinicName.trim().length > 0;
    if (s.kind === "recap") return false;
    return s.category.criteria.every((c) =>
      c.type === "boolean" ? typeof answers[c.id] === "boolean" : typeof answers[c.id] === "string",
    );
  }

  function goTo(index: number) {
    setDirection(index > stepIndex ? 1 : -1);
    setStepIndex(index);
    setError(null);
  }

  function setAnswer(id: string, value: boolean | string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...info, answers }),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (res.ok && data.id) {
        router.push(`/audit/${data.id}`);
        return;
      }
      setError(data.error ?? "خطأ غير متوقع.");
      setSubmitting(false);
    } catch {
      setError("خطأ في الاتصال — تحقق من شبكة الإنترنت.");
      setSubmitting(false);
    }
  }

  const isLast = stepIndex === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-paper">
      {/* الشريط العلوي */}
      <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-ink text-accent">
              <Radar className="size-4.5" />
            </span>
            <Logo className="text-xl" />
          </Link>
          <div className="flex items-center gap-3 text-[12px] text-muted">
            <span className="hidden sm:inline">نسبة إنجاز الفحص</span>
            <span className="rounded-full border border-line bg-white px-3 py-1 font-mono text-[11px] text-ink">
              {progress}%
            </span>
          </div>
        </div>
        <div className="h-0.5 w-full bg-line/60">
          <motion.div
            className="h-full bg-accent"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          {/* عمود الخطوات */}
          <aside className="hidden lg:block">
            <ol className="sticky top-28 space-y-1.5">
              {STEPS.map((s, i) => {
                const active = i === stepIndex;
                const done = s.kind !== "recap" && isDone(s);
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => goTo(i)}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 transition ${
                        active
                          ? "border-ink bg-ink text-paper"
                          : done
                            ? "border-accent/40 bg-accent-soft/60 text-ink hover:border-accent"
                            : "border-line bg-white text-muted hover:border-ink/30 hover:text-ink"
                      }`}
                    >
                      <span
                        className={`font-mono text-[11px] ${active ? "text-accent" : done ? "text-accent-deep" : "text-muted"}`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-sm font-medium">
                        {s.kind === "category" ? s.category.shortLabel : s.title}
                      </span>
                      {done && !active ? <CircleCheck className="size-4 text-accent-deep" /> : null}
                    </button>
                  </li>
                );
              })}
            </ol>
          </aside>

          {/* محتوى الخطوة */}
          <main>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -28 * direction }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 28 * direction }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-8">
                  <p className="text-[12px] font-semibold text-accent-deep">
                    الخطوة {String(stepIndex + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
                  </p>
                  <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{step.title}</h1>
                  <p className="mt-2 max-w-xl text-muted">{step.subtitle}</p>
                </div>

                {step.kind === "info" ? (
                  <InfoStep info={info} onChange={setInfo} />
                ) : step.kind === "category" ? (
                  <div className="space-y-4">
                    {step.category.criteria.map((c) => (
                      <CriterionCard
                        key={c.id}
                        criterion={c}
                        value={answers[c.id]}
                        onChange={(v) => setAnswer(c.id, v)}
                      />
                    ))}
                  </div>
                ) : (
                  <RecapStep info={info} answers={answers} onEdit={(i) => goTo(i)} />
                )}

                {error ? (
                  <div className="mt-6 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
                    {error}
                  </div>
                ) : null}

                {/* أزرار التنقل */}
                <div className="mt-10 flex items-center justify-between gap-4">
                  <button
                    onClick={() => goTo(stepIndex - 1)}
                    disabled={stepIndex === 0 || submitting}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink transition hover:border-ink/40 disabled:opacity-40"
                  >
                    <ArrowRight className="size-4" />
                    رجوع
                  </button>

                  {isLast ? (
                    <button
                      onClick={submit}
                      disabled={submitting || answeredCount < TOTAL_CRITERIA}
                      className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,168,107,0.35)] transition hover:bg-accent-deep disabled:opacity-40"
                    >
                      {submitting ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <ClipboardCheck className="size-4" />
                      )}
                      {submitting ? "جارٍ الإنشاء…" : "إنشاء التقرير"}
                    </button>
                  ) : (
                    <button
                      onClick={() => goTo(stepIndex + 1)}
                      disabled={!stepValid}
                      className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-sm font-semibold text-paper transition hover:bg-accent disabled:opacity-40"
                    >
                      متابعة
                      <ArrowLeft className="size-4" />
                    </button>
                  )}
                </div>

                {isLast && answeredCount < TOTAL_CRITERIA ? (
                  <p className="mt-3 text-[11px] text-muted">
                    تبقّى {TOTAL_CRITERIA - answeredCount} معياراً لإكماله
                  </p>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------

function InfoStep({
  info,
  onChange,
}: {
  info: InfoState;
  onChange: (next: InfoState) => void;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 sm:p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        {INFO_FIELDS.map((f) => (
          <div key={f.key} className={f.full ? "sm:col-span-2" : ""}>
            <label className="mb-1.5 block text-sm font-medium">
              {f.label} {f.required ? <span className="text-accent-deep">*</span> : null}
            </label>
            <input
              type="text"
              dir={f.key === "clinicName" || f.key === "doctorName" || f.key === "city" ? "rtl" : "ltr"}
              value={info[f.key]}
              placeholder={f.placeholder}
              onChange={(e) => onChange({ ...info, [f.key]: e.target.value })}
              className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none transition placeholder:text-muted/60 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/25"
            />
          </div>
        ))}
      </div>
      <p className="mt-5 text-[11px] leading-relaxed text-muted">
        الروابط اختيارية — ستظهر على تقرير PDF النهائي.
      </p>
    </div>
  );
}

// ------------------------------------------------------------------

function CriterionCard({
  criterion,
  value,
  onChange,
}: {
  criterion: CriterionDef;
  value: boolean | string | undefined;
  onChange: (v: boolean | string) => void;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-semibold leading-snug">{criterion.label}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">{criterion.hint}</p>
        </div>
        <span className="shrink-0 rounded-full border border-line bg-paper px-2.5 py-1 text-[10.5px] font-medium text-muted">
          +{criterion.points} نقطة
        </span>
      </div>

      {criterion.type === "boolean" ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            { v: true, label: "نعم", Icon: Check },
            { v: false, label: "لا", Icon: X },
          ].map(({ v, label, Icon }) => {
            const selected = value === v;
            return (
              <button
                key={label}
                onClick={() => onChange(v)}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  selected
                    ? v
                      ? "border-accent bg-accent text-white"
                      : "border-ink bg-ink text-paper"
                    : "border-line bg-paper text-muted hover:border-ink/40 hover:text-ink"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {criterion.options?.map((opt) => {
            const selected = value === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onChange(opt.value)}
                className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition ${
                  selected
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-paper text-ink hover:border-ink/40"
                }`}
              >
                <span className="text-sm font-medium">{opt.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[10.5px] ${
                    selected ? "bg-accent text-white" : "bg-white text-muted"
                  }`}
                >
                  +{opt.points}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------

function RecapStep({
  info,
  answers,
  onEdit,
}: {
  info: InfoState;
  answers: Answers;
  onEdit: (stepIndex: number) => void;
}) {
  const results = computeResults(answers);

  return (
    <div className="space-y-4">
      {/* معاينة النتيجة */}
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-line bg-ink p-6 text-paper sm:p-8">
        <div>
          <p className="text-[11px] text-paper/50">النتيجة المتوقعة</p>
          <p className="mt-2 font-display text-5xl font-bold tabular-nums">
            {results.total}
            <span className="text-xl text-paper/50">/100</span>
          </p>
        </div>
        <div className="rounded-full border px-4 py-2" style={{ borderColor: results.verdict.color }}>
          <span className="text-sm font-semibold" style={{ color: results.verdict.color }}>
            {results.verdict.label}
          </span>
        </div>
      </div>

      {/* الركائز */}
      {results.categories.map((cat, i) => (
        <div key={cat.id} className="rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-paper text-ink">
                <CategoryIcon icon={cat.icon} className="size-5" />
              </span>
              <div>
                <p className="font-display text-sm font-semibold">{cat.title}</p>
                <p className="text-[11px] text-muted">
                  {cat.earned} / {cat.max} نقطة
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-28 sm:w-40">
                <span className="block h-2 w-full overflow-hidden rounded-full bg-ink/10">
                  <span
                    className="block h-full rounded-full"
                    style={{ width: `${cat.percent}%`, backgroundColor: barTone(cat.percent) }}
                  />
                </span>
              </span>
              <button
                onClick={() => onEdit(i + 1)}
                className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted transition hover:border-ink hover:text-ink"
              >
                تعديل
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* معلومات العيادة */}
      <div className="rounded-2xl border border-line bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="font-display text-sm font-semibold">معلومات العيادة</p>
          <button
            onClick={() => onEdit(0)}
            className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted transition hover:border-ink hover:text-ink"
          >
            تعديل
          </button>
        </div>
        <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted">العيادة</dt>
            <dd className="font-medium">{info.clinicName || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted">الطبيب(ة)</dt>
            <dd className="font-medium">{info.doctorName || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted">المدينة</dt>
            <dd className="font-medium">{info.city || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted">الهاتف</dt>
            <dd className="font-medium">{info.phone || "—"}</dd>
          </div>
        </dl>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-accent/30 bg-accent-soft/60 p-5">
        <Plus className="mt-0.5 size-4 shrink-0 text-accent-deep" />
        <p className="text-sm leading-relaxed text-accent-deep">
          سيتضمن التقرير النهائي النتيجة التفصيلية لكل ركيزة، وقائمة التحقق الكاملة المشروحة، وخطة
          عمل مرتبة بالأولويات — جاهز للطباعة بصيغة PDF.
        </p>
      </div>
    </div>
  );
}
