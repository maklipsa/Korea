"""Generate docs/data.js from the Markdown source of truth.

Reads itinerary.md, passes.md, packing.md, days/*.md, and cards/*.md and emits
docs/data.js, which defines the `DAYS`, `CHECKLIST`, `PASSES`, `PACKING`, and
`CARDS` globals consumed by docs/app.js.

Run after editing any of the Markdown files:

    python generate_site_data.py

Pure standard library, no dependencies.
"""

import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).parent
ITINERARY = ROOT / "itinerary.md"
PASSES_MD = ROOT / "passes.md"
PLACES_MD = ROOT / "places.md"
PACKING_MD = ROOT / "packing.md"
DMZ_MD = ROOT / "dmz.md"
DAYS_DIR = ROOT / "days"
OUT = ROOT / "docs" / "data.js"
OUT_JSON = ROOT / "docs" / "data.json"
CARDS_DIR = ROOT / "cards"
INDEX_HTML = ROOT / "docs" / "index.html"

# Local assets referenced in index.html to cache-bust with a content hash.
# The site is fronted by Cloudflare, which edge-caches these and hands browsers
# a long Browser Cache TTL (~4h). index.html itself is not hard-cached, so
# stamping a ?v=<hash> that changes only when the file changes lets a new
# index.html point at fresh asset URLs and bypass both caches instantly.
VERSIONED_ASSETS = ("style.css", "firebase-config.js", "data.js", "app.js")

# Acronyms to keep uppercase when title-casing an ALL-CAPS heading.
ACRONYMS = {
    "DMZ", "DDP", "NPM", "COEX", "HSR", "KTX", "TPE", "PUS", "ICN",
    "MRT", "BTS", "SEA", "LIFE", "UNESCO", "MMCA", "HOMA",
}
# Words kept lowercase in a title unless they are the first word.
# English leftovers (district names, "Day Trip from …") plus the Polish
# prepositions/conjunctions that now appear in the translated headings.
SMALL_WORDS = {
    "to", "and", "of", "the", "a", "an", "at", "by", "on", "in", "or", "vs",
    "i", "oraz", "albo", "lub", "a", "w", "we", "z", "ze", "do", "na", "od",
    "po", "przy", "dla", "nad", "pod", "za", "u", "o",
}

# Polish diacritics folded away when building an id/slug (the slug alphabet is
# ASCII, so without this "Łódź" would collapse to "d").
_PL_FOLD = str.maketrans({
    "ą": "a", "ć": "c", "ę": "e", "ł": "l", "ń": "n",
    "ó": "o", "ś": "s", "ź": "z", "ż": "z",
})


# --- inline markdown helpers ------------------------------------------------

def md_inline(s: str) -> str:
    """Convert inline Markdown (bold, italics, links, strikethrough) to the HTML the site expects."""
    s = re.sub(r"~~([^~]+)~~", r"<del>\1</del>", s)  # before links: works inside link text too
    # italics first, so a nested *italic* inside **bold** doesn't break the bold
    # match below (whose [^*]+ cannot cross an asterisk). Same order as the
    # cards renderer. Without this, the bold's closing ** pairs with a LATER
    # bold's opening **, emitting a literal ** and an unclosed <strong>.
    s = re.sub(r"(?<!\*)\*(?!\s)([^*\n]+?)\*(?!\*)", r"<em>\1</em>", s)
    s = re.sub(
        r"\*\*\[([^\]]+)\]\(([^)]+)\)\*\*",
        r'<strong><a href="\2" target="_blank">\1</a></strong>',
        s,
    )
    s = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2" target="_blank">\1</a>', s)
    return s.strip()


def md_plain(s: str) -> str:
    """Strip inline Markdown to plain text."""
    s = re.sub(r"~~([^~]+)~~", r"\1", s)
    s = re.sub(r"\*\*\[([^\]]+)\]\([^)]+\)\*\*", r"\1", s)
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)
    s = re.sub(r"(?<!\*)\*(?!\s)([^*\n]+?)\*(?!\*)", r"\1", s)  # italics before bold, as in md_inline
    s = re.sub(r"\*\*([^*]+)\*\*", r"\1", s)
    return s.strip()


