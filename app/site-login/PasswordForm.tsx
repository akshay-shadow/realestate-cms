"use client";

import { useActionState } from "react";
import { unlockSite } from "./actions";

export function PasswordForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(unlockSite, undefined);
  return (
    <form action={action} className="mt-6 space-y-3">
      <input type="hidden" name="next" value={next} />
      <input
        name="password"
        type="password"
        required
        autoFocus
        placeholder="Password"
        autoComplete="current-password"
        className="admin-input"
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button disabled={pending} className="admin-btn w-full">
        {pending ? "Checking…" : "View website"}
      </button>
    </form>
  );
}
