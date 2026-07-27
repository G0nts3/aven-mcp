import { z } from "zod";
import path from "node:path";
import fs from "node:fs/promises";

import { browserManager, logger } from "../utils/index.js";

export const CaptureScreenshotSchema = {
    url: z.string().url(),
    fullPage: z.boolean().default(true)
};

export async function captureScreenshot(
    url: string,
    fullPage: boolean = true
) {
    const browser = await browserManager.getBrowser();

    const page = await browser.newPage();

    try {
        logger.info(`Capturing screenshot: ${url}`);

        await page.goto(url, {
            waitUntil: "networkidle",
            timeout: 30000
        });

        const outputDir = path.resolve(process.cwd(), "screenshots");

        await fs.mkdir(outputDir, {
            recursive: true
        });

        const filename =
            `${Date.now()}.png`;

        const filepath =
            path.join(outputDir, filename);

        await page.screenshot({
            path: filepath,
            fullPage
        });

        return {
            success: true,
            url,
            path: filepath
        };

    } catch (error) {

        logger.error(error);

        return {
            success: false,
            error: error instanceof Error
                ? error.message
                : "Unknown error"
        };

    } finally {

        await page.close();

    }
}