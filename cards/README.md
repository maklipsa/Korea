# Discount Cards — Overview & Decisions

Per-city analysis of museum/attraction discount cards for the trip (Aug 11–29, 2026), mapped to **the attractions we actually visit** and to **our party: 3 adults + 3 children (ages 9, 11, 15), in two groups**. Each city file lists the available cards, a coverage table (card covers it? / gate price / in our schedule? / which day), a profitability calculation, and a **what-and-how-long-to-buy** recommendation.

| City | Card(s) | Buy? | One-line verdict |
|------|---------|------|------------------|
| [Seoul](seoul.md) | Discover Seoul Pass | **Adults yes (48h), kids no** | +33k KRW/adult if COEX is done; no child discount, so kids go à la carte |
| [Busan](busan.md) | Visit Busan Pass | **No (default)** | One usable day; only pays as an adult **BIG3 + X the Sky** add-on play |
| [Taipei](taipei.md) | Taipei Fun Pass + alternatives | **Adults maybe, kids no** | Worth it for adults **only if you DIY the Aug 23 coast day**; else EasyCard + tickets |
| [Taichung](taichung.md) | — | **No** | All stops free; NT$0 |
| [Tainan](tainan.md) | Historic Site Pass | **No** | Our 3 sites cost the same à la carte (NT$210 adult / NT$105 child) as the pass — pay per site |
| [Kaohsiung](kaohsiung.md) | MRT / Fun Pass | **No** | Sights nearly all free; tap EasyCard, pay 1–2 small gate fees |

## The shopping list (if you follow the recommendations)

- **Seoul:** 3 × **Discover Seoul Pass 48h** (adults; activate afternoon Aug 16 → N Tower, Lotte World, COEX). The 15-year-old only if COEX is confirmed. Kids 9 & 11: discounted individual Lotte World + N Seoul Tower tickets. Everyone pays out of pocket for Seoul Sky, Namsan Cable Car, Nami zipline.
- **Busan:** nothing by default — pay gate prices (Beach Train + Busan Tower) and book the **Sky Capsule** separately (2 capsules for 6 people; book ~28 days ahead). Optional: adult **BIG3 (45k) + Busan X the Sky** only if you want a Haeundae observation-deck day.
- **Taipei:** **decide the Aug 23 coast day first.** If DIY → 3 × adult **Fun Pass Unlimited 3-day** (Aug 22–24), no kid passes. If guided tour → no passes; EasyCard + discounted tickets for all.
- **Taichung / Tainan / Kaohsiung:** no cards. One Taiwan-wide **EasyCard/iPASS** each, pay the handful of small gate fees à la carte.

## Cross-cutting notes

- **Korean city passes (Seoul, Busan) are foreigners-only and flat-priced for all ages** — no child discount. Because children's *gate* prices are lower, these passes are systematically **worse value for kids than adults**. Default to buying them for adults only.
- **Taiwan:** one **EasyCard/iPASS** works nationwide (Taipei/Taichung/Tainan/Kaohsiung MRT, LRT, buses, Cijin ferry, convenience stores). You don't need a separate transit card per city. The airport MRT in Taipei is *not* on the Fun Pass. **Non-resident kids aged 6+ get no fare concession** — budget adult transit fares for all three children.
- **NPM (Taipei) is free for everyone under 18** — all three kids enter free; never buy a child ticket or spend a pass slot on it.
- **Age tiers matter** (see [CLAUDE.md](../CLAUDE.md) → "Skład rodziny"): the 15-year-old is adult-priced on the Taipei Fun Pass (child tier is 6–11) but still free at NPM; 9 & 11 get child rates.
- **All prices are current-research baselines and drift** (Korean passes have risen notably). **Re-verify every price ~2 weeks before travel** — each file lists its specific items to recheck.

## How these files were built

Researched by five parallel agents (one per card/cluster), synthesised here, then checked by critics for factual and arithmetic errors. These files are **standalone reference** — they are **not** parsed by `generate_site_data.py` and don't appear in the web app (that pipeline only reads `itinerary.md`, `days/*.md`, and `passes.md`). See [passes.md](../passes.md) for the transport/transit/eSIM details.
