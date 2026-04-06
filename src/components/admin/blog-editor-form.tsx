import { PublishStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { upsertBlogPostAction } from "@/lib/actions/admin";

interface BlogEditorFormProps {
  post?: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    contentMarkdown: string;
    seoTitle: string | null;
    seoDescription: string | null;
    tags: string[];
    readTimeMinutes: number;
    featured: boolean;
    status: PublishStatus;
    publishedAt: Date | null;
  } | null;
}

export function BlogEditorForm({ post }: BlogEditorFormProps) {
  return (
    <form action={upsertBlogPostAction} className="space-y-5">
      {post?.id ? <input type="hidden" name="id" value={post.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input name="slug" defaultValue={post?.slug || ""} />
        </div>
        <div className="space-y-2">
          <Label>Naslov</Label>
          <Input name="title" defaultValue={post?.title || ""} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Excerpt</Label>
        <Textarea name="excerpt" defaultValue={post?.excerpt || ""} />
      </div>
      <div className="space-y-2">
        <Label>Markdown sadržaj</Label>
        <Textarea
          name="contentMarkdown"
          className="min-h-[320px]"
          defaultValue={post?.contentMarkdown || ""}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>SEO naslov</Label>
          <Input name="seoTitle" defaultValue={post?.seoTitle || ""} />
        </div>
        <div className="space-y-2">
          <Label>SEO opis</Label>
          <Input name="seoDescription" defaultValue={post?.seoDescription || ""} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Tagovi</Label>
          <Input name="tags" defaultValue={post?.tags.join(", ") || ""} />
        </div>
        <div className="space-y-2">
          <Label>Vrijeme čitanja</Label>
          <Input name="readTimeMinutes" type="number" defaultValue={post?.readTimeMinutes || 4} />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            name="status"
            defaultValue={post?.status || PublishStatus.DRAFT}
            options={[
              { label: "Draft", value: PublishStatus.DRAFT },
              { label: "Published", value: PublishStatus.PUBLISHED },
            ]}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Datum objave</Label>
          <Input
            name="publishedAt"
            type="datetime-local"
            defaultValue={post?.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : ""}
          />
        </div>
        <label className="flex items-center gap-3 rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
          <input type="checkbox" name="featured" defaultChecked={post?.featured || false} />
          Istaknuti članak
        </label>
      </div>
      <Button type="submit">Sačuvaj članak</Button>
    </form>
  );
}
