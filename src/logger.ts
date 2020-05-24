import * as core from "@actions/core";

export class Logger {
  buildMessage(message?: unknown): string {
    if (message == null) {
      return "";
    }
    if (typeof message === "object") {
      return JSON.stringify(message);
    }
    return `${message}`;
  }
  build(message?: unknown, ...optionalParams: unknown[]): string {
    return [
      this.buildMessage(message),
      ...optionalParams.map((param) => this.buildMessage(param)),
    ].join(" ");
  }
  debug(message?: unknown, ...optionalParams: unknown[]): void {
    core.debug(this.build(message, ...optionalParams));
  }
  error(message?: unknown, ...optionalParams: unknown[]): void {
    core.error(this.build(message, ...optionalParams));
  }
  warning(message?: unknown, ...optionalParams: unknown[]): void {
    core.warning(this.build(message, ...optionalParams));
  }
  info(message?: unknown, ...optionalParams: unknown[]): void {
    core.info(this.build(message, ...optionalParams));
  }
}

export const logger = new Logger();
