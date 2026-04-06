import Link from "next/link";
import { leadStatusOptions } from "@/lib/constants";
import { getLeadsData } from "@/lib/admin-data";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LeadStatusBadge } from "@/components/admin/lead-status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireSession } from "@/lib/auth";
import { canManageOperations } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function LeadsPage() {
  const session = await requireSession();
  if (!canManageOperations(session.role)) redirect("/admin");
  const leads = await getLeadsData();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Leadovi i pipeline"
        description="Kanban pogled za ručnu prodaju: od prvog upita do rezervacije, sastanka i završenog handoffa."
      />

      <div className="grid gap-4 xl:grid-cols-4">
        {leadStatusOptions.map((column) => {
          const items = leads.filter((lead) => lead.status === column.value);

          return (
            <Card key={column.value} className="rounded-[28px]">
              <CardContent className="p-5">
                <div className="border-b border-white/8 pb-4">
                  <LeadStatusBadge status={column.value} />
                  <p className="mt-3 text-sm leading-7 text-zinc-400">{column.description}</p>
                  <p className="mt-2 text-2xl text-white">{items.length}</p>
                </div>
                <div className="mt-4 space-y-3">
                  {items.map((lead) => (
                    <Link
                      key={lead.id}
                      href={`/admin/leadovi/${lead.id}`}
                      className="block rounded-[22px] border border-white/8 bg-white/[0.03] p-4 transition hover:bg-white/[0.05]"
                    >
                      <p className="text-base font-semibold text-white">{lead.fullName}</p>
                      <p className="mt-1 text-sm text-zinc-400">{lead.phone}</p>
                      <p className="mt-3 text-xs uppercase tracking-[0.18em] text-zinc-500">
                        {lead.quantityRequested} × {lead.priceSeen.toString()} KM
                      </p>
                    </Link>
                  ))}
                  {!items.length ? (
                    <p className="rounded-[22px] border border-dashed border-white/10 p-4 text-sm text-zinc-500">
                      Nema leadova u ovoj koloni.
                    </p>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
