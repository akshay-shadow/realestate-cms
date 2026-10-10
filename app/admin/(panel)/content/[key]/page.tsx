import { notFound } from "next/navigation";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { requireAdmin } from "@/lib/admin";
import { getEditorPage } from "@/lib/content/schema";
import type { ContentKey } from "@/lib/content/types";
import { SITE_SLUG } from "@/lib/site";

export default async function ContentPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const page = getEditorPage(key);
  if (!page) notFound();

  const { content } = await requireAdmin();

  return (
    <ContentEditor
      key={key}
      page={page}
      initialValue={content[key as ContentKey] as unknown as Record<string, unknown>}
      siteSlug={SITE_SLUG}
    />
  );
}