def _case_subword(word: str, is_first: bool) -> str:
    core = word.strip("()[],.:;")
    if core.upper() in ACRONYMS:
        return word.replace(core, core.upper())
    if any(c.islower() for c in core):  # already mixed-case, leave alone
        return word
    if not core.isalpha():  # numbers, punctuation like "1:" or "101"
        return word
    if core.lower() in SMALL_WORDS and not is_first:
        return word.lower()
    # Capitalize the first LETTER, not str.capitalize(): capitalize() uppercases
    # index 0 only, so a word starting with punctuation — "(D" in
    # "(D Museum + Kukje ...)" — came out as "(d".
    for i, ch in enumerate(word):
        if ch.isalpha():
            return word[:i] + ch.upper() + word[i + 1:].lower()
    return word


def smart_title(text: str) -> str:
    """Turn an ALL-CAPS heading into a readable title, keeping acronyms."""
    tokens = re.split(r"(\s+)", text)
    out, is_first = [], True
    for tok in tokens:
        if tok.strip() == "":
            out.append(tok)
            continue
        # handle slash-joined words like ITAEWON/HANNAM
        out.append("/".join(_case_subword(p, is_first and i == 0)
                            for i, p in enumerate(tok.split("/"))))
        is_first = False
    return "".join(out)


def slugify(text: str, n_words: int = 6) -> str:
    words = re.findall(r"[a-z0-9]+", md_plain(text).lower().translate(_PL_FOLD))
    return "-".join(words[:n_words]) or "item"


# --- itinerary.md -----------------------------------------------------------

def parse_itinerary_days():
    """Return {filename: {'num', 'date', 'summary', 'country'}} from the tables."""
    days, country = {}, ""
    row_re = re.compile(
        r"^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*(.+?)\s*\|\s*"
        r"\[[^\]]+\]\(days/([^)]+)\)\s*\|"
    )
    for line in ITINERARY.read_text(encoding="utf-8").splitlines():
        st = line.strip()
        if st.startswith("## "):
            head = st[3:].upper()
            if "KOREA" in head:
                country = "korea"
            elif "TAIWAN" in head:
                country = "taiwan"
        m = row_re.match(line)
        if m:
            num, date, summary, fname = m.groups()
            days[fname] = {
                "num": int(num),
                "date": date.strip(),
                "summary": summary.strip(),
                "country": country,
            }
    return days


def parse_checklist():
    """Parse the 'BEFORE YOU GO' booking checklist into CHECKLIST items."""
    items, category, in_section = [], "", False
    seen = set()
    for line in ITINERARY.read_text(encoding="utf-8").splitlines():
        st = line.strip()
        if st.startswith("## "):
            head = st.upper()
            in_section = "PRZED WYJAZDEM" in head or "BEFORE YOU GO" in head
            continue
        if not in_section:
            continue
        if st.startswith("### "):
            category = re.split(r"\s*\(", st[4:])[0].strip()  # drop "(see ...)"
            continue
        m = re.match(r"-\s*\[([ xX])\]\s*(.+)", st)
        if m:
            done = m.group(1).lower() == "x"
            text = md_inline(m.group(2))
            cid = slugify(m.group(2))
            while cid in seen:
                cid += "-x"
            seen.add(cid)
            item = {"id": cid, "category": category, "text": text}
            if done:
                # [x] in the Markdown = permanently done: the app force-checks
                # and locks these, independent of Firebase/localStorage state.
                item["done"] = True
            items.append(item)
    return items


# --- passes.md --------------------------------------------------------------

# H2 sections of passes.md whose "### Name — price" entries become pass cards.
PASS_SECTIONS = ("Karty miejskie", "Karty transportowe", "City Passes", "Transport Passes")


