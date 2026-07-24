"""Annotate places.md with which day(s) each place is visited.

Cross-references every day file in days/*.md against the master catalogue in
places.md, matching on the Google Maps search query (the `/maps/search/<query>`
slug both files share). For each catalogue entry that a day plan references, it
appends a day marker to that line, e.g.:

    - [... Gyeongbokgung Palace](...search/Gyeongbokgung+Palace+Seoul) — ... 📅 **Day 2 (Aug 12)**

A link that appears in a day's `## Schedule` (or its main table) counts as a
*visit*; one that only appears under `## Also Nearby` is flagged as a *near-day*
option. Days are numbered from Aug 11 = Day 1 (day_num = NN - 10).

The marker always starts with the 📅 sentinel and runs to end-of-line, so the
script is idempotent: existing markers are stripped before fresh ones are added,
and a place that is no longer referenced simply loses its marker.

Usage:
    python annotate_places.py            # dry run: report matches, write nothing
    python annotate_places.py --write     # rewrite places.md in place
    python annotate_places.py --check      # alias for the default dry run

Pure standard library, no dependencies.
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent
DAYS_DIR = ROOT / "days"
PLACES_MD = ROOT / "places.md"

SEARCH_RE = re.compile(r"maps/search/([^)\s\"']+)")
DAYFILE_RE = re.compile(r"aug-(\d{2})-")
MARKER_RE = re.compile(r"\s*📅.*$")          # existing marker -> strip (idempotent)


def norm(query: str) -> str:
    """Normalise a maps search slug into a match key."""
    q = query.strip().rstrip(").,")
    q = q.replace("+", " ").replace("%20", " ")
    return re.sub(r"\s+", " ", q).strip().lower()


def day_index():
    """Map normalised query -> {'visit': {day_nums}, 'nearby': {day_nums}}."""
    index: dict[str, dict[str, set]] = {}
    for path in sorted(DAYS_DIR.glob("aug-*.md")):
        m = DAYFILE_RE.search(path.name)
        if not m:
            continue
        day_num = int(m.group(1)) - 10          # Aug 11 -> Day 1
        section = None
        for line in path.read_text(encoding="utf-8").splitlines():
            st = line.strip()
            if st.startswith("## "):
                section = st[3:].strip().lower()
                continue
            low = section or ""
            if "route map" in low:               # no visit info here
                continue
            kind = "nearby" if "also nearby" in low else "visit"
            for q in SEARCH_RE.findall(line):
                bucket = index.setdefault(norm(q), {"visit": set(), "nearby": set()})
                bucket[kind].add(day_num)
    return index


def _day_list(nums) -> str:
    nums = sorted(nums)
    if len(nums) == 1:
        d = nums[0]
        return f"Day {d} (Aug {d + 10})"
    days = ", ".join(str(d) for d in nums)
    dates = ", ".join(str(d + 10) for d in nums)
    return f"Days {days} (Aug {dates})"


def build_marker(info) -> str:
    visit = info["visit"]
    nearby = info["nearby"] - info["visit"]     # don't repeat a day already a visit
    segs = []
    if visit:
        segs.append("**" + _day_list(visit) + "**")
    if nearby:
        segs.append("*near " + _day_list(nearby) + "*")
    return "📅 " + " · ".join(segs) if segs else ""


def annotate(write: bool) -> int:
    index = day_index()
    lines = PLACES_MD.read_text(encoding="utf-8").splitlines()
    out = []
    n_links = n_matched = n_visit = n_nearby = n_changed = 0
    matched_keys = set()

    for line in lines:
        queries = SEARCH_RE.findall(line)
        if not queries:
            out.append(line)
            continue
        n_links += 1
        stripped = MARKER_RE.sub("", line)       # remove any prior marker
        merged = {"visit": set(), "nearby": set()}
        for q in queries:
            info = index.get(norm(q))
            if info:
                merged["visit"] |= info["visit"]
                merged["nearby"] |= info["nearby"]
                matched_keys.add(norm(q))
        marker = build_marker(merged)
        if marker:
            n_matched += 1
            if merged["visit"]:
                n_visit += 1
            if merged["nearby"] - merged["visit"]:
                n_nearby += 1
            new_line = stripped.rstrip() + " " + marker
        else:
            new_line = stripped                  # no match -> just cleaned
        if new_line != line:
            n_changed += 1
        out.append(new_line)

    print(f"day queries indexed : {len(index)}")
    print(f"places.md link lines: {n_links}")
    print(f"  matched to a day  : {n_matched}  (visit: {n_visit}, near-only: {n_nearby})")
    print(f"  lines changed     : {n_changed}")
    unmatched_days = sorted(k for k in index if k not in matched_keys)
    print(f"day queries NOT in places.md ({len(unmatched_days)}):")
    for k in unmatched_days:
        print(f"    - {k}")

    if write:
        PLACES_MD.write_text("\n".join(out) + "\n", encoding="utf-8")
        print(f"\nWROTE {PLACES_MD.relative_to(ROOT)}")
    else:
        print("\n(dry run — no file written; pass --write to apply)")
    return 0


if __name__ == "__main__":
    do_write = "--write" in sys.argv[1:]
    sys.exit(annotate(write=do_write))
