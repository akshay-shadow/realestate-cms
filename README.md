# Real Estate CMS: Lead-Gen Website + Admin Panel

A real estate project website where every piece of content can be changed: text, images, videos, SEO, colours, fonts, sections and WhatsApp settings. You manage it all from `/admin`. One codebase serves any number of client sites.

**Stack:** Next.js 15 (App Router) · Supabase (Postgres, Auth, Storage) · Tailwind CSS

## Page layout

The default layout follows a high-converting channel-partner landing page (dark navy and gold, editable under **Theme & Fonts**):

1. **Header:** menu, Contact button and WhatsApp button. The "Brochure" menu item opens the form.
2. **Hero:** an image slider plus an info panel (project name, developer, location, offer box, configuration and price) with a lead form. You can switch it to a full-screen background image or video instead.
3. Overview → Highlights (checklist + image + Request Brochure) → Amenities (image carousel) → Pricing cards (blurred plan, Typology / Carpet Area / Price, "Get Details") → Site & Floor Plan (tabs: Master / Floor / Unit) → Gallery carousel → Location Advantages (map + tabs: Connectivity / Education / Healthcare / Retail) → Virtual Tour → EMI Calculator → About Developer (with RERA QR) → Enquire Now → FAQ (hidden by default).
4. **Footer:** RERA note, website link, registration no., authorised advertiser line and disclaimer.
5. **Always available:** an auto popup, a WhatsApp chat bubble, and a Call / Brochure / WhatsApp bar on mobile.

Every "Download …" or "Request …" button opens the lead form, and the lead's source records which button was clicked. You can reorder or hide any section under **Settings → Section Order**.

## Features

- **Lead capture.** Forms appear in the hero, the contact section, an auto-popup, the floor-plan unlock and the brochure download. Every lead is saved in Supabase along with UTM/gclid/fbclid, the source form and the page URL.
- **WhatsApp alerts** (use one or both):
  1. *Automatic*: the server sends each enquiry to your number(s) through the **WhatsApp Cloud API**.
  2. *Zero setup*: after submitting, the visitor lands in a WhatsApp chat with the enquiry pre-filled.
- **Fully dynamic content** lives in one JSON document per site (`sites.content`):
  brand, SEO (meta, OG image, noindex), theme colours, Google Fonts, corner radius, section order and visibility, navigation, all section content, popup, brochure, footer, privacy policy, plus GA4 / GTM / Meta Pixel IDs.
- **Admin panel:** dashboard, leads (search, filter, status pipeline, notes, CSV export), auto-generated content editors, media library (drag-and-drop upload to Supabase Storage), and JSON import/export for cloning sites.
- **SEO:** metadata, Open Graph/Twitter cards, JSON-LD (RealEstateListing + FAQPage), `robots.txt`, `sitemap.xml`, ISR caching (pages refresh as soon as you save in the admin).
- **Conversion tracking:** submissions fire `generate_lead` (GA4), `Lead` (Meta Pixel) and `lead_submit` (GTM dataLayer). An optional `/thank-you` redirect is available for ad conversion goals.

## Setup (about 10 minutes)

### 1. Supabase
1. Create a project at https://supabase.com.
2. Open **SQL Editor**, paste [supabase/schema.sql](supabase/schema.sql) and run it. This creates the tables, the security policies, the `media` bucket and the `demo` site.
3. Go to **Authentication → Users → Add user** and create your admin login (email + password, with "Auto confirm" on).
4. Link that user to the site by running this in the SQL Editor:
   ```sql
   insert into public.site_admins (site_id, user_id)
   select s.id, u.id from public.sites s, auth.users u
   where s.slug = 'demo' and u.email = 'you@example.com';
   ```

### 2. Environment
```bash
cp .env.example .env.local
```
Fill in the values from **Supabase → Project Settings → API**:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

### 3. Run
```bash
npm install
npm run dev
```
- Website: http://localhost:3000
- Admin: http://localhost:3000/admin

The site shows demo content until you save your own in the admin.

## WhatsApp Cloud API (automatic alerts)

