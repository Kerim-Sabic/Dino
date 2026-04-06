import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LeadStatusBadge } from "@/components/admin/lead-status-badge";
import { MetricCard } from "@/components/admin/metric-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminDashboardData } from "@/lib/admin-data";
import { formatCurrency } from "@/lib/format";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description="Pregled prodajnog pulsa: leadovi, raspoloživost, cijene i zadnje aktivnosti koje traže reakciju."
      />

      {!data.configured ? (
        <Card className="rounded-[28px]">
          <CardContent className="p-6 text-sm leading-7 text-zinc-300">
            Baza još nije konfigurirana. Javni dio sajta radi s fallback sadržajem, ali admin operacije i forme će postati aktivne tek nakon postavljanja `DATABASE_URL` i Prisma migracije.
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Ukupno leadova"
          value={String(data.metrics.leadCount)}
          hint="Ukupan broj zaprimljenih upita u CRM-u."
        />
        <MetricCard
          label="Rezervisano"
          value={String(data.metrics.reservedCount)}
          hint="Količina privremeno vezana uz obećane dogovore."
        />
        <MetricCard
          label="Prodano"
          value={String(data.metrics.soldCount)}
          hint="Završeni Sarajevo handoff i prodate fizičke ulaznice."
        />
        <MetricCard
          label="Javna cijena"
          value={
            data.pricing.source === "sold_out" ? "Rasprodano" : formatCurrency(data.pricing.currentPrice)
          }
          hint={data.pricing.urgencyLabel}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-[30px]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl text-white">Pipeline po statusu</h2>
              <Button asChild variant="secondary">
                <Link href="/admin/leadovi">Otvori CRM</Link>
              </Button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {Object.entries(data.leadCounts).map(([status, count]) => (
                <div key={status} className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                  <LeadStatusBadge status={status as never} />
                  <p className="mt-4 text-3xl text-white">{count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[30px]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl text-white">Najnoviji leadovi</h2>
              <Button asChild variant="secondary">
                <Link href="/admin/leadovi">Svi leadovi</Link>
              </Button>
            </div>
            <div className="mt-6 space-y-3">
              {data.recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leadovi/${lead.id}`}
                  className="flex items-center justify-between rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-3 transition hover:bg-white/[0.05]"
                >
                  <div>
                    <p className="text-base font-semibold text-white">{lead.fullName}</p>
                    <p className="text-sm text-zinc-400">
                      {lead.quantityRequested} × {lead.phone}
                    </p>
                  </div>
                  <LeadStatusBadge status={lead.status} />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
