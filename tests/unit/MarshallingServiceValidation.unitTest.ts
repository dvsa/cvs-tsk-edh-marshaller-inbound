import { ITarget } from "../../src/models";
import { MarshallingService } from "../../src/services/MarshallingService";
import demoStation from "../resources/demoStation.json";
describe("isValidMessageBody", () => {
  let origProcEnv: any;
  beforeAll(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
    origProcEnv = process.env;
  });
  const target: ITarget = {
    queueName: "",
    swaggerSpecFile: "API_Test_Stations_EDH->CVS_v1.yaml",
    schemaItem: "testStation",
  };
  describe("When validation = true", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    beforeAll(() => {
      process.env.VALIDATION = "TRUE";
    });
    afterAll(() => {
      process.env = origProcEnv;
    });

    it("returns false when evaluating a completely invalid record against a valid spec", async () => {
      const svc = new MarshallingService();
      //@ts-ignore
      svc.basePath = "./src/resources/";
      const output = await svc.isValidMessageBody(
        { something: "invalid" },
        target
      );
      expect(output).toEqual(false);
    });
    it("returns true when evaluating a 'good' record against a valid spec", async () => {
      const svc = new MarshallingService();
      //@ts-ignore
      svc.basePath = "./src/resources/";
      const output = await svc.isValidMessageBody(demoStation, target);
      expect(output).toEqual(true);
    });
  });
  describe("when validation = false", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    beforeAll(() => {
      process.env.VALIDATION = "false";
    });

    it("always returns true", async () => {
      const svc = new MarshallingService();
      //@ts-ignore
      svc.basePath = "./src/resources/";
      const output = await svc.isValidMessageBody(
        { something: "invalid" },
        target
      );
      expect(output).toEqual(true);
    });
  });
  describe("when validation is not set in environment variables", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    beforeAll(() => {
      process.env = origProcEnv;
    });
    it("always returns true", async () => {
      const svc = new MarshallingService();
      //@ts-ignore
      svc.basePath = "./src/resources/";
      const output = await svc.isValidMessageBody(
        { something: "invalid" },
        target
      );
      expect(output).toEqual(true);
    });
  });
});
