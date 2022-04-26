import request from "supertest";

import { server } from "./../src/server";

beforeAll((done) => {

  server.once("listening", () => {
    done();
  });
});
afterAll((done) => {
  console.log("Shutting down");
  server.close(done);
});



describe("when call /test", () => {
  it("return responce in body", () => {
    return request(server).post("/test").send({name: 'john'}).set('Accept', 'application/json')
      .expect('Content-Type', /json/).expect({name: 'john'})
      .expect(200);

  });
});
