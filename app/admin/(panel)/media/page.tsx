import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { SITE_SLUG } from "@/lib/site";

export default function MediaPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Media Library</h1>
      <div className="admin-card">
        <MediaLibrary slug={SITE_SLUG} />
      </div>
    </div>
  );
}
