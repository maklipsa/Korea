import re
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import unquote_plus, urlparse


@dataclass
class Place:
    name: str
    search_query: str
    search_url: str
    section: str


LINK_PATTERN = re.compile(r"-\s+\[([^\]]+)\]\((https?://[^)]+)\)")
HEADER2_PATTERN = re.compile(r"^##\s+(.+)")
HEADER3_PATTERN = re.compile(r"^###\s+(.+)")


def _extract_search_query(url: str) -> str:
    parsed = urlparse(url)
    # URL format: https://www.google.com/maps/search/Query+Here
    path = parsed.path
    prefix = "/maps/search/"
    if prefix in path:
        query_part = path[path.index(prefix) + len(prefix) :]
        return unquote_plus(query_part.strip("/"))
    return ""


def parse_places_file(filepath: Path) -> list[Place]:
    places = []
    current_h2 = ""
    current_h3 = ""

    with open(filepath, encoding="utf-8") as f:
        for line in f:
            line = line.rstrip()

            h2 = HEADER2_PATTERN.match(line)
            if h2:
                current_h2 = h2.group(1).strip()
                current_h3 = ""
                continue

            h3 = HEADER3_PATTERN.match(line)
            if h3:
                current_h3 = h3.group(1).strip()
                continue

            link = LINK_PATTERN.match(line.strip())
            if link:
                name = link.group(1)
                url = link.group(2)
                search_query = _extract_search_query(url)
                section = f"{current_h2} > {current_h3}" if current_h3 else current_h2
                places.append(
                    Place(
                        name=name,
                        search_query=search_query or name,
                        search_url=url,
                        section=section,
                    )
                )

    return places
