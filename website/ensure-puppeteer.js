const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const SYSTEM_CHROME_PATHS = [
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
];

function findSystemChrome() {
    for (const chromePath of SYSTEM_CHROME_PATHS) {
        if (fs.existsSync(chromePath)) {
            return chromePath;
        }
    }
    return null;
}

/**
 * Ensures Puppeteer's Chromium is ready to use.
 * Returns the executable path to use, or null to use Puppeteer's default.
 */
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
            // Remove any env vars that would cause the download to be skipped
            const env = Object.assign({}, process.env);
            for (const key of Object.keys(env)) {
                if (/PUPPETEER_SKIP/i.test(key)) {
                    delete env[key];
                }
            }
            execFileSync(process.execPath, [require.resolve("puppeteer/install.js")], {
                stdio: "inherit",
                env,
            });

            // Re-check after installation attempt
            try {
                delete require.cache[require.resolve("puppeteer")];
            } catch (_) {}
            try {
                const puppeteer = require("puppeteer");
                executablePath = typeof puppeteer.executablePath === "function" ? puppeteer.executablePath() : "";
            } catch (_) {
                executablePath = "";
            }

            if (!executablePath || !fs.existsSync(executablePath)) {
                const systemChrome = findSystemChrome();
                if (systemChrome) {
                    console.log(`Puppeteer bundled Chromium unavailable; using system Chrome at ${systemChrome}`);
                    return systemChrome;
                }
                throw new Error(
                    `Chromium not found at ${executablePath || "(unknown)"} after installation attempt, ` +
                        "and no system Chrome was found. Try running yarn install again."
                );
            }
        }

        return null;
    } catch (error) {
        console.error(
            `Failed to prepare Puppeteer Chromium: ${error.message}. ` +
                "Try running yarn install or deleting Puppeteer's local browser cache."
        );
        process.exit(1);
    }
}

if (require.main === module) {
    ensurePuppeteer();
}

module.exports = { ensurePuppeteer, findSystemChrome };
