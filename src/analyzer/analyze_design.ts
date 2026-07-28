import type { ReferenceItem } from "../types/index.js";

export interface DesignAnalysis {
    reference: ReferenceItem;
    metadata?: unknown;
    colors?: unknown;
}

export async function analyzeDesign(
    reference: ReferenceItem
): Promise<DesignAnalysis> {

    return {
        reference
    };

}