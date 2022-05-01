/**
 * Express app and REST definitions
 */
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import errorHandler from "errorhandler";
import cors from "cors";

import express from "express";


import { Server } from "http";
import { TransferAlreadyExistsInStoreError, TransferRecordIsNotValidError } from "./errorsDefinitions";
import { readFileStore, store$addTransfer, store$deleteTransfer, store$updateTransfer } from "./fileStore";
import { validateTransferRecord, validateTransferRecordId } from "./model";

import { addLogger } from "./util/logger";

//Create logger
const logger = addLogger("app");

// Create Express server
export const app = express();

// Express configuration
app.set("port", process.env.PORT || 3003);

/**
 * Error Handler. Provides full stack - remove for production
 */

app.use(cors());
app.use(errorHandler());
app.use(cookieParser());
app.use(bodyParser.json());


/**
 * Add transfer record route
 * Response statuses: 
 * 201 - created, 
 * 400 - not valid data
 * 409 - record exists
 * 500 - other errors
 */
app.post("/transfers", (req, response, next) => {
  try {
    const transferRecordId = req.body.transferId;
    const transferRecord = req.body.transfer;
    if (!transferRecordId) {
      response.status(400).json("transferId is required");
    }
    else if (!transferRecord) {
      response.status(400).json("transferRecord is required");
    }
    else {
      validateTransferRecord(transferRecord, transferRecordId);
      store$addTransfer(app.get("fileStorePath"), transferRecordId, transferRecord);
      response.status(201).json({});
    }
  } catch (error) {
    if (error instanceof TransferRecordIsNotValidError) {
      response.status(400).json(`${error.message}, details: ${JSON.stringify(error.fields)}`);
    }
    if (error instanceof TransferAlreadyExistsInStoreError) {
      response.status(409).json(`${error.message}`);
    }
    else response.status(500).json(error.message);
  }
});

/**
 * Get all transfer records route
 * Response statuses: 
 * 200 - get all records 
 * 500 - other errors
 */
app.get("/transfers", (req, response, next) => {
  try {
    const transfers = readFileStore(app.get("fileStorePath"));
    response.status(200).json(transfers);
  } catch (error) {
    response.status(500).json(error.message);
  }
});

/**
 * Delete transfer record route
 * Response statuses: 200, 400, 500
 * Response statuses: 
 * 200 - record deleted, 
 * 400 - not valid data
 * 500 - other errors
 */
app.delete("/transfers", (req, response, next) => {
  try {
    const transferRecordId = req.body.transferId;
    if (!transferRecordId) {
      response.status(400).json("transferId is required");
    }
    else {
      validateTransferRecordId(transferRecordId);
      store$deleteTransfer(app.get("fileStorePath"), transferRecordId);
      response.status(200).json({});
    }
  } catch (error) {
    if (error instanceof TransferRecordIsNotValidError) {
      response.status(400).json(`${error.message}, details: ${JSON.stringify(error.fields)}`);
    }
    else response.status(500).json(error.message);
  }
});

/**
 * Update transfer record route
 * Response statuses: 200, 400, 404, 500
 * Response statuses: 
 * 200 - record updated, 
 * 400 - not valid data
 * 500 - other errors
 */
app.put("/transfers", (req, response, next) => {
  try {
    const transferRecordId = req.body.transferId;
    const transferRecord = req.body.transfer;
    if (!transferRecordId) {
      response.status(400).json("transferId is required");
    }
    else if (!transferRecord) {
      response.status(400).json("transferRecord is required");
    }
    else {
      validateTransferRecord(transferRecord, transferRecordId);
      store$updateTransfer(app.get("fileStorePath"), transferRecordId, transferRecord);
      response.status(200).json({});
    }
  } catch (error) {
    if (error instanceof TransferRecordIsNotValidError) {
      response.status(400).json(`${error.message}, details: ${JSON.stringify(error.fields)}`);
    }
    if (error instanceof TransferAlreadyExistsInStoreError) {
      response.status(409).json(`${error.message}`);
    }
    else response.status(500).json(error.message);
  }
});

export const startAppServer = (fileStorePath?: string): { server: Server } => {
  /**
   * Start Express server.
   */


  const server = app.listen(app.get("port"), () => {
    app.set("fileStorePath", fileStorePath || process.env.FILE_STORE_PATH || "./filestore/transfers.json");
    console.log(
      "  App is running at http://localhost:%d in %s mode",
      app.get("port"),
      app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");

  });


  return { server: server };
};