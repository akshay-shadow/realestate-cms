import { ImportContent } from "@/components/admin/ImportContent";

export default function BackupPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <h1 className="text-2xl font-bold">Import / Export</h1>

      <div className="admin-card space-y-3">
        <h2 className="font-semibold">Export content</h2>
        <p className="text-sm text-slate-600">
          Download all text, media links, SEO, theme and settings as a JSON file. Use it as a backup, or import it into a new
          client site as a starting point.
        </p>
        <a href="/admin/backup/export" className="admin-btn">
          ⬇ Download content.json
        </a>
      </div>

      <div className="admin-card space-y-3">
        <h2 className="font-semibold">Import content</h2>
        <p className="text-sm text-slate-600">
          Replaces <strong>all</strong> content of this site with the uploaded file. Leads are not affected.
        </p>
        <ImportContent />
      </div>
    </div>
  );
}
