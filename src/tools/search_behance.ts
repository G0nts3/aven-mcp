import { z } from "zod";

import { cache } from "../utils/index.js";
import { searchBehanceSource } from "../sources/behance.js";

import type { ReferenceItem } from "../types/index.js";

export async function searchBehance(
    query: string,
    limit: number = 10
) {

    const cacheKey = `behance:${query}:${limit}`;

    const cached = cache.get<ReferenceItem[]>(cacheKey);

    if (cached) {

        return {
            success: true,
            cached: true,
            provider: "Behance",
            results: cached
        };

    }

    const results = await searchBehanceSource(query, limit);

    cache.set(cacheKey, results);

    return {
        success: true,
        cached: false,
        provider: "Behance",
        results
    };

}

export const SearchBehanceSchema = {
    query: z.string().min(1),
    limit: z.number().min(1).max(50).default(10)
};