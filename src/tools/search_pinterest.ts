import { z } from "zod";

import { cache } from "../utils/cache.js";
import { searchPinterestSource } from "../sources/pinterest.js";

import type { ReferenceItem } from "../types/index.js";

export const SearchPinterestSchema = {
    query: z.string().min(1),
    limit: z.number().min(1).max(50).default(10)
};

export async function searchPinterest(
    query: string,
    limit: number = 10
) {

    const cacheKey = `pinterest:${query}:${limit}`;

    const cached = cache.get<ReferenceItem[]>(cacheKey);

    if (cached) {
        return {
            success: true,
            cached: true,
            provider: "Pinterest",
            results: cached
        };
    }

    const results = await searchPinterestSource(query, limit);

    cache.set(cacheKey, results);

    return {
        success: true,
        cached: false,
        provider: "Pinterest",
        results
    };
}