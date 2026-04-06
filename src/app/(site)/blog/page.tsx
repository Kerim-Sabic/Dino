import Link from "next/link";
import { BlogCard } from "@/components/site/blog-card";
import { SectionHeading } from "@/components/site/section-heading";
import { StructuredData } from "@/components/site/structured-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildBreadcrumbSchema, buildMetadata } from "@/lib/metadata";
import { getBlogPosts } from "@/lib/public-data";
import { absoluteUrl } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Vodič i savjeti za kupovinu ulaznica za Dino Merlin Koševo | Blog",
  description:
    "Korisni tekstovi za sve koji traže ulaznice za Dino Merlin na Koševu: kako funkcioniše privatna rezervacija, šta su fizičke ulaznice i kako bezbjedno kupiti u Sarajevu.",
  path: "/blog",
  keywords: [
    "dino merlin kosevo vodic ulaznice",
    "kako kupiti ulaznice dino merlin sarajevo",
    "fizicke ulaznice savjeti",
    "rezervacija ulaznica blog sarajevo",
  ],
});

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <section className="container-shell py-16">
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Početna", url: absoluteUrl("/") },
          { name: "Blog", url: absoluteUrl("/blog") },
        ])}
      />

      <Badge>Blog / vodiči</Badge>
      <SectionHeading
        title="Tekstovi koji odgovaraju na realna pitanja prije rezervacije"
        description="Svaki članak je pisan za stvarne nedoumice kupaca, bez generičkog punjenja ključnim riječima i bez tankih stranica koje ne pomažu odluci."
      />

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>

      <Card className="mt-10 rounded-[32px] border-primary/12 bg-primary/[0.05]">
        <CardContent className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.18em] text-primary">Kad vam tekst riješi dilemu</p>
            <h2 className="mt-3 text-4xl text-white">Naredni korak treba ostati jednostavan</h2>
            <p className="mt-4 text-sm leading-8 text-zinc-300">
              Ako ste dobili odgovor koji ste tražili, pređite na javnu ponudu ili odmah pošaljite zahtjev za rezervaciju dok je trenutni nivo još otvoren.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/ulaznice">Pogledaj ulaznice</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/rezervacija">Pošalji zahtjev</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
