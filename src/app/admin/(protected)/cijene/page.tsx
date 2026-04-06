import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getPricingAdminData } from "@/lib/admin-data";
import { updatePricingConfigAction, upsertPriceTierAction } from "@/lib/actions/admin";
import { requireSession } from "@/lib/auth";
import { canManageOperations } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function PricingPage() {
  const session = await requireSession();
  if (!canManageOperations(session.role)) redirect("/admin");
  const { config, tiers, pool } = await getPricingAdminData();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Cijene i tier logika"
        description="Javni nivo cijene, override logika, poruke hitnosti i inventarski pragovi koji pokreću prelazak na naredni nivo."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-[28px]">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Prodano</p>
            <p className="mt-3 text-4xl text-white">{pool.soldCount}</p>
          </CardContent>
        </Card>
        <Card className="rounded-[28px]">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Rezervisano</p>
            <p className="mt-3 text-4xl text-white">{pool.reservedCount}</p>
          </CardContent>
        </Card>
        <Card className="rounded-[28px]">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Preostalo procijenjeno</p>
            <p className="mt-3 text-4xl text-white">{Math.max(pool.totalStock - pool.reservedCount - pool.soldCount, 0)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-[30px]">
          <CardContent className="p-6">
            <h2 className="text-3xl text-white">Javna konfiguracija</h2>
            <form action={updatePricingConfigAction} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Valuta</Label>
                  <Input name="currency" defaultValue={config.currency} />
                </div>
                <div className="space-y-2">
                  <Label>Ručna javna cijena</Label>
                  <Input name="manualOverridePrice" type="number" step="0.01" defaultValue={config.manualOverridePrice || ""} />
                </div>
                <div className="space-y-2">
                  <Label>Oznaka ručne cijene</Label>
                  <Input name="manualOverrideLabel" defaultValue={config.manualOverrideLabel || ""} />
                </div>
                <div className="space-y-2">
                  <Label>Promo cijena</Label>
                  <Input name="promoOverridePrice" type="number" step="0.01" defaultValue={config.promoOverridePrice || ""} />
                </div>
                <div className="space-y-2">
                  <Label>Promo oznaka</Label>
                  <Input name="promoOverrideLabel" defaultValue={config.promoOverrideLabel || ""} />
                </div>
                <div className="space-y-2">
                  <Label>Finalna hitna cijena</Label>
                  <Input name="scarcityOverridePrice" type="number" step="0.01" defaultValue={config.scarcityOverridePrice || ""} />
                </div>
                <div className="space-y-2">
                  <Label>Oznaka finalne hitnosti</Label>
                  <Input name="scarcityOverrideLabel" defaultValue={config.scarcityOverrideLabel || ""} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Ručna poruka hitnosti</Label>
                <Textarea name="publicUrgencyOverride" defaultValue={config.publicUrgencyOverride || ""} />
              </div>
              <div className="space-y-2">
                <Label>Ručna poruka uz cijenu</Label>
                <Textarea name="publicPriceMessageOverride" defaultValue={config.publicPriceMessageOverride || ""} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { name: "manualOverrideEnabled", label: "Uključi manual override", checked: config.manualOverrideEnabled },
                  { name: "promoOverrideEnabled", label: "Uključi promo override", checked: config.promoOverrideEnabled },
                  { name: "scarcityOverrideEnabled", label: "Uključi scarcity override", checked: config.scarcityOverrideEnabled },
                  { name: "showNextPrice", label: "Prikaži sljedeći nivo", checked: config.showNextPrice },
                  { name: "allowReservations", label: "Dozvoli rezervacije", checked: config.allowReservations },
                ].map((item) => (
                  <label key={item.name} className="flex items-center gap-3 rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
                    <input type="checkbox" name={item.name} defaultChecked={item.checked} />
                    {item.label}
                  </label>
                ))}
              </div>
              <Button type="submit">Sačuvaj konfiguraciju</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-[30px]">
          <CardContent className="p-6">
            <h2 className="text-3xl text-white">Tier definicije</h2>
            <div className="mt-5 space-y-4">
              {tiers.map((tier) => (
                <form key={tier.id} action={upsertPriceTierAction} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                  <input type="hidden" name="id" value={tier.id} />
                  <div className="grid gap-3 md:grid-cols-6">
                    <Input name="name" defaultValue={tier.name} />
                    <Input name="sortOrder" type="number" defaultValue={tier.sortOrder} />
                    <Input name="startSoldCount" type="number" defaultValue={tier.startSoldCount} />
                    <Input name="endSoldCount" type="number" defaultValue={tier.endSoldCount} />
                    <Input name="price" type="number" step="0.01" defaultValue={tier.price} />
                    <Input name="publicLabel" defaultValue={tier.publicLabel || ""} />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-zinc-300">
                      <input type="checkbox" name="isActive" defaultChecked={tier.isActive} />
                      Aktivno
                    </label>
                    <Button type="submit" variant="secondary">
                      Sačuvaj tier
                    </Button>
                  </div>
                </form>
              ))}
              <div className="rounded-[24px] border border-dashed border-white/10 p-4">
                <p className="text-sm text-zinc-400">
                  Novi tier trenutno dodajte ručno kroz postojeće zapise ili migraciju seed seta. Fokus ovog panela je brzo operativno uređivanje aktivnih nivoa.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
