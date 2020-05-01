// @ts-ignore
import Enforcer from "openapi-enforcer"
import {Configuration} from "../utils/Configuration";
import {ISecretConfig, ITarget} from "../models";
import {SQService} from "./SQService";
import SQS from "aws-sdk/clients/sqs";


export class MarshallingService {
  private sqService: SQService;
  constructor() {
    this.sqService = new SQService(new SQS())
  }

  public async processRequest(eventBody: any, targetName: string, changeType: string, key: string) {
    const targets = Configuration.getInstance().getTargets();
    const target: ITarget = targets[targetName];
    if (!(await this.isValidMessageBody(eventBody, target))) {
      throw new Error("Invalid body");
    }

    const body = {
      changeType,
      key,
      body: eventBody
    }

    await this.sqService.sendMessage(JSON.stringify(body), target.queue).catch(
      (error) => {
        console.log("Failed to submit queue message: ", error)
        throw new Error(error)
      }
    )
  }

  public async isValidMessageBody(body: any, target: ITarget) {
    const config: ISecretConfig = await Configuration.getInstance().getSecretConfig();
    if(config.validation) {
      const enforcer = await Enforcer(`./src/resources/${target.swaggerSpecFile}`);
      const schema = enforcer.components.schemas[target.schemaItem];
      const deserialised = schema.deserialize(body);
      const output = schema.validate(deserialised.value);
      if(output) {
        console.log("Record failed validation: ", output);
        return false
      }
    }
    return true;
  }
}
