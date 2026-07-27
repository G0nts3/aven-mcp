import { chromium, Browser } from "playwright";

class BrowserManager {

    private browser: Browser | null = null;

    async initialize() {
        if (!this.browser) {
            this.browser = await chromium.launch({
                headless: process.env.HEADLESS !== "false"
            });
        }

        return this.browser;
    }

    async getBrowser() {
        return await this.initialize();
    }

    async shutdown() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    

    async newPage() {
        const browser = await this.getBrowser();

        return browser.newPage({
            viewport: {
                width: 1440,
                height: 900
            }
        });
    }

}

export const browserManager = new BrowserManager();