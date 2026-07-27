import { z } from "zod";

import { cache } from "../utils/index.js";
import { searchAwwwardsSource } from "../sources/awwwards.js";

import type { ReferenceItem } from "../types/index.js";

export async function searchAwwwards(
    query: string,
    limit: number = 10
) {

    const cacheKey = `awwwards:${query}:${limit}`;

    const cached = cache.get<ReferenceItem[]>(cacheKey);

    if (cached) {

        return {
            success: true,
            cached: true,
            provider: "Awwwards",
            results: cached
        };

    }

    const results = await searchAwwwardsSource(query, limit);

    cache.set(cacheKey, results);

    return {
        success: true,
        cached: false,
        provider: "Awwwards",
        results
    };

}

export const SearchAwwwardsSchema = {
    query: z.string().min(1),
    limit: z.number().min(1).max(50).default(10)
};
