/**
 * Model with validations
 */

import { TransferAlreadyExistsInStoreError, TransferNotFoundInStoreError, TransferRecordIsNotValidError } from "./errorsDefinitions";
import { isValidDate, isValidNumber, isValidString } from "./util/utils";

export type Transfer = {
    accountHolder?: string;
    iban: string;
    amount: number;
    date: string;
    note?: string;
};
export type TransfersList = {
    [key: string]: Transfer;
};


export function updateTransfer(transfers: TransfersList, id: string, updatedRecord: Transfer): TransfersList {
    if (!transfers[id]) throw new TransferNotFoundInStoreError(id);
    const updatedTransfers = { ...transfers };
    updatedTransfers[id] = updatedRecord;
    return updatedTransfers;
}

export function addTransfer(transfers: TransfersList, id: string, newRecord: Transfer): TransfersList {
    if (transfers[id]) throw new TransferAlreadyExistsInStoreError(id);
    const updatedTransfers = { ...transfers };
    updatedTransfers[id] = newRecord;
    return updatedTransfers;
}

export function deleteTransfer(transfers: TransfersList, id: string): TransfersList {
    const updatedTransfers = { ...transfers };
    delete updatedTransfers[id];
    return updatedTransfers;
}

export function validateTransferRecordId(transferId: any) {
    const invalidFields: string[] = [];
    if (!transferId || !isValidString(transferId)) invalidFields.push("id");
    if (invalidFields.length > 0) throw new TransferRecordIsNotValidError(invalidFields);
}

//validation should work with any types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateTransferRecord(record: any, transferId?: any) {
    const invalidFields: string[] = [];
    if (typeof record !== "object") throw new TransferRecordIsNotValidError();
    if (record.accountHolder && !isValidString(record.accountHolder)) invalidFields.push("accountHolder");
    if (record.note && !isValidString(record.note)) invalidFields.push("note");
    if (!record.iban || (record.iban && !isValidString(record.iban))) invalidFields.push("iban");
    if (!record.amount || (record.amount && !isValidNumber(record.amount))) invalidFields.push("amount");
    if (!record.date || (record.date && !isValidDate(record.date))) invalidFields.push("date");
    if (transferId) {
        try {
            validateTransferRecordId(transferId);
        } catch (error) {
            invalidFields.push("id");
        }
    }
    if (invalidFields.length > 0) throw new TransferRecordIsNotValidError(invalidFields);
}


//validation should work with any types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isValidTransferRecord(record: any, transferId?: any): boolean {
    try {
        validateTransferRecord(record, transferId);
    } catch (error) {
        return false;
    }
    return true;
}
