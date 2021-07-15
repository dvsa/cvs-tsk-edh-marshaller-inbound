import { Configuration } from "../../src/utils/Configuration";
import { IFunctionConfig } from "../../src/models";
import { ERROR } from "../../src/models/enums";

describe("ConfigurationUtil", () => {
  const branch = process.env.BRANCH;
  context("when calling getConfig", () => {
    it("returns the full config object", () => {
      const conf = Configuration.getInstance().getConfig();
      expect(Object.keys(conf)).toEqual(
        expect.arrayContaining(["functions", "serverless", "targets"])
      );
      expect(Object.keys(conf.targets)).toEqual(
        expect.arrayContaining(["test-stations"])
      );
    });
  });

  context("when calling the getFunctions()", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    context("the config is empty", () => {
      process.env.BRANCH = "local";
      //@ts-ignore
      const emptyConfig: Configuration = new Configuration(
        "../../tests/resources/EmptyConfig.yml"
      );
      it("should throw error", () => {
        try {
          emptyConfig.getFunctions();
        } catch (e) {
          expect(e.message).toEqual(ERROR.FUNCTION_CONFIG_NOT_DEFINED);
        }
      });
    });
    context("the config is present", () => {
      process.env.BRANCH = "local";
      const funcConfig: IFunctionConfig[] =
        Configuration.getInstance().getFunctions();
      it("should return the list of specified functions with names and matching paths", () => {
        expect(funcConfig).toHaveLength(2);
        expect(funcConfig[0].name).toEqual("createTestStation");
        expect(funcConfig[0].path).toEqual(
          "/:apiVersion/test-stations/:testStationId"
        );
        expect(funcConfig[0].method).toEqual("POST");
        expect(funcConfig[1].name).toEqual("updateTestStation");
        expect(funcConfig[1].path).toEqual(
          "/:apiVersion/test-stations/:testStationId"
        );
        expect(funcConfig[1].method).toEqual("PUT");
      });
    });
  });

  afterAll(() => {
    process.env.BRANCH = branch;
  });
});

/**
 * Configuration does the token replacement for ${BRANCH} on instantiation, so in order to
 * catch this early enough, need to use jest.resetModules() and a "require" import
 * of Configuration again
 */
const getMockedConfig: () => Configuration = () => {
  jest.resetModules();
  const ConfImp = require("../../src/utils/Configuration");
  return ConfImp.Configuration.getInstance();
};
