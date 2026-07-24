---
name: add-place
description: How to add a new place (restaurant, café, museum/gallery, palace, market, viewpoint, activity, etc.) to the Korea/Taiwan trip planner. Use whenever the user wants to add/insert a place, spot, venue, or stop — covers the correct places.md entry format, the 1–5 star importance rating, the classifying emoji tags, and how to slot it into a day. Triggers: "add a place", "add this restaurant/museum/café", "found a new spot", "put X in the plan".
---

# Adding a new place

Markdown is the source of truth. Adding a place is four steps: **(1) catalog it in `places.md`, (2) rate it, (3) tag it with emoji, (4) assign it to a day** — then regenerate `docs/data.js`.

Do all of this by editing Markdown. Never hand-edit `docs/data.js`.

## The one line format (memorize this)

Every place is a bullet whose **link text** carries, in order: `★ rating` → `emoji tags` → `name`. The URL is a Google Maps **search** URL. After the em-dash comes a short description, then an optional 📅 day annotation.

```markdown
- [★★★★☆ 🏛️🎨 Place Name](https://www.google.com/maps/search/Place+Name+City) — short description 📅 **Day N (Aug NN)**
```

Non-negotiable rules:
- **Every place must contain a link to it** — a real, working map link is required, not optional. It's what puts the pin on the map, feeds the Google Maps saver, and makes the entry clickable on the site. A place with no link is incomplete; find its map URL before adding it.
- **The link URL must be `https://www.google.com/maps/search/<query>`** with `+` between words (e.g. `Place+Name+Seoul`). Both `markdown_parser.py` and the web app depend on this exact form — `place/` or `@lat,lng` URLs are silently skipped. Include the city in the query so the pin is unambiguous.
- **Stars are always 5 glyphs**, filled + empty: `★★★★★ ★★★★☆ ★★★☆☆ ★★☆☆☆ ★☆☆☆☆`. They go first inside the link text, before the emoji.
- **Rare exception — unlinked bullets:** only when there is genuinely no single mappable location (e.g. a street-vendor *category* like hotteok stalls, not one venue). Then put the stars + emoji at the start of the bullet text: `- ★★☆☆☆ ☕ Dragon's Beard Candy vendors — …`. If the place is a real venue with an address, it gets a link — no exceptions.
- Do **not** rate/tag generic dish bullets or "Must-Try Dishes" checklists — only real destinations.

## Step 1 — Catalog it in `places.md`

Find the right home by heading hierarchy:
- `##` = region/city (e.g. `KOREA — SEOUL`, `TAIWAN — TAIPEI`).
- `###` = day-combo / district (e.g. `Day Combo: Jongno / Bukchon / Samcheong-dong…`).
- `####` = category (Landmarks & Temples, Cafes, Food (no chains), Desserts & Ice Cream, Shopping & Stores, Kid-Friendly, …). These are informational, not parsed — but keep them tidy and consistent.

Put the bullet under the `##`/`###` that matches its location and the `####` that matches its type. If no category fits, reuse the closest existing one rather than inventing a new heading.

## Step 2 — Rate it (1–5 ★, "regret-if-missed")

Rate against the canonical rubric in **[`priorities.md`](../../../priorities.md) → §B The importance star rating** (repo root) — the scale lives there, not here. In short: **5** unmissable/flagship (major theme parks = 5) · **4** top-of-category highlight · **3** worth-it-if-nearby / kid-magnet / signature single restaurant · **2** nice-to-have interchangeable · **1** marginal. **Bump kid-magic up one notch.**

Rank the *category* against the priority ladder (§A of the same file) before rating: photography & contemporary art, general museums, and STEM/industry/transport rate generously (rarely below ★★★☆☆); immersive-projection spaces rank **low**; trick-eye/selfie/optical-illusion "museums" are **not** galleries — cap ~★★☆☆☆ and label them selfie spots.

## Step 3 — Tag with emoji (classify what it is)

`places.md` → **Emoji Key** is canonical. A place can carry more than one tag; lead with the primary type, then extras. Current key:

