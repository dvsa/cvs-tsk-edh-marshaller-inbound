import { Handler } from "aws-lambda";

export interface ISubSeg {
  addError(error: any): void;
  close: () => void;
}

export interface IFunctionConfig {
  name: string;
  path: string;
  function: Handler;
  method: string;
}

export interface ISecretConfig {
  debugMode?: string | boolean;
  validation?: string | boolean;
}

export interface ITarget {
  queueName: string;
  swaggerSpecFile: string;
  schemaItem: string;
}

export interface ITargetConfig {
  [target: string]: ITarget;
}
