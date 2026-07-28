import type { Page } from "playwright";

import { browserManager, logger } from "../utils/index.js";
import { screenshotManager } from "../storage/index.js";

export interface CaptureResult {
    screenshotPath: string;
}

export async function captureReference(
    projectUrl: string,
    provider: string
): Promise<CaptureResult> {

    let page: Page | null = null;

    try {

        // Check if we've already captured this page
        const record = await screenshotManager.getScreenshotPath(
            provider,
            projectUrl
        );

        if (record.exists) {

            logger.info(`Using cached screenshot: ${record.filename}`);

            return {
                screenshotPath: record.filePath
            };

        }

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

        // Give the page time to finish animations/lazy loading
        await page.waitForTimeout(2000);

        await page.screenshot({

            path: record.filePath,

            fullPage: true,

            type: "png"

        });

        logger.info(`Captured ${projectUrl}`);

        return {

            screenshotPath: record.filePath

        };

    } catch (error) {

        logger.error(error);

        throw error;

    } finally {

        if (page) {

            await page.close();

        }

    }

}