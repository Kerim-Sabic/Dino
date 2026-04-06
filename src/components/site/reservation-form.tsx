"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Loader2, Mail, Send } from "lucide-react";
import { ContactMethod, SiteMode } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { reservationSchema } from "@/lib/schemas";
import type { MeetupZoneData, PricingSnapshot, SiteSettingsData } from "@/lib/types";

const ADMIN_EMAIL = "adriaticketadmin@gmail.com";

interface ReservationFormProps {
  meetupZones: MeetupZoneData[];
  pricing: PricingSnapshot;
  settings: SiteSettingsData;
}

function buildMailtoUrl(values: {
  fullName: string;
  email: string;
  phone: string;
  quantityRequested: number;
  meetupZoneName: string;
  noteFromCustomer: string;
  currentPrice: string;
}): string {
  const subject = encodeURIComponent(
    `Rezervacija – ${values.fullName} – ${values.quantityRequested} × Parter Zona 2`,
  );

  const lines = [
    `Ime i prezime: ${values.fullName}`,
    `E-mail kupca: ${values.email}`,
    values.phone ? `Telefon: ${values.phone}` : null,
    ``,
    `Kategorija: Parter Zona 2`,
    `Količina: ${values.quantityRequested} ${values.quantityRequested === 1 ? "ulaznica" : "ulaznice"}`,
    `Aktuelna cijena: ${values.currentPrice}`,
    `Zona preuzimanja: ${values.meetupZoneName}`,
    ``,
    values.noteFromCustomer ? `Napomena: ${values.noteFromCustomer}` : null,
    ``,
    `---`,
    `Zahtjev poslan s dino-kosevo.ba/rezervacija`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const body = encodeURIComponent(lines);
  return `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
}

export function ReservationForm({ meetupZones, pricing, settings }: ReservationFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  type FormValues = z.input<typeof reservationSchema>;

  const defaultValues = useMemo<FormValues>(
    () => ({
      fullName: "",
      phone: "",
      whatsapp: "",
      instagramHandle: "",
      email: "",
      quantityRequested: 1,
      preferredContactMethod: ContactMethod.EMAIL,
      preferredMeetupZoneId: meetupZones.find((z) => z.isPrimary)?.id ?? "",
      noteFromCustomer: "",
      source: searchParams.get("utm_source") ?? "website",
      landingPage: typeof window !== "undefined" ? window.location.pathname : "/rezervacija",
      referrer: typeof document !== "undefined" ? document.referrer : "",
      utmSource: searchParams.get("utm_source") ?? "",
      utmMedium: searchParams.get("utm_medium") ?? "",
      utmCampaign: searchParams.get("utm_campaign") ?? "",
      utmContent: searchParams.get("utm_content") ?? "",
      utmTerm: searchParams.get("utm_term") ?? "",
      consentAccepted: true,
      startedAt: String(Date.now()),
      company: "",
    }),
    [meetupZones, searchParams],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues,
  });

  const errors = form.formState.errors;
  const soldOutMode = settings.siteMode === SiteMode.SOLD_OUT || !pricing.allowReservations;

  const getMeetupZoneName = () =>
    meetupZones.find((z) => z.id === form.getValues("preferredMeetupZoneId"))?.name ?? "Po dogovoru";

  const getCurrentPrice = () =>
    pricing.source === "sold_out"
      ? "Lista čekanja"
      : formatCurrency(pricing.currentPrice, pricing.currency);

  // ── Primary action: save to DB ──
  const onSubmit = form.handleSubmit(async (values) => {
    if (!values.email && !values.phone) {
      form.setError("email", { message: "Unesite e-mail ili broj telefona." });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          whatsapp: values.whatsapp || values.phone,
          landingPage: window.location.pathname,
          referrer: document.referrer,
        }),
      });
      const result = (await response.json()) as { error?: string; leadId?: string };
      if (response.ok) {
        router.push(`/hvala${result.leadId ? `?lead=${result.leadId}` : ""}`);
      } else {
        form.setError("root", { message: result.error ?? "Greška. Pokušajte ponovo ili koristite e-mail." });
      }
    } catch {
      form.setError("root", { message: "Nema veze. Pokušajte ponovo ili koristite e-mail opciju ispod." });
    } finally {
      setIsSubmitting(false);
    }
  });

  // ── Fallback: open email app ──
  const onEmailFallback = () => {
    const values = form.getValues();
    if (!values.fullName || values.fullName.length < 2) {
      form.setError("fullName", { message: "Unesite ime i prezime." });
      return;
    }

    const mailtoUrl = buildMailtoUrl({
      fullName: values.fullName,
      email: values.email ?? "",
      phone: values.phone ?? "",
      quantityRequested: Number(values.quantityRequested),
      meetupZoneName: getMeetupZoneName(),
      noteFromCustomer: values.noteFromCustomer ?? "",
      currentPrice: getCurrentPrice(),
    });
    window.location.href = mailtoUrl;
  };

  const quantityOptions = Array.from({ length: 6 }, (_, i) => ({
    label: `${i + 1} ${i === 0 ? "ulaznica" : "ulaznice"}`,
    value: String(i + 1),
  }));

  const meetupOptions = meetupZones.map((zone) => ({
    label: zone.name,
    value: zone.id,
  }));

  return (
    <form className="space-y-5" onSubmit={onSubmit} noValidate>

      {/* Info banner */}
      <div className="rounded-[20px] border border-primary/14 bg-primary/[0.06] px-4 py-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary">
          {soldOutMode ? "Lista čekanja" : "Aktuelna cijena"}
        </p>
        <p className="mt-2 text-sm leading-[1.75] text-zinc-200">
          {soldOutMode
            ? "Javni kontingent je zatvoren, ali vaš zahtjev ide na prioritetnu listu čekanja."
            : `Aktuelni nivo: ${formatCurrency(pricing.currentPrice, pricing.currency)}. Cijena se bilježi u trenutku slanja.`}
        </p>
        <p className="mt-1.5 text-xs leading-5 text-zinc-500">{settings.responseTimeText}</p>
      </div>

      {/* Required fields */}
      <div>
        <p className="mb-4 text-[10px] uppercase tracking-[0.18em] text-zinc-600">Vaši podaci</p>
        <div className="grid gap-4 sm:grid-cols-2">

          {/* Full name */}
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="fullName">Ime i prezime *</Label>
            <Input
              id="fullName"
              placeholder="Vaše ime i prezime"
              autoComplete="name"
              {...form.register("fullName")}
            />
            {errors.fullName && (
              <p className="text-[11px] text-rose-400">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="email">E-mail adresa *</Label>
            <Input
              id="email"
              type="email"
              placeholder="vas@email.com"
              autoComplete="email"
              {...form.register("email")}
            />
            <p className="text-[11px] text-zinc-600">
              Na ovaj e-mail javimo se s potvrdom i detaljima preuzimanja.
            </p>
            {errors.email && (
              <p className="text-[11px] text-rose-400">{errors.email.message}</p>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantityRequested">Broj ulaznica</Label>
            <Select
              id="quantityRequested"
              options={quantityOptions}
              value={String(form.watch("quantityRequested"))}
              onChange={(e) => form.setValue("quantityRequested", Number(e.target.value))}
            />
          </div>

          {/* Meetup zone */}
          <div className="space-y-2">
            <Label htmlFor="preferredMeetupZoneId">Zona preuzimanja</Label>
            <Select
              id="preferredMeetupZoneId"
              options={meetupOptions}
              value={form.watch("preferredMeetupZoneId")}
              onChange={(e) => form.setValue("preferredMeetupZoneId", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Optional fields accordion */}
      <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.02]">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
          onClick={() => setShowOptionalFields((v) => !v)}
        >
          <div>
            <p className="text-sm font-semibold text-white">Dodaj broj telefona ili napomenu</p>
            <p className="mt-0.5 text-xs leading-5 text-zinc-500">
              Telefon, WhatsApp, Instagram ili kratka napomena — sve opciono.
            </p>
          </div>
          <ChevronDown
            className={[
              "h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200",
              showOptionalFields ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>

        {showOptionalFields && (
          <div className="border-t border-white/[0.07] px-5 pb-5 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Broj telefona / WhatsApp</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+387..."
                  autoComplete="tel"
                  {...form.register("phone")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagramHandle">Instagram</Label>
                <Input
                  id="instagramHandle"
                  placeholder="@profil"
                  {...form.register("instagramHandle")}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="noteFromCustomer">Napomena</Label>
                <Textarea
                  id="noteFromCustomer"
                  placeholder="Posebna napomena za termin, količinu ili dolazak u Sarajevo."
                  {...form.register("noteFromCustomer")}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden fields */}
      <div className="hidden">
        <input tabIndex={-1} autoComplete="off" {...form.register("company")} />
        <input {...form.register("startedAt")} />
      </div>

      {/* Consent */}
      <label className="flex cursor-pointer items-start gap-3 rounded-[18px] border border-white/[0.08] bg-white/[0.025] px-4 py-4 text-sm leading-[1.75] text-zinc-300 transition-colors hover:border-white/[0.12]">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 shrink-0 rounded accent-primary"
          checked={Boolean(form.watch("consentAccepted"))}
          onChange={(e) => form.setValue("consentAccepted", e.target.checked)}
        />
        <span>
          Razumijem da online forma{" "}
          <span className="text-white">nije automatska potvrda kupovine</span> i da plaćanje ide
          isključivo uživo u Sarajevu nakon pregleda fizičke ulaznice.
        </span>
      </label>
      {errors.consentAccepted && (
        <p className="text-[11px] text-rose-400">{errors.consentAccepted.message}</p>
      )}

      {/* Root error */}
      {errors.root && (
        <p className="rounded-[12px] border border-rose-500/20 bg-rose-500/[0.07] px-4 py-3 text-sm text-rose-400">
          {errors.root.message}
        </p>
      )}

      {/* Submit */}
      <div className="space-y-3">
        <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Šaljem zahtjev...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              {soldOutMode ? "Pošalji zahtjev za listu čekanja" : "Pošalji zahtjev"}
            </>
          )}
        </Button>

        {/* Email fallback */}
        <button
          type="button"
          onClick={onEmailFallback}
          className="flex w-full items-center justify-center gap-2 rounded-[14px] border border-white/[0.07] bg-transparent px-4 py-3 text-xs text-zinc-500 transition-colors hover:border-white/[0.12] hover:text-zinc-300"
        >
          <Mail className="h-3.5 w-3.5" />
          Problem s formom? Pošalji direktno e-mailom
        </button>

        <p className="text-center text-[10px] uppercase tracking-[0.16em] text-zinc-600">
          Zahtjev se sprema · javimo se na vaš e-mail
        </p>
      </div>
    </form>
  );
}
