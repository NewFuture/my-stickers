const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

function ensurePuppeteer() {
    try {
        const puppeteerPackage = require.resolve("puppeteer/package.json");
        const pkgDir = path.dirname(puppeteerPackage);
        let executablePath = "";

        try {
            const puppeteer = require("puppeteer");
            executablePath = typeof puppeteer.executablePath === "function" ? puppeteer.executablePath() : "";
        } catch (error) {
            if (
                error?.code === "MODULE_NOT_FOUND" ||
                error?.message?.includes("Could not find expected browser")
            ) {
                executablePath = "";
            } else {
                throw error;
            }
        }

        if (!executablePath || !fs.existsSync(executablePath)) {
            fs.rmSync(path.join(pkgDir, ".local-chromium"), { recursive: true, force: true });
            execFileSync(process.execPath, [require.resolve("puppeteer/install.js")], {
                stdio: "inherit",
            });
        }
    } catch (error) {
        console.error(
            `Failed to prepare Puppeteer Chromium: ${error.message}. ` +
                "Try running yarn install or deleting Puppeteer's local browser cache."
        );
        process.exit(1);
    }
}

ensurePuppeteer();
