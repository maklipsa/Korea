# CLAUDE.md

## What this is

Personal family trip planner for a **Korea + Taiwan trip, Aug 11–29, 2026** (Seoul, Busan, Taipei, Taichung, Tainan, Kaohsiung; ~25k steps/day, kids 9+). It's **content, not an app** — Markdown is the source of truth. No tests, no build, no package manager. Two bits of tooling sit on top:

1. A **Python CLI** that bulk-saves places from Markdown into a Google Maps list (browser automation).
2. A **static web app** (`docs/`) deployed to GitHub Pages.

## Repository layout

| Path | Purpose |
|------|---------|
| `itinerary.md` | Master index: booking checklist, day table linking to `days/`, closed-day rules, weather/packing, swaps. **Start here.** |
| `days/aug-NN-*.md` | One file per day (19 days, `aug-11` … `aug-29`). |
| `passes.md` | City/transport/transit passes, transit cards, eSIM/connectivity. |
| `places.md` | Master place catalog (region → district → category). Parsed by the Python tool. |
| `gmaps_saver.py` / `maps_automator.py` / `markdown_parser.py` | Maps saver: CLI / Playwright automation / Markdown→`Place` parser. |
| `generate_site_data.py` | Generates `docs/data.js` from the Markdown (stdlib only). |
| `docs/` | Static Pages site: `index.html`, `app.js`, `data.js` (generated), `style.css`, `firebase-config.js`. |
| `.github/workflows/` | `regen-data.yml` (regen + commit `data.js` on push) and `deploy-pages.yml` (regen + deploy to Pages). |

## Content conventions — follow exactly

**Maps links must use the search-URL format** — both the Python parser and `docs/app.js` (`buildGoogleMapsPinsUrl`) depend on it:

```markdown
- [Place Name](https://www.google.com/maps/search/Place+Name+City) — short description
```

`markdown_parser.py` only recognizes `- [text](http…)` items and extracts the query from `/maps/search/<query>`. Don't switch to `place/` or `@lat,lng` URLs without updating `_extract_search_query`, or entries are silently skipped.

**`places.md` headings** drive the parser's section label: `##` = region/city (e.g. `KOREA — SEOUL`), `###` = day combo/district. `####` (Cafes, Food, …) is informational, not parsed.

**Day files (`days/*.md`)** — `generate_site_data.py` parses this structure, so match it:
1. `# Aug NN (Day) — TITLE` — the `— TITLE` becomes the site day title (smart-cased, acronyms preserved).
2. Optional `> Badges: type:text; type:text` right after H1. `type` ∈ `pass`, `closed`, `holiday` (e.g. `> Badges: pass:Activate Busan Pass 24h; closed:Museums closed Mon`).
3. Prose between H1 and first section = day `notes`.
4. `## Route Map` — parser picks up the **Naver** link (label "Naver Map route"). Google Maps link optional; site regenerates all-pins directions at runtime.
5. `## Schedule` — `| Time | Activity | Price |` table; activity cells embed the search links (parser tolerates missing columns/sections, e.g. `aug-29`).
6. `## Also Nearby` — extras grouped under `###`.

`date`, `summary`, `country` come from the day tables in `itinerary.md` (matched by filename), **not** the day file — a new day must be added to both `itinerary.md` and a `days/*.md`.

## Google Maps saver (Python)

```bash
pip install -r requirements.txt && playwright install chromium
python gmaps_saver.py places.md --list-name "Korea 2026" --dry-run   # preview first
python gmaps_saver.py places.md --list-name "Korea 2026"
```

- Non-headless Chromium, persistent profile in `./browser_data/` (gitignored). First run: log into Google in the window, then press Enter.
- Flags: `--section "Busan"` (filter), `--start-from N` (resume), `--slow-mo MS`, `--browser-data-dir DIR`.
- Writes `error_*.png` on failure. Depends on Google Maps DOM/aria selectors — brittle to UI changes; if saving fails, check selectors in `maps_automator.py`.

## Web app (`docs/`)

Vanilla-JS SPA, no framework/bundler. Open `docs/index.html` directly to preview; push to `main` to deploy.

**Markdown is the single source of truth.** `docs/data.js` holds the `DAYS`, `CHECKLIST`, `PASSES` globals and is **generated — never hand-edit it.** After editing any Markdown, regenerate:

```bash
python generate_site_data.py    # rewrites docs/data.js
```

The workflows keep `data.js` in sync on push, but run it locally anyway so previews and the committed diff stay current.

Hand-written HTML in `app.js` (**not** generated, edit directly): Packing tab, Closed-Day rule tables, eSIM/transit notes in `renderPasses`, "Optional Swaps" cards.

`firebase-config.js` = optional Realtime Database sync for the checklist; empty falls back to `localStorage`. No real secrets.

## Working style

- **Overpack every day.** This family moves fast and would rather skip a stop on the spot than under-plan and miss out. Build each day to ~1.5–2× what a typical visitor does; keep the extra stops in and mark the lowest-priority ones as the natural things to drop if a day runs long. Do NOT thin days down to a "normal" pace — flag tight timing and name what to cut, but leave the density in.
- Prefer editing Markdown over code. Times, prices, and closed-day rules are load-bearing — preserve them.
- After editing `itinerary.md`, `passes.md`, or any `days/*.md`, run `python generate_site_data.py`.
- Keep surfaces consistent: `itinerary.md` (index + rules + summaries), `days/*.md` (detail), `places.md` (catalog).
- Prices in local currency (KRW / NT$); dates absolute (Aug 2026).


# Stałe informacje:
- Przylot do Seoul: 9:25
- Wylot z Taipei: 19:25 
- Przelot Pusan do Taipei: 9:00 do 10:30 (w Taipei) 


# Skład rodziny (6 osób, 2 grupy):
- **Grupa 1:** 1 osoba dorosła + 2 dzieci (11 i 9 lat)
- **Grupa 2:** 2 osoby dorosłe + 1 dziecko (15 lat)
- **Razem:** 3 dorosłych + 3 dzieci (9, 11, 15 lat)
- Uwaga do biletów: ceny licz według progu wiekowego danej atrakcji, nie ryczałtem "dziecko". Np. National Palace Museum w Tajpej — wstęp wolny do 18 lat (wszystkie 3 dzieci za darmo); 15-latek bywa liczony jako uczeń/dorosły, a 9- i 11-latek zwykle jako dziecko; w Korei częsty podział child (~3–12) vs youth (~13–18).


# Noclegi:
- Seoul: DDP 중구 퇴계로66길 17-6 1, 04614 Seul, Korea Południowa
- Busan: TBD (nie ustalone — transfery liczone approx., zakładając Haeundae)
- Taipei: TBD (nie ustalone — plany zakładają pobyt centralnie)
