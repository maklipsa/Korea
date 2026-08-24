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
| `packing.md` | Packing list (adults + kids), in Polish. Source of the site's **Pakowanie** tab — each `##` becomes one section, every `- [ ]` a tickable item. |
| *(trip-planner plugin)* | The taste/planning tooling lives in the **`trip-planner`** Claude Code plugin (marketplace `trip-tools`, checked out at **`~/.claude/plugins/marketplaces/trip-tools/`** — skills live under `plugins/trip-planner/skills/<name>/SKILL.md`. It is its own git repo, **github.com/maklipsa/trip-planner**, branch **`master`** not `main`, and it has **no git identity configured** — set `user.name`/`user.email` locally before committing. ⚠️ An earlier note in this file gave `c:\src\trip-planner`; that path does not exist), not in this repo: skills `find-places`, `add-place`, `split-into-days`, plus the rules skills **`priorities`** (priority ladder + 1–5 ★ rubric) and **`day-planning`** (day-shape & clustering). Enable via `.claude/settings.local.json`. |
| `gmaps_saver.py` / `maps_automator.py` / `markdown_parser.py` | Maps saver: CLI / Playwright automation / Markdown→`Place` parser. |
| `generate_site_data.py` | Generates `docs/data.js` **and `docs/data.json`** from the Markdown (stdlib only) — one payload, two artifacts. |
| `generate_brief.py` | Generates **`docs/brief.txt`** — the shareable slice: **today + every remaining day, nothing else** (no packing/dmz/cards/passes/places). ~10× smaller than `data.json` and shrinking daily, so other people's AI tools can read it whole. Day content is copied **verbatim** from `days/*.md`. ⚠️ It's a **date-keyed snapshot** — see the workflow note below. |
| `docs/` | Static Pages site: `index.html`, `app.js`, `data.js` + `data.json` + `brief.txt` (all generated), `style.css`, `firebase-config.js`. |
| `.github/workflows/` | `regen-data.yml` (regen + commit generated files on push), `deploy-pages.yml` (regen + deploy all of `docs/` to Pages), `refresh-brief.yml` (**daily cron** for `brief.txt`). |

## Content conventions — follow exactly

**Maps links must use the search-URL format** — both the Python parser and `docs/app.js` (`buildGoogleMapsPinsUrl`) depend on it:

```markdown
- [Place Name](https://www.google.com/maps/search/Place+Name+City) — short description
```

`markdown_parser.py` only recognizes `- [text](http…)` items and extracts the query from `/maps/search/<query>`. Don't switch to `place/` or `@lat,lng` URLs without updating `_extract_search_query`, or entries are silently skipped.

**Importance rating prefix** — each real place carries a **1–5 ★ importance rating** inside the link text, before the emoji type-tags: `- [★★★★☆ 🏛️ Place Name](url) — description`. Keep a place's stars + emoji **identical** across `places.md` and any `days/*.md`. The rating rubric and the priority ladder (what to hunt vs. skip) are canonical in the **`priorities`** skill (trip-planner plugin); the emoji type-tag key is canonical at the top of `places.md`. Don't rate generic dish bullets or "Must-Try Dishes" checklists.

**Personal wish-list markers — 🐞 Jadzia, 🦐 Olaf, 🦑 Szymon, 👶 Piotr.** These are **personal markers, not type-tags**: they mean *this person asked for this place themselves*. The kids' come from their WhatsApp replies to the daily `brief.txt` (Jadzia: „Zależy mi” / „JA BARDZO BARDZO CHCĘ”; Olaf: his own sent list). They go **last in the emoji group**, after the type/extra tags, in the fixed order 🐞 → 🦐 → 🦑 → 👶 — a place can carry several: `- [★★★☆☆ 🎁🧒🐞🦐🦑 Donguri Republic](url)` has all three. Like every other tag they must stay **identical across `places.md` and every `days/*.md`** row for that place. They are orthogonal to both the ★ planning importance and the 1–6 verdict and never change either — a marked place keeps whatever stars it earned on the merits.

