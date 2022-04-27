import { TransferAlreadyExistsInStoreError, TransferNotFoundInStoreError, TransferRecordIsNotValidError } from "../src/errorsDefinitions";
import { addTransfer, deleteTransfer, isValidTransferRecord, Transfer, updateTransfer, validateTransferRecord } from "../src/model";

describe("Model Transfer", () => {
    describe("Validation ", () => {
        [{
            testTransferRecord: {
                amount: "50.1232",
                date: "2022-01-22",
                iban: "DE1232"
            },
            testTransferId: "1"
        }, {
            testTransferRecord: {
                amount: "-50.1232",
                date: "2022-01-22",
                iban: "DE1232"
            }
        }, {
            testTransferRecord: {
                amount: -50.123,
                date: "2022-01-22",
                iban: "DE1232",
                accountHolder: "a b",
                note: "note"
            }
        }].forEach((testData, i) => {
            it(`${i}.validateTransferRecord does not throw error when record is valid`, () => {
                expect(() => { validateTransferRecord(testData.testTransferRecord, testData.testTransferId); }).not.toThrow();
            });
            it(`${i}.isValidTransferRecord returns true when record is valid`, () => {
                expect(isValidTransferRecord(testData.testTransferRecord, testData.testTransferId)).toEqual(true);
            });
        });


        [{
            testTransferRecord: {
                amount: 50,
                date: "2022.01.22",
                iban: "DE1232",
                accountHolder: "a b",
                note: "note"
            },
            testTransferId: 1,
            expectedThrow: ["id", "date"]
        }, {
            testTransferRecord: {
                amount: "-50.22",
                date: "2022-01-52",
                iban: {},
                accountHolder: {},
                note: {}
            },
            testTransferId: "1",
            expectedThrow: ["date", "accountHolder", "iban", "note"]
        }, {
            testTransferRecord: {
                amount: "51,23",
                date: "2022-01-22",
                iban: "DE1232",
                accountHolder: "a b",
                note: "note"
            },
            testTransferId: {},
            expectedThrow: ["id", "amount"]
        }, {
            testTransferRecord: {
                amount: "50XSS12S32",
                date: "2022-01-22",
                iban: "DE1232"
            },
            expectedThrow: ["amount"]
        }, {
            testTransferRecord: 1232,
            expectedThrow: []
        }
        ].forEach((testData, i) => {
            it(`${i}.ivalidateTransferRecord throws error when record is not valid`, () => {
                try {
                    validateTransferRecord(testData.testTransferRecord, testData.testTransferId);
                } catch (error) {
                    expect(error).toBeInstanceOf(TransferRecordIsNotValidError);

                    if (testData.expectedThrow.length > 0) {
                        expect(error.fields.sort()).toEqual(testData.expectedThrow.sort());
                    } else expect(error.fields).toBeUndefined();
                }
            });
            it(`${i}.isValidTransferRecord returns false when record is not valid`, () => {
                expect(isValidTransferRecord(testData.testTransferRecord, testData.testTransferId)).toEqual(false);
            });
        });
    });
    describe("Function ", () => {
        it("addTransfer adds new record to store", () => {
            const transferRec: Transfer = {
                amount: 50,
                date: "2022-01-22",
                iban: "DE1232",
                accountHolder: "a b",
                note: "note"
            };
            expect(addTransfer({}, "1a", transferRec)).toEqual({ "1a": transferRec });
            const store = addTransfer({}, "1a", transferRec);
            expect(addTransfer(store, "1b", transferRec)).toEqual({ "1b": transferRec, "1a": transferRec });
        });
        it("addTransfer should throw error when record exists", () => {
            const transferRec: Transfer = {
                amount: 50,
                date: "2022-01-22",
                iban: "DE1232",
                accountHolder: "a b",
                note: "note"
            };
            const store = addTransfer({}, "1a", transferRec);
            expect(() => { addTransfer(store, "1a", transferRec); }).toThrow(TransferAlreadyExistsInStoreError);
        });
        it("deleteTransfer deletes record from store", () => {
            const transferRec: Transfer = {
                amount: 50,
                date: "2022-01-22",
                iban: "DE1232",
                accountHolder: "a b",
                note: "note"
            };
            expect(addTransfer({}, "1a", transferRec)).toEqual({ "1a": transferRec });
            const store = addTransfer({}, "1a", transferRec);
            expect(deleteTransfer(store, "1a")).toEqual({});
        });
        it("updateTransfer updates record in store", () => {
            const transferRec: Transfer = {
                amount: 50,
                date: "2022-01-22",
                iban: "DE1232",
                accountHolder: "a b",
                note: "note"
            };
            const transferRec2: Transfer = {
                amount: -50,
                date: "2022-01-24",
                iban: "DE1232"
            };
            expect(addTransfer({}, "1a", transferRec)).toEqual({ "1a": transferRec });
            const store = addTransfer({}, "1a", transferRec);
            expect(updateTransfer(store, "1a", transferRec2)).toEqual({ "1a": transferRec2 });
        });
        it("updateTransfer should throw error when record does not exists", () => {
            const transferRec2: Transfer = {
                amount: -50,
                date: "2022-01-24",
                iban: "DE1232"
            };
            expect(() => { updateTransfer({}, "1a", transferRec2); }).toThrow(TransferNotFoundInStoreError);
        });
    });
});