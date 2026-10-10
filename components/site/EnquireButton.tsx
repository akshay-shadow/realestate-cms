"use client";

import { useEnquiry, type Intent } from "./EnquiryProvider";

export function EnquireButton({
  children,
  className = "btn-primary",
  intent,
  interest,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  intent?: Intent;
  interest?: string;
  title?: string;
}) {
  const { open } = useEnquiry();
  return (
    <button type="button" className={className} onClick={() => open({ intent, interest, title })}>
      {children}
    </button>
  );
}
