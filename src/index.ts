import "dotenv/config";

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { createServer } from "./server.js";
import { logger, browserManager } from "./utils/index.js";

async function bootstrap() {
    const server = createServer();

    const transport = new StdioServerTransport();

    await server.connect(transport);
}

bootstrap().catch(async (error) => {
    logger.error(error);

    await browserManager.shutdown();

    process.exit(1);
});

process.on("SIGINT", async () => {
    logger.info("Stopping Aven...");

    await browserManager.shutdown();

    process.exit(0);
});

process.on("SIGTERM", async () => {
    logger.info("Stopping Aven...");

    await browserManager.shutdown();

    process.exit(0);
});