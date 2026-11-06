"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteAuditButtonProps {
  id: string;
  redirect?: string;
  variant?: "icon" | "full";
  label?: string;
}

export function DeleteAuditButton({ id, redirect, variant = "icon", label = "حذف" }: DeleteAuditButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!window.confirm("حذف هذا الفحص؟ لا يمكن التراجع عن هذا الإجراء.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/audits/${id}`, { method: "DELETE" });
      if (res.ok) {
        if (redirect) router.push(redirect);
        else router.refresh();
      } else {
        setBusy(false);
        window.alert("حدث خطأ أثناء الحذف.");
      }
    } catch {
      setBusy(false);
      window.alert("خطأ في الاتصال أثناء الحذف.");
    }
  }

  if (variant === "full") {
    return (
      <button
        onClick={onDelete}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-paper/80 transition hover:border-danger hover:text-danger disabled:opacity-50"
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={onDelete}
      disabled={busy}
      aria-label="حذف هذا الفحص"
      title="حذف هذا الفحص"
      className="grid size-9 place-items-center rounded-full border border-line bg-white text-muted transition hover:border-danger hover:bg-danger-soft hover:text-danger disabled:opacity-50"
    >
      {busy ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
    </button>
  );
}
