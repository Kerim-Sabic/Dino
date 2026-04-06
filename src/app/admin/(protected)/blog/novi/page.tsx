import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BlogEditorForm } from "@/components/admin/blog-editor-form";
import { Card, CardContent } from "@/components/ui/card";
import { requireSession } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function NewBlogPostPage() {
  const session = await requireSession();
  if (!canManageContent(session.role)) redirect("/admin");
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Novi članak"
        description="Kreirajte novi Bosnian-first SEO članak sa jasnim internim linkovima prema money stranicama."
      />
      <Card className="rounded-[30px]">
        <CardContent className="p-6">
          <BlogEditorForm />
        </CardContent>
      </Card>
    </div>
  );
}
