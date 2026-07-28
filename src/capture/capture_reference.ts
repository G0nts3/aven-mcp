import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

import type { Page } from "playwright";

import { browserManager, logger } from "../utils/index.js";

const CACHE_ROOT = path.resolve(process.cwd(), "cache");

export interface CaptureResult {
    screenshotPath: string;
}

export async function captureReference(
    projectUrl: string,
    provider: string
): Promise<CaptureResult> {

    let page: Page | null = null;

    try {

        const browser = await browserManager.getBrowser();

        page = await browser.newPage({

            viewport: {
                width: 1440,
                height: 900
            }

        });

        await page.goto(projectUrl, {
            waitUntil: "networkidle",
            timeout: 60000
        });

        await page.waitForTimeout(2000);

        const directory = path.join(
            CACHE_ROOT,
            provider.toLowerCase()
        );

        await fs.mkdir(directory, {
            recursive: true
        });

        const filename =
            crypto
                .createHash("sha256")
                .update(projectUrl)
                .digest("hex")
                .slice(0, 16) + ".png";

        const screenshotPath =
            path.join(directory, filename);

        await page.screenshot({

            path: screenshotPath,

            fullPage: true,

            type: "png"

        });

        logger.info(`Captured ${projectUrl}`);

        return {

            screenshotPath

        };

    } finally {

        if (page) {

            await page.close();

        }

    }

}