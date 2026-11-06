import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { audits, type AuditAnswers } from "@/db/schema";
import { CATEGORIES, computeResults } from "@/lib/audit";

function cleanString(value: unknown, max = 240): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

export async function GET() {
  try {
    const rows = await db.select().from(audits).orderBy(desc(audits.createdAt)).limit(100);
    return NextResponse.json({ audits: rows });
  } catch (error) {
    console.error("GET /api/audits", error);
    return NextResponse.json({ audits: [] }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;

    const clinicName = cleanString(body.clinicName, 140);
    if (!clinicName) {
      return NextResponse.json({ error: "اسم العيادة مطلوب." }, { status: 400 });
    }

    // نحتفظ فقط بالمعايير المعروفة مع قيم صالحة.
    const rawAnswers = (body.answers ?? {}) as Record<string, unknown>;
    const answers: AuditAnswers = {};
    for (const cat of CATEGORIES) {
      for (const c of cat.criteria) {
        const v = rawAnswers[c.id];
        if (c.type === "boolean") {
          answers[c.id] = v === true;
        } else if (typeof v === "string" && c.options?.some((o) => o.value === v)) {
          answers[c.id] = v;
        }
      }
    }

    const results = computeResults(answers);
    const categoryScores: Record<string, number> = {};
    for (const c of results.categories) categoryScores[c.id] = c.earned;

    const [row] = await db
      .insert(audits)
      .values({
        clinicName,
        doctorName: cleanString(body.doctorName, 140),
        city: cleanString(body.city, 120),
        phone: cleanString(body.phone, 40),
        instagramUrl: cleanString(body.instagramUrl, 400),
        mapsUrl: cleanString(body.mapsUrl, 400),
        websiteUrl: cleanString(body.websiteUrl, 400),
        answers,
        totalScore: results.total,
        categoryScores,
      })
      .returning({ id: audits.id });

    return NextResponse.json({ id: row.id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/audits", error);
    return NextResponse.json({ error: "خطأ في الخادم أثناء إنشاء الفحص." }, { status: 500 });
  }
}
