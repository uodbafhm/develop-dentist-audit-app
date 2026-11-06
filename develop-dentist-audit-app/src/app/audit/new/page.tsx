import type { Metadata } from "next";
import { AuditWizard } from "@/components/AuditWizard";

export const metadata: Metadata = {
  title: "فحص جديد — MAPSO.RADAR",
};

export default function NewAuditPage() {
  return <AuditWizard />;
}
