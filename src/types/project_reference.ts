export interface ProjectReference {

    id: string;

    title: string;

    projectUrl: string;

    provider:
        | "Pinterest"
        | "Behance"
        | "Awwwards";

    tags: string[];

    screenshotPath?: string;

}