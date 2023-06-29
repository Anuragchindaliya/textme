import request from "supertest";
import app from "../../app";
import { wandResponse } from "./note.controller";

describe("GET /wands", () => {
  it("responds with a json message", (done) => {
    request(app)
      .get("/wands/all")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, wandResponse, done);
  });
});
