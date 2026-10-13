-- Result of the enquiry email alert (sent / failed (...) / skipped: ...).
alter table public.leads add column if not exists email_status text;
