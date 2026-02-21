import argparse
import asyncio
import logging
from collections import defaultdict
from pathlib import Path

from markdown_parser import parse_places_file
from maps_automator import MapsAutomator, SaveResult

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    datefmt="%H:%M:%S",
)


def parse_args():
    parser = argparse.ArgumentParser(
        description="Save places from a markdown file to a Google Maps list"
    )
    parser.add_argument("markdown_file", help="Path to the markdown file with places")
    parser.add_argument(
        "--list-name", required=True, help="Name of the Google Maps list to save to"
    )
    parser.add_argument(
        "--section", help="Only process places under this section header"
    )
    parser.add_argument(
        "--start-from",
        type=int,
        default=0,
        help="Skip first N places (for resuming after a failure)",
    )
    parser.add_argument(
        "--slow-mo",
        type=int,
        default=500,
        help="Playwright slow_mo in milliseconds (default: 500)",
    )
    parser.add_argument(
        "--browser-data-dir",
        default="./browser_data",
        help="Directory for persistent browser profile (default: ./browser_data)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Parse and print places without opening a browser",
    )
    return parser.parse_args()


def print_summary(results: list[tuple]):
    by_status = defaultdict(list)
    for place, result in results:
        by_status[result].append(place)

    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)

    for status in SaveResult:
        places = by_status.get(status, [])
        if places:
            print(f"\n{status.value.upper()} ({len(places)}):")
            for p in places:
                print(f"  - [{p.section}] {p.name}")

    total = len(results)
    success = len(by_status.get(SaveResult.SUCCESS, []))
    already = len(by_status.get(SaveResult.ALREADY_SAVED, []))
    print(f"\nTotal: {total} | Saved: {success} | Already saved: {already} | "
          f"Failed: {total - success - already}")


async def main():
    args = parse_args()

    places = parse_places_file(Path(args.markdown_file))

    if args.section:
        places = [p for p in places if args.section.lower() in p.section.lower()]

    places = places[args.start_from :]

    print(f"Found {len(places)} places to process\n")

    if args.dry_run:
        for i, p in enumerate(places):
            print(f"  {i + 1:2d}. [{p.section}] {p.name}")
            print(f"      Query: {p.search_query}")
        return

    automator = MapsAutomator(
        list_name=args.list_name,
        slow_mo=args.slow_mo,
        browser_data_dir=args.browser_data_dir,
    )

    results = await automator.run(places)
    print_summary(results)


if __name__ == "__main__":
    asyncio.run(main())
