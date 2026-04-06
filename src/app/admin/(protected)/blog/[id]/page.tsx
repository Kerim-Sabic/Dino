import { notFound, redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BlogEditorForm } from "@/components/admin/blog-editor-form";
import { Card, CardContent } from "@/components/ui/card";
import { getBlogAdminPost } from "@/lib/admin-data";
import { requireSession } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: EditBlogPageProps) {
  const session = await requireSession();
  if (!canManageContent(session.role)) redirect("/admin");

  const { id } = await params;
  const post = await getBlogAdminPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Uredi članak"
        description="Ažuriranje SEO naslova, teksta članka i objave bez izlaska iz internog sistema."
      />
      <Card className="rounded-[30px]">
        <CardContent className="p-6">
          <BlogEditorForm post={post} />
        </CardContent>
      </Card>
    </div>
  );
}
