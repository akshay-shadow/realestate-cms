"use client";

import { createBrowserClient } from "@supabase/ssr";
import { createContext, createElement, useContext, useMemo } from "react";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

// Provided by app/admin/layout.tsx from runtime env, so the browser doesn't
// depend on NEXT_PUBLIC_* values being present at build time.
const SupabaseConfigContext = createContext<SupabaseConfig | null>(null);

export function SupabaseConfigProvider({ config, children }: { config: SupabaseConfig; children: React.ReactNode }) {
  return createElement(SupabaseConfigContext.Provider, { value: config }, children);
}

export function useSupabase() {
  const config = useContext(SupabaseConfigContext);
  if (!config) throw new Error("useSupabase must be used inside SupabaseConfigProvider");
  return useMemo(() => createBrowserClient(config.url, config.anonKey), [config.url, config.anonKey]);
}
