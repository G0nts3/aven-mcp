import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { searchBehance, SearchBehanceSchema } from "./tools/search_behance.js";

import { searchPinterest } from "./tools/search_pinterest.js";

import {
    searchAwwwards,
    SearchAwwwardsSchema
} from "./tools/search_awwwards.js";

import {
    captureScreenshot,
    CaptureScreenshotSchema
} from "./tools/capture_screenshot.js";


import {
    searchDesigns,
    SearchDesignsSchema
} from "./tools/search_designs.js";

export function createServer() {
    const server = new McpServer(
        {
            name: "aven",
            version: "0.1.0"
        },
        {
            instructions:
                "Aven is a perception engine for collecting and analysing design inspiration."
        }
    );

    server.registerTool(
        "search_pinterest",
        {
            title: "Search Pinterest",
            description: "Search Pinterest for visual inspiration.",
            inputSchema: {
                query: z.string(),
                limit: z.number().min(1).max(50).default(10)
            }
        },
        async ({ query, limit }) => {
            const result = await searchPinterest(query, limit);

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(result, null, 2)
                    }
                ]
            };
        }
    );


    server.registerTool(
    "capture_screenshot",
    {
        title: "Capture Screenshot",
        description: "Capture a screenshot of any webpage.",
        inputSchema: CaptureScreenshotSchema
    },
    async ({ url, fullPage }) => {

        const result =
            await captureScreenshot(url, fullPage);

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2)
                }
            ]
        };

    }
);

server.registerTool(
    "search_behance",
    {
        title: "Search Behance",
        description: "Search Behance for design inspiration.",
        inputSchema: SearchBehanceSchema
    },
    async ({ query, limit }) => {

        const result = await searchBehance(query, limit);

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2)
                }
            ]
        };

    }
);

server.registerTool(
    "search_awwwards",
    {
        title: "Search Awwwards",
        description: "Search Awwwards for award-winning websites.",
        inputSchema: SearchAwwwardsSchema
    },
    async ({ query, limit }) => {

        const result = await searchAwwwards(query, limit);

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2)
                }
            ]
        };

    }
);

server.registerTool(
    "search_designs",
    {
        title: "Search Designs",
        description: "Search every design provider simultaneously.",
        inputSchema: SearchDesignsSchema
    },
    async ({ query, limit }) => {

        const result = await searchDesigns(query, limit);

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2)
                }
            ]
        };

    }
);

    return server;
}