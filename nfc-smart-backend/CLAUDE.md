# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**NFC Smart Backend** — A serverless backend for a Smart NFC restaurant management system built on Cloudflare Workers. The system enables restaurant owners to deliver dynamic landing pages via NFC tags that link to menus, Google Maps reviews, and WiFi passwords. Restaurant owners update menus via a Telegram bot, which automatically syncs to the backend.

## Tech Stack

- **Runtime:** Cloudflare Workers (serverless, TypeScript)
- **Database:** Supabase (PostgreSQL + managed storage)
- **API Integrations:** Telegram Bot API
- **Build Tool:** Wrangler (Cloudflare's CLI tool)
- **Frontend:** React 19 + TypeScript + Vite 6 + Tailwind CSS v4, served as static assets by the Worker

## Architecture

**Single-file backend** (`src/index.ts`). The Worker routes requests to four main handlers:

1. **POST /webhook/telegram** — Receives Telegram messages. When a restaurant owner sends a PDF document, it uploads the file to Supabase storage and updates the `menu_url` in the restaurants table.

2. **GET /t/<uuid>** — Serves the React landing page for a restaurant. Queries Supabase for the restaurant record, injects it as `window.__RESTAURANT__` into the built `index.html` shell, and returns it. The Worker's job here is data lookup + injection only — no HTML is hand-built server-side. Also logs a `scan` analytics event (see "Analytics" below).

3. **POST /api/event** — Analytics ingestion from the frontend (`search`, `select_add`, `call_waiter`, `wifi_open`, `review_click`, `lang`). Validates a type whitelist + UUID + payload size, inserts into the `events` table with the secret key via `ctx.waitUntil` (fire-and-forget, never blocks the response). `scan` is deliberately not client-submittable.

4. **GET /** — Default route with usage instructions.

**Frontend rendering:** Client-side rendering with server-injected data (CSR + hydration). Vite builds `frontend/` to `frontend/dist/`, served via Cloudflare Workers Static Assets (`ASSETS` binding in `wrangler.toml`). `frontend/src/main.tsx` reads `window.__RESTAURANT__` on mount (falling back to `mockData.ts` in local dev) — no client-side fetch, no loading skeleton, no waterfall.

**Request Flow:**
- NFC tag encodes `https://worker-url/t/<restaurant-uuid>`
- Phone scans tag → Worker looks up the restaurant row → serves the built React app with that row's data injected inline
- Owner sends menu PDF to Telegram bot → webhook handler uploads to Supabase storage → updates DB
- Next NFC scan shows updated data

**Secrets Management:**
- All sensitive credentials (Supabase URL, keys, Telegram token) are stored as Worker secrets via `wrangler secret put`, not in config files.
- Environment variables are accessed via the `Env` interface passed to the fetch handler.
- **Two different Supabase keys, two different trust levels** (split enforced 12/07/2026 after a leaked-token incident — see git history around that date for context): `SUPABASE_ANON_KEY` (the "publishable" key) is used only for the public read in `handleNfcLandingPage` — safe to be public, RLS only allows `SELECT`. `SUPABASE_SECRET_KEY` (the "secret"/service_role key) is used only inside `handleTelegramWebhook` for the storage upload and the `restaurants` update — it bypasses RLS and must never reach the client. There is intentionally **no** `INSERT`/`UPDATE` RLS policy for the anon role on `restaurants` or `storage.objects` — writes only happen through the Worker with the secret key.

## Key Commands

```bash
# Install dependencies
npm install

# Local development (runs on http://localhost:8787 by default)
npm run dev

# Build the frontend (frontend/dist) then deploy the Worker
npm run deploy

# Authenticate with Cloudflare (one-time setup)
npx wrangler login

# Set Worker secrets (required before first deploy)
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_ANON_KEY
npx wrangler secret put SUPABASE_SECRET_KEY   # service_role / "secret" key — privileged writes only, never sent to the client
npx wrangler secret put TELEGRAM_BOT_TOKEN
```

Frontend-only work (`nfc-smart-backend/frontend/`):

```bash
cd frontend
npm install
npm run dev     # Vite dev server, renders against mockData.ts
npm run build   # outputs to frontend/dist, consumed by the Worker's ASSETS binding
```

## Database Setup

1. Create a new Supabase project at https://supabase.com/
2. Run the SQL from `supabase_schema.sql` in Supabase's SQL Editor to create the `restaurants` table with RLS policies and the `menus` storage bucket. If you're updating an existing project that predates 12/07/2026, run the "MIGRAZIONE" block at the bottom of that file instead (adds `updated_at`, drops the old public-write policy) — it's idempotent.
3. Retrieve the **publishable** key (→ `SUPABASE_ANON_KEY`) and the **secret**/service_role key (→ `SUPABASE_SECRET_KEY`) from Supabase dashboard → Project Settings → API Keys. Never put the secret key anywhere but the Worker secret store.

## Deployment & Configuration

**Before first deploy:**
- Set secrets via wrangler (see Key Commands above)
- Update `wrangler.toml` with your project name if needed

**After deploy:**
- Get the Worker URL (format: `https://nfc-smart-backend.your-account.workers.dev`)
- Configure Telegram webhook by visiting in browser or curl:
  ```
  https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=<WORKER_URL>/webhook/telegram
  ```

## File Structure

```
nfc-smart-backend/
├── src/
│   └── index.ts              # Worker: routing, Telegram webhook, Supabase lookup + HTML injection
├── frontend/
│   ├── index.html             # Vite entry HTML shell
│   ├── .mcp.json              # Project-scoped MCP servers (21st Magic — needs API_KEY_21ST env var)
│   ├── src/
│   │   ├── main.tsx           # Reads window.__RESTAURANT__, renders <App>
│   │   ├── App.tsx            # Screen state: cinematic hero <-> menu, wifi modal; wraps LangProvider
│   │   ├── types.ts           # Restaurant type — the Worker/frontend data contract (incl. google_place_id)
│   │   ├── lib/
│   │   │   └── analytics.ts   # track(): sendBeacon/fetch to POST /api/event, no-op on mock/dev, never throws
│   │   ├── i18n/
│   │   │   ├── index.tsx      # LangProvider/useLang (it/en/de), all UI strings, auto-detect + localStorage
│   │   │   └── menu.i18n.ts   # EN/DE translations of dish descriptions + pairing notes + category names
│   │   ├── mockData.ts        # Local-dev fallback restaurant (real pilot: "Notte Dì")
│   │   ├── index.css          # Tailwind v4 entry + @theme design tokens + font imports
│   │   ├── components/
│   │   │   ├── CinematicStack.tsx   # Sticky-stack scroll intro (3 full-bleed ambiance photo panels)
│   │   │   ├── KineticText.tsx      # Word-by-word scroll-reveal text (used by headlines)
│   │   │   ├── QuickActions.tsx     # Wi-Fi / Maps / Chiama-Cameriere row
│   │   │   ├── WifiModal.tsx        # Bottom sheet with copyable Wi-Fi password
│   │   │   ├── CategoryTabs.tsx     # Pill tabs, scrollspy-synced; header hides on scroll-down, reveals on scroll-up (MenuView)
│   │   │   ├── SearchOverlay.tsx    # Full-screen ingredient search: suggestion chips (from i18n) when empty, results grouped by category, matches IT + current language
│   │   │   ├── LangSwitcher.tsx     # IT/EN/DE pill row (hero top-right + menu header)
│   │   │   ├── CategoryHeader.tsx   # Ambiance photo banner + category name (start of each section)
│   │   │   ├── DishRow.tsx          # Text row: name, price, description, +/✓ toggle (adds to selection)
│   │   │   ├── PairingToast.tsx     # Per-add drink suggestion: photo card slides up, auto-dismisses (see "La Mia Selezione")
│   │   │   ├── SelectionButton.tsx  # Floating badge button, bottom-right, shows selection count
│   │   │   └── SelectionSheet.tsx   # Review sheet: selected dishes + one prominent aggregated pairing recommendation
│   │   ├── context/
│   │   │   └── SelectionContext.tsx # Selected-dish state, localStorage-persisted (survives reload/back-nav)
│   │   └── data/
│   │       ├── menu.ts        # Real menu (Pizzeria Notte Dì, Verona) — categories in restaurant order (antipasti first, 16/07/2026); Pairing includes real drink price; EXTRA_INGREDIENTS for pizza customization
│   │       ├── reviews.ts     # Hand-curated Google reviews (REAL ONLY, verbatim — never invented) + rating/count shown in ReviewsSheet
│   │       └── images.ts      # Real (Unsplash) drink photos — used only where meaningful (pairing cards); ambiance banners removed 16/07/2026
│   └── dist/                  # Build output, served via the ASSETS binding (gitignored)
├── supabase_schema.sql        # Database schema and RLS policies
├── package.json                # Root scripts: dev (wrangler dev), build, deploy
└── wrangler.toml               # Cloudflare Workers config + ASSETS binding
```

## Frontend Design Workflow

The `/t/<uuid>` landing page is a pilot for a real product idea, not just a data display: **the page must actively recommend a drink/wine pairing for every dish, not just list the menu.** That pairing feature is the differentiator vs. a plain PDF link.

**Content is real as of 14/07/2026**: `frontend/src/data/menu.ts` is transcribed from the actual PDF menu of **Pizzeria Notte Dì** (Verona) — real dishes, real prices, real categories (Le Pazzesche, Le Speciali, Le Bianche, Le Schiacciate, Le Tradizionali, Antipasti, Primi, Secondi, Insalatone, Birre, Vini/Amari/Distillati, Aperitivi/Bibite/Caffè). `mockData.ts` reflects the same restaurant. Pairing suggestions are only mapped to drinks the restaurant actually serves (its two by-the-glass wines — Verdicchio, Cabernet Franc — and its on-tap/bottled beers), not invented ones.

**Copy voice (15/07/2026): site copy draws from the restaurant's own printed menu**, not invented marketing. Their menu intro states: Mulino Caputo flour, Caseificio Sagliocco dairy, house-made toppings, "lungo processo di lievitazione" for digestibility, and signs off with "Nella certezza che passerete un'ottima serata, vi auguriamo Buon Appetito!". The panel-2 headline ("Lunga lievitazione, lunga serata.") compresses their claim + their wish — it's safe *because it's their own claim*; the sign-off appears verbatim at the end of the menu list (`ui.signOff`). When writing new copy, mine that menu voice first (owner: "lasciare un po' di magia della pizzeria"); don't invent claims the menu doesn't make (see also Menu Photo Policy).

Design direction (dark premium, image-forward ambiance) is unchanged, but **see "Menu Photo Policy" below — per-dish photography was deliberately dropped**, so `DishSlide`/`DishDetailSheet` (the old image-per-dish swipe gallery) no longer exist. Menu items now render as `DishRow` — a plain text row (name, price, description, a `+`/✓ toggle) — under a `CategoryHeader` ambiance banner per section, with a big group-label divider ("Pizze" / "Cucina" / "Da Bere") wherever `MenuCategory.group` changes, for wayfinding across the ~90-item real menu. **The per-dish pairing chip is gone from the row itself** (14/07/2026 — see "La Mia Selezione" below): with real content this large, a pairing note on every one of ~90 rows was noise, not a sell. The pairing data still lives on every `MenuItem` — it just surfaces once, prominently, in the selection review sheet instead of diluted across the whole list.

### Design skills (vendored in this repo — no install needed)

`.claude/skills/` at the repo root is committed to git specifically so anyone who clones this repo gets the same design tooling automatically, with no setup:

- **`ui-ux-pro-max`** — searchable design-system database (palettes, font pairings, styles, UX rules) across 22 stacks. Invoke via the `Skill` tool, or directly: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system`.
- **`taste-skill`** ([leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill)) — anti-slop frontend rules: banned AI-default clichés (purple glow, beige+brass "premium consumer" palette, Inter-as-default, eyebrow-above-every-section, etc.), motion/typography/layout discipline. Read `.claude/skills/taste-skill/SKILL.md` before making visual changes to this frontend.

Current design tokens (defined in `frontend/src/index.css` `@theme` block, **redesign "alta classe" 16/07/2026** after three owner-feedback iterations — dark+orange, carta+olive and Fraunces-ink were all rejected): ivory paper base (`#faf6ee`), ink (`#1c1a15`, doubles as the interactive accent — filled buttons are ink), **antique gold `#9a7b4f` for details only** (hairlines, small-caps eyebrows, numbers, thin icons — never gold blocks), **Cormorant Garamond** (display serif), **Jost** (body + spaced small-caps labels), **Mrs Saint Delafield** (pen-signature script, home only). A `.inverted` CSS class flips the tokens to "notte" mode (ink background) — used by the search overlay so search feels like a distinct place without leaving the palette. Don't reach for new colors/fonts without a reason — see taste-skill rules and the design-taste memory.

### Optional: 21st.dev Magic MCP

`frontend/.mcp.json` (committed) registers a 21st.dev Magic MCP server for component search/generation, reading its key from the `API_KEY_21ST` env var — no secret is committed. It's optional and **not required** for the workflow above (ui-ux-pro-max + taste-skill are enough). To enable it:

1. Get a free API key at 21st.dev/magic/console (small free tier: unlimited search, but only ~2 code retrievals/day — check current limits in the console, they change).
2. `export API_KEY_21ST=<your-key>` (or `claude mcp add --transport http 21st https://21st.dev/api/mcp --header "x-api-key: <your-key>"` for a machine-local, non-shared registration).
3. Restart Claude Code — new MCP tools only load on session start, `claude mcp list` confirms the connection.

### Verifying frontend changes

This is a mobile-first page (scanned via NFC at a table) — always check it on a phone-sized viewport, not desktop:

```bash
cd nfc-smart-backend/frontend && npm install && npm run dev -- --port 5183
# then drive it with the playwright-cli skill, device "iPhone 14", and screenshot —
# don't trust --full-page screenshots for scroll-triggered (whileInView) animations,
# they capture before the animations have a chance to trigger; scroll incrementally instead.
```

### Mobile smoothness rules (audit pass 15/07/2026 — keep these invariants)

- **Text inputs are ≥16px** (`text-base`): below that, iOS Safari zooms on focus and stays zoomed, breaking the layout. This was the reported "search breaks the page" bug.
- **Every fixed overlay locks the body** via `lib/useLockBodyScroll.ts` (counter-based, safe for stacked overlays) and its scroll area gets `overscroll-contain` — no scroll chaining to the page behind.
- Global CSS (`index.css`): `touch-action: manipulation` (kills double-tap zoom, keeps pinch), `overscroll-behavior-y: none` (no accidental pull-to-refresh mid-meal), `-webkit-text-size-adjust: 100%`, no long-press callout/drag on images. Viewport meta has `viewport-fit=cover`; fonts get `preconnect`.
- **(Storico — l'hero fotografico è stato sostituito il 16/07/2026 dalla home tipografica statica; le regole del vecchio stack restano come riferimento.)** The hero stack does zero scroll-driven work (settled 15/07/2026 after several on-device attempts): panel images are fully static — no `useScroll` transforms (stutter against iOS momentum scrolling), no enter zooms (churn on fast scrolls). Impact comes from the CSS sticky covering effect + `KineticText` (`once: true`).
- **Hero panel geometry: FIXED PIXELS measured once at mount** (`useStablePanelHeight` in CinematicStack; panel = innerHeight, backdrop = +240px overshoot; re-measured only when the width changes, i.e. rotation). History of this rule: `dvh` reflowed the page on every URL-bar collapse; `svh`-box+`lvh`-backdrop fixed it **in Safari only** — in third-party iOS browsers (Brave, Chrome, Firefox = WKWebView shells) the toolbars are native app chrome and even `svh` moves with them (~150px reflow mid-scroll, diagnosed frame-by-frame from a screen recording 16/07/2026). Pixel heights are immune everywhere. The `.stack-panel`/`.stack-backdrop` CSS classes stay as pre-JS fallbacks only. Hero scroll-snap is also disabled in those browsers (`lib/browser.ts` — WKWebView snap+sticky is jerky); Safari keeps it.
- Scrollspy: the click-scroll guard window is 900ms (600ms let the observer re-fire mid-flight → tab flicker); the active tab auto-centers in the tab bar via `container.scrollTo` (never `scrollIntoView`, which also scrolls the page vertically).

## Menu Photo Policy (decided 14/07/2026 — don't re-litigate without reason)

**No photo on this site ever claims to depict the specific dish a customer will receive.** Photos are ambiance (the cinematic intro panels, `CategoryHeader` section banners) or genuine drink photography (the small thumbnail next to a pairing suggestion — "a glass of Cabernet Franc" is true regardless of which bottle is open that night). Individual dishes (`MenuItem`) have no `image` field at all; `DishRow` is text-only (name, price, description, pairing chip).

**Why:** this was tested and reversed in one afternoon. AI photo-enhancement of a real phone photo (tested with Gemini, free) produced results ranging from "same dish, better lit" to "different plating with a garnish that was never on the plate, in front of a wood-fired oven the kitchen doesn't have." The dishonest end of that range crosses into what Italian/EU consumer law calls a pratica commerciale scorretta/ingannevole (Codice del Consumo, transposing Directive 2005/29/EC) if a customer reasonably feels misled about what they're ordering — not a criminal matter for a small pizzeria menu, but a real reputational risk (bad reviews: "didn't look like the photo") that this product should not be built to enable by default. Food styling tricks and lighting/background embellishment are normal and fine; adding or removing ingredients the kitchen doesn't actually put on the plate is the line.

**If per-dish photography comes back later** (e.g. a restaurant wants to submit its own real photos), keep it to genuine unedited or lightly-graded (lighting/crop only, no added/removed elements) photos of that exact dish — do not resurrect AI reimagining for individual `MenuItem`s.

## Extra-Ingredient Pricing (built 23/07/2026 — prices are PLACEHOLDERS, not final)

Adding an extra ingredient to a pizza in `DishSheet` now changes the price shown; removing a base ingredient does not (agreed with the owner 23/07/2026 — matches how almost every real pizzeria works: no discount for "senza X").

- `EXTRA_INGREDIENTS` in `data/menu.ts` changed from `string[]` to `{ name: string; price: number }[]` — one price per extra, not a flat rate across all ten (owner's choice: some ingredients genuinely cost the kitchen more, e.g. truffle-adjacent or bufala items vs. a basic topping).
- `lib/pricing.ts` — `extraPrice(name)` looks up one ingredient's price; `dishTotal(item, mods)` returns `item.price + sum of mods.added prices` (removed ingredients are intentionally excluded from the calculation, per the no-discount decision above).
- `DishSheet` shows the live total next to the dish name — `€13,00` with the original `€9,00` struck through beside it once at least one extra is added, back to a single plain price with no strikethrough once `mods.added` is empty. Each extra chip in "Aggiunte" shows its own `+€X,XX` next to the name so the price change is legible before tapping, not just after.
- **This does not touch `SelectionSheet`** — the "no prices, no total" rule there ("La Mia Selezione" section below) is about not turning the reminder list into a checkout-style running bill across multiple dishes, which is a separate decision from showing one dish's own price while you're actively customizing it in `DishSheet`. Don't conflate the two if this comes up again.

**Current placeholder prices (agreed 23/07/2026 — explicitly provisional, update like the drink list once the owner has real numbers):**

| Extra | Price |
|---|---|
| Mozzarella di bufala | €2,00 |
| Stracciatella di bufala | €2,50 |
| Nduja | €1,50 |
| Salamella | €1,50 |
| Prosciutto crudo | €2,50 |
| Gorgonzola | €1,50 |
| Funghi porcini | €2,50 |
| Friarielli | €1,50 |
| Acciughe | €1,50 |
| Scamorza affumicata | €1,50 |

## "La Mia Selezione" — reminder list + concentrated pairing recommendation (built 14/07/2026)

**What it is:** a memory aid, not a cart — nothing here places an order or takes payment; a real waiter still has to come take it. That purpose is now stated in the UI itself (15/07/2026): a subtitle under the sheet title ("Mostrala al cameriere quando arriva: si ordina in un attimo.") and a matching empty-state line. The guest taps `+` on any `DishRow` to add it to a running list, can review that list anytime via a floating badge button, and the review sheet leads with **one "consiglio della casa" card showing every distinct pairing in the selection**: a single pairing gets the full-width photo card with its note; several pairings become a collage card — one photo slice per drink, dominant first, each slice labeled with the drink name and either "Per <dish>" (count 1) or "N piatti" (`groupPairings` in `lib/pairing.ts`; layout chosen 15/07/2026 over a hero+rows split and over a swipeable carousel — one card, no scrolling). **The entire sheet surface is "carta paglia"** — the straw-yellow paper of Italian pizzeria placemats (`#eadfb9`, flat color, no simulated grain), the one deliberate light surface in the otherwise dark app (owner decision after four iterations, 15/07/2026: "voglio un materiale che abbia senso"). Ink text (`#26200f`), burnt-orange accent `#bc3f0a` (the app accent `#ff6a1a` lacks contrast on straw), dish list as an editorial numbered list (`01`, `02`, … echoing the cinematic panels' section numbers) **grouped by menu category with one caption per group, in menu order rather than tap order** (`resolveSelection` iterates the menu, not the key set) — it reads like a waiter's comanda: pizzas together, primi together. The dark drink-recommendation cards sit on the paper like printed photographs. Iterations rejected same day: partial cream "comanda" slip with zigzag edge (light block inside dark sheet = not enough), stitched leather panel and grain textures ("da videogame, non professionale"), plain dark editorial list (no contrast). Rules that emerged: material metaphors must cover the whole surface or not exist; no simulated textures (flat color + typography only); the paglia style stays confined to this sheet. Pairing surfaces in exactly **two** places: that sheet card, plus `PairingToast` — a photo card that slides up **once per added dish** (that dish's own pairing: image, label, localized note), auto-dismisses after 4s, tap to close, driven by `lastAdded` on `SelectionContext`. Rationale (15/07/2026): each guest browses on their own phone, so the on-add moment is personal, and it lands *before* drinks are ordered. Two earlier variants were tried and removed — a static chip on all ~90 rows (14/07, noise) and a quiet badge on the matching drink row in Da Bere (15/07, nobody noticed it). Don't resurrect either without discussion.

**Why this exists:** with 90 real dishes, a pairing chip on every row was ignorable noise. Concentrating it into a single well-designed moment — reached deliberately, seen once, hard to miss — sells the pairing far more effectively than a chip a guest scrolls past 90 times.

**How it works:**
- `context/SelectionContext.tsx` — a `Set<string>` of `"${categoryId}:${itemId}"` keys (category-prefixed so ids never collide across the ~12 categories), persisted to `localStorage` under `nfc-menu-selection` **with a 2-hour sliding expiry from the last change** (added 15/07/2026). Survives page reload and app switches for the whole meal — mobile browsers reload tabs constantly, so clearing on every reload was explicitly rejected (an accidental refresh would wipe the order right before the waiter arrives) — but a guest returning for the next visit starts with an empty list. It does **not** survive across different restaurants/devices, by design; this is a per-visit note-to-self, not an account.
- `DishRow` renders the toggle and reads/writes selection state directly via `useSelection()`.
- `SelectionButton` — floating, bottom-right, safe-area aware, only rendered once `count > 0`.
- `SelectionSheet` — resolves the selected keys back to full `MenuItem`s, then picks the **most frequent `pairing.label`** among them (simple majority count, ties broken by insertion order — deliberately not fancier than that) and renders it as the "Il consiglio della casa" card: drink photo, name, and a note like "adatto a N piatti scelti". Below it, the plain list of selected dishes with a remove button. **No prices and no total in this sheet** (removed 14/07/2026, owner decision): the selection is an experience/memory aid, not a bill — showing a running total made it feel like a checkout. Prices stay visible on `DishRow` in the menu itself.

**Explicitly out of scope, don't add without discussion:** this does not send anything to the kitchen/waiter, has no server component at all (pure client-side `localStorage`), and does not multiply/sum pairing logic beyond "most common label" — no per-dish sub-recommendations once in the sheet.

## Analytics (built 15/07/2026 — collection only, no dashboard)

Raw events land in the Supabase `events` table (restaurant_id, type, jsonb payload, created_at). **Server-side:** the Worker logs `scan` on every `/t/<uuid>` hit (slightly undercounted: the 1h `Cache-Control` on that response means same-phone re-opens within the hour don't reach the Worker — accepted). **Client-side:** `lib/analytics.ts` `track()` posts `search` (chip taps + typed queries debounced 1.2s), `select_add`, `call_waiter`, `wifi_open`, `review_click`, `lang` to `POST /api/event` via sendBeacon; it no-ops on the mock restaurant and swallows every error. The endpoint whitelists types (`scan` excluded so clients can't inflate it), validates the UUID, caps payload at 500 bytes. No anon RLS policy on `events` — only the Worker writes/reads it; consumption today = Supabase SQL editor. A Telegram `/stats` command and any dashboard were deliberately deferred (15/07/2026: user chose to drop the Telegram side entirely for now).

## Multilingual menu — IT/EN/DE (built 15/07/2026)

Language auto-detects from `navigator.language` (it→it, de→de, everything else→en), is switchable via the IT/EN/DE pill row (hero top-right + menu header), persists in localStorage (`nfc-menu-lang`), and logs a `lang` event on manual switch. All UI strings live in `i18n/index.tsx` (`ui` record, typed by `UiStrings` — add new strings to all three languages or it won't compile). Dish description + pairing-note translations live in `i18n/menu.i18n.ts`, keyed by bare item id with Italian (`menu.ts`) as fallback — **dish names, the pizza-line category names (Le Pazzesche, Le Speciali, Le Schiacciate) and iconic ingredients (nduja, friarielli, speck…) deliberately stay Italian**, like on a real translated menu. Search matches Italian + current-language descriptions; the suggestion chips are per-language (`ui.suggestions`) and must keep matching the translated descriptions (e.g. DE "Steinpilze" ↔ porcini). German pairing notes are never lowercased mid-sentence (noun capitalization); IT/EN get first-letter lowercasing via `noteInSentence`. If the menu ever moves to Supabase (pipeline below), these translations become columns there.

## Google reviews — 1-tap deep link (built 15/07/2026, flow updated 16/07/2026)

`google_place_id` is set in production (16/07/2026). The "Recensioni" quick action now opens **ReviewsSheet ("Dicono di noi")**: overall Google rating + hand-curated real quotes (`data/reviews.ts` — REAL reviews only, copied verbatim; array currently empty until the owner picks them) + a CTA that opens `https://search.google.com/local/writereview?placeid=…` — Google's own review dialog with the stars immediately in front of the guest (helper: `lib/review.ts` `reviewUrl()`, no Maps fallback — without a Place ID review touchpoints don't render). A separate timed `ReviewSheet` (lib/reviewPrompt.ts: 35min after first scan, or 15min + coffee signal, once per visit, 2h fixed TTL) asks directly at end of meal. `review_click` analytics carry a `source` payload (`quick_action`/`reviews_page`/`timed_sheet`). Find the Place ID with Google's Place ID Finder (comment at the bottom of `supabase_schema.sql`); it's still unset for Notte Dì. **Hard constraints, don't re-litigate:** pre-filling or submitting star ratings from outside Google is not technically possible and not allowed; in-page star filters that only route happy customers to Google ("review gating") violate Google policy and risk penalties to the restaurant's profile — never build that.

## Menu Data Pipeline — current gap, planned fix (deferred 15/07/2026)

**Status update 15/07/2026: the owner decided to drop the Telegram-based update path for now** — neither option below is being built yet, the visual menu stays compiled-in (`menu.ts`). The analysis is kept because the underlying gap is unchanged.

**The Telegram bot and the visual menu are currently disconnected.** Sending a PDF to the bot genuinely works end-to-end (downloads it, uploads to Supabase Storage, updates `restaurants.menu_url` — verified working 12/07/2026 after the secret-key fix above) — but nothing on the frontend reads `menu_url`. The menu the customer actually sees (`DishRow` list, `CategoryTabs`, drink pairings) is 100% static data from `frontend/src/data/menu.ts`, compiled into the JS bundle. Updating `menu_url` today has zero visible effect on the page.

**Planned fix, revised 14/07/2026 after the Menu Photo Policy decision above.** The original version of this plan (12/07/2026) rejected PDF parsing specifically because a PDF has no dish photos — since per-dish photos are now explicitly out of scope (see Menu Photo Policy), that objection no longer applies and PDF parsing is back on the table as the simpler option. Not yet built; two viable approaches, not chosen between:

- **Option A — PDF text parsing.** Owner sends the same whole-menu PDF they already send today (no behavior change for the owner). Worker/LLM extracts category/name/description/price per item — much more tractable now that it only needs to recover text, not decide what to do about missing photos. Drink pairing per item would need to be generated too (rule-based heuristic against the restaurant's actual drink list, same approach used to hand-write the pairings in the current `menu.ts` — see the `verdicchio()`/`cabernet()`/`rossa()` helper pattern there).
- **Option B — structured Telegram messages.** One message per dish (or a batch), text-only, format still to be finalized (e.g. `Nome | Prezzo | Descrizione | Categoria`). More owner effort than sending one PDF, but no parsing ambiguity and no LLM cost.
- Either way: new `menu_items` table in Supabase (mirrors `MenuItem`/`MenuCategory`, no `image` column on items per the photo policy — `pairing` stays as a small structured field: label + note + a reference to one of a small fixed set of generic drink photos, not a per-dish upload). Frontend (`MenuView`/`DishRow`) switches from `import { menu } from '../data/menu'` to fetching from Supabase, same pattern as the existing public anon-key read in `handleNfcLandingPage`.
- Category-level ambiance photos (`CategoryHeader`) can stay curated/hand-picked (there are only ~12 categories) rather than owner-submitted — low effort, no photo-sourcing problem to solve there.

## "Chiama Cameriere" — physical NFC call-button object (frontend button shipped 14/07/2026; industrial design decided 24/07/2026, nothing physically built yet)

The old `tel:` "Chiama" quick action is gone. `QuickActions.tsx` now has a **"Cameriere"** button (CallBell icon): tapping it is meant to light up a physical object sitting on the table. **Today it's optimistic UI only** — on tap it switches to an accent-highlighted "In arrivo" state for 30s, but no request leaves the page; a `TODO` in `CallWaiterButton` marks where the `POST /api/call-waiter` call goes once the Worker endpoint and the object exist. Everything below (endpoint, push mechanism, hardware) is still unbuilt.

**Why this is worth building, not just a gimmick:** today's NFC tag is a sticker — cheap, forgettable, and looks identical to a QR code to most guests. A physical call-button object (a small lamp/bell/totem with the NFC embedded in its base) is an actual product a restaurant proudly puts on every table — visible, tactile, brand-carrying, and not something you can casually replicate. It turns this from "a link behind a tag" into hardware with presence. Given the firmware background here, this is buildable end-to-end in-house, not something to outsource — and it's a much stronger thing to sell than the tag alone.

**Two radios, two jobs — don't conflate them:**
- **NFC in the object** — unchanged from today: passive, one-way, only fires when tapped, opens `/t/<uuid>`.
- **The "light up" trigger** — NFC cannot do this. It has no power source of its own and can't receive a push while nobody's touching it. The object needs its *own* connectivity (Wi-Fi realistically — ESP32/ESP8266-class chip) so it can sit listening for a signal at any time, independent of the NFC tap.

**Sketch of the flow (not designed in detail yet):**
1. Guest scans NFC → lands on `/t/<uuid>` as today (no change).
2. Guest taps "Chiama Cameriere" → frontend calls a new Worker endpoint, e.g. `POST /api/call-waiter` with a restaurant/table identifier.
3. Worker needs to push that event to the physical object in near-real-time. Candidates, not chosen yet:
   - **Supabase Realtime** (already in the stack — free to reach for first) — Worker writes a row/flag, the ESP32 firmware subscribes directly to the Postgres change stream. Least new infrastructure.
   - MQTT broker — more conventional in embedded/IoT circles, but a new moving part to run/host.
   - Dumb polling from the ESP32 (`GET` every few seconds) — worst latency and battery life, but the fastest thing to prototype first.
4. ESP32 receives the signal, drives an LED/NeoPixel inside the object until a waiter acknowledges it (physical reset button, or auto-timeout).

**Decided 24/07/2026 — granularity and power.** One object **per table** (not per restaurant): this is the real product, a v0 per-restaurant shortcut was considered and rejected. Power is an **internal rechargeable LiPo battery**, not a permanent USB-C cable — no wire ever visible on the table; trade-off accepted is a recurring recharge routine for the owner (same pattern many restaurants already run for LED table candles). This means the base needs an access point to reach the battery (see construction below), not just a cable-through hole.

### Industrial design (decided 24/07/2026 — first pass, not yet prototyped)

**Concept:** a slim vertical totem, ~2-piece construction: an opaque/functional **base** (electronics, battery, NFC inlay) with a **transparent PETG shade** that press-fits over it like a cap and glows from an LED strip hidden inside. One physical object per table does both jobs — NFC tap-to-menu *and* the call-waiter light — deliberately unifying the two radios described above into a single product, not two separate devices.

- **Print technique — "vase mode" in clear PETG.** Single continuous spiral wall (no infill, no visible layer seams), printed on a normal FDM printer. **Why:** the print's own spiral ridges diffuse the LED light into a soft, warm glow along the whole wall with zero post-processing (no sanding, no frosting spray, no paint) — and it's the cheapest, fastest technique available on hobbyist FDM hardware. A dome/cupola shape was considered and rejected for the *shade* specifically: a wide dome over a point LED source risks a visible hot spot at the top; a slim vertical column doesn't have this problem because the strip runs the length of it. Flat/wide shapes (disc, puck) were also rejected — vase mode only works well on tall "revolve" forms, a flat wide part would need a completely different edge-lit technique.
  - Base is printed normally (not vase mode) since it needs functional features (battery bay, board mounts, cable/NFC pockets) vase mode can't do — a solid single-wall print can't have internal ribs or a closed compartment.
- **Base/shade connection: friction-fit (Approach A of 3 considered).** Shade presses onto a lip on the base, no screws, lifts straight off to reach the battery for recharging. Chosen over (B) a bayonet twist-lock (more secure against accidental removal, but pricier to get printing tolerances right — worth revisiting in v2 if friction-fit proves too loose/tight in practice) and (C) permanently bonded shade with pogo-pin charging (sleekest, but makes the battery nearly unreplaceable and needs a per-table charging dock — too much engineering for a first unit). **Why A first:** lowest risk, fastest to reprint and re-tolerance across iterations, matches "don't over-engineer the first physical prototype."
- **Electronics:** Seeed XIAO ESP32-C3 (tiny footprint ~2×1.8cm, Wi-Fi, has onboard LiPo charge management — no separate charge-controller module needed) + a short WS2812B addressable LED strip segment inside the shade + a small LiPo battery (~500mAh).
- **LED color/behavior — single warm amber tone, no RGB cycling.** Matches the site's own gold accent (`#9a7b4f`) rather than introducing a new color language. Two states only, both **slow breathing, never a strobe/flash** (explicitly rejected as too attention-grabbing for a restaurant setting): idle = off or barely-perceptible slow dim breath; call active = full warm brightness, slow breathing, until the waiter acknowledges or it times out (mirrors the existing 30s "In arrivo" frontend state in `QuickActions.tsx`).
- **NFC — needs a bigger antenna than a standard sticker.** Field experience (owner feedback) says small ~25mm NFC stickers (the common cheap NTAG213/215 format) are unreliable — guests have to align the phone almost pixel-perfectly, "fa fatica". Spec calls for a **larger-antenna inlay, closer to a payment-terminal's tap area** (~50mm+), positioned in the base on a free edge away from the battery/metal (NFC reads fine through plain plastic, not through batteries or shielding). **Exact antenna placement/size within the base is still open** — genuinely undecided, don't assume a specific spot when this gets prototyped; it depends on the final base footprint.
- **NFC anti-tamper: password-lock the tag itself, not the firmware.** NTAG213/215/216 chips have a built-in 32-bit password-protect feature (set once via an app like NFC Tools when provisioning each tag) that blocks rewriting without the password — deliberately **not** routed through the ESP32 (no dynamic key exchange, no active firmware involvement): the built-in chip password is enough defense against a guest bringing their own NFC writer, and building anything fancier on top would be effort for no real gain here.

### Bill of materials & cost estimate (24/07/2026 — verified against current retail listings, not final quote)

Per-unit component cost, small-batch/retail pricing (i.e. buying single/few units from normal retailers, not wholesale):

| Part | Est. cost | Note |
|---|---|---|
| Seeed XIAO ESP32-C3 | ~€5.50 | Official Seeed single-unit price; drops toward ~€4.50 buying the 3-pack |
| WS2812B LED strip (short segment, ~10-15 LEDs) | ~€2.50 | Priced off a ~€18/m boutique retailer; bulk/AliExpress sourcing is significantly cheaper per meter |
| LiPo battery ~500mAh + protection circuit | ~€4.50 | Wide retail spread ($4-10 single unit); drops with bulk sourcing |
| NFC inlay, large antenna (~50mm) | ~€2.00 ⚠️ | **Unverified** — bulk pricing data was only found for standard small 25mm stickers (~€0.20/unit); large-antenna format isn't commonly stocked off-the-shelf, likely needs a semi-custom order. Confirm with a specific supplier before quoting a customer. |
| PETG (clear, shade) + PLA/PETG (opaque, base) filament | ~€1.00 | ~30-50g total per unit at ~€20-25/kg clear PETG |
| Misc (JST connector, wiring, screws/adhesive, heat shrink) | ~€1.50 | |
| **Total, small-batch retail** | **~€17** | |
| **Total, estimated at bulk (10+ units, direct sourcing)** | **~€11-13** | Electronics and LED strip both drop meaningfully in bulk; the NFC line item is the biggest remaining unknown |

Not in the table above but real: **print time** (~2.5-3h per unit across both parts on a home FDM printer — electricity cost is negligible, a few cents, but it caps how many units can be produced per day per printer) and **assembly labor** (~15-20 min hands-on per unit: solder LED strip leads, wire battery JST, seat the NFC inlay, press-fit the shade) — both are the owner's own time, not cash cost, but worth pricing in if this becomes a real per-restaurant product rather than a one-off prototype.

**Suggested price to propose to restaurants/bars: ~€39-49 per table, one-time hardware fee.** Reasoning: all-in cost (parts + a modest valuation of assembly labor/print time) lands around €20-21/unit at small-batch pricing, so €39-49 is roughly a 2x markup — covers labor, a reasonable margin, and a buffer for the unverified NFC line item, while staying well under typical commercial wireless "call waiter" button systems (which generally run in a similar or higher per-unit range and don't include an integrated NFC menu link at all). At bulk order sizes (a restaurant with many tables, buying components in one batch) the underlying cost drops toward ~€13-15/unit, which either widens the margin at the same price or supports a per-table discount for larger deployments — worth deciding once the first real prototype's build time is measured, this isn't a final quote.

**Status: design only, nothing physically built yet.** Frontend button UI shipped 14/07/2026 (still optimistic-only, see above); the object described in this section has a first-pass industrial design but no prototype has been printed, no firmware written for it, and the push-mechanism choice (Supabase Realtime vs MQTT vs polling, see flow sketch above) is still undecided. Per-table granularity and battery power are the only previously-open questions now resolved.

## Common Development Tasks

**Testing locally:** Run `npm run dev` from `nfc-smart-backend/`, then test routes:
- `http://localhost:8787/` — Default message
- `http://localhost:8787/t/<test-uuid>` — Landing page (need test record in local/dev Supabase)
- Telegram webhook testing requires ngrok or deployed endpoint

**Adding a new Worker endpoint:** Edit the fetch handler in `src/index.ts` to add a new `if` branch checking `url.pathname`.

**Frontend changes:** Work inside `frontend/src/`, run `npm run dev` there for hot reload against mock data, then `npm run build` (or `npm run deploy` from the repo root, which builds first) to ship.

**Database changes:** Edit `supabase_schema.sql` and re-run the schema in Supabase SQL Editor. RLS policies allow anonymous reads of `restaurants` and the `menus` bucket; writes to either are intentionally not exposed to the anon role (see "Secrets Management" above) — the Worker writes using `SUPABASE_SECRET_KEY`, which bypasses RLS.

## Notes

- This is a **serverless architecture** — no server to manage, scales automatically, billed per request.
- The landing page is **generated dynamically** — the Worker queries Supabase and injects fresh data on every request; no pre-built static pages per restaurant.
- **File storage** (menus) is in Supabase public bucket, accessible via public URLs after upload.
- **Telegram bot** integration uses webhooks (not polling), so the Worker must be publicly deployed for Telegram to reach it.
- No authentication on restaurant endpoints — all reads are public. In production, consider RLS column policies if you need per-restaurant access control.
