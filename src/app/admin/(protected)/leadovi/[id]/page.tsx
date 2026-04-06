import { notFound } from "next/navigation";
import { CommunicationChannel } from "@prisma/client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LeadStatusBadge } from "@/components/admin/lead-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAdminUsers, getInventoryAdminData, getLeadDetail } from "@/lib/admin-data";
import { leadStatusOptions, preferredContactMethodLabels } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { addCommunicationLogAction, addLeadNoteAction, applyInventoryActionAction, updateLeadAction } from "@/lib/actions/admin";
import { requireSession } from "@/lib/auth";
import { canManageOperations } from "@/lib/permissions";
import { redirect } from "next/navigation";

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const session = await requireSession();
  if (!canManageOperations(session.role)) redirect("/admin");
  const { id } = await params;
  const [lead, users, inventory] = await Promise.all([getLeadDetail(id), getAdminUsers(), getInventoryAdminData()]);

  if (!lead) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={lead.fullName}
        description="Detaljan operativni prikaz jednog leada: status, cijena, napomene, komunikacija i inventarska povezanost."
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[30px]">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-5">
              <div>
                <LeadStatusBadge status={lead.status} />
                <p className="mt-3 text-sm text-zinc-300">
                  {lead.phone} · {preferredContactMethodLabels[lead.preferredContactMethod]}
                </p>
              </div>
              <div className="text-right text-sm text-zinc-400">
                <p>Viđena cijena: {lead.priceSeen.toString()} KM</p>
                <p>Poslano: {formatDateTime(lead.submittedAt)}</p>
              </div>
            </div>

            <form action={updateLeadAction} className="mt-6 grid gap-4 sm:grid-cols-2">
              <input type="hidden" name="leadId" value={lead.id} />
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  name="status"
                  defaultValue={lead.status}
                  options={leadStatusOptions.map((item) => ({ label: item.label, value: item.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Dodijeljeni admin</Label>
                <Select
                  name="assignedAdminId"
                  defaultValue={lead.assignedAdminId || ""}
                  placeholder="Bez dodjele"
                  options={users.map((user) => ({ label: `${user.name} · ${user.role}`, value: user.id }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Obećana cijena</Label>
                <Input name="promisedPrice" type="number" step="0.01" defaultValue={lead.promisedPrice?.toString() || ""} />
              </div>
              <div className="space-y-2">
                <Label>Napomena uz cijenu</Label>
                <Input name="promisedPriceNote" defaultValue={lead.promisedPriceNote || ""} />
              </div>
              <div className="space-y-2">
                <Label>Istek rezervacije</Label>
                <Input name="reservationExpiresAt" type="datetime-local" defaultValue={lead.reservationExpiresAt ? new Date(lead.reservationExpiresAt).toISOString().slice(0, 16) : ""} />
              </div>
              <div className="space-y-2">
                <Label>Dogovoreno preuzimanje</Label>
                <Input name="meetupAt" type="datetime-local" defaultValue={lead.meetupAt ? new Date(lead.meetupAt).toISOString().slice(0, 16) : ""} />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit">Sačuvaj lead</Button>
              </div>
            </form>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Card className="rounded-[24px]">
                <CardContent className="p-5">
                  <h3 className="text-2xl text-white">Interna napomena</h3>
                  <form action={addLeadNoteAction} className="mt-4 space-y-3">
                    <input type="hidden" name="leadId" value={lead.id} />
                    <Textarea name="body" placeholder="Šta je dogovoreno, šta treba pratiti, koji je rizik." />
                    <label className="flex items-center gap-2 text-sm text-zinc-300">
                      <input type="checkbox" name="isPinned" />
                      Pinovana napomena
                    </label>
                    <Button type="submit" variant="secondary">
                      Dodaj napomenu
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="rounded-[24px]">
                <CardContent className="p-5">
                  <h3 className="text-2xl text-white">Komunikacijski log</h3>
                  <form action={addCommunicationLogAction} className="mt-4 space-y-3">
                    <input type="hidden" name="leadId" value={lead.id} />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Select
                        name="channel"
                        defaultValue={CommunicationChannel.WHATSAPP}
                        options={[
                          { label: "WhatsApp", value: CommunicationChannel.WHATSAPP },
                          { label: "Poziv", value: CommunicationChannel.PHONE },
                          { label: "Instagram", value: CommunicationChannel.INSTAGRAM },
                          { label: "E-mail", value: CommunicationChannel.EMAIL },
                          { label: "Interna napomena", value: CommunicationChannel.INTERNAL_NOTE },
                        ]}
                      />
                      <Select
                        name="direction"
                        defaultValue="OUTBOUND"
                        options={[
                          { label: "Poslano", value: "OUTBOUND" },
                          { label: "Primljeno", value: "INBOUND" },
                        ]}
                      />
                    </div>
                    <Textarea name="summary" placeholder="Kratak sažetak poziva ili poruke." />
                    <Button type="submit" variant="secondary">
                      Dodaj zapis
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[30px]">
            <CardContent className="p-6">
              <h2 className="text-3xl text-white">Brze inventarske akcije</h2>
              <form action={applyInventoryActionAction} className="mt-5 space-y-4">
                <input type="hidden" name="leadId" value={lead.id} />
                <input type="hidden" name="poolId" value={inventory.pool.id || ""} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Select
                    name="actionType"
                    defaultValue="RESERVE"
                    options={[
                      { label: "Rezerviši", value: "RESERVE" },
                      { label: "Oslobodi", value: "RELEASE" },
                      { label: "Prodano", value: "SOLD" },
                      { label: "Povrat", value: "RETURN" },
                    ]}
                  />
                  <Input name="quantity" type="number" min="1" defaultValue={lead.quantityRequested} />
                </div>
                <Textarea name="note" placeholder="Kratka operativna napomena." />
                <Button type="submit">Primijeni akciju</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-[30px]">
            <CardContent className="p-6">
              <h2 className="text-3xl text-white">Timeline</h2>
              <div className="mt-5 space-y-3">
                {lead.statusEvents.map((event) => (
                  <div key={event.id} className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-sm font-semibold text-white">
                      {event.fromStatus || "START"} → {event.toStatus}
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">{formatDateTime(event.changedAt)}</p>
                    {event.note ? <p className="mt-2 text-sm leading-7 text-zinc-300">{event.note}</p> : null}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[30px]">
            <CardContent className="p-6">
              <h2 className="text-3xl text-white">Napomene i komunikacija</h2>
              <div className="mt-5 space-y-3">
                {lead.notes.map((note) => (
                  <div key={note.id} className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-sm leading-7 text-zinc-200">{note.body}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
                      {note.author?.name || "Sistem"} · {formatDateTime(note.createdAt)}
                    </p>
                  </div>
                ))}
                {lead.communicationLogs.map((item) => (
                  <div key={item.id} className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-sm font-semibold text-white">{item.channel}</p>
                    <p className="mt-2 text-sm leading-7 text-zinc-200">{item.summary}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
                      {item.direction} · {formatDateTime(item.happenedAt)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
