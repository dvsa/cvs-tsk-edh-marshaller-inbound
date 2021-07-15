import { SQService } from "../../src/services/SQService";

describe("SQService", () => {
  beforeAll(() => {
    jest.restoreAllMocks();
  });
  describe("sendMessage", () => {
    describe("with good inputs", () => {
      const sendMock = jest
        .fn()
        .mockReturnValue({ promise: jest.fn().mockResolvedValue("It worked") });
      const sqclientMock = jest.fn().mockImplementation(() => {
        return {
          sendMessage: sendMock,
          getQueueUrl: () => {
            return {
              promise: jest.fn().mockResolvedValue({ QueueUrl: "testURL" }),
            };
          },
          customizeRequests: jest.fn(),
        };
      });
      const liveMock = new sqclientMock();
      const svc = new SQService(liveMock);
      const expectedSendArgs = { MessageBody: "my thing", QueueUrl: "testURL" };
      it("doesn't throw an error", async () => {
        expect.assertions(3);
        const output = await svc.sendMessage("my thing", "aQueue");
        expect(output).toEqual("It worked");
        expect(sendMock).toHaveBeenCalledWith(expectedSendArgs);
        expect(sendMock).toHaveBeenCalledTimes(1);
      });
      describe("and specify attributes", () => {
        it("adds the attributes to the call params", async () => {
          sendMock.mockReset();
          sendMock.mockReturnValue({
            promise: jest.fn().mockResolvedValue("It worked"),
          });
          expect.assertions(3);
          const attrMap = { a: { DataType: "b" } };
          const output = await svc.sendMessage("my thing", "aQueue", attrMap);
          expect(output).toEqual("It worked");
          expect(sendMock).toHaveBeenCalledWith({
            ...expectedSendArgs,
            MessageAttributes: attrMap,
          });
          expect(sendMock).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
