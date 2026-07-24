---
name: find-places
description: A reusable method for RESEARCHING and DISCOVERING new candidates — places/venues for the trip, but equally any researched shortlist (tools, products, options). The step before committing anything to a file. Use whenever the user wants to find, search for, research, or suggest options ("what museums are in Busan?", "find more photography galleries", "research X near the Bukchon day", "fill out the Taichung day", or any "go find me candidates for …"). Covers how deep to search, the audience/context check, building the priority ladder of what to hunt vs. exclude, where to look, verifying freshness/hours/pricing incl. discount passes, deduping against what exists, clustering results, then handing off to the right writer (for the trip, the add-place skill).
---

# Researching & discovering candidates

A general method for turning a research request into a **vetted, deduped, organized shortlist** you present for approval before anything gets written down. The running example is discovering **places** for the Korea/Taiwan trip, but the same steps apply to any "go find candidates" task — swap the domain-specific bits (the priority ladder, the writer you hand off to).

Six steps: **(0) set audience/context → (1) set depth → (2) build the priority ladder → (3) search → (4) verify → (5) cluster → (6) present + hand off.**

> **For the trip planner specifically:** this is the discovery front-end to the **[[add-place]]** skill. Do the research here; do the writing (the `places.md` one-line format, day assignment, `python generate_site_data.py` regen) there. Never hand-edit `docs/data.js`.

## Step 0 — Set the audience / context

Establish who and what the research is for before searching — it changes what you surface and how you rank.

- **State your assumption and only ask when genuinely ambiguous.** Don't interrogate the user for context you can reasonably infer.
- **For the trip, the default is WITH kids, ages 9, 11, 15** (3 adults + 3 kids, two groups — see the `family-composition` memory). Assume the whole family unless told a sub-group is going off alone.
- **With-kids weighting:** up-weight kid-magnet spots, animal encounters, hands-on workshops, scenic rides; screen for age-appropriateness and stamina; flag height/age limits; price by **age tier** (9 & 11 usually child; 15 often youth/student/adult; many venues free under a cutoff) — never a flat "child".
- **Nightlife / bars are LOW interest for this group — even for the adults.** Do not surface them as priority stops in any mode. Only include if the user explicitly asks for a night out, and even then keep it minimal.
- **Culture stays the priority regardless of audience** — kids never lower the bar toward gimmicks (see Step 2).

## Step 1 — Set the search depth

Pick a depth and **say which one you're using** before you start. Depth = how many sources you consult, how many candidates you generate, and how hard you verify.

| Depth | When | Sources | Candidates | Verify |
|-------|------|---------|-----------|--------|
| **Quick** | "give me a couple ideas", one named gap | 1–2 obvious sources + a map check | Top 3–5 for the ask | Real? still exists / not closed? link works |
| **Standard** (default) | "find cafés near the Bukchon day", "more galleries in Busan" | 3–5 sources incl. one local-language + a recently-dated one | 8–15 across the category/area, ranked | + hours, closed-day, rough price by tier, **discount passes**, dedupe vs what exists |
| **Exhaustive** | "fill this out", "sweep everything", "be comprehensive" | Wide: official, awards/authoritative, local-language, recent articles, aggregators, and existing files | Full coverage — overpack to ~1.5–2× a normal set | Full verify on every survivor; **report what you searched and what you deliberately excluded** (no silent caps) |

- **Overpack.** When in doubt, go one depth deeper and surface more, marking the lowest-priority ones as the natural drops. For the trip: this family would rather drop a stop on the spot than under-plan — never thin to a "normal" pace.
- For **Exhaustive** sweeps, fan out — run parallel search agents (Explore / general-purpose), one per area or per category — then merge and dedupe. State the breakdown.

## Step 2 — Build the priority ladder (what to hunt vs. exclude)

Before searching, decide what "good" looks like and rank candidates against it — don't take whatever a source lists first. **The ranked ladder and the hard exclude-list are the canonical [`priorities.md`](../../../priorities.md) → §A The priority ladder** (repo root). Rank every candidate against those tiers; culture is the main goal, NOT Instagram.

