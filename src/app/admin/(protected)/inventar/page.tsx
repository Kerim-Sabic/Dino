import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getInventoryAdminData } from "@/lib/admin-data";
import { applyInventoryActionAction } from "@/lib/actions/admin";
import { formatDateTime } from "@/lib/format";
import { requireSession } from "@/lib/auth";
import { canManageOperations } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function InventoryPage() {
  const session = await requireSession();
  if (!canManageOperations(session.role)) redirect("/admin");
  const { pool, movements } = await getInventoryAdminData();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Inventar"
        description="Pool-level kontrola za Parter Zona 2 sa historijom rezervacija, oslobađanja, prodaja i operativnih korekcija."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Ukupan stock", value: pool.totalStock },
          { label: "Rezervisano", value: pool.reservedCount },
          { label: "Prodano", value: pool.soldCount },
        ].map((item) => (
          <Card key={item.label} className="rounded-[28px]">
            <CardContent className="p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{item.label}</p>
              <p className="mt-3 text-4xl text-white">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[30px]">
          <CardContent className="p-6">
            <h2 className="text-3xl text-white">Nova akcija</h2>
            <form action={applyInventoryActionAction} className="mt-5 space-y-4">
              <input type="hidden" name="poolId" value={pool.id || ""} />
              <div className="space-y-2">
                <Label>Tip akcije</Label>
                <Select
                  name="actionType"
                  defaultValue="RESERVE"
                  options={[
                    { label: "Rezerviši", value: "RESERVE" },
                    { label: "Oslobodi", value: "RELEASE" },
                    { label: "Prodano", value: "SOLD" },
                    { label: "Povrat", value: "RETURN" },
                    { label: "Korekcija total stocka", value: "ADJUSTMENT" },
                  ]}
                />
              </div>
              <div className="space-y-2">
                <Label>Količina</Label>
                <Input name="quantity" type="number" min="1" defaultValue="1" />
              </div>
              <div className="space-y-2">
                <Label>Lead ID</Label>
                <Input name="leadId" placeholder="Opcionalno" />
              </div>
              <div className="space-y-2">
                <Label>Napomena</Label>
                <Textarea name="note" placeholder="Zašto je akcija urađena?" />
              </div>
              <Button type="submit">Primijeni akciju</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-[30px]">
          <CardContent className="p-6">
            <h2 className="text-3xl text-white">Historija kretanja</h2>
            <div className="mt-5 space-y-3">
              {movements.map((movement) => (
                <div key={movement.id} className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-base font-semibold text-white">
                      {movement.actionType} · {movement.quantity}
                    </p>
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                      {formatDateTime(movement.createdAt)}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-zinc-300">
                    Lead: {movement.lead?.fullName || "nije vezano"} · Admin: {movement.actor?.name || "sistem"}
                  </p>
                  {movement.note ? <p className="mt-2 text-sm leading-7 text-zinc-400">{movement.note}</p> : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
