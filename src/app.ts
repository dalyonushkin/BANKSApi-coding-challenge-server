import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import errorHandler from "errorhandler";
import express from "express";

import { Server } from "http";

import { addLogger } from "./util/logger";

//Create logger
const logger = addLogger("app");

// Create Express server
export const app = express();

// Express configuration
app.set("port", process.env.PORT || 3003);

const fileStorePath = "./filestore/transfers.json";
/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());
app.use(cookieParser());
app.use(bodyParser.json());

app.post("/test", (req, response, next) => {
  logger.debug("return body:");
  logger.debug(req.body);
  response.status(200).json(req.body);
});

/**
 * Add transfer record route
 * Response statuses: 201, 400, 500
 */
app.post("/transfers", (req, response, next) => {
  logger.debug("return body:");
  logger.debug(req.body);
  response.status(201).json(req.body);
});

/**
 * Get all transfer records route
 * Response statuses: 200, 500
 */
app.get("/transfers", (req, response, next) => {
  logger.debug("return body:");
  logger.debug(req.body);
  response.status(200).json(req.body);
});

/**
 * Delete transfer record route
 * Response statuses: 200, 400, 500
 */
app.delete("/transfers", (req, response, next) => {
  logger.debug("return body:");
  logger.debug(req.body);
  response.status(200).json(req.body);
});

/**
 * Update transfer record route
 * Response statuses: 200, 400, 404, 500
 */
app.put("/transfers", (req, response, next) => {
  logger.debug("return body:");
  logger.debug(req.body);
  response.status(200).json(req.body);
});

export const startAppServer = (): { server: Server } => {
  /**
   * Start Express server.
   */


  const server = app.listen(app.get("port"), () => {
    console.log(
      "  App is running at http://localhost:%d in %s mode",
      app.get("port"),
      app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");

  });


  return { server: server };
};