Research-specific reminders on top of the ladder:
- **Overpack** — when in doubt, go one depth deeper and surface more, marking the lowest-priority ones as the natural drops. This family would rather drop a stop on the spot than under-plan — never thin to a "normal" pace.
- Immersive/projection spaces (teamLab, Arte Museum, Bunker) stay **LOW** — include them so the option exists, tag them 🤳, never rank them above a real museum/gallery.
- Skip the hard exclusions outright (trick-eye/selfie museums beyond one labelled kids' optional, chains, generic dish bullets, nightlife per Step 0, anything closed/superseded).

## Step 3 — Where to search

- **Maps first** for every candidate — you need a working `https://www.google.com/maps/search/<query>` URL anyway (Step 4 / add-place). Confirms it exists and gives the right city-qualified name.
- **Official + authoritative:** tourism boards (VisitSeoul/VisitKorea, Busan/Taipei/Tainan tourism), venue official sites (hours, closed days, current & Aug-2026 exhibitions), Michelin Guide, UNESCO.
- **Guidebooks — Lonely Planet** (a source the user rates): strong for mainstream anchors — palaces/temples, markets, character neighborhoods, big-name museums, day-trips. Reach it with **`WebSearch` scoped to the domain** (`allowed_domains: ["lonelyplanet.com"]`) — their "top things to do / best museums / best neighborhoods / free things to do" articles and per-POI pages come through with descriptions. **Don't rely on direct page fetch** (`WebFetch` of an LP page is JS-rendered and usually returns nav chrome, not the article body); the paid guidebooks/ebooks aren't accessible either — site-scoped search surfaces the same public content. It **leans mainstream, so it's thin on tier-1 niche contemporary-art & fine-art-photography venues** — blend with the local-language and gallery sources for those, and **dedupe hard** (the dense city sections of `places.md` already contain most LP picks).
- **Local-language sources matter** — English-only misses a lot. **Naver / Kakao** for Korea, local Taiwanese sources for Taiwan; translate as needed.
- **Freshness:** prefer **recently-dated (2025–2026)** sources; venues open, close, and move (cf. Cheongwadae closed since Aug 2025). Check the trip window **Aug 11–29, 2026** for temporary/seasonal exhibitions, festivals, and closures.
- Aggregators/blogs/Reddit are fine for *leads*, but confirm facts against an authoritative source before proposing.

## Step 4 — Verify each candidate (before proposing)

For every survivor, confirm — depth-appropriate — and drop or flag failures:

- **Real & open** for the trip window (not permanently/temporarily closed).
- **Map link:** a working `https://www.google.com/maps/search/Name+City` URL (city included). No link = incomplete.
- **Hours, closed-day, last-entry** — load-bearing. Many museums close **Mondays**; palaces vary — cross-check `itinerary.md` closed-day rules.
- **Price by age tier:** adult / youth / child and any free-under-N cutoff for ages 9, 11, 15 — not a flat "child".
- **Discount / bundle passes — always check.** Before pricing a paid venue, search whether a **city or museum pass gives free or discounted entry** (e.g. Discover Seoul Pass, Busan-area passes, Taipei Fun Pass / unlimited passes, integrated museum tickets). If one does, note it and cross-reference **`passes.md`** — a "free with the pass we're buying" venue is far more attractive, and it may justify buying/activating a pass on that day.
- **Dedupe:** search the target file (`places.md`) first — don't propose what already exists. If it's there but unrated/unscheduled, treat it as an *update*, not a new add.
- **Age-appropriateness** (with-kids): stamina, height/age limits, genuinely engaging for 9–15.

## Step 5 — Cluster / organize the results

Group results along the axis that makes them actionable. For the trip that's **geography**: cluster by the `##` region and `###` day-combo/district in `places.md`, and check which existing day passes through that area (`itinerary.md` day tables, `days/*.md`). A candidate that clusters near an existing day beats an orphan across town — note the fit. (For non-trip research, cluster by whatever axis the user will decide along — vendor, price band, use-case.)

## Step 6 — Present for approval, then hand off

Present the vetted list **grouped by cluster**, each candidate one line: **proposed priority/rating + tags + name — one-line why — hours/closed-day/price (and any pass that covers it) — suggested fit.** Let the user accept/reject/trim in bulk before anything is written.

On approval, hand off to the writer. **For the trip → the [[add-place]] skill:** catalog in `places.md` with the exact `- [★rating emoji Name](maps-search-url) — desc 📅 day` format, add to the right day's `## Schedule` / `## Also Nearby`, then regenerate:

```bash
python generate_site_data.py    # rewrites docs/data.js — run after any Markdown edit
```

## Report

Tell the user: the **depth** used, **audience/context** assumed, **what you searched** (sources/areas) and **what you deliberately excluded** (e.g. "skipped 3 trick-eye/selfie museums — not culture; no nightlife"), how many candidates survived, where each clusters, and any **pass** that covers entry. Surface freshness caveats (closed for the window, seasonal-only, hours unconfirmed).

## Worked example

User: "Find me some photography and contemporary-art spots for the Busan days."

1. **Audience** — default with-kids (9/11/15); photography/contemporary museums suit all ages. No nightlife. Age-tier pricing.
2. **Depth** — Standard. Say so.
3. **Ladder** — HIGHEST: fine-art photography + contemporary art. GoEun Museum of Photography anchors; also MoCA Busan, Busan Museum of Art, F1963. Any immersive/projection space stays LOW (tag 🤳), listed only as an option.
4. **Search** — official sites for hours/closed-days + a Naver check for Aug-2026 shows; Google Maps for each URL.
5. **Verify** — GoEun & MoCA Busan closed **Mondays**; adult/youth/child prices; **check if a Busan pass covers entry** → note in `passes.md`; dedupe vs `places.md`.
6. **Cluster** — GoEun/Haeundae vs MoCA (Eulsukdo) vs F1963; map onto the relevant Busan day-combos.
7. **Present + hand off** — grouped list with priority/tags/why/hours/pass/day fit; on approval, use **add-place** and regenerate `docs/data.js`.
8. **Report** — "Standard depth, with-kids, no nightlife; searched official + Naver; excluded a trick-eye museum; 6 survivors across 2 Busan days; 2 covered by the Busan pass."
