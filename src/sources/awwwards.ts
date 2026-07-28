import type { Page } from "playwright";

import { browserManager, logger } from "../utils/index.js";
import type { ReferenceItem } from "../types/index.js";

export async function searchAwwwardsSource(
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
            `https://www.awwwards.com/websites/${encodeURIComponent(query)}/`;

        logger.info(`Awwwards search: ${query}`);

        await page.goto(url, {
            waitUntil: "networkidle",
            timeout: 30000
        });

        await page.waitForTimeout(2000);

        await page.evaluate(async () => {

            for (let i = 0; i < 5; i++) {

                window.scrollBy(0, window.innerHeight);

                await new Promise(resolve => setTimeout(resolve, 800));

            }

            window.scrollTo(0, 0);

        });

        const raw = await page.evaluate((limit) => {

            const seen = new Set<string>();

            return Array.from(document.querySelectorAll("img"))

                .filter(img => {

                    const src = img.getAttribute("src") ?? "";

                    if (!src) return false;

                    if (seen.has(src)) return false;

                    seen.add(src);

                    return (
                        img.naturalWidth >= 500 &&
                        img.naturalHeight >= 500
                    );

                })

                .slice(0, limit)

                .map((img, index) => ({

                    title:
                        img.getAttribute("alt") ??
                        `Awwwards Site ${index + 1}`,

                    imageUrl:
                        img.getAttribute("src") ?? "",

                    sourceUrl:
                        window.location.href,
                    width: 
                        img.naturalWidth,
                    height: 
                        img.naturalHeight

                }));

        }, limit);

        const results: ReferenceItem[] = raw.map(item => ({
            id: crypto.randomUUID(),
            title: item.title,
            imageUrl: item.imageUrl,
            projectUrl: item.sourceUrl,
            provider: "Awwwards",
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