//validation
export class InternalStoreReadWriteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InternalStoreReadWriteError";
  }
}
class StoreModificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StoreModificationError";
  }
}
export class TransferNotFoundInStoreError extends StoreModificationError {
  id: string;
  constructor(id: string) {
    super("Transfer record not found.");
    this.name = "TransferNotFoundInStoreError";
    this.id = id;
  }
}
export class TransferAlreadyExistsInStoreError extends StoreModificationError {
  id: string;
  constructor(id: string) {
    super("Transfer record already exists.");
    this.name = "TransferAlreadyExistsInStoreError";
    this.id = id;
  }
}

export class TransferRecordIsNotValidError extends StoreModificationError {
  fields: string[]
  constructor(fields?: string[]) {
    super("Transfer record is not valid.");
    this.name = "TransferRecordIsNotValidError";
    this.fields = fields;
  }
}