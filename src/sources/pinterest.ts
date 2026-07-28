import type { Page } from "playwright";

import { browserManager, logger } from "../utils/index.js";
import type { ReferenceItem } from "../types/index.js";

export async function searchPinterestSource(
    query: string,
    limit: number
): Promise<ReferenceItem[]> {

    let page: Page | null = null;

    try {

        const browser = await browserManager.getBrowser();

        page = await browser.newPage();

        await page.setViewportSize({
            width: 1600,
            height: 3000
        });

        const url =
            `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;

        logger.info(`Pinterest search: ${query}`);

        await page.goto(url, {
            waitUntil: "domcontentloaded"
        });

        await page.waitForTimeout(3000);

        await page.evaluate(async () => {

            for (let i = 0; i < 5; i++) {

                window.scrollBy(0, window.innerHeight);

                await new Promise(resolve => setTimeout(resolve, 800));

            }

            window.scrollTo(0, 0);

        });

        const rawResults = await page.evaluate((limit: number) => {

            const seen = new Set<string>();

            return Array.from(document.querySelectorAll("img"))

                .map((img) => {

                    const srcset = img.getAttribute("srcset");

                    let imageUrl = img.getAttribute("src") ?? "";

                    if (srcset) {

                        const entries = srcset
                            .split(",")
                            .map(entry => entry.trim().split(" ")[0]);

                        if (entries.length > 0) {
                            imageUrl = entries[entries.length - 1];
                        }

                    }

                    return {
                        title:
                            img.getAttribute("alt") ??
                            "Pinterest Result",
                        imageUrl,
                        sourceUrl: window.location.href,
                        width: img.naturalWidth,
                        height: img.naturalHeight
                    };

                })

                .filter(item => {

                    if (!item.imageUrl) return false;

                    if (seen.has(item.imageUrl)) return false;

                    seen.add(item.imageUrl);

                    return (
                        item.width >= 500 &&
                        item.height >= 500
                    );

                })

                .slice(0, limit);

        }, limit);

        const results: ReferenceItem[] = rawResults.map((item) => ({

            id: crypto.randomUUID(),

            title: item.title,

            imageUrl: item.imageUrl,

            projectUrl: item.sourceUrl,

            provider: "Pinterest",

            tags: [],

            width: item.width,

            height: item.height

        }));

        logger.info({
            query,
            imagesFound: results.length
        });

        return results;

    } catch (error) {

        logger.error(error);

        return [];

    } finally {

        if (page) {
            await page.close();
        }

    }

}