**Type:** 🍜 food · ☕ cafés/dessert/bakery · 🏯 palaces/temples/historic · 🏛️ museums & galleries · 🌳 parks/gardens/nature · 🛍️ shopping/markets/malls · 🏮 night markets · 🎡 theme parks/amusement · 🚶 strolls/old streets · 🗼 viewpoints/decks/towers · 📸 landmarks/photo spots · 🎨 hands-on/cultural experiences
**Extra:** 🧒 kid-favourite · 🐾 animals · ♨️ hot springs/spas · 🚡 scenic rides · 🍺 nightlife/bars
**Finer:** 🍵 tea house · 🧋 bubble tea · 🌊 waterfalls/natural wonders · ⛪ churches · 🎭 performing arts · 🤪 quirky/novelty · 🎁 character/fandom stores · 📷 photography museum/gallery

If a genuinely new type appears, add it to the Emoji Key in `places.md` first, then use it.

## Step 4 — Find a day and assign it

Check `itinerary.md`'s day tables (Day 1 = Aug 11 … Day 19 = Aug 29) and the relevant `days/*.md` to see which day passes through this place's district. Then annotate the `places.md` bullet:

- **On the schedule** → `📅 **Day N (Aug NN)**` (bold). This means you also add it to that day file's `## Schedule` (see below).
- **Near a day but not scheduled** (a nearby optional/backup) → `📅 *near Day N (Aug NN)*` (italic). Add it to that day file's `## Also Nearby` section under the right `###` group.
- **Near several days** → `📅 *near Days 1, 6 (Aug 11, 16)*`.
- **No day fits** → leave the 📅 annotation off entirely (some catalog entries legitimately have none).

**Always tell the user where you assigned it** (which day and whether scheduled vs. nearby), or say that no day fit and it's catalog-only.

Check the day's closed-day rules and badges before scheduling (many museums close Mondays; palaces vary — see `itinerary.md` closed-day rules and each day file's `> Badges:` line). Don't schedule a place onto a day it's closed.

### If you put it on a day's Schedule

Add a row to that `days/*.md` file's `## Schedule` table, at the time that fits the route:

```markdown
| 10:30 | **[★★★★☆ 🏛️🎨 Place Name](https://www.google.com/maps/search/Place+Name+City)** — what it is; hours/last-entry; price note. | 15,000 KRW / youth 7,500 |
```

- **Overpack** — this family would rather drop a stop on the spot than under-plan. Adding a 4th museum to an afternoon is fine; flag tight closing/last-entry timing and name the natural drop rather than thinning the day.
- Bold the linked name in schedule cells (matches existing rows). Repeat the **same stars + emoji** as in `places.md` — they must stay in sync.
- Price by **age tier**, not a flat "child": 3 kids aged 9, 11, 15. The 15-yo is often student/adult or youth; 9 & 11 usually child; many venues free under a cutoff. See the `family-composition` memory.
- Consider adding it to the day's `## Route Map` waypoints if it's a real stop (both the Naver and Google links).

## Step 5 — Regenerate the site data (required)

After editing any Markdown, run:

```bash
python generate_site_data.py    # rewrites docs/data.js from the Markdown
```

Commit the regenerated `docs/data.js` alongside the Markdown so previews and the committed diff stay in sync (the push workflows also regen it, but do it locally too).

## Worked example

User: "Add Leeum Museum — it's in Hannam, near the Itaewon day."

1. **places.md** — under `## KOREA — SEOUL` → the Itaewon/Hannam `###` → `#### Museums` (or nearest), add:
   ```markdown
   - [★★★★★ 🏛️🎨 Leeum Museum of Art](https://www.google.com/maps/search/Leeum+Museum+of+Art+Seoul) — Samsung's flagship; traditional + contemporary; leading private museum. Closed Mon. 📅 **Day 3 (Aug 13)**
   ```
2. **Rating** — flagship contemporary-art museum → ★★★★★.
3. **Emoji** — 🏛️ museum + 🎨 art/contemporary.
4. **Day** — Aug 13 (Day 3) passes Itaewon/Hannam; it's open Thu → schedule it. Add a `## Schedule` row to `days/aug-13-dmz-itaewon.md` with the same stars/emoji and youth/adult pricing.
5. **Regenerate** — `python generate_site_data.py`.
6. **Report** — "Added Leeum (★★★★★ 🏛️🎨) to places.md and scheduled it on Day 3 (Aug 13, Itaewon/Hannam)."
