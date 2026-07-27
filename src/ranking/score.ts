import type { ReferenceItem } from "../types/index.js";

const providerScores = {
    Awwwards: 30,
    Behance: 20,
    Pinterest: 10
} as const;

export function scoreReference(item: ReferenceItem): number {

    let score = providerScores[item.provider] ?? 0;

    if (item.imageUrl.includes("original")) score += 15;
    if (item.imageUrl.includes("1200")) score += 10;
    if (item.imageUrl.includes("736")) score += 8;
    if (item.imageUrl.includes("564")) score += 6;

    if (item.title.length > 15)
        score += 2;

    return score;
}