⚠️ **Do NOT drop a marked place when rescheduling.** When a day is overloaded, a variant gets rewritten, or a leg gets re-planned, take the cuts from stops **without** a personal marker. Moving a marked place to another day is fine (keep the `➡️ Przeniesione z <date>` label); silently removing it from the trip is not. If a marked place genuinely cannot survive (closed, unreachable, day impossible), say so explicitly and offer a replacement — don't just delete the row.

⚠️ **When adding markers, grep the whole file for `⏭️` collisions and report every one** — a marker landing on an already-cancelled stop is the thing most likely to be missed. Two live cases, both Olaf, both paid viewpoints killed by the same N-Seoul-Tower-2/6 reasoning, and both left for the family to decide rather than resolved by the planner: the **Taipei 101 observatory** (flagged in `places.md` + `days/aug-26`) and the **Miramar ferris wheel** (flagged in `days/aug-25`). Marking the catalog entry is not enough — the ⏭️ decision row is a *separate* line and needs the flag too.

⚠️ **Disambiguate before marking.** Name collisions bite: `National Palace Museum` (Taipei, ★★★★★, 🦑) is a different place from `National Palace Museum of Korea` (Seoul, ★★★★☆, already seen 4/6) and from `National Palace Museum Southern Branch` (Chiayi, ★★★★☆) — neither of those is marked. Match on the **full link text incl. stars**, not a substring of the name.

Current sets — 🐞 **Jadzia (13, Tajwan, Dni 13–19):** Thermal Valley, Spring City Resort, Beitou Public Library, Jiufen Old Street, Yehliu Geopark, National Taiwan Science Education Center, Donguri Republic, Taiwan Design Museum, NTMoFA, National Museum of Natural Science, Tainan Art Museum, Pier-2 Art Center, KMFA. 🦐 **Olaf (12, Tajpej + Dzień 14):** Modern Toilet Restaurant, Snow King Ice Cream, Beitou Public Library, wypuszczanie lampionów (Shifen), National Taiwan Science Education Center, Taipei Astronomical Museum, Taipei 101 (taras — konflikt), Taipei Zoo, Maokong Gondola, Donguri Republic, Pokémon Center Taipei, Miramar Entertainment Park (diabelski młyn — konflikt). 🦑 **Szymon (10, muzea i galerie):** NCPI, TFAM, Beitou Museum, National Palace Museum (Taipei), Donguri Republic, Taiwan Design Museum, NTMoFA, Tainan Art Museum, Pier-2 Art Center, KMFA. 👶 **Piotr (4):** Yehliu Geopark, Shifen Waterfall, Taipei Astronomical Museum, Fort San Domingo (Tamsui). The key is canonical at the top of `places.md`; the site legend group is `Znaczniki osobiste` in `LEGEND_GROUPS` (`docs/app.js`).