1. Go to https://developers.facebook.com, then **Create App → Business → add WhatsApp**.
2. Under **WhatsApp → API Setup**, copy the *Phone number ID* and create a **permanent token** (Business Settings → System Users → generate a token with `whatsapp_business_messaging`).
3. Set `WHATSAPP_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID`.
4. **Recommended: create a message template.** WhatsApp delivers free-form text only to numbers that have messaged your business number in the last 24 hours. Templates always deliver. Create one (category *Utility*) whose body has 5 variables:
   ```
   New enquiry: Name {{1}}, Phone {{2}}, Email {{3}}, Interested in {{4}}, Message {{5}}
   ```
   Once it's approved, set `WHATSAPP_TEMPLATE_NAME` (and `WHATSAPP_TEMPLATE_LANG`).
5. In **Admin → Settings → WhatsApp**, turn on *Send enquiry automatically* and enter the notify numbers (format `919876543210`; separate several with commas).

The result of each send (`sent` / `failed (...)`) appears with the lead under **Leads**.

## Launching a site for a new client

**Option A: same Supabase project, new deployment** (one admin login can manage many sites)
1. In the SQL Editor:
   ```sql
   insert into public.sites (slug) values ('client2');
   insert into public.site_admins (site_id, user_id)
   select s.id, u.id from public.sites s, auth.users u
   where s.slug = 'client2' and u.email = 'client-or-you@example.com';
   ```
2. Deploy the same repo again (for example as a new Vercel project) with `NEXT_PUBLIC_SITE_SLUG=client2`, the client's domain in `NEXT_PUBLIC_SITE_URL`, and their WhatsApp variables.
3. *(Optional)* On the old site, go to **Admin → Import / Export** and download the content. Import it on the new site, then edit.

**Option B: separate Supabase project per client.** Repeat the setup with fresh keys. This gives full data isolation.

## Deploying (Vercel)
1. Push the repo to GitHub and import it on Vercel.
2. Add all environment variables from `.env.example`.
3. Add the client's domain under Vercel → Domains.

## Deploying (Cloudflare Workers)
The app runs on Workers through the [OpenNext adapter](https://opennext.js.org/cloudflare). Config is in [wrangler.jsonc](wrangler.jsonc) and [open-next.config.ts](open-next.config.ts).

**From GitHub (auto-deploys on push):**
1. Cloudflare dashboard → **Workers & Pages → Create → Import a repository**, and pick this repo.
2. Build command: `npx opennextjs-cloudflare build`. Deploy command: `npx opennextjs-cloudflare deploy`.
3. Under **Settings → Build → Variables and secrets**, add the `NEXT_PUBLIC_*` variables. They are baked in at build time.
4. Under **Settings → Variables and Secrets** (runtime), add every variable from `.env.example`. Add `SUPABASE_SERVICE_ROLE_KEY` and `WHATSAPP_TOKEN` as type *Secret*.
5. Add the client's domain under **Settings → Domains & Routes**.

**From your machine:** `npm run deploy` (runs `wrangler login` the first time). `npm run preview` runs the Workers build locally.

The worker name in `wrangler.jsonc` must match the Worker name in the dashboard. Use a different name per client deployment.

## Adding a new editable field

1. Add it to the type in [lib/content/types.ts](lib/content/types.ts).
2. Give it a default in [lib/content/defaults.ts](lib/content/defaults.ts).
3. Add an editor entry in [lib/content/schema.ts](lib/content/schema.ts). The admin form is generated from this file.
4. Use it in the component under [components/site/sections/](components/site/sections/).

## Project structure

```
app/
  (site)/            public website (layout applies theme, fonts, SEO, tracking)
  admin/             login + panel (dashboard, leads, content/[key], media, backup)
  api/leads/         lead submission → Supabase + WhatsApp
components/
  site/              header, footer, lead form, popup, sections/*
  admin/             sidebar, generic ContentEditor/FieldInput, media library
lib/
  content/           types, defaults, admin editor schema
  supabase/          server / browser / service clients
  site.ts            loads the site content for this deployment
  whatsapp.ts        WhatsApp Cloud API sender
supabase/schema.sql  database, RLS and storage setup
```

## Security notes
- Leads are inserted only by the server, using the service-role key. The public has no read or write access to the `leads` table.
- Admins can read and change only the sites listed for them in `site_admins` (enforced by row-level security in Postgres). Media uploads are restricted to `media/<site-slug>/`.
- Forms include a honeypot field for bots. For heavy spam, add Cloudflare Turnstile or reCAPTCHA.
