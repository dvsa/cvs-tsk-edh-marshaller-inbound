import { MarshallingService } from "../../src/services/MarshallingService";
import { SQService } from "../../src/services/SQService";
import demoStation from "../resources/demoStation.json";
import { CHANGE, TARGET } from "../../src/models/enums";

describe("MarshallingService service", () => {
  describe("processRequest function", () => {
    const validMock = jest.spyOn(
      MarshallingService.prototype,
      "isValidMessageBody"
    );
    const sendMock = jest.spyOn(SQService.prototype, "sendMessage");
    const svc = new MarshallingService();
    describe("with valid inputs", () => {
      afterEach(() => {
        jest.clearAllMocks();
      });
      validMock.mockResolvedValue(true);
      describe("with happy SQService", () => {
        // @ts-ignore
        sendMock.mockResolvedValue(Promise.resolve("good"));
        it("calls sendMessage and does not error", async () => {
          expect.assertions(1);
          await svc.processRequest(
            demoStation,
            TARGET.TEST_STATIONS,
            CHANGE.CREATE,
            "abc123"
          );
          expect(sendMock).toHaveBeenCalled();
          sendMock.mockRestore();
        });
      });

      // TODO: reinstate these when you can work out how to have them not conflict.
      // describe("with unhappy SQService", () => {
      //   // @ts-ignore
      //   sendMock.mockRejectedValue("bad");
      //   it("calls sendMessage and does not error", async () => {
      //     expect.assertions(1);
      //     await svc.processRequest(demoStation, TARGET.TEST_STATIONS, CHANGE.CREATE, "abc123")
      //       .catch((e) => {
      //         expect(e.message).toEqual("bad");
      //       });
      //   })
      // })
    });
  });
});