**Trip-diary markers (seen / skipped)** — once the trip is under way, a visited place gets a verdict marker appended to its description; the 1–5 ★ prefix stays untouched (it's the *planning importance*, a separate axis from the after-the-fact verdict).

**⚠️ Two different scales — do not conflate them.** The ★ prefix is **1–5** and measures *planning importance*. The verdict is **1–6** and measures *how it actually was*, with **6 reserved for extraordinary** — something that broke the scale. Only one 6 has been awarded (Photo SeMA / "We Are Martin Parr", 16 sie). The scale was widened from 1–5 to 1–6 on 16 sie; existing verdicts kept their numerator (a 5 stayed a 5, it was not promoted), so 6 is genuinely a new top tier rather than a renaming of the old one.

```markdown
… description ✅ **Widziane: Dzień 1 (11 sie) — 4/6** 📅 **Dzień 1 (11 sie)**
… description ⏭️ **Pominięte: Dzień 1 (11 sie)** 📅 **Dzień 1 (11 sie)**
… description 🚫 **ZAMKNIĘTE: Dzień 4 (14 sie)** 📅 **Dzień 4 (14 sie)**
```

**Three outcome states, not two.** `✅ Widziane` = went, with a 1–5 verdict. `⏭️ Pominięte` = chose not to go. `🚫 ZAMKNIĘTE` = wanted to, but the place was shut — record it separately, because it says something about the *source data* rather than about us, and it should trigger a correction to that place's opening hours. HOMA on 14 sie is the worked example: listed Wed–Sat, shut on a Friday in August because of the university vacation break.

**Moves: once a move lands, delete the trace from the source day.** A `➡️ PRZENIESIONE na …` row is scaffolding for the decision, not a record to keep. As soon as the place is scheduled on its new day, **remove the row from the source day's `## Schedule` and remove the corresponding sentence from that day's notes block.** The destination day's row keeps its `➡️ Przeniesione z <date>` label — that one explains why it's there. Skips are different: `⏭️ Pominięte` rows stay, because a skip has no other home and the record is the point. Rationale: leftover move-rows go stale silently — the Aug 13 ghosts still pointed at 18 sie long after the pair had been re-homed to 14 sie, and nothing flags that.

⚠️ **The marker must come BEFORE the ` 📅 …` day marker.** `annotate_places.py` strips everything from the 📅 sentinel to end-of-line (`MARKER_RE`), so anything placed after it is destroyed on the next `--write`. In `days/*.md` the day is implicit, so the short form `✅ **Widziane — 4/6.**` / `⏭️ **Pominięte.**` goes at the **front of the Activity cell**; use the explicit `Widziane już w Dzień N (NN sie)` form when a place was seen on a *different* day than the one whose file it sits in. Record off-plan stops in the day's notes paragraph (between H1 and `## Route Map`) — that text lands in the site's day `notes` and is indexed by `annotate_places.py` as a Day-N visit, but is **not** picked up by `buildGoogleMapsPinsUrl` (schedule-only), so the route link stays intact.

**`places.md` headings** drive the parser's section label: `##` = region/city (e.g. `KOREA — SEOUL`), `###` = day combo/district. `####` (Kawiarnie, Jedzenie, …) is informational, not parsed. The `KOREA — ` / `TAIWAN — ` prefixes stay in English — `_place_nav` strips them to build the nav chip.

**Language: the content is Polish, the parser keys are English.** All prose, descriptions, schedule cells, headings and site UI are in **Polish**; place names, dish names, station/line names and pass names stay in their original romanized form (Seoul, Busan, Taipei, Taichung, Tainan, Kaohsiung — not Seul/Tajpej), because the Maps search URLs and link texts depend on them. Country names are Polish in prose (Korea, Tajwan). These strings are **load-bearing keys — keep them exactly as-is in English**:

| Where | Key |
|-------|-----|
| `days/*.md` | `# Aug NN (Day) — `, `## Route Map`, `## Schedule`, `## Also Nearby`, `| Time | Activity | Price |`, `> Badges:` + the `pass:` / `closed:` / `holiday:` type names, the word `Naver` in the route link label |
| `itinerary.md` | `## KOREA`, `## TAIWAN` (country detection); the checklist H2 must contain `PRZED WYJAZDEM` |
| `passes.md` | H2s `## Karty miejskie` / `## Karty transportowe`; line prefixes `Kup:`, `**Aktywacja:`, `**Wartość`/`**Uwaga`/`**Razem`; the ` — ` between pass name and price |
| `places.md` | `KOREA — ` / `TAIWAN — ` heading prefixes; the ` 📅 …` day markers (generated by `annotate_places.py`) |

`generate_site_data.py` accepts both the Polish and the old English variants of the passes/checklist keys, so an English heading won't crash — it will just silently drop that section. `_NAV_OVERRIDES` maps two Polish region headings to short nav chips.

**Day files (`days/*.md`)** — `generate_site_data.py` parses this structure, so match it:
1. `# Aug NN (Day) — TITLE` — the `— TITLE` becomes the site day title (smart-cased, acronyms preserved).
2. Optional `> Badges: type:text; type:text` right after H1. `type` ∈ `pass`, `closed`, `holiday` — English type names, Polish text (e.g. `> Badges: pass:Aktywuj Busan Pass 24 h; closed:Muzea zamknięte w pon.`).
3. Prose between H1 and first section = day `notes`.
4. `## Route Map` — parser picks up the **Naver** link (its label must keep the word "Naver"; the emitted label is "Trasa w Naver Map"). Google Maps link optional; site regenerates all-pins directions at runtime.
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

**Markdown is the single source of truth.** `docs/data.js` holds the `DAYS`, `CHECKLIST`, `PASSES`, `PACKING`, `CARDS`, `PLACES`, `DMZ` globals and is **generated — never hand-edit it.** After editing any Markdown, regenerate:

```bash
python generate_site_data.py    # rewrites docs/data.js AND docs/data.json
```

The workflows keep both files in sync on push, but run it locally anyway so previews and the committed diff stay current.

**Two artifacts, one payload.** `main()` builds a single `payload` dict and writes it twice, so the files cannot drift:

| File | Format | Who reads it |
|------|--------|--------------|
| `docs/data.js` | `const DAYS = …;` globals + `<script>` tag | **The site.** `app.js` reads the globals synchronously, and `fetch()` is CORS-blocked on `file://` — so this is what keeps `docs/index.html` openable straight from disk. **Don't convert the site to fetch `data.json`** without also accepting the loss of file:// preview and making `app.js` init async. |
| `docs/data.json` | plain JSON, same keys | **Everything that isn't the site** — AI tools, scripts, other trip members. Served publicly alongside the site, so it needs no auth. |

### `docs/brief.txt` — two gotchas worth knowing

**1. The `.txt` extension is deliberate — do not "fix" it to `.md`.** GitHub Pages derives `Content-Type` from the file extension and offers no override (no `_headers` support); Cloudflare, which fronts the site, just passes it through. `.md` is served as `text/markdown; charset=utf-8`, `.txt` as `text/plain; charset=utf-8` — the latter is what we want for a file handed to other people's tools. The body is still Markdown.

**2. It goes stale at midnight even when no Markdown changed**, because it keys off "today". Three workflows keep it honest, and all three pin `TZ: Asia/Taipei`:

| Trigger | Why |
|---|---|
| `refresh-brief.yml` (cron 16:10 UTC = 00:10 Taipei) | catches the date rollover; a push-triggered job never can |
| `regen-data.yml` (content push) | content edits land in the brief immediately |
| `deploy-pages.yml` (every deploy) | regenerated-not-committed, so the deployed copy is right for today |

⚠️ **`TZ: Asia/Taipei`, not `Asia/Seoul`, is a correctness choice.** Taipei (UTC+8) runs *behind* Seoul (UTC+9). Erring "behind" keeps one already-finished day in the file for an extra hour; erring "ahead" would **drop the day you are currently living through**. Only one direction is harmless.

⚠️ **A `GITHUB_TOKEN` push does not trigger other workflows**, so the cron's commit would never reach Pages on its own — `refresh-brief.yml` therefore ends by dispatching `deploy-pages.yml` explicitly (needs `actions: write`). Any future workflow that commits generated files has the same trap.

⚠️ Adding a new top-level Markdown source means touching **three** places: a `build_*` + `payload` entry in `generate_site_data.py`, the `paths:` trigger list in `regen-data.yml` (otherwise a content edit ships stale data), and — if it gets its own tab — `FIXED_TABS` + a render branch in `app.js` plus a `data-tab` button in `index.html`. `dmz.md` is the worked example. *(`car.md` was the previous example — deleted 24 sie together with its tab, `build_car`, the `CAR` payload key, the summary-line counter and the `regen-data.yml` trigger. Git has the wiring pattern if it's ever needed again.)*

Hand-written HTML in `app.js` (**not** generated, edit directly, and it is in **Polish**): the weather/strategy grid + Closed-Day rule tables + "Optional Swaps" cards on the Packing tab, eSIM/transit notes in `renderPasses`, the emoji legend (`LEGEND_GROUPS`). Tab labels live in `index.html` — translate the label, never the `data-tab` id.

**Packing tab:** the list itself is **generated from `packing.md`** into `PACKING` — edit the Markdown, not `renderPacking()`. Every `- [ ]` becomes a tickable row; ticks are stored per-device in `localStorage` (`trip-packing`), keyed by a hash of the item text, so reordering `packing.md` keeps the ticks and only rewording an item resets that one. Deliberately **not** Firebase-synced — each traveller packs their own bag. `- [x]` in `packing.md` = ticked by default (still un-tickable, unlike the booking checklist).

`firebase-config.js` = optional Realtime Database sync for the checklist; empty falls back to `localStorage`. No real secrets.

**Checklist "done" state:** a booking-checklist item marked `- [x]` in `itinerary.md` is treated as **permanently done** — the site force-checks it and locks it (can't be un-ticked), independent of the per-user Firebase/`localStorage` toggle state. Use `- [x]` only for things truly booked; leave `- [ ]` for anything travelers should still tick off themselves.

## Working style

- **Overpack every day.** This family moves fast and would rather skip a stop on the spot than under-plan and miss out. Build each day to ~1.5–2× what a typical visitor does; keep the extra stops in and mark the lowest-priority ones as the natural things to drop if a day runs long. Do NOT thin days down to a "normal" pace — flag tight timing and name what to cut, but leave the density in.
- **Personally-marked places survive every replan.** A place tagged 🐞 (Jadzia), 🦐 (Olaf), 🦑 (Szymon) or 👶 (Piotr) is that person's own request — when trimming or re-planning a day, cut from the unmarked stops first. Reschedule a marked place, never delete it; if it truly can't fit, flag it out loud instead of dropping it quietly. See the personal-marker convention above.
- **Museums AND galleries are top priority — 4–7 a day is normal.** This family routinely visits four to seven museums/galleries in a single day and would rather add one than cut one. Never drop or downgrade one for "too many museums" / "no time for a third" reasons — schedule every worthwhile one (a third or fourth in an afternoon is fine), flag tight closing/last-entry times so they move briskly, and let them pace on the day. **Galleries count as much as museums, and modern/contemporary-art museums and fine-art photography museums rank highest of all** (e.g. D Museum, TFAM, MoCA, Kukje/leading contemporary galleries; for photography specifically **Museum Hanmi** and **Photography Seoul Museum of Art / Photo SeMA** in Seoul, **GoEun Museum of Photography** in Busan, **National Center of Photography and Images** in Taipei) — actively seek these out and weight them above general sightseeing.
- **Culture is the main goal — NOT Instagram.** A "photo gallery" means a gallery of *photographs* (photography as an art form), never a photo-op backdrop. Gimmicky selfie/"fun" attractions — trick-eye / trick-art museums, selfie museums, optical-illusion & AR photo-op spots (e.g. Trickeye, Alive Museum) — are **not culture and never count as a museum/gallery.** Don't schedule them as priority stops or as a substitute for a real museum; at most keep one as a minor kids' optional, clearly labeled as a selfie spot. When in doubt, pick the genuine cultural venue.
- **Concentrate on the locally distinctive — skip what you can also see at home.** A stop only earns its slot if it's distinctively Korean/Taiwanese; down-weight anything the family could just as easily do in Poland/Europe (petting-zoo animal parks, generic theme villages like Petite France, chain attractions, imported-concept spots). When in Korea/Taiwan, spend the time on things you *can't* get at home. Pairs with the culture-not-Instagram rule above.
- Prefer editing Markdown over code. Times, prices, and closed-day rules are load-bearing — preserve them.
- After editing `itinerary.md`, `passes.md`, `packing.md`, `places.md`, `dmz.md`, `cards/*.md`, or any `days/*.md`, run `python generate_site_data.py`.
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
