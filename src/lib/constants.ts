import { ContactMethod, LeadStatus, UserRole } from "@prisma/client";
import type { LeadStatusOption } from "@/lib/types";

export const siteNavigation = [
  { href: "/", label: "Početna" },
  { href: "/ulaznice", label: "Dostupne ulaznice" },
  { href: "/rezervacija", label: "Rezervacija" },
  { href: "/kako-funkcionise", label: "Kako funkcioniše" },
  { href: "/zasto-nama-vjeruju", label: "Zašto nama vjeruju" },
  { href: "/faq", label: "FAQ" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/blog", label: "Blog" },
] as const;

export const adminNavigation = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leadovi", label: "Leadovi" },
  { href: "/admin/inventar", label: "Inventar" },
  { href: "/admin/cijene", label: "Cijene" },
  { href: "/admin/sadrzaj", label: "Sadržaj" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/postavke", label: "Postavke" },
  { href: "/admin/revizija", label: "Revizija" },
] as const;

export const legalNavigation = [
  { href: "/uslovi-koristenja", label: "Uslovi korištenja" },
  { href: "/politika-privatnosti", label: "Politika privatnosti" },
  { href: "/odricanje-odgovornosti", label: "Odricanje od odgovornosti" },
] as const;

export const leadStatusOptions: LeadStatusOption[] = [
  { value: LeadStatus.NEW, label: "Novi", description: "Tek pristigli upiti koji čekaju prvi odgovor." },
  { value: LeadStatus.CONTACTED, label: "Kontaktiran", description: "Kupac je dobio prvi odgovor." },
  { value: LeadStatus.INTERESTED, label: "Zainteresovan", description: "Komunikacija ide dobro, kupac razmatra dogovor." },
  { value: LeadStatus.RESERVED, label: "Rezervisano", description: "Količina je privremeno sačuvana za lead." },
  { value: LeadStatus.MEETUP_ARRANGED, label: "Dogovoren susret", description: "Termin i zona preuzimanja su usklađeni." },
  { value: LeadStatus.SOLD, label: "Prodano", description: "Ulaznice su predane uživo i transakcija je završena." },
  { value: LeadStatus.CANCELED, label: "Otkaženo", description: "Lead je odustao ili je rezervacija poništena." },
  { value: LeadStatus.NO_SHOW, label: "Nije došao", description: "Dogovoren susret se nije realizovao." },
] as const;

export const preferredContactMethodLabels: Record<ContactMethod, string> = {
  [ContactMethod.WHATSAPP]: "WhatsApp",
  [ContactMethod.PHONE]: "Poziv",
  [ContactMethod.INSTAGRAM]: "Instagram",
  [ContactMethod.EMAIL]: "E-mail",
};

export const roleLabels: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: "Super Admin",
  [UserRole.ADMIN]: "Admin",
  [UserRole.EDITOR]: "Editor",
};

export const sessionCookieName = "dino-admin-session";
export const inventoryPoolSlug = "parter-zona-2";
