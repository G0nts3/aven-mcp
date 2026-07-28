import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

import type { ReferenceItem } from "../types/index.js";

const CACHE_ROOT = path.resolve(process.cwd(), "cache");

export interface DownloadedReference extends ReferenceItem {
    localPath: string;
}

export async function downloadReference(
    item: ReferenceItem
): Promise<DownloadedReference> {

    // Create a deterministic filename from the image URL
    const hash = crypto
        .createHash("sha256")
        .update(item.imageUrl)
        .digest("hex")
        .slice(0, 16);

    const provider = item.provider.toLowerCase();

    const extension =
        getExtension(item.imageUrl) ?? ".jpg";

    const directory =
        path.join(CACHE_ROOT, provider);

    await fs.mkdir(directory, {
        recursive: true
    });

    const filePath =
        path.join(directory, `${hash}${extension}`);

    // Skip download if already cached
    try {

        await fs.access(filePath);

        return {
            ...item,
            localPath: filePath
        };

    } catch {
        // File doesn't exist, continue.
    }

    const response = await fetch(item.imageUrl);

    if (!response.ok) {
        throw new Error(
            `Failed to download ${item.imageUrl}`
        );
    }

    const bytes =
        Buffer.from(await response.arrayBuffer());

    await fs.writeFile(filePath, bytes);

    return {
        ...item,
        localPath: filePath
    };

}

function getExtension(
    url: string
): string | null {

    try {

        const pathname =
            new URL(url).pathname;

        const extension =
            path.extname(pathname);

        return extension || ".jpg";

    } catch {

        return ".jpg";

    }

}