import { getImageMetadata } from "./analyzer/index.js";

const metadata = await getImageMetadata(
    "./cache/example.png"
);

console.log(metadata);