const { spawnSync } = require("child_process");
const { ensurePuppeteer } = require("./ensure-puppeteer");

const chromePath = ensurePuppeteer();

const env = Object.assign({}, process.env);
if (chromePath) {
    env.PUPPETEER_EXECUTABLE_PATH = chromePath;
}

const reactSnapBin = require.resolve("react-snap/bin/reactSnap.js");
const result = spawnSync(process.execPath, [reactSnapBin], {
    stdio: "inherit",
    env,
    cwd: process.cwd(),
});

process.exit(result.status !== null ? result.status : 1);
