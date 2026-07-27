import type { ReferenceItem } from "../types/index.js";

export function deduplicate(
    items: ReferenceItem[]
): ReferenceItem[] {

    const seen = new Set<string>();

    return items.filter((item) => {

        // Normalize the URL so tiny variations don't create duplicates
        const key = item.imageUrl
            .split("?")[0]
            .trim()
            .toLowerCase();

        if (!key) {
            return false;
        }

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);

        return true;
    });

}