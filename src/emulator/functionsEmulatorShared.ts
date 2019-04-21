import * as _ from "lodash";
import * as logger from "../logger";
import * as fft from "firebase-functions-test";
import * as parseTriggers from "../parseTriggers";
import * as utils from "../utils";
import { WrappedFunction } from "firebase-functions-test/lib/main";
import { CloudFunction } from "firebase-functions";
import * as os from "os";
import * as path from "path";

interface EmulatedTriggerDefinition {
  entryPoint: string;
  name: string;
  timeout?: string; // Like "3s" for some reason lol
  availableMemoryMb?: number;
  httpsTrigger?: any;
  eventTrigger?: any;
}

export class EmulatedTrigger {
  static fromDirectory(definition: EmulatedTriggerDefinition, directory: string): EmulatedTrigger {
    const emulatedTrigger = new EmulatedTrigger(definition);
    emulatedTrigger.directory = directory;
    emulatedTrigger.definition = definition;
    return emulatedTrigger;
  }

  static fromModule(definition: EmulatedTriggerDefinition, module: any): EmulatedTrigger {
    const emulatedTrigger = new EmulatedTrigger(definition);
    emulatedTrigger.module = module;
    emulatedTrigger.definition = definition;
    return emulatedTrigger;
  }

  private directory: string | void = undefined;
  private module: string | void = undefined;
  constructor(public definition: EmulatedTriggerDefinition) {}

  get timeout(): number {
    return parseInt((this.definition.timeout || "60s").split("s")[0], 10) * 1000;
  }

  getRawFunction(): CloudFunction<any> {
    if (this.directory) {
      const module = require(this.directory);
      const newFunction = _.get(module, this.definition.entryPoint);
      logger.debug(`[functions] Function "${this.definition.name}" will be invoked. Logs:`);
      return newFunction;
    } else if (this.module) {
      return _.get(this.module, this.definition.entryPoint);
    } else {
      throw new Error(
        "EmulatedTrigger has not been provided with a directory or a triggers object"
      );
    }
  }

  getWrappedFunction(): WrappedFunction {
    return fft().wrap(this.getRawFunction());
  }
}

export async function getTriggersFromDirectory(
  projectId: string,
  functionsDir: string,
  firebaseConfig: any
): Promise<{ [name: string]: EmulatedTrigger }> {
  let triggers;

  try {
    triggers = await parseTriggers(projectId, functionsDir, {}, JSON.stringify(firebaseConfig));
  } catch (e) {
    utils.logWarning(`Failed to load functions source code.`);
    logger.info(e.message);
    return {};
  }

  return triggers.reduce((obj: { [triggerName: string]: any }, trigger: any) => {
    obj[trigger.name] = EmulatedTrigger.fromDirectory(trigger, functionsDir);
    return obj;
  }, {});
}

export function getTemporarySocketPath(pid: number): string {
  return path.join(os.tmpdir(), `firebase_emulator_invocation_${pid}.sock`);
}

// This bundle gets passed from hub -> runtime as a CLI arg
export interface FunctionsRuntimeBundle {
  mode: "HTTPS" | "BACKGROUND";
  projectId: string;
  proto?: any;
  triggerId: any;
  ports: {
    firestore: number;
  };
  disabled_features?: {
    functions_config_helper?: boolean;
    network_filtering?: boolean;
  };
  cwd: string;
}
