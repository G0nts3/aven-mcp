import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export interface ScreenshotRecord {
    filename: string;
    filePath: string;
    exists: boolean;
}

const CACHE_ROOT = path.resolve(process.cwd(), "cache");

export class ScreenshotManager {

    async ensureProviderDirectory(
        provider: string
    ): Promise<string> {

        const directory = path.join(
            CACHE_ROOT,
            provider.toLowerCase()
        );

        await fs.mkdir(directory, {
            recursive: true
        });

        return directory;

    }

    generateFilename(
        url: string
    ): string {

        return crypto
            .createHash("sha256")
            .update(url)
            .digest("hex")
            .slice(0, 16) + ".png";

    }

    async getScreenshotPath(
        provider: string,
        url: string
    ): Promise<ScreenshotRecord> {

        const directory =
            await this.ensureProviderDirectory(provider);

        const filename =
            this.generateFilename(url);

        const filePath =
            path.join(directory, filename);

        let exists = false;

        try {

            await fs.access(filePath);

            exists = true;

        } catch {

            exists = false;

        }

        return {
            filename,
            filePath,
            exists
        };

    }

}

export const screenshotManager =
    new ScreenshotManager();