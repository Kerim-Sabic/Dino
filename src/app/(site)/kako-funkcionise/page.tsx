import Link from "next/link";
import { IndependenceNotice } from "@/components/site/independence-notice";
import { RelatedGuides } from "@/components/site/related-guides";
import { SectionHeading } from "@/components/site/section-heading";
import { StructuredData } from "@/components/site/structured-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildBreadcrumbSchema, buildMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Kako funkcioniše rezervacija ulaznica za Dino Merlin Koševo | Korak po korak",
  description:
    "Tačan opis procesa privatne rezervacije: zahtjev online, ručni odgovor u roku od 30 minuta, dogovor i lično preuzimanje uz pregled fizičke ulaznice u Sarajevu.",
  path: "/kako-funkcionise",
  keywords: [
    "kako rezervisati ulaznice dino merlin",
    "preuzimanje ulaznica sarajevo",
    "privatna kupovina ulaznica sarajevo",
    "kako funkcionise rezervacija ulaznica",
    "fizicke ulaznice preuzimanje sarajevo",
  ],
});

const flow = [
  {
    number: "01",
    title: "Online zahtjev",
    body: "Kupac unosi osnovne podatke i bira preferirani kanal kontakta. Forma nije online kupovina, nego početak ručne obrade.",
  },
  {
    number: "02",
    title: "Ručna potvrda",
    body: "Provjerava se dostupnost, količina i eventualna mogućnost zaključavanja cijene za konkretan lead.",
  },
  {
    number: "03",
    title: "Dogovor za Sarajevo",
    body: "Nakon potvrde se dogovaraju lokacija i vrijeme sastanka, uz fokus na praktičnost i sigurnost za kupca.",
  },
  {
    number: "04",
    title: "Pregled i plaćanje",
    body: "Kupac vidi fizičku ulaznicu uživo, potvrđuje da mu odgovara i tek tada završava transakciju.",
  },
];

export default function HowItWorksPage() {
  return (
    <section className="container-shell py-16">
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Početna", url: absoluteUrl("/") },
          { name: "Kako funkcioniše", url: absoluteUrl("/kako-funkcionise") },
        ])}
      />

      <Badge>Kako funkcioniše</Badge>
      <SectionHeading
        size="compact"
        title="Proces je namjerno jednostavan, miran i lokalno utemeljen"
        description="Najveći dio povjerenja dolazi iz toga što korisnik od prve sekunde zna šta se online dešava, a šta se završava uživo."
      />

      <div className="mt-8">
        <IndependenceNotice className="border-primary/12 bg-primary/[0.05]" />
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        {flow.map((item) => (
          <Card key={item.number} className="rounded-[30px]">
            <CardContent className="p-7">
              <p className="text-sm uppercase tracking-[0.2em] text-primary">{item.number}</p>
              <h2 className="mt-4 text-4xl text-white">{item.title}</h2>
              <p className="mt-4 text-sm leading-8 text-zinc-300">{item.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <h2 className="text-4xl text-white">Zašto ovo smanjuje anksioznost kupca</h2>
        <div className="mt-5 grid gap-4 text-sm leading-8 text-zinc-300 sm:grid-cols-2">
          <p>Online forma služi za brzinu, a ručni kontakt za povjerenje.</p>
          <p>Preuzimanje uživo u Sarajevu uklanja potrebu za rizičnim slanjem novca unaprijed.</p>
          <p>Jasna rečenica da ovo nije zvanični prodajni kanal djeluje iskrenije i smanjuje sumnju.</p>
          <p>Jedna kategorija i jedna cijena čine odluku jednostavnijom i bržom.</p>
        </div>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/rezervacija">Pošalji zahtjev za rezervaciju</Link>
          </Button>
        </div>
      </div>

      <div className="mt-10">
        <RelatedGuides
          items={[
            {
              title: "Zašto nama vjeruju",
              description: "Dodatni razlozi zbog kojih je model ličnog preuzimanja sigurniji.",
              href: "/zasto-nama-vjeruju",
            },
            {
              title: "FAQ",
              description: "Odgovori na pitanja o cijeni, potvrdi i preuzimanju.",
              href: "/faq",
            },
            {
              title: "Kontakt",
              description: "Direktni kanali za brži dogovor s kupcem.",
              href: "/kontakt",
            },
          ]}
        />
      </div>
    </section>
  );
}
