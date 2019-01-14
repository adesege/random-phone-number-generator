import {ExpressApplication} from "@tsed/common";
import {bootstrap, inject, TestContext} from "@tsed/testing";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {Server} from "../Server";

import "mocha";

describe("Integration", () => {
  beforeEach(bootstrap(Server));
  afterEach(TestContext.reset);

  describe("GET /api/phone-numbers", () => {
    let app: any;
    before(bootstrap(Server));
    before(inject([ExpressApplication], (expressApplication) => {
      app = SuperTest(expressApplication);
    }));

    it("should get all phone-numbers", (done) => {
      app
        .get("/api/phone-numbers")
        .expect(200)
        .end((err: any, response: any) => {
          if (err) {
            throw (err);
          }
          expect(response.body.status).to.be.equal("success");
          expect(response.body.data).to.to.be.an.instanceof(Array);
          done();
        });
    });

    it("should generate a new phone-number", (done) => {
      app
        .post("/api/phone-numbers")
        .expect(201)
        .end((err: any, response: any) => {
          if (err) {
            throw (err);
          }
          expect(response.body.status).to.be.equal("success");
          expect(response.body).to.have.property("data");
          expect(response.body.data[0]).to.equal("0");
          done();
        });
    });
  });
});
