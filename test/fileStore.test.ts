import { readFileStore, store$addTransfer, store$deleteTransfer, store$updateTransfer, writeFileStore } from "../src/fileStore";
import { Transfer, TransfersList } from "../src/model";
import { existsSync, unlinkSync, mkdtempSync, rmdirSync } from "fs";
import { TransferAlreadyExistsInStoreError, TransferNotFoundInStoreError } from "../src/errorsDefinitions";
describe("File Store", () => {
    let fileStorePath: string;
    let fileStoreDir: string;
    beforeAll(() => {
        fileStoreDir = mkdtempSync("tmp-filestore-test-");
        fileStorePath = `${fileStoreDir}/transfers.json`;
        if (existsSync(fileStorePath)) {
            throw Error(`Test env is not empty , check ${fileStorePath}`);
        }

    });
    afterAll(() => {
        if (existsSync(fileStoreDir)) {
            rmdirSync(fileStoreDir);
        }
    });
    beforeEach(() => {
        if (existsSync(fileStorePath)) {
            throw Error(`Test env is not empty , check ${fileStorePath}`);
        }
    });
    afterEach(() => {
        if (existsSync(fileStorePath)) {
            unlinkSync(fileStorePath);
        }
    });
    describe("when processing files", () => {
        it("should write and read content from file", () => {
            const filecontent: TransfersList = {
                a: { amount: 50, date: "2022-01-02", iban: "1232" },
                b: { amount: 50.22, date: "2022-01-02", iban: "1232", accountHolder: "a b", note: "note" }
            };
            writeFileStore(fileStorePath, filecontent);
            const transfers = readFileStore(fileStorePath);
            expect(transfers).toEqual(filecontent);
        });
        it("when open non existing file should return empty oblect", () => {
            const transfers = readFileStore(fileStorePath);
            expect(transfers).toEqual({});
        });
        it("when read a content is same as a content after write", () => {
            const filecontent: TransfersList = {
                a: { amount: 50, date: "2022-01-02", iban: "1232" },
                b: { amount: 50.22, date: "2022-01-02", iban: "1232", accountHolder: "a b", note: "note" }
            };
            const filecontent2: TransfersList = {
                a1: { amount: 501, date: "2022-01-02", iban: "1232" },
                b2: { amount: 501.22, date: "2022-01-02", iban: "1232", accountHolder: "a b", note: "note" }
            };
            writeFileStore(fileStorePath, filecontent);
            const transfers = readFileStore(fileStorePath);
            expect(transfers).toEqual(filecontent);
            const transfers2 = readFileStore(fileStorePath);
            expect(transfers2).toEqual(filecontent);            
            writeFileStore(fileStorePath, filecontent2);
            const transfers3 = readFileStore(fileStorePath);
            expect(transfers3).toEqual(filecontent2);            
            const transfers4 = readFileStore(fileStorePath);
            expect(transfers4).toEqual(filecontent2);        
        });        
    });
    describe("when adding Transfer record ", () => {
        it("should add new record to store", () => {
            const transferRec: Transfer = {
                amount: 50,
                date: "2022-01-22",
                iban: "DE1232",
                accountHolder: "a b",
                note: "note"
            };
            store$addTransfer(fileStorePath, "1a", transferRec);
            store$addTransfer(fileStorePath, "1b", transferRec);
            expect(readFileStore(fileStorePath)).toEqual({ "1a": transferRec, "1b": transferRec });
        });
        it("should throw error if record exists", () => {
            const transferRec: Transfer = {
                amount: 50,
                date: "2022-01-22",
                iban: "DE1232",
                accountHolder: "a b",
                note: "note"
            };
            store$addTransfer(fileStorePath, "1a", transferRec);
            expect(() => { store$addTransfer(fileStorePath, "1a", transferRec); }).toThrow(TransferAlreadyExistsInStoreError);
        });
    });

    it("should delete Transfer record", () => {
        const transferRec: Transfer = {
            amount: 50,
            date: "2022-01-22",
            iban: "DE1232",
            accountHolder: "a b",
            note: "note"
        };
        store$addTransfer(fileStorePath, "1a", transferRec);
        store$addTransfer(fileStorePath, "1b", transferRec);
        expect(readFileStore(fileStorePath)).toEqual({ "1a": transferRec, "1b": transferRec });
        store$deleteTransfer(fileStorePath, "1a");
        expect(readFileStore(fileStorePath)).toEqual({ "1b": transferRec });
    });
    describe("when update Transfer record ", () => {
        it("should update existing Transfer record", () => {
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
            store$addTransfer(fileStorePath, "1a", transferRec);
            store$addTransfer(fileStorePath, "1b", transferRec);
            expect(readFileStore(fileStorePath)).toEqual({ "1a": transferRec, "1b": transferRec });
            store$updateTransfer(fileStorePath, "1a", transferRec2);
            expect(readFileStore(fileStorePath)).toEqual({ "1a": transferRec2, "1b": transferRec });
        });
        it("should throw error if Transfer record does not exists", () => {
            const transferRec2: Transfer = {
                amount: -50,
                date: "2022-01-24",
                iban: "DE1232"
            };
            store$addTransfer(fileStorePath, "1a", transferRec2);
            expect(readFileStore(fileStorePath)).toEqual({ "1a": transferRec2 });
            expect(() => { store$updateTransfer(fileStorePath, "1b", transferRec2); }).toThrow(TransferNotFoundInStoreError);
        });
    });
});