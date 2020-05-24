import * as core from "@actions/core";

export class Logger {
  debug(message: string): void {
    core.debug(message);
  }
}

export const logger = new Logger();
