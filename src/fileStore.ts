/**
 * Simple File storage for JSON object
 */
import { readFileSync, writeFileSync } from "fs";
import { InternalStoreReadWriteError } from "./errorsDefinitions";
import { addTransfer, deleteTransfer, Transfer, TransfersList, updateTransfer } from "./model";

export function readFileStore(fileStorePath: string): TransfersList {
  try {
    const filecontent = readFileSync(fileStorePath, {encoding:"utf8", flag:"a+"});
    if (!filecontent) return {};
    return JSON.parse(filecontent);
  } catch (e) {
    throw new InternalStoreReadWriteError(e.message);
  }
}

export function writeFileStore(fileStorePath: string, filecontent: TransfersList) {
  try {
    writeFileSync(fileStorePath, JSON.stringify(filecontent), {encoding:"utf8", flag:"w"});
  } catch (e) {
    throw new InternalStoreReadWriteError(e.message);
  }

}

export function store$updateTransfer(fileStorePath: string, id: string, updatedRecord: Transfer) {
  const transfers = updateTransfer(readFileStore(fileStorePath), id, updatedRecord);
  writeFileStore(fileStorePath,transfers);
}

export function store$addTransfer(fileStorePath: string, id: string, newRecord: Transfer) {
  const transfers = addTransfer(readFileStore(fileStorePath), id, newRecord);
  writeFileStore(fileStorePath,transfers);
}

export function store$deleteTransfer(fileStorePath: string, id: string) {
  const transfers = deleteTransfer(readFileStore(fileStorePath), id);
  writeFileStore(fileStorePath,transfers);
}