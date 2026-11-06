/**
 * يعمل مرة واحدة عند بدء الخادم (Node runtime).
 * يضمن وجود جدول "audits" — مفيد للبيئات الجديدة
 * (أول نشر على Vercel، أو إعادة ضبط sandbox) بدون ترحيل يدوي.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  try {
    const { pool } = await import("@/db");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "audits" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "clinic_name" text NOT NULL,
        "doctor_name" text,
        "city" text,
        "phone" text,
        "instagram_url" text,
        "maps_url" text,
        "website_url" text,
        "answers" jsonb NOT NULL,
        "total_score" integer NOT NULL,
        "category_scores" jsonb NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      )
    `);
  } catch (error) {
    console.error("[instrumentation] تعذّر التحقق من جدول 'audits':", error);
  }
}
