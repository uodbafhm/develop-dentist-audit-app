import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { audits } from "@/db/schema";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    const rows = await db.select().from(audits).where(eq(audits.id, id)).limit(1);
    if (!rows.length) {
      return NextResponse.json({ error: "الفحص غير موجود." }, { status: 404 });
    }
    return NextResponse.json({ audit: rows[0] });
  } catch {
    return NextResponse.json({ error: "معرّف غير صالح." }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    const deleted = await db.delete(audits).where(eq(audits.id, id)).returning({ id: audits.id });
    if (!deleted.length) {
      return NextResponse.json({ error: "الفحص غير موجود." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "معرّف غير صالح." }, { status: 400 });
  }
}