def parse_passes():
    """Parse city + transport passes (those with a price in the heading)."""
    lines = PASSES_MD.read_text(encoding="utf-8").splitlines()
    passes, h2 = [], ""
    i = 0
    while i < len(lines):
        st = lines[i].strip()
        if st.startswith("## "):
            h2 = st[3:].strip()
        elif st.startswith("### ") and " — " in st and h2 in PASS_SECTIONS:
            name, _, price = st[4:].partition(" — ")
            block = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith(("### ", "## ")):
                block.append(lines[i])
                i += 1
            passes.append(_build_pass(name.strip(), price.strip(), block))
            continue
        i += 1
    return passes


_BUY_RE = re.compile(r"^(?:Kup|Buy):\s*", re.IGNORECASE)
_VALUE_RE = re.compile(r"\*\*(Wartość|Uwaga|Razem|Value|Note|Total)")
_ACTIVATE_RE = re.compile(r"^(?:Aktywacja|Activate):\s*")


def _build_pass(name, price, block):
    includes, activate, value, buy = [], "", "", ""
    for raw in block:
        st = raw.strip()
        if not st:
            continue
        if st.startswith("- "):
            includes.append(md_plain(st[2:]))
        elif _BUY_RE.match(st):
            buy = md_plain(_BUY_RE.sub("", st)).strip()
        elif _VALUE_RE.match(st):
            value = md_plain(st)
        elif not activate and st.startswith("**"):
            activate = _ACTIVATE_RE.sub("", md_plain(st))
    return {
        "name": name,
        "price": price,
        "activate": activate,
        "includes": includes,
        "value": value,
        "buy": buy,
    }


# --- days/*.md --------------------------------------------------------------

def parse_table(lines):
    """Parse the first pipe-table (the schedule) into rows."""
    rows, i = [], 0
    while i < len(lines):
        st = lines[i].strip()
        if st.startswith("|") and "-" in st and set(st) <= set("|:- "):
            j = i + 1
            while j < len(lines) and lines[j].strip().startswith("|"):
                cells = [c.strip() for c in lines[j].strip().strip("|").split("|")]
                time = cells[0] if len(cells) > 0 else ""
                activity = cells[1] if len(cells) > 1 else ""
                price = cells[2] if len(cells) > 2 else ""
                if any([time, activity, price]):
                    rows.append({
                        "time": md_inline(time),
                        "activity": md_inline(activity),
                        "price": md_inline(price),
                    })
                j += 1
            break
        i += 1
    return rows


def parse_extras(lines):
    """Parse the '## Also Nearby' section into extra categories."""
    extras, cat_name, cat_items = [], None, []
    started = False

    def flush():
        if cat_name is not None and cat_items:
            extras.append({"category": cat_name, "items": list(cat_items)})

    for line in lines:
        st = line.strip()
        if st.startswith("## "):
            if "ALSO NEARBY" in st.upper():
                started = True
                continue
            if started:
                break
            continue
        if not started:
            continue
        if st.startswith("### "):
            flush()
            cat_name, cat_items = st[4:].strip(), []
            continue
        m = re.match(r"-\s+(.*)", st)
        if m and cat_name is not None:
            content = m.group(1)
            lm = re.match(r"\[([^\]]+)\]\(([^)]+)\)\s*(?:—\s*(.*))?$", content)
            if lm:
                name, url, desc = md_inline(lm.group(1)), lm.group(2), (lm.group(3) or "").strip()
            else:
                head, _, tail = content.partition(" — ")
                name, url, desc = md_inline(head), "", tail.strip()
            cat_items.append({"name": name, "url": url, "desc": md_inline(desc)})
    flush()
    return extras


def parse_badges(lines):
    for line in lines:
        st = line.strip()
        m = re.match(r">\s*Badges:\s*(.+)", st, re.IGNORECASE)
        if m:
            badges = []
            for part in m.group(1).split(";"):
                if ":" in part:
                    btype, text = part.split(":", 1)
                    badges.append({"type": btype.strip(), "text": text.strip()})
            return badges
    return []


def parse_notes(lines):
    """Prose between the H1 (skipping the badge marker) and the first section."""
    notes = []
    for line in lines[1:]:
        st = line.strip()
        if st.startswith("##") or st.startswith("|") or st == "---":
            break
        if st.startswith(">"):  # badge marker
            continue
        if st:
            notes.append(md_inline(st))
    return " ".join(notes)


