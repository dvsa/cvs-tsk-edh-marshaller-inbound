// @ts-ignore
import * as yml from "node-yaml";
import { IFunctionConfig, ITargetConfig } from "../models";
import SecretsManager from "aws-sdk/clients/secretsmanager";
import * as AWSXray from "aws-xray-sdk";
import { ERROR } from "../models/enums";
import { Handler } from "aws-lambda";

/**
 * Helper class for retrieving project configuration
 */
class Configuration {
  private static instance: Configuration;
  private readonly config: any;
  private secretsClient: SecretsManager;

  private constructor(configPath: string) {
    this.config = yml.readSync(configPath);
    this.secretsClient = AWSXray.captureAWSClient(
      new SecretsManager({ region: "eu-west-1" })
    );

    // Replace environment variable references
    let stringifiedConfig: string = JSON.stringify(this.config);
    const envRegex: RegExp = /\${(\w+\b):?(\w+\b)?}/g;
    const matches: RegExpMatchArray | null = stringifiedConfig.match(envRegex);

    if (matches) {
      matches.forEach((match: string) => {
        envRegex.lastIndex = 0;
        const captureGroups: RegExpExecArray = envRegex.exec(
          match
        ) as RegExpExecArray;

        // Insert the environment variable if available. If not, insert placeholder. If no placeholder, leave it as is.
        stringifiedConfig = stringifiedConfig.replace(
          match,
          process.env[captureGroups[1]] || captureGroups[2] || captureGroups[1]
        );
      });
    }

    this.config = JSON.parse(stringifiedConfig);
  }

  /**
   * Retrieves the singleton instance of Configuration
   * @returns Configuration
   */
  public static getInstance(): Configuration {
    if (!this.instance) {
      this.instance = new Configuration("../config/config.yml");
    }

    return Configuration.instance;
  }

  /**
   * Retrieves the entire config as an object
   * @returns any
   */
  public getConfig(): any {
    return this.config;
  }

  /**
   * Retrieves the lambda functions declared in the config
   * @returns IFunctionEvent[]
   */
  public getFunctions(): IFunctionConfig[] {
    if (!this.config.functions) {
      throw new Error(ERROR.FUNCTION_CONFIG_NOT_DEFINED);
    }

    return this.config.functions.map((fn: Handler) => {
      const [name, params]: any = Object.entries(fn)[0];
      const path: string = params.proxy
        ? params.path.replace("{+proxy}", params.proxy)
        : params.path;

      return {
        name,
        method: params.method.toUpperCase(),
        path,
        function: require(`../functions/${name}`)[name],
      };
    });
  }

  /**
   * Retrieves the Targets config
   * @returns ITargetConfig[]
   */
  public getTargets(): ITargetConfig {
    return this.config.targets;
  }
}

export { Configuration };
