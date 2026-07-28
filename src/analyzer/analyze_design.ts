import type { ReferenceItem } from "../types/index.js";
import { getImageMetadata } from "./metadata.js";

export interface DesignAnalysis {
    reference: ReferenceItem;
    metadata: Awaited<ReturnType<typeof getImageMetadata>>;
}

export async function analyzeDesign(
    reference: ReferenceItem
): Promise<DesignAnalysis> {

    if (!reference.screenshotPath) {
        throw new Error("Reference has no screenshot.");
    }

    const metadata = await getImageMetadata(
        reference.screenshotPath
    );

    return {
        reference,
        metadata
    };

}