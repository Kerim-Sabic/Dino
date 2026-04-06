import { LeadStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

const variants: Record<LeadStatus, "default" | "secondary" | "success" | "danger"> = {
  [LeadStatus.NEW]: "secondary",
  [LeadStatus.CONTACTED]: "default",
  [LeadStatus.INTERESTED]: "default",
  [LeadStatus.RESERVED]: "success",
  [LeadStatus.MEETUP_ARRANGED]: "success",
  [LeadStatus.SOLD]: "success",
  [LeadStatus.CANCELED]: "danger",
  [LeadStatus.NO_SHOW]: "danger",
};

const labels: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: "Novi",
  [LeadStatus.CONTACTED]: "Kontaktiran",
  [LeadStatus.INTERESTED]: "Zainteresovan",
  [LeadStatus.RESERVED]: "Rezervisano",
  [LeadStatus.MEETUP_ARRANGED]: "Dogovoren susret",
  [LeadStatus.SOLD]: "Prodano",
  [LeadStatus.CANCELED]: "Otkaženo",
  [LeadStatus.NO_SHOW]: "No-show",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
