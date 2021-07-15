import { Path } from "path-parser";
import { Configuration } from "./utils/Configuration";
import { Context } from "aws-lambda";
import { IFunctionConfig } from "./models";
import { ERROR } from "./models/enums";

const handler = async (event: any, context: Context) => {
  // Request integrity checks
  if (!event) {
    throw new Error(ERROR.AWS_EVENT_EMPTY);
  }

  if (event.body) {
    let payload = {};

    try {
      payload = JSON.parse(event.body);
    } catch {
      throw new Error(ERROR.NOT_VALID_JSON);
    }

    Object.assign(event, { body: payload });
  }

  // Finding an appropriate λ matching the request
  const config: Configuration = Configuration.getInstance();
  const functions: IFunctionConfig[] = config.getFunctions();
  const serverlessConfig = config.getConfig().serverless;

  const matchingLambdaEvents: IFunctionConfig[] = functions
    .filter((fn: IFunctionConfig) => {
      // Find λ with matching httpMethod
      return event.httpMethod === fn.method;
    })
    .filter((fn: IFunctionConfig) => {
      // Find λ with matching path
      const localPath: Path = new Path(fn.path);
      const remotePath: Path = new Path(
        `${serverlessConfig.basePath}${fn.path}`
      ); // Remote paths also have environment
      return localPath.test(event.path) || remotePath.test(event.path);
    });

  // Exactly one λ should match the above filtering.
  if (matchingLambdaEvents.length === 1) {
    const lambdaEvent = matchingLambdaEvents[0];
    const lambdaFn = lambdaEvent.function;

    const localPath: Path = new Path(lambdaEvent.path);
    const remotePath: Path = new Path(
      `${serverlessConfig.basePath}${lambdaEvent.path}`
    ); // Remote paths also have environment

    const lambdaPathParams =
      localPath.test(event.path) || remotePath.test(event.path);

    Object.assign(event, { pathParameters: lambdaPathParams });

    console.log(
      `HTTP ${event.httpMethod} ${event.path} -> λ ${lambdaEvent.name}`
    );

    // Explicit conversion because typescript can't figure it out
    return lambdaFn(event, context, () => {
      return;
    });
  }

  // If filtering results in less or more λ functions than expected, we return an error.
  console.error(`Error: Route ${event.httpMethod} ${event.path} was not found.
    Dumping event:
    ${JSON.stringify(event)}
    Dumping context:
    ${JSON.stringify(context)}`);

  throw new Error(`Route ${event.httpMethod} ${event.path} was not found.`);
};

export { handler };
