import { saveState, getState } from "@actions/core";

import { CoverageResult } from "../type";
import { Repository } from "./index";

export class StateRepository implements Repository {
  async save(key: string, value: unknown): Promise<void> {
    saveState(key, JSON.stringify(value));
  }

  async load(key: string): Promise<unknown> {
    const value = getState(key);
    return JSON.parse(value);
  }

  private getKey(branch: string): string {
    const key = ["coverage-history-action", branch, "coverage"].join(":");
    return key;
  }

  async saveCoverage(branch: string, value: CoverageResult): Promise<void> {
    const key = this.getKey(branch);
    await this.save(key, value);
  }
  async loadCoverage(branch: string): Promise<CoverageResult | undefined> {
    const key = this.getKey(branch);
    const value = await this.load(key);
    if (value) {
      return value as CoverageResult;
    }
    return undefined;
  }
}
