import asyncio
import logging
import re
from enum import Enum
from pathlib import Path

from playwright.async_api import Page, async_playwright

from markdown_parser import Place

logger = logging.getLogger(__name__)


class SaveResult(Enum):
    SUCCESS = "success"
    ALREADY_SAVED = "already_saved"
    NOT_FOUND = "not_found"
    SAVE_FAILED = "save_failed"
    ERROR = "error"


class MapsAutomator:
    def __init__(
        self,
        list_name: str,
        slow_mo: int = 500,
        browser_data_dir: str = "./browser_data",
    ):
        self.list_name = list_name
        self.slow_mo = slow_mo
        self.browser_data_dir = Path(browser_data_dir)

    async def run(self, places: list[Place]) -> list[tuple[Place, SaveResult]]:
        results = []

        async with async_playwright() as pw:
            context = await pw.chromium.launch_persistent_context(
                str(self.browser_data_dir),
                headless=False,
                slow_mo=self.slow_mo,
                viewport={"width": 1400, "height": 900},
                locale="en-US",
                args=["--disable-blink-features=AutomationControlled"],
            )

            page = context.pages[0] if context.pages else await context.new_page()
            await self._ensure_logged_in(page)

            for i, place in enumerate(places):
                result = await self._save_place(page, place, i, len(places))
                results.append((place, result))
                # Reset to maps home between places
                await page.goto(
                    "https://www.google.com/maps", wait_until="domcontentloaded"
                )
                await page.wait_for_timeout(1500)

            await context.close()

        return results

    async def _ensure_logged_in(self, page: Page) -> None:
        await page.goto(
            "https://www.google.com/maps", wait_until="domcontentloaded"
        )
        await page.wait_for_timeout(3000)

        logged_in = False
        for selector in [
            'a[aria-label*="Google Account"]',
            'img[aria-label*="Google Account"]',
            'button[aria-label*="Google Account"]',
        ]:
            if await page.locator(selector).count() > 0:
                logged_in = True
                break

        if not logged_in:
            logger.info(
                "Not logged in. Please log in to your Google account in the browser."
            )
            print("\n" + "=" * 60)
            print("Please log in to your Google account in the browser window.")
            print("After logging in, press Enter here to continue...")
            print("=" * 60 + "\n")
            await asyncio.get_event_loop().run_in_executor(None, input)
        else:
            logger.info("Already logged in to Google.")

    async def _search_place(self, page: Page, place: Place) -> None:
        search_box = page.locator("#searchboxinput")
        if await search_box.count() == 0:
            search_box = page.get_by_role("combobox", name="Search Google Maps")

        await search_box.click()
        await search_box.fill("")
        await search_box.fill(place.search_query)
        await page.keyboard.press("Enter")
        await page.wait_for_load_state("domcontentloaded")
        await page.wait_for_timeout(3000)

    async def _select_first_result(self, page: Page) -> bool:
        # Check if we landed directly on a place details page
        save_btn = page.get_by_role("button", name=re.compile(r"^Save$", re.IGNORECASE))
        if await save_btn.count() > 0 and await save_btn.first.is_visible():
            return True

        # Also check for "Saved" button (already saved place)
        saved_btn = page.get_by_role("button", name=re.compile(r"^Saved$", re.IGNORECASE))
        if await saved_btn.count() > 0 and await saved_btn.first.is_visible():
            return True

        # Try clicking the first search result
        results = page.locator('[role="feed"] a[aria-label]')
        if await results.count() > 0:
            await results.first.click()
            await page.wait_for_load_state("domcontentloaded")
            await page.wait_for_timeout(2500)
            return True

        return False

    async def _is_already_saved(self, page: Page) -> bool:
        saved_btn = page.get_by_role("button", name=re.compile(r"^Saved$", re.IGNORECASE))
        return await saved_btn.count() > 0 and await saved_btn.first.is_visible()

    async def _click_save_button(self, page: Page) -> bool:
        for selector_fn in [
            lambda: page.get_by_role("button", name=re.compile(r"^Save$", re.IGNORECASE)),
            lambda: page.locator('button[aria-label*="Save"]'),
            lambda: page.locator('button[data-value="Save"]'),
        ]:
            btn = selector_fn()
            if await btn.count() > 0 and await btn.first.is_visible():
                await btn.first.click()
                await page.wait_for_timeout(2000)
                return True
        return False

    async def _select_list(self, page: Page) -> bool:
        try:
            list_item = page.get_by_text(self.list_name, exact=False)
            await list_item.first.wait_for(state="visible", timeout=5000)
            await list_item.first.click()
            await page.wait_for_timeout(1500)
            return True
        except Exception:
            return False

    async def _verify_saved(self, page: Page) -> bool:
        try:
            saved_btn = page.get_by_role(
                "button", name=re.compile(r"^Saved$", re.IGNORECASE)
            )
            await saved_btn.first.wait_for(state="visible", timeout=3000)
            return True
        except Exception:
            return False

    async def _save_place(
        self, page: Page, place: Place, index: int, total: int
    ) -> SaveResult:
        logger.info(f"[{index + 1}/{total}] Processing: {place.name} ({place.section})")

        try:
            await self._search_place(page, place)

            if not await self._select_first_result(page):
                logger.warning(f"  No results found for '{place.name}'")
                return SaveResult.NOT_FOUND

            if await self._is_already_saved(page):
                logger.info(f"  Already saved: '{place.name}'")
                return SaveResult.ALREADY_SAVED

            if not await self._click_save_button(page):
                logger.error(f"  Could not find Save button for '{place.name}'")
                return SaveResult.SAVE_FAILED

            if not await self._select_list(page):
                logger.error(f"  Could not find list '{self.list_name}'")
                # Press Escape to close the save dialog
                await page.keyboard.press("Escape")
                return SaveResult.SAVE_FAILED

            if await self._verify_saved(page):
                logger.info(f"  Saved successfully: '{place.name}'")
                return SaveResult.SUCCESS
            else:
                logger.warning(f"  Save not confirmed for '{place.name}'")
                return SaveResult.SAVE_FAILED

        except Exception as e:
            logger.error(f"  Error for '{place.name}': {e}")
            try:
                screenshot_name = re.sub(r"[^\w]", "_", place.name[:20])
                await page.screenshot(path=f"error_{index}_{screenshot_name}.png")
            except Exception:
                pass
            return SaveResult.ERROR
