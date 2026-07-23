"""Generate docs/data.js from the Markdown source of truth.

Reads itinerary.md, passes.md, and days/*.md and emits docs/data.js, which
defines the `DAYS`, `CHECKLIST`, and `PASSES` globals consumed by docs/app.js.

Run after editing any of the Markdown files:

    python generate_site_data.py

Pure standard library, no dependencies.
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).parent
ITINERARY = ROOT / "itinerary.md"
PASSES_MD = ROOT / "passes.md"
DAYS_DIR = ROOT / "days"
OUT = ROOT / "docs" / "data.js"

# Acronyms to keep uppercase when title-casing an ALL-CAPS heading.
ACRONYMS = {
    "DMZ", "DDP", "NPM", "COEX", "HSR", "KTX", "TPE", "PUS", "ICN",
    "MRT", "BTS", "SEA", "LIFE", "UNESCO", "KEYESCAPE",
}
# Words kept lowercase in a title unless they are the first word.
SMALL_WORDS = {"to", "and", "of", "the", "a", "an", "at", "by", "on", "in", "or", "vs"}


# --- inline markdown helpers ------------------------------------------------

def md_inline(s: str) -> str:
    """Convert inline Markdown (bold, links) to the HTML the site expects."""
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
    s = re.sub(r"\*\*\[([^\]]+)\]\([^)]+\)\*\*", r"\1", s)
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)
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
    return word.capitalize()


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
    words = re.findall(r"[a-z0-9]+", md_plain(text).lower())
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
            in_section = "BEFORE YOU GO" in st.upper()
            continue
        if not in_section:
            continue
        if st.startswith("### "):
            category = re.split(r"\s*\(", st[4:])[0].strip()  # drop "(see ...)"
            continue
        m = re.match(r"-\s*\[[ xX]\]\s*(.+)", st)
        if m:
            text = md_inline(m.group(1))
            cid = slugify(m.group(1))
            while cid in seen:
                cid += "-x"
            seen.add(cid)
            items.append({"id": cid, "category": category, "text": text})
    return items


# --- passes.md --------------------------------------------------------------

def parse_passes():
    """Parse city + transport passes (those with a price in the heading)."""
    lines = PASSES_MD.read_text(encoding="utf-8").splitlines()
    passes, h2 = [], ""
    i = 0
    while i < len(lines):
        st = lines[i].strip()
        if st.startswith("## "):
            h2 = st[3:].strip()
        elif st.startswith("### ") and " — " in st and h2 in ("City Passes", "Transport Passes"):
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


def _build_pass(name, price, block):
    includes, activate, value, buy = [], "", "", ""
    for raw in block:
        st = raw.strip()
        if not st:
            continue
        if st.startswith("- "):
            includes.append(md_plain(st[2:]))
        elif st.startswith("Buy:"):
            buy = md_plain(st[4:]).strip()
        elif re.match(r"\*\*(Value|Note|Total)", st):
            value = md_plain(st)
        elif not activate and (st.startswith("**") or "Any " in st):
            activate = re.sub(r"^Activate:\s*", "", md_plain(st))
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
                name, url, desc = lm.group(1), lm.group(2), (lm.group(3) or "").strip()
            else:
                head, _, tail = content.partition(" — ")
                name, url, desc = md_plain(head), "", tail.strip()
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
            return [{"label": "Naver Map route", "url": m.group(2)}]
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


# --- emit -------------------------------------------------------------------

def js_block(name, data):
    return f"const {name} = " + json.dumps(data, indent=2, ensure_ascii=False) + ";"


def main():
    days = build_days()
    checklist = parse_checklist()
    passes = parse_passes()

    header = (
        "// === ITINERARY DATA ===\n"
        "// AUTO-GENERATED by generate_site_data.py from the Markdown files.\n"
        "// Do not edit by hand. Regenerate with:  python generate_site_data.py\n\n"
    )
    OUT.write_text(
        header
        + js_block("DAYS", days) + "\n\n"
        + js_block("CHECKLIST", checklist) + "\n\n"
        + js_block("PASSES", passes) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUT.relative_to(ROOT)}")
    print(f"  {len(days)} days, {len(checklist)} checklist items, {len(passes)} passes")


if __name__ == "__main__":
    main()
