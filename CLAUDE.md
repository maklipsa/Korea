# CLAUDE.md

Guidance for working in this repo.

## What this is

A personal, family trip planner for a **Korea + Taiwan trip, Aug 11–29, 2026** (Seoul, Busan, Taipei, Taichung, Tainan, Kaohsiung; active pace ~25k steps/day, traveling with kids 9+). It is **content, not an application** — the source of truth is a set of Markdown documents. On top of that content sit two small pieces of tooling:

1. A **Python CLI** that bulk-saves places from a Markdown file into a Google Maps list (browser automation).
2. A **static web app** (`docs/`) that presents the itinerary, deployed to GitHub Pages.

There is no test suite, no build step, and no package manager. Most work here is editing Markdown prose and tables.

## Repository layout

| Path | Purpose |
|------|---------|
| `itinerary.md` | Master index: booking checklist, day-by-day table linking to `days/`, closed-day rules, weather/packing, optional swaps. Start here. |
| `days/aug-NN-*.md` | One file per day (19 days, `aug-11` … `aug-29`). |
| `passes.md` | City passes, transport passes, transit cards, eSIM/connectivity. |
| `places.md` | Master catalog of every place, grouped by region → district → category. This is the file the Python tool parses. |
| `gmaps_saver.py` | CLI entry point for the Google Maps saver. |
| `maps_automator.py` | Playwright automation that drives Google Maps to save each place. |
| `markdown_parser.py` | Parses a Markdown file into `Place` objects. |
| `generate_site_data.py` | Generates `docs/data.js` from the Markdown (stdlib only). |
| `requirements.txt` | Python deps (`playwright`). |
| `docs/` | Static GitHub Pages site (`index.html`, `app.js`, `data.js` (generated), `style.css`, `firebase-config.js`). |
| `.github/workflows/regen-data.yml` | On push to `main` that changes the itinerary Markdown or the generator, regenerates `docs/data.js` and commits it back. |
| `.github/workflows/deploy-pages.yml` | Regenerates `data.js`, then deploys `docs/` to GitHub Pages on push to `main`. |

## Content conventions — follow these exactly

**Google Maps place links use the search-URL format** and the Python parser depends on it:

```markdown
- [Place Name](https://www.google.com/maps/search/Place+Name+City) — short description
```

- `markdown_parser.py` only recognizes list items matching `- [text](http…)`. It extracts the query from the `/maps/search/<query>` path segment. **Do not change this link format** (e.g. to `place/` or `@lat,lng` URLs) without updating `_extract_search_query` in `markdown_parser.py`, or the tool silently skips those entries.
- `docs/app.js` (`buildGoogleMapsPinsUrl`) also scrapes these `/maps/search/` URLs to build multi-stop directions, so the format matters there too.

**Heading hierarchy in `places.md`** drives the parser's `section` label (`## H2 > ### H3`):
- `##` = region/city (e.g. `KOREA — SEOUL`)
- `###` = day combo / district
- `####` = category (Cafes, Food, Kid-Friendly, …) — informational, not parsed into section

**Day files (`days/*.md`)** follow a consistent structure — match it when adding or editing days, because `generate_site_data.py` parses it:
1. `# Aug NN (Day) — TITLE` heading. The `— TITLE` part (ALL CAPS is fine) becomes the site's day title, smart-cased with acronyms preserved.
2. Optional `> Badges: type:text; type:text` line immediately after the H1. `type` is one of `pass`, `closed`, `holiday` (e.g. `> Badges: pass:Activate Busan Pass 24h; closed:Museums closed Mon`). These render as the coloured badges on the day card.
3. Prose between the H1 and the first section becomes the day's `notes`.
4. `## Route Map` — the parser picks up the **Naver** directions link (label "Naver Map route"). The Google Maps directions link is optional; the site regenerates all-pins directions at runtime from the schedule.
5. `## Schedule` — a `| Time | Activity | Price |` table; activity cells embed the Google Maps search links. (`aug-29` uses a shorter 2-column table; the parser tolerates missing columns/sections.)
6. `## Also Nearby` — extras grouped under `###` by area/theme.

`date`, `summary`, and `country` for each day come from the day tables in `itinerary.md` (matched by filename), **not** from the day file — so a new day must be added to both the itinerary table and a `days/*.md` file.

## The Google Maps saver (Python)

Setup:
```bash
pip install -r requirements.txt
playwright install chromium
```

Run (dry run first to preview what will be parsed):
```bash
python gmaps_saver.py places.md --list-name "Korea 2026" --dry-run
python gmaps_saver.py places.md --list-name "Korea 2026"
```

Notes:
- Opens a **non-headless** Chromium with a persistent profile in `./browser_data/` (gitignored). First run requires manually logging into Google in the window, then pressing Enter in the terminal.
- Useful flags: `--section "Busan"` (filter by section substring), `--start-from N` (resume after a failure), `--slow-mo MS`, `--browser-data-dir DIR`.
- On errors it writes `error_*.png` screenshots (gitignored). Results are summarized by status (`SUCCESS`, `ALREADY_SAVED`, `NOT_FOUND`, `SAVE_FAILED`, `ERROR`).
- The automation depends on Google Maps DOM/aria selectors, so it is inherently brittle to Google UI changes — if saving fails, check the selectors in `maps_automator.py`.

## The web app (`docs/`)

Plain vanilla-JS single-page app, no framework or bundler. Open `docs/index.html` directly in a browser to preview; push to `main` to deploy via GitHub Pages.

**The Markdown is the single source of truth for the site's content.** `docs/data.js` holds the `DAYS`, `CHECKLIST`, and `PASSES` globals that `app.js` renders, and it is **generated** — do not hand-edit it.

After changing any itinerary Markdown (`itinerary.md`, `passes.md`, or a `days/*.md`), regenerate `data.js`:

```bash
python generate_site_data.py    # rewrites docs/data.js
```

`index.html` loads `data.js` before `app.js`. Two GitHub Actions workflows keep things in sync on push to `main`, so drift is impossible even if you forget to run the script:
- **`regen-data.yml`** regenerates `docs/data.js` and commits it back to the repo when the Markdown or generator changes.
- **`deploy-pages.yml`** regenerates `data.js` and deploys `docs/` to GitHub Pages.

Running the script locally is still the norm — it lets you preview (`docs/index.html` opens straight from disk) and keeps the committed `data.js` current so the diff is meaningful.

`app.js` still contains hand-written presentational HTML that is **not** generated: the Packing tab, the Closed-Day rule tables, the eSIM/transit notes in `renderPasses`, and the "Optional Swaps" cards. Edit those in `app.js` directly.

`firebase-config.js` is an optional Realtime Database config for syncing the packing/booking checklist across devices; left empty, the checklist falls back to `localStorage`. Do not commit real secrets here.

## Working style for this repo

- Prefer editing Markdown over touching code. Keep prose concise and factual; times, prices, and closed-day rules are load-bearing — preserve them.
- After editing `itinerary.md`, `passes.md`, or any `days/*.md`, run `python generate_site_data.py` to refresh `docs/data.js`.
- Keep the cross-referencing surfaces consistent: `itinerary.md` (index + rules + day summaries), `days/*.md` (detail), `places.md` (catalog). The site (`docs/`) derives from the first two automatically.
- Prices are given in local currency (KRW / NT$); dates are absolute (the trip is Aug 2026).
