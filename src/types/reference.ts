export interface ReferenceItem {

    id: string;

    title: string;

    provider:
        | "Pinterest"
        | "Behance"
        | "Awwwards";

    // Direct image
    imageUrl: string;

    // Page containing the design
    projectUrl: string;

    // Local cached screenshot/download
    screenshotPath?: string;

    tags: string[];

    metadata?: {
        colors?: string[];
        fonts?: string[];
        category?: string;
    };

    width?: number;
    height?: number;

}