def parse_naver(lines):
    for line in lines:
        m = re.search(r"\[([^\]]*Naver[^\]]*)\]\((https?://[^)]+)\)", line)
        if m:
            return [{"label": "Trasa w Naver Map", "url": m.group(2)}]
    return []


def build_days():
    itinerary = parse_itinerary_days()
    days = []
    for fname, meta in sorted(itinerary.items(), key=lambda kv: kv[1]["num"]):
        path = DAYS_DIR / fname
        if not path.exists():
            print(f"  WARNING: {fname} listed in itinerary but not found")
            continue
        lines = path.read_text(encoding="utf-8").splitlines()
        h1 = lines[0].lstrip("# ").strip() if lines else ""
        title_raw = h1.split(" — ", 1)[1] if " — " in h1 else h1
        days.append({
            "id": f"day-{meta['num']}",
            "day": meta["num"],
            "date": meta["date"],
            "title": smart_title(title_raw),
            "country": meta["country"],
            "summary": md_inline(meta["summary"]),
            "notes": parse_notes(lines),
            "badges": parse_badges(lines),
            "maps": parse_naver(lines),
            "schedule": parse_table(lines),
            "extras": parse_extras(lines),
        })
    return days


# --- cards/*.md -------------------------------------------------------------
# The discount-card reference files use richer Markdown than the day files
# (tables, blockquotes, nested lists), so they get a small self-contained
# block-to-HTML converter here. Like md_inline above, it does NOT HTML-escape:
# the source has no raw < / > (only the entity &lt;), matching the rest of the
# pipeline. The emitted HTML is injected by renderCards() in docs/app.js.

CARD_FILES = ["README", "seoul", "busan", "taipei", "taichung", "tainan", "kaohsiung"]


def _card_anchor_map():
    m = {}
    for f in CARD_FILES:
        stem = f.lower()
        m[stem] = "card-overview" if stem == "readme" else "card-" + stem
    return m


def _card_link(text, url, anchors):
    if url.startswith("http"):
        return f'<a href="{url}" target="_blank">{text}</a>'
    stem = url.split("/")[-1].split("#")[0]
    if stem.endswith(".md"):
        stem = stem[:-3]
    key = stem.lower()
    if key in anchors:                       # cross-link between card pages
        return f'<a href="#{anchors[key]}">{text}</a>'
    return text                              # other repo files -> plain text


def card_inline(s, anchors):
    """Inline Markdown -> HTML for the card files (code, bold, italic, links)."""
    codes = []
    s = re.sub(r"`([^`]+)`",
               lambda m: codes.append(m.group(1)) or f"\x00C{len(codes) - 1}\x00", s)
    s = re.sub(r"~~([^~]+)~~", r"<del>\1</del>", s)  # before links: works inside link text too
    # italics first, so a nested *italic* inside **bold** doesn't break the
    # bold match (the ** markers are guarded by the look-arounds below).
    s = re.sub(r"(?<!\*)\*(?!\s)([^*\n]+?)\*(?!\*)", r"<em>\1</em>", s)
    s = re.sub(r"\*\*\[([^\]]+)\]\(([^)]+)\)\*\*",
               lambda m: "<strong>" + _card_link(m.group(1), m.group(2), anchors) + "</strong>", s)
    s = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)",
               lambda m: _card_link(m.group(1), m.group(2), anchors), s)
    for i, c in enumerate(codes):
        s = s.replace(f"\x00C{i}\x00", f"<code>{c}</code>")
    return s.strip()


def _card_table(rows, anchors):
    def cells(r):
        return [c.strip() for c in r.strip().strip("|").split("|")]
    header = cells(rows[0])
    body = rows[2:] if len(rows) > 1 and set(rows[1]) <= set("|:- ") else rows[1:]
    head = "".join(f"<th>{card_inline(c, anchors)}</th>" for c in header)
    trs = "".join(
        "<tr>" + "".join(f"<td>{card_inline(c, anchors)}</td>" for c in cells(r)) + "</tr>"
        for r in body
    )
    return ('<div class="card-table-wrap"><table class="card-table">'
            f"<thead><tr>{head}</tr></thead><tbody>{trs}</tbody></table></div>")


_TASK_RE = re.compile(r"^\[([ xX])\]\s+")       # '- [ ] item' / '- [x] item'


def _card_list(items, anchors, ordered=False):
    """Bullet/ordered list -> HTML, with GitHub-style task items.

    A '- [ ]' / '- [x]' item renders as a .task <li> carrying its own checkbox
    box element (packing.md is one long set of these); plain bullets are
    untouched, so the cards/places/dmz pages render exactly as before.
    """
    root = []
    stack = [(-1, root)]
    for ln in items:
        indent = len(ln) - len(ln.lstrip(" "))
        text = re.sub(r"^\s*(?:[-*]|\d+\.)\s+", "", ln)
        task = _TASK_RE.match(text)
        if task:
            text = _TASK_RE.sub("", text)
        node = {
            "text": card_inline(text, anchors),
            "task": bool(task),
            "done": bool(task) and task.group(1).lower() == "x",
            "children": [],
        }
        while len(stack) > 1 and indent <= stack[-1][0]:
            stack.pop()
        stack[-1][1].append(node)
        stack.append((indent, node["children"]))

    def build(nodes, ordered):
        tag = "ol" if ordered else "ul"
        cls = ' class="task-list"' if any(nd["task"] for nd in nodes) else ""
        out = f"<{tag}{cls}>"
        for nd in nodes:
            if nd["task"]:
                box = "task-box task-box-done" if nd["done"] else "task-box"
                out += (f'<li class="task"><span class="{box}"></span>'
                        f'<span class="task-text">{nd["text"]}</span>')
            else:
                out += "<li>" + nd["text"]
            out += (build(nd["children"], False) if nd["children"] else "") + "</li>"
        return out + f"</{tag}>"

    return build(root, ordered)


def render_card_markdown(md, anchors):
    lines = md.splitlines()
    html, para, i, n = [], [], 0, len(md.splitlines())

    def flush():
        if para:
            html.append("<p>" + card_inline(" ".join(para), anchors) + "</p>")
            para.clear()

    while i < n:
        raw, st = lines[i], lines[i].strip()
        if st == "":
            flush(); i += 1; continue
        if st == "---":
            flush(); html.append("<hr>"); i += 1; continue
        m = re.match(r"^(#{1,6})\s+(.*)$", st)
        if m:
            flush()
            level = len(m.group(1))
            if level > 1:                       # H1 is the page title -> skipped
                tag = "h" + str(min(level + 1, 6))
                html.append(f"<{tag}>{card_inline(m.group(2), anchors)}</{tag}>")
            i += 1; continue
        if st.startswith(">"):
            flush()
            quote = []
            while i < n and lines[i].strip().startswith(">"):
                quote.append(re.sub(r"^\s*>\s?", "", lines[i])); i += 1
            html.append("<blockquote>" + render_card_markdown("\n".join(quote), anchors) + "</blockquote>")
            continue
        if st.startswith("|"):
            flush()
            tbl = []
            while i < n and lines[i].strip().startswith("|"):
                tbl.append(lines[i].strip()); i += 1
            html.append(_card_table(tbl, anchors))
            continue
        if re.match(r"^\s*[-*]\s+", raw):
            flush()
            items = []
            while i < n and re.match(r"^\s*[-*]\s+", lines[i]):
                items.append(lines[i]); i += 1
            html.append(_card_list(items, anchors))
            continue
        if re.match(r"^\s*\d+\.\s+", raw):      # '1. …' numbered list -> <ol>
            flush()
            items = []
            while i < n and re.match(r"^\s*\d+\.\s+", lines[i]):
                items.append(lines[i]); i += 1
            html.append(_card_list(items, anchors, ordered=True))
            continue
        para.append(st); i += 1
    flush()
    return "".join(html)


