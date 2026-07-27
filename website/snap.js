'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ip = require.resolve('puppeteer/install.js');
const chromiumDir = path.join(path.dirname(ip), '.local-chromium');

function findChromeBinary(dir) {
    if (!fs.existsSync(dir)) return null;
    for (const revision of fs.readdirSync(dir)) {
        const revPath = path.join(dir, revision);
        const linuxBin = path.join(revPath, 'chrome-linux', 'chrome');
        const winBin = path.join(revPath, 'chrome-win', 'chrome.exe');
        if (fs.existsSync(linuxBin)) return linuxBin;
        if (fs.existsSync(winBin)) return winBin;
    }
    return null;
}

// If .local-chromium exists but has no valid chrome binary, clean it up to force a fresh download
if (fs.existsSync(chromiumDir) && !findChromeBinary(chromiumDir)) {
    fs.rmSync(chromiumDir, { recursive: true, force: true });
}

// Try to download Chrome via puppeteer's install script
require(ip);

// Prepare environment for react-snap
const env = { ...process.env };

// If puppeteer's Chrome is still not available, fall back to system-installed Chrome
if (!findChromeBinary(chromiumDir)) {
    const systemChromePaths = [
        '/usr/bin/google-chrome-stable',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
    ];
    for (const chromePath of systemChromePaths) {
        if (fs.existsSync(chromePath)) {
            process.stderr.write('Puppeteer Chrome not found; falling back to system Chrome: ' + chromePath + '\n');
            env.PUPPETEER_EXECUTABLE_PATH = chromePath;
            break;
        }
    }
}

// Run react-snap with the configured environment
const result = spawnSync('yarn', ['react-snap'], {
    stdio: 'inherit',
    env,
    shell: process.platform === 'win32',
});
process.exit(result.status !== null ? result.status : 1);
