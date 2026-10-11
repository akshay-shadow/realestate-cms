import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { requireAdmin } from "@/lib/admin";

export default async function MediaPage() {
  const { slug } = await requireAdmin();
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Media Library</h1>
      <div className="admin-card">
        <MediaLibrary slug={slug} />
      </div>
    </div>
  );
}
