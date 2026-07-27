import type { ReferenceItem } from "../types/index.js";
import { scoreReference } from "./score.js";

export function rankReferences(
    items: ReferenceItem[]
): ReferenceItem[] {

    return [...items].sort((a, b) => {
        return scoreReference(b) - scoreReference(a);
    });

}