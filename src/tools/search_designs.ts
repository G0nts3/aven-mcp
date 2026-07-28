import { z } from "zod";

import { searchPinterest } from "./search_pinterest.js";
import { searchBehance } from "./search_behance.js";
import { searchAwwwards } from "./search_awwwards.js";

import { downloadReference } from "../storage/index.js";

import { deduplicate, rankReferences } from "../ranking/index.js";

export async function searchDesigns(
    query: string,
    limit: number = 20
) {

    const [pinterest, behance, awwwards] = await Promise.all([
        searchPinterest(query, limit),
        searchBehance(query, limit),
        searchAwwwards(query, limit)
    ]);

    const merged = [
        ...pinterest.results,
        ...behance.results,
        ...awwwards.results
    ];

    const unique = deduplicate(merged);

    const ranked = rankReferences(unique);

    const downloaded = (
        await Promise.allSettled(
            ranked
                .slice(0, limit)
                .map(downloadReference)
        )
    )
        .filter(
            (result): result is PromiseFulfilledResult<any> =>
                result.status === "fulfilled"
        )
        .map(result => result.value);

    return {
        success: true,
        query,
        totalFound: merged.length,
        uniqueFound: unique.length,
        downloaded: downloaded.length,
        results: downloaded
};

}

export const SearchDesignsSchema = {
    query: z.string().min(1),
    limit: z.number().min(1).max(50).default(20)
};  