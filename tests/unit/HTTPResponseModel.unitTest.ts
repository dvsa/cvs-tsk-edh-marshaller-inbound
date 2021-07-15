import { HTTPResponse } from "../../src/models/HTTPResponse";

describe("HTTP Response Model", () => {
  context("Constructor", () => {
    it("creates Headers (with seed headers)", () => {
      const resp = new HTTPResponse(418, "winning", { thing: true });
      expect(resp.headers["Access-Control-Allow-Origin"]).toBeTruthy();
      expect(resp.headers["Access-Control-Allow-Credentials"]).toBeTruthy();
      expect(resp.headers["X-Content-Type-Options"]).toBeTruthy();
      expect(resp.headers["X-XSS-Protection"]).toBeTruthy();
      expect(resp.headers.thing).toBeTruthy();
      expect(resp.statusCode).toEqual(418);
      expect(resp.body).toEqual(JSON.stringify("winning"));
    });
    it("creates Headers (without  seed headers)", () => {
      const resp = new HTTPResponse(418, "winning");
      expect(resp.headers["Access-Control-Allow-Origin"]).toBeTruthy();
      expect(resp.headers["Access-Control-Allow-Credentials"]).toBeTruthy();
      expect(resp.headers["X-Content-Type-Options"]).toBeTruthy();
      expect(resp.headers["X-XSS-Protection"]).toBeTruthy();
      expect(resp.headers.thing).toBeFalsy();
      expect(resp.statusCode).toEqual(418);
      expect(resp.body).toEqual(JSON.stringify("winning"));
    });
  });
});
