import type { ReferenceItem } from "../types/index.js";

export function scoreReference(item: ReferenceItem): number {

    let score = 0;

    // Prefer higher-resolution images
    if (item.width && item.height) {

        const pixels = item.width * item.height;

        if (pixels >= 2_000_000) score += 40;
        else if (pixels >= 1_000_000) score += 30;
        else if (pixels >= 500_000) score += 20;
        else score += 10;

    }

    // Provider weighting
    switch (item.provider) {

        case "Awwwards":
            score += 30;
            break;

        case "Behance":
            score += 20;
            break;

        case "Pinterest":
            score += 10;
            break;

    }

    // Reward descriptive titles
    if (item.title.length > 20) {
        score += 10;
    }

    return score;

}