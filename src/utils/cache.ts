import NodeCache from "node-cache";

export const cache = new NodeCache({
    stdTTL: Number(process.env.CACHE_TTL ?? 600),
    checkperiod: 120,
    useClones: false
});