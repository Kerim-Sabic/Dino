import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/public-data";

export const metadata = buildMetadata({
  title: "Rasprodano / lista čekanja",
  description:
    "Ako je javna dostupnost zatvorena, ostavite kontakt za listu čekanja i potencijalno oslobađanje rezervacija za Parter Zona 2 u Sarajevu.",
  path: "/rasprodano",
});

export default async function SoldOutPage() {
  const settings = await getSiteSettings();

  return (
    <section className="container-shell py-20">
      <Card className="mx-auto max-w-3xl rounded-[36px]">
        <CardContent className="p-10 text-center">
          <Badge variant="danger">Rasprodano / lista čekanja</Badge>
          <h1 className="mt-5 text-balance text-5xl text-white sm:text-6xl">{settings.soldOutTitle}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-300">{settings.soldOutDescription}</p>
          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 text-left">
            <h2 className="text-3xl text-white">{settings.waitlistTitle}</h2>
            <p className="mt-3 text-sm leading-8 text-zinc-300">{settings.waitlistDescription}</p>
          </div>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/rezervacija">Ostavi kontakt</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/kontakt">Direktan kontakt</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
