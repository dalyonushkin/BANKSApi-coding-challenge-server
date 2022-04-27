import { existsSync, mkdtempSync, rmdirSync, unlinkSync } from "fs";
import request from "supertest";
import { Transfer } from "../src/model";
import { Server } from "http";

import { startAppServer } from "../src/app";
import { readFileStore } from "../src/fileStore";

//import { server } from "./../src/server";
let server: Server;
let fileStorePath: string;
let fileStoreDir: string;
beforeAll((done) => {

  fileStoreDir = mkdtempSync("tmp-filestore-test-");
  fileStorePath = `${fileStoreDir}/transfers.json`;
  if (existsSync(fileStorePath)) {
    throw Error(`Test env is not empty , check ${fileStorePath}`);
  }
  const servers: { server: Server } = startAppServer(fileStorePath);
  server = servers.server;
  server.once("listening", () => {
    done();
  });
});

afterAll((done) => {
  console.log("Shutting down");
  server.close(done);
  if (existsSync(fileStoreDir)) {
    rmdirSync(fileStoreDir);
  }
});

describe("Transfers Requests", () => {


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

  describe("when post /transfers", () => {
    it("should return 201 when add new record to store ", async () => {
      const transferRec: Transfer = {
        amount: 50,
        date: "2022-01-22",
        iban: "DE1232",
        accountHolder: "a b",
        note: "note"
      };
      return request(server).post("/transfers").send({ transferId: "1a", transfer: transferRec }).set("Accept", "application/json")
        .expect("Content-Type", /json/).expect(201);
    });
    it("should return 409 when record exists", async () => {
      const transferRec: Transfer = {
        amount: 50,
        date: "2022-01-22",
        iban: "DE1232",
        accountHolder: "a b",
        note: "note"
      };
      await request(server).post("/transfers").send({ transferId: "1a", transfer: transferRec }).set("Accept", "application/json")
        .expect("Content-Type", /json/).expect(201);
      return request(server).post("/transfers").send({ transferId: "1a", transfer: transferRec }).set("Accept", "application/json")
        .expect("Content-Type", /json/).expect(409);
    });
    it("should return 400 when bad record", async () => {
      const transferRec: Transfer = {
        amount: 50,
        date: "2022X01-22",
        iban: "DE1232",
        accountHolder: "a b",
        note: "note"
      };
      return request(server).post("/transfers").send({ transferId: "1a", transfer: transferRec }).set("Accept", "application/json")
        .expect("Content-Type", /json/).expect(400);
    });
    it("should return 400 when no transferId", async () => {
      const transferRec: Transfer = {
        amount: 50,
        date: "2022-01-22",
        iban: "DE1232",
        accountHolder: "a b",
        note: "note"
      };
      return request(server).post("/transfers").send({ transfer: transferRec }).set("Accept", "application/json")
        .expect("Content-Type", /json/).expect(400);
    });
    it("should return 400 when no transferRec", async () => {
      return request(server).post("/transfers").send({ transferId: "a" }).set("Accept", "application/json")
        .expect("Content-Type", /json/).expect(400);
    });
  });
  describe("when put /transfers", () => {
    it("should return 200 when update record in store ", async () => {
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
        iban: "DE1232",
        accountHolder: "a b",
        note: "note"
      };
      await request(server).post("/transfers").send({ transferId: "1a", transfer: transferRec }).set("Accept", "application/json");
      return request(server).put("/transfers").send({ transferId: "1a", transfer: transferRec2 }).set("Accept", "application/json")
        .expect("Content-Type", /json/).expect(200);
    });
    it("should return 400 when bad record", async () => {
      const transferRec: Transfer = {
        amount: 50,
        date: "2022X01-22",
        iban: "DE1232",
        accountHolder: "a b",
        note: "note"
      };
      return request(server).put("/transfers").send({ transferId: "1a", transfer: transferRec }).set("Accept", "application/json")
        .expect("Content-Type", /json/).expect(400);
    });
    it("should return 400 when no transferId", async () => {
      const transferRec: Transfer = {
        amount: 50,
        date: "2022-01-22",
        iban: "DE1232",
        accountHolder: "a b",
        note: "note"
      };
      return request(server).put("/transfers").send({ transfer: transferRec }).set("Accept", "application/json")
        .expect("Content-Type", /json/).expect(400);
    });
    it("should return 400 when no transferRec", async () => {
      return request(server).put("/transfers").send({ transferId: "a" }).set("Accept", "application/json")
        .expect("Content-Type", /json/).expect(400);
    });
  });  
  describe("when delete /transfers", () => {
    it("should return 200 when delete existing record from store", async () => {
      const transferRec: Transfer = {
        amount: 50,
        date: "2022-01-22",
        iban: "DE1232",
        accountHolder: "a b",
        note: "note"
      };
      await request(server).post("/transfers").send({ transferId: "1a", transfer: transferRec }).set("Accept", "application/json");
      return request(server).delete("/transfers").send({ transferId: "1a" }).set("Accept", "application/json")
        .expect("Content-Type", /json/).expect(200);
    });
    it("should return 200 when delete non existing record from store", async () => {
      const transferRec: Transfer = {
        amount: 50,
        date: "2022X01-22",
        iban: "DE1232",
        accountHolder: "a b",
        note: "note"
      };
      await request(server).post("/transfers").send({ transferId: "1a", transfer: transferRec }).set("Accept", "application/json");
      return request(server).delete("/transfers").send({ transferId: "1b" }).set("Accept", "application/json")
        .expect("Content-Type", /json/).expect(200);
    });
    it("should return 400 when no transferId", async () => {
      const transferRec: Transfer = {
        amount: 50,
        date: "2022-01-22",
        iban: "DE1232",
        accountHolder: "a b",
        note: "note"
      };
      return request(server).delete("/transfers").send({ transfer: transferRec }).set("Accept", "application/json")
        .expect("Content-Type", /json/).expect(400);
    });

  });  
  describe("when get /transfers", () => {
    it("should return 200 and response with all transfer records", async () => {
      const transferRec: Transfer = {
        amount: 50,
        date: "2022-01-22",
        iban: "DE1232",
        accountHolder: "a b",
        note: "note"
      };
      const transferRec2: Transfer = {
        amount: -50.33,
        date: "2022-01-26",
        iban: "DE1232",
        accountHolder: "a b",
        note: "note"
      };      
      await request(server).post("/transfers").send({ transferId: "1a", transfer: transferRec }).set("Accept", "application/json").expect("Content-Type", /json/).expect(201);;
      await request(server).post("/transfers").send({ transferId: "1b", transfer: transferRec2 }).set("Accept", "application/json").expect("Content-Type", /json/).expect(201);;
      return request(server).get("/transfers").set("Accept", "application/json")
        .expect("Content-Type", /json/).expect({ "1a":transferRec,"1b": transferRec2})
        .expect(200);
  
    });    
  });
});