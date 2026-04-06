import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  getCmsAdminData,
} from "@/lib/admin-data";
import {
  updateHomepageContentAction,
  updateSiteSettingsAction,
  upsertFaqAction,
  upsertLegalDocumentAction,
  upsertMeetupZoneAction,
  upsertTestimonialAction,
  upsertTrustBadgeAction,
} from "@/lib/actions/admin";
import { requireSession } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function ContentPage() {
  const session = await requireSession();
  if (!canManageContent(session.role)) redirect("/admin");
  const data = await getCmsAdminData();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="CMS i javni sadržaj"
        description="Uređivanje copyja, trust elemenata, FAQ sekcija, meetup zona i pravnih tekstova bez dodirivanja koda."
      />

      <Card className="rounded-[30px]">
        <CardContent className="p-6">
          <h2 className="text-3xl text-white">Postavke sajta</h2>
          <form action={updateSiteSettingsAction} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["siteName", "Naziv sajta", data.settings.siteName],
                ["businessLabel", "Poslovna oznaka", data.settings.businessLabel],
                ["city", "Grad", data.settings.city],
                ["whatsappNumber", "WhatsApp", data.settings.whatsappNumber],
                ["phoneNumber", "Telefon", data.settings.phoneNumber],
                ["instagramHandle", "Instagram", data.settings.instagramHandle],
                ["contactEmail", "E-mail", data.settings.contactEmail || ""],
                ["businessHours", "Radno vrijeme", data.settings.businessHours],
                ["responseTimeText", "Odgovor", data.settings.responseTimeText],
                ["primaryMeetupText", "Primarni meetup tekst", data.settings.primaryMeetupText],
                ["heroTicketLabel", "Hero oznaka", data.settings.heroTicketLabel],
                ["seoDefaultTitle", "SEO naslov", data.settings.seoDefaultTitle],
              ].map(([name, label, value]) => (
                <div key={name} className="space-y-2">
                  <Label>{label}</Label>
                  <Input name={name} defaultValue={String(value)} />
                </div>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>SEO opis</Label>
                <Textarea name="seoDefaultDescription" defaultValue={data.settings.seoDefaultDescription} />
              </div>
              <div className="space-y-2">
                <Label>Kratki disclaimer</Label>
                <Textarea name="shortDisclaimer" defaultValue={data.settings.shortDisclaimer} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Uputstvo za preuzimanje</Label>
              <Textarea name="meetupGuidance" defaultValue={data.settings.meetupGuidance} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Naslov rasprodano</Label>
                <Input name="soldOutTitle" defaultValue={data.settings.soldOutTitle} />
              </div>
              <div className="space-y-2">
                <Label>Naslov liste čekanja</Label>
                <Input name="waitlistTitle" defaultValue={data.settings.waitlistTitle} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Sold out opis</Label>
                <Textarea name="soldOutDescription" defaultValue={data.settings.soldOutDescription} />
              </div>
              <div className="space-y-2">
                <Label>Waitlist opis</Label>
                <Textarea name="waitlistDescription" defaultValue={data.settings.waitlistDescription} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="space-y-2">
                <Label>Broj preuzimanja</Label>
                <Input name="handoffCount" type="number" defaultValue={data.settings.handoffCount} />
              </div>
              <div className="space-y-2">
                <Label>Brzina odgovora</Label>
                <Input name="fastResponseMinutes" type="number" defaultValue={data.settings.fastResponseMinutes} />
              </div>
              <div className="space-y-2">
                <Label>Režim sajta</Label>
                <Select
                  name="siteMode"
                  defaultValue={data.settings.siteMode}
                  options={[
                    { label: "LIVE", value: "LIVE" },
                    { label: "SOLD_OUT", value: "SOLD_OUT" },
                    { label: "WAITLIST", value: "WAITLIST" },
                  ]}
                />
              </div>
              <div className="space-y-2">
                <Label>Traka obavijesti</Label>
                <Input name="announcementText" defaultValue={data.settings.announcementText || ""} />
                <label className="mt-2 flex items-center gap-2 text-sm text-zinc-300">
                  <input type="checkbox" name="announcementEnabled" defaultChecked={data.settings.announcementEnabled} />
                  Aktivno
                </label>
              </div>
            </div>
            <Button type="submit">Sačuvaj postavke sajta</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-[30px]">
        <CardContent className="p-6">
          <h2 className="text-3xl text-white">Početna stranica</h2>
          <form action={updateHomepageContentAction} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["heroEyebrow", "Eyebrow", data.homepage.heroEyebrow],
                ["heroPrimaryLabel", "Primarni CTA", data.homepage.heroPrimaryLabel],
                ["heroSecondaryLabel", "Sekundarni CTA", data.homepage.heroSecondaryLabel],
                ["scarcityTitle", "Naslov hitnosti", data.homepage.scarcityTitle],
                ["whyReserveTitle", "Naslov razloga za rezervaciju", data.homepage.whyReserveTitle],
                ["processTitle", "Naslov procesa", data.homepage.processTitle],
                ["trustTitle", "Naslov povjerenja", data.homepage.trustTitle],
                ["ticketsSectionTitle", "Naslov sekcije ulaznica", data.homepage.ticketsSectionTitle],
                ["ctaStripTitle", "Naslov završnog CTA-a", data.homepage.ctaStripTitle],
              ].map(([name, label, value]) => (
                <div key={name} className="space-y-2">
                  <Label>{label}</Label>
                  <Input name={name} defaultValue={String(value)} />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Hero naslov</Label>
              <Textarea name="heroTitle" defaultValue={data.homepage.heroTitle} />
            </div>
            <div className="space-y-2">
              <Label>Hero opis</Label>
              <Textarea name="heroDescription" defaultValue={data.homepage.heroDescription} />
            </div>
            <div className="space-y-2">
              <Label>Hero linija povjerenja</Label>
              <Input name="heroTrustLine" defaultValue={data.homepage.heroTrustLine} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Opis hitnosti</Label>
                <Textarea name="scarcityDescription" defaultValue={data.homepage.scarcityDescription} />
              </div>
              <div className="space-y-2">
                <Label>Uvod razloga za rezervaciju</Label>
                <Textarea name="whyReserveIntro" defaultValue={data.homepage.whyReserveIntro} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Razlozi za rezervaciju, jedan po redu</Label>
              <Textarea name="whyReserveItems" defaultValue={data.homepage.whyReserveItems.join("\n")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Uvod procesa</Label>
                <Textarea name="processIntro" defaultValue={data.homepage.processIntro} />
              </div>
              <div className="space-y-2">
                <Label>Uvod povjerenja</Label>
                <Textarea name="trustIntro" defaultValue={data.homepage.trustIntro} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Uvod sekcije ulaznica</Label>
                <Textarea name="ticketsSectionIntro" defaultValue={data.homepage.ticketsSectionIntro} />
              </div>
              <div className="space-y-2">
                <Label>Opis završnog CTA-a</Label>
                <Textarea name="ctaStripDescription" defaultValue={data.homepage.ctaStripDescription} />
              </div>
            </div>
            <Button type="submit">Sačuvaj homepage</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-[30px]">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-3xl text-white">FAQ unosi</h2>
            {data.faqs.map((item) => (
              <form key={item.question} action={upsertFaqAction} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 space-y-3">
                <input type="hidden" name="id" value={(item as { id?: string }).id || ""} />
                <Input name="question" defaultValue={item.question} />
                <Textarea name="answer" defaultValue={item.answer} />
                <div className="grid gap-3 sm:grid-cols-3">
                  <Input name="section" defaultValue={item.section || ""} />
                  <Input name="sortOrder" type="number" defaultValue={item.sortOrder} />
                  <label className="flex items-center gap-2 text-sm text-zinc-300">
                    <input type="checkbox" name="isFeatured" defaultChecked={item.isFeatured} />
                    Istaknuto
                  </label>
                </div>
                <label className="flex items-center gap-2 text-sm text-zinc-300">
                  <input type="checkbox" name="isActive" defaultChecked={item.isActive} />
                  Aktivno
                </label>
                <Button type="submit" variant="secondary">Sačuvaj FAQ</Button>
              </form>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[30px]">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-3xl text-white">Testimoniali</h2>
            {data.testimonials.map((item) => (
              <form key={item.quote} action={upsertTestimonialAction} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 space-y-3">
                <input type="hidden" name="id" value={(item as { id?: string }).id || ""} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input name="name" defaultValue={item.name} />
                  <Input name="city" defaultValue={item.city} />
                </div>
                <Textarea name="quote" defaultValue={item.quote} />
                <div className="grid gap-3 sm:grid-cols-3">
                  <Input name="rating" type="number" defaultValue={item.rating} />
                  <Input name="sortOrder" type="number" defaultValue={item.sortOrder} />
                  <label className="flex items-center gap-2 text-sm text-zinc-300">
                    <input type="checkbox" name="isFeatured" defaultChecked={item.isFeatured} />
                    Istaknuto
                  </label>
                </div>
                <label className="flex items-center gap-2 text-sm text-zinc-300">
                  <input type="checkbox" name="isActive" defaultChecked={item.isActive} />
                  Aktivno
                </label>
                <Button type="submit" variant="secondary">Sačuvaj testimonial</Button>
              </form>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-[30px]">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-3xl text-white">Trust badgeovi</h2>
            {data.trustBadges.map((item) => (
              <form key={item.label} action={upsertTrustBadgeAction} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 space-y-3">
                <input type="hidden" name="id" value={(item as { id?: string }).id || ""} />
                <Input name="label" defaultValue={item.label} />
                <Textarea name="detail" defaultValue={item.detail} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input name="sortOrder" type="number" defaultValue={item.sortOrder} />
                  <label className="flex items-center gap-2 text-sm text-zinc-300">
                    <input type="checkbox" name="isActive" defaultChecked={item.isActive} />
                    Aktivno
                  </label>
                </div>
                <Button type="submit" variant="secondary">Sačuvaj badge</Button>
              </form>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[30px]">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-3xl text-white">Zone preuzimanja</h2>
            {data.meetupZones.map((item) => (
              <form key={item.id} action={upsertMeetupZoneAction} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 space-y-3">
                <input type="hidden" name="id" value={item.id} />
                <Input name="name" defaultValue={item.name} />
                <Textarea name="description" defaultValue={item.description} />
                <div className="grid gap-3 sm:grid-cols-3">
                  <Input name="sortOrder" type="number" defaultValue={item.sortOrder} />
                  <label className="flex items-center gap-2 text-sm text-zinc-300">
                    <input type="checkbox" name="isPrimary" defaultChecked={item.isPrimary} />
                    Primarno
                  </label>
                  <label className="flex items-center gap-2 text-sm text-zinc-300">
                    <input type="checkbox" name="isActive" defaultChecked={item.isActive} />
                    Aktivno
                  </label>
                </div>
                <Button type="submit" variant="secondary">Sačuvaj zonu</Button>
              </form>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[30px]">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-3xl text-white">Pravni dokumenti</h2>
          {data.legalDocuments.map((item) => (
            <form key={item.slug} action={upsertLegalDocumentAction} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 space-y-3">
              <input type="hidden" name="id" value={(item as { id?: string }).id || ""} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input name="slug" defaultValue={item.slug} />
                <Input name="title" defaultValue={item.title} />
              </div>
              <Input name="excerpt" defaultValue={item.excerpt} />
              <Textarea name="contentMarkdown" className="min-h-[220px]" defaultValue={item.contentMarkdown} />
              <Button type="submit" variant="secondary">Sačuvaj dokument</Button>
            </form>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
