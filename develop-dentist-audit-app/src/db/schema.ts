import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export type AuditAnswers = Record<string, boolean | string>;

export const audits = pgTable("audits", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicName: text("clinic_name").notNull(),
  doctorName: text("doctor_name"),
  city: text("city"),
  phone: text("phone"),
  instagramUrl: text("instagram_url"),
  mapsUrl: text("maps_url"),
  websiteUrl: text("website_url"),
  answers: jsonb("answers").notNull().$type<AuditAnswers>(),
  totalScore: integer("total_score").notNull(),
  categoryScores: jsonb("category_scores").notNull().$type<Record<string, number>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Audit = typeof audits.$inferSelect;
export type NewAudit = typeof audits.$inferInsert;
