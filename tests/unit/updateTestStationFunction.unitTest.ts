import { cloneDeep } from "lodash";
import { CHANGE, ERROR, TARGET } from "../../src/models/enums";
import { MarshallingService } from "../../src/services/MarshallingService";
import { updateTestStation } from "../../src/functions/updateTestStation";

describe("createTestStation function", () => {
  const event = {
    body: { something: "good" },
    pathParameters: {
      testStationId: "abc123",
    },
    headers: [],
  };

  describe("with no payload (at all)", () => {
    const emptyEvent = cloneDeep(event);
    delete emptyEvent.body;
    it("throws Invalid Payload error", async () => {
      expect.assertions(1);
      // @ts-ignore
      await updateTestStation(emptyEvent).catch((e) => {
        expect(e.message).toEqual(ERROR.INVALID_PAYLOAD);
      });
    });
  });

  describe("with payload but not testStationId in pathParameters", () => {
    const emptyEvent = cloneDeep(event);
    delete emptyEvent.pathParameters.testStationId;
    it("throws Invalid Path Param error", async () => {
      expect.assertions(1);
      // @ts-ignore
      await updateTestStation(emptyEvent).catch((e) => {
        expect(e.message).toEqual(ERROR.INVALID_PATH_PARAM);
      });
    });
  });

  describe("with payload and testStationId in pathParameters", () => {
    it("invoked the processRequest function", async () => {
      const svc = jest
        .spyOn(MarshallingService.prototype, "processRequest")
        .mockResolvedValue(Promise.resolve());
      expect.assertions(2);
      // @ts-ignore
      await updateTestStation(event);
      expect(svc).toHaveBeenCalledTimes(1);
      expect(svc).toHaveBeenCalledWith(
        event.body,
        TARGET.TEST_STATIONS,
        CHANGE.UPDATE,
        event.pathParameters.testStationId
      );
    });
  });
});
