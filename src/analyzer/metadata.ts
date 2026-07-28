import sharp from "sharp";

export interface ImageMetadata {
    width: number;
    height: number;
    format: string;
    aspectRatio: number;
    orientation: "portrait" | "landscape" | "square";
}

export async function getImageMetadata(
    imagePath: string
): Promise<ImageMetadata> {

    const metadata = await sharp(imagePath).metadata();

    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;

    let orientation: ImageMetadata["orientation"] = "square";

    if (width > height) {
        orientation = "landscape";
    } else if (height > width) {
        orientation = "portrait";
    }

    return {
        width,
        height,
        format: metadata.format ?? "unknown",
        aspectRatio: height === 0 ? 0 : width / height,
        orientation
    };

}