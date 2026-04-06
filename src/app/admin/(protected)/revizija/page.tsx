import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { getAuditLogData } from "@/lib/admin-data";
import { formatDateTime } from "@/lib/format";
import { requireSession } from "@/lib/auth";
import { canManageSensitiveSettings } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function AuditPage() {
  const session = await requireSession();
  if (!canManageSensitiveSettings(session.role)) redirect("/admin");
  const logs = await getAuditLogData();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Revizija"
        description="Audit trail za ključne admin akcije: lead update, auth pristup, cijene, sadržaj i inventarske promjene."
      />

      <Card className="rounded-[30px]">
        <CardContent className="space-y-3 p-6">
          {logs.map((log) => (
            <div key={log.id} className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                  {log.action}
                </p>
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                  {formatDateTime(log.createdAt)}
                </p>
              </div>
              <p className="mt-2 text-sm text-zinc-100">{log.summary}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
                {log.entityType} · {log.actor?.name || "Sistem"}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
