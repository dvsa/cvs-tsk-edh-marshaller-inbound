import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { ERROR, TARGET, CHANGE } from "../models/enums";
import { MarshallingService } from "../services/MarshallingService";
import { HTTPResponse } from "../models/HTTPResponse";

export const updateTestStation: Handler = async (
  event: APIGatewayProxyEvent
) => {
  const payload = event.body;
  const testStationId = event.pathParameters?.testStationId;
  const headers = event.headers;
  console.log("Trace Header: ", headers?.["X-Amzn-Trace-Id"]);

  if (!payload) {
    throw new Error(ERROR.INVALID_PAYLOAD);
  }

  if (!testStationId) {
    throw new Error(ERROR.INVALID_PATH_PARAM);
  }

  const marshallingService = new MarshallingService();
  return await marshallingService
    .processRequest(payload, TARGET.TEST_STATIONS, CHANGE.UPDATE, testStationId)
    .then(() => {
      return new HTTPResponse(202, undefined);
    });
};
