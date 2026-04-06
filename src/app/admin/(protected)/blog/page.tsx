import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getBlogAdminData } from "@/lib/admin-data";
import { formatDateShort } from "@/lib/format";
import { requireSession } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function AdminBlogPage() {
  const session = await requireSession();
  if (!canManageContent(session.role)) redirect("/admin");
  const posts = await getBlogAdminData();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog i SEO"
        description="Pregled i uređivanje sadržaja koji ranka za lokalni intent i istovremeno pomaže konverziji leadova."
      />
      <Button asChild>
        <Link href="/admin/blog/novi">Novi članak</Link>
      </Button>
      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id} className="rounded-[28px]">
            <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.16em] text-zinc-500">{post.status}</p>
                <h2 className="mt-2 text-3xl text-white">{post.title}</h2>
                <p className="mt-2 text-sm leading-7 text-zinc-300">{post.excerpt}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
                  {post.publishedAt ? formatDateShort(post.publishedAt) : "nije objavljeno"}
                </p>
              </div>
              <Button asChild variant="secondary">
                <Link href={`/admin/blog/${post.id}`}>Uredi članak</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
