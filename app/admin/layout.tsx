import { SupabaseConfigProvider } from "@/lib/supabase/client";

// Read Supabase config from runtime env on each request, not at build time.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const config = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  };
  return <SupabaseConfigProvider config={config}>{children}</SupabaseConfigProvider>;
}
