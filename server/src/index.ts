import * as http from "http";
import * as debug from "debug";

import * as Express from "express";
// import * as proxy from "express-http-proxy";

import { MsTeamsApiRouter } from "express-msteams-host";
import router from "./router";
import * as allComponents from "./TeamsAppsComponents";

// import * as appInsights from "applicationinsights";


// Initialize debug logging module
const log = debug("msteams");

log(`Initializing Microsoft Teams Express hosted App...`);

// Initialize dotenv, to use .env file settings if existing
// tslint:disable-next-line:no-var-requires
require("dotenv").config();


// Set up app insights
// appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY).start();


// The import of components has to be done AFTER the dotenv config

// Create the Express webserver
const express = Express();

// Inject the raw request body onto the request object
express.use(Express.json({
    verify: (req, res, buf: Buffer, encoding: string): void => {
        (req as any).rawBody = buf.toString();
    }
}));
express.use(Express.urlencoded({ extended: true }));

// express.use("/web/", proxy("localhost:3000"));
// express.use("/static/", proxy("http://localhost:3000/static/"));


// Add simple logging
// express.use(morgan("tiny"));

// routing for bots, connectors and incoming web hooks - based on the decorators
// For more information see: https://www.npmjs.com/package/express-msteams-host
express.use(MsTeamsApiRouter(allComponents));

express.use("/api", router);

// routing for pages for tabs and connector configuration
// For more information see: https://www.npmjs.com/package/express-msteams-host
// express.use(MsTeamsPageRouter({
//     root: path.join(__dirname, "web/"),
//     components: allComponents
// }));

// // Set default web page
// express.use("/", Express.static(path.join(__dirname, "web/"), {
//     index: "index.html"
// }));

express.get("/ping", (res, req, next) => {
    req.status(200).send("pong").end();
    next();
});

// Set the port
const port = process.env.port || process.env.PORT || 3007;
express.set("port", port);

// Start the webserver
http.createServer(express).listen(port, () => {
    log(`Server running on ${port}`);
});

