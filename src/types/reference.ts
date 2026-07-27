export interface ReferenceItem {

    id: string;

    title: string;

    imageUrl: string;

    sourceUrl: string;

    provider:
        | "Pinterest"
        | "Behance"
        | "Awwwards";

    tags: string[];

    width?: number;

    height?: number;

    metadata?: {

        colors?: string[];

        fonts?: string[];

        category?: string;

    };

}