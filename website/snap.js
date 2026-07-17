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

if (result.status !== null) {
    process.exit(result.status);
} else {
    console.error(`react-snap process was terminated by signal: ${result.signal}`);
    process.exit(1);
}