def build_cards():
    if not CARDS_DIR.exists():
        return []
    anchors = _card_anchor_map()
    cards = []
    for f in CARD_FILES:
        path = CARDS_DIR / (f + ".md")
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        title = next((md_plain(ln[2:]) for ln in text.splitlines() if ln.startswith("# ")), "")
        stem = f.lower()
        cards.append({
            "id": "card-overview" if stem == "readme" else "card-" + stem,
            "nav": "Przegląd" if stem == "readme" else f.capitalize(),
            "title": title or f,
            "html": render_card_markdown(text, anchors),
        })
    return cards


# --- places.md --------------------------------------------------------------
# The master place catalog is rich Markdown (region ## / district ### /
# category ####), so it reuses the card block-to-HTML converter above. Each
# top-level ## region becomes one section of the Places subsite, mirroring the
# CARDS structure ({id, nav, title, html}) so docs/app.js can render it with
# the existing .card-doc / .card-nav styles.

_NAV_OVERRIDES = {
    "Tajwan": "Potrawy",                        # '## Tajwan — potrawy do spróbowania'
    "Wycieczki jednodniowe z Seoulu": "Wycieczki z Seoulu",
}


def _place_nav(title):
    """Short nav-chip label from a region heading (drop country prefix, notes)."""
    t = title
    for pre in ("KOREA — ", "TAIWAN — "):
        if t.startswith(pre):
            t = t[len(pre):]
            break
    t = re.sub(r"\s*—.*$", "", t)         # drop trailing ' — Aug 11–29…'
    t = re.sub(r"\s*\(.*?\)\s*", " ", t)       # drop parentheticals
    label = smart_title(t.strip())
    return _NAV_OVERRIDES.get(label, label)


def build_places():
    if not PLACES_MD.exists():
        return []
    lines = PLACES_MD.read_text(encoding="utf-8").splitlines()
    sections, title, body = [], None, []

    def flush():
        if not title or title.strip().lower() in ("klucz emoji", "emoji key"):
            return                              # legend already lives on Overview
        # Promote headings one level (#### -> ###, ### -> ##) so render_card_markdown
        # maps them onto the styled .card-doc h3/h4 (it renders H2+ and skips H1).
        promoted = [
            re.sub(r"^(#{3,6})(\s)", lambda m: "#" * (len(m.group(1)) - 1) + m.group(2), ln)
            for ln in body
        ]
        html = render_card_markdown("\n".join(promoted), {})
        if html.strip():
            sections.append({
                "id": "place-" + slugify(_place_nav(title)),
                "nav": _place_nav(title),
                "title": smart_title(title),
                "html": html,
            })

    for ln in lines:
        m = re.match(r"^##\s+(.*)$", ln)        # H2 only ('### ' has '#' after '##')
        if m:
            flush()
            title, body = m.group(1).strip(), []
        elif title is not None:
            body.append(ln)
    flush()
    return sections


# --- packing.md -------------------------------------------------------------
# The packing list is rich Markdown (## section / '- [ ]' task items / a per-day
# gear table), so it reuses the card block-to-HTML converter. Each ## section
# becomes one block of the Packing tab, mirroring the CARDS/PLACES shape
# ({id, nav, title, html}) plus the intro prose above the first ##.

def _packing_nav(title):
    """Short nav-chip label from a packing section heading."""
    t = re.sub(r"\s*\(.*?\)\s*", " ", title)        # drop parentheticals
    t = re.sub(r"\s+", " ", t).strip()
    if len(t) > 26:                                 # too long for a chip: keep the head
        t = re.split(r"\s+—\s+|,\s+", t)[0].strip()
    return t


def build_packing():
    if not PACKING_MD.exists():
        return None
    lines = PACKING_MD.read_text(encoding="utf-8").splitlines()
    title = next((md_plain(ln[2:]) for ln in lines if ln.startswith("# ")), "Pakowanie")

    sections, intro, head, body = [], [], None, []

    def flush():
        html = render_card_markdown("\n".join(body), {})
        if head and html.strip():
            sections.append({
                "id": "pack-" + slugify(_packing_nav(head)),
                "nav": _packing_nav(head),
                "title": md_plain(head),
                "html": html,
            })

    for ln in lines:
        if ln.startswith("# "):                     # H1 = page title, already taken
            continue
        m = re.match(r"^##\s+(.*)$", ln)            # H2 only ('### ' has '#' after '##')
        if m:
            flush()
            head, body = m.group(1).strip(), []
        elif head is None:
            intro.append(ln)
        else:
            body.append(ln)
    flush()

    return {
        "title": title,
        "intro": render_card_markdown("\n".join(intro), {}),
        "sections": sections,
    }


