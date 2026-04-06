import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MarkdownContent } from "@/components/site/markdown-content";
import { buildMetadata } from "@/lib/metadata";
import { getLegalDocument } from "@/lib/public-data";

export const metadata = buildMetadata({
  title: "Uslovi korištenja",
  path: "/uslovi-koristenja",
});

export default async function TermsPage() {
  const document = await getLegalDocument("uslovi-koristenja");

  if (!document) {
    notFound();
  }

  return (
    <section className="container-shell py-16">
      <Badge>Pravni okvir</Badge>
      <h1 className="mt-4 text-5xl text-white">{document.title}</h1>
      <Card className="mt-8 rounded-[32px]">
        <CardContent className="p-8">
          <MarkdownContent content={document.contentMarkdown} />
        </CardContent>
      </Card>
    </section>
  );
}
