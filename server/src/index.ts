import * as http from "http";
import * as debug from "debug";
import * as Express from "express";
// import * as appInsights from "applicationinsights";

import { Config } from "./config";
import { i18nMiddleware } from "./middleware/i18n";

import { apiRouter, botRouter, pong } from "./router";

// Initialize debug logging module
const log = debug("stickers");

log(`Initializing Microsoft Teams Express hosted App...`);

// Initialize dotenv, to use .env file settings if existing
// tslint:disable-next-line:no-var-requires
require("dotenv").config();


// Set up app insights
// appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY).start();

// Create the Express webserver
const express = Express();

// Inject the raw request body onto the request object
express.use(Express.json({
    verify: (req, res, buf: Buffer, encoding: string): void => {
        (req as any).rawBody = buf.toString();
    }
}));
express.use(Express.urlencoded({ extended: true }));
express.use(i18nMiddleware);

// routing
express.use(Config.BOT_API_ENDPONT, botRouter);
express.use("/api", apiRouter);
express.get("/ping", pong);

// Set the port
const port = Config.PORT;
express.set("port", port);
// Start the webserver
http.createServer(express).listen(port, () => {
    log(`Server running on ${port}`);
});