# --- dmz.md -----------------------------------------------------------------
# Standalone research page (its own top-level tab). Single rich-Markdown doc,
# rendered with the same block-to-HTML converter as the card/place subsites.

def build_dmz():
    if not DMZ_MD.exists():
        return None
    text = DMZ_MD.read_text(encoding="utf-8")
    title = next((md_plain(ln[2:]) for ln in text.splitlines() if ln.startswith("# ")), "DMZ")
    return {"title": title, "html": render_card_markdown(text, {})}


# --- emit -------------------------------------------------------------------

def js_block(name, data):
    return f"const {name} = " + json.dumps(data, indent=2, ensure_ascii=False) + ";"


def stamp_asset_versions():
    """Rewrite ?v=<hash> cache-busting query strings on local asset refs in
    index.html. Call AFTER data.js is written so its hash reflects the new
    content. Idempotent: strips any existing ?v= and re-appends the current
    content hash, so a no-op run leaves index.html untouched."""
    if not INDEX_HTML.exists():
        return
    html = original = INDEX_HTML.read_text(encoding="utf-8")
    docs = INDEX_HTML.parent
    for name in VERSIONED_ASSETS:
        asset = docs / name
        if not asset.exists():
            continue
        # Normalize CRLF->LF so the hash is identical on Windows and the
        # Linux CI runner (otherwise committed stamps churn against CI).
        raw = asset.read_bytes().replace(b"\r\n", b"\n")
        digest = hashlib.sha1(raw).hexdigest()[:8]
        pattern = re.compile(
            r'((?:href|src)=")' + re.escape(name) + r'(?:\?v=[0-9a-f]+)?(")'
        )
        html = pattern.sub(rf'\g<1>{name}?v={digest}\g<2>', html)
    if html != original:
        INDEX_HTML.write_text(html, encoding="utf-8")
        print(f"Stamped asset versions in {INDEX_HTML.relative_to(ROOT)}")
    else:
        print("Asset versions already current in index.html")


def main():
    days = build_days()
    checklist = parse_checklist()
    passes = parse_passes()
    cards = build_cards()
    places = build_places()
    dmz = build_dmz()
    packing = build_packing()

    header = (
        "// === ITINERARY DATA ===\n"
        "// AUTO-GENERATED by generate_site_data.py from the Markdown files.\n"
        "// Do not edit by hand. Regenerate with:  python generate_site_data.py\n\n"
    )

    # One payload -> two artifacts, so they can never drift:
    #   docs/data.js   = `const NAME = …;` globals, loaded by a <script> tag in
    #                    index.html. Kept as the site's loader because app.js
    #                    reads the globals synchronously and because fetch() is
    #                    CORS-blocked on file://, which would break opening
    #                    docs/index.html straight from disk.
    #   docs/data.json = the same data as plain JSON, for anything that isn't
    #                    this site (AI tools, scripts, other trip members).
    payload = {
        "DAYS": days,
        "CHECKLIST": checklist,
        "PASSES": passes,
        "CARDS": cards,
        "PLACES": places,
        "DMZ": dmz,
        "PACKING": packing,
    }
    OUT.write_text(
        header + "\n\n".join(js_block(k, v) for k, v in payload.items()) + "\n",
        encoding="utf-8",
    )
    OUT_JSON.write_text(
        json.dumps(payload, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUT.relative_to(ROOT)} and {OUT_JSON.relative_to(ROOT)}")
    print(f"  {len(days)} days, {len(checklist)} checklist items, "
          f"{len(passes)} passes, {len(cards)} cards, {len(places)} place regions, "
          f"dmz={'yes' if dmz else 'no'}, "
          f"packing={len(packing['sections']) if packing else 0} sections")
    stamp_asset_versions()


if __name__ == "__main__":
    main()
