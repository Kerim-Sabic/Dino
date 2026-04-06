import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateShort } from "@/lib/format";
import type { BlogPostData } from "@/lib/types";

interface BlogCardProps {
  post: BlogPostData;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="group h-full rounded-[26px] transition-all duration-[220ms] hover:-translate-y-1 hover:border-white/14">
      <CardContent className="flex h-full flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-center gap-2.5">
          <Badge variant="secondary">{post.readTimeMinutes} min čitanja</Badge>
          {post.publishedAt ? (
            <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
              {formatDateShort(post.publishedAt)}
            </span>
          ) : null}
        </div>

        <div className="space-y-2">
          <h3 className="text-[1.125rem] leading-snug text-white">{post.title}</h3>
          <p className="text-sm leading-[1.8] text-zinc-400">{post.excerpt}</p>
        </div>

        {post.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-white"
        >
          Pročitaj vodič
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
