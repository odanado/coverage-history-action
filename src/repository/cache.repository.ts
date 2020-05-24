import fs from "fs";
import path from "path";
import { saveCache, restoreCache } from "@actions/cache";

import { CoverageResult } from "../type";
import { Repository } from "./index";

export class CacheRepository implements Repository {
  private getDirectory(): string {
    return ".coverage-history";
  }

  private getfileName(branch: string): string {
    console.log("filename", this.getDirectory(), branch);
    return path.join(this.getDirectory(), `${branch}.json`);
  }

  private getKey(branch: string): string {
    const key = ["coverage-history-action", branch, "coverage"].join(":");
    return key;
  }

  async save(branch: string, value: unknown): Promise<void> {
    const directory = this.getDirectory();
    const key = this.getKey(branch);

    await fs.promises.mkdir(directory, { recursive: true });

    fs.promises.writeFile(this.getfileName(branch), JSON.stringify(value));

    const runId = process.env.GITHUB_RUN_ID;

    await saveCache([directory], `${key}-${runId}`);
  }

  async load(branch: string): Promise<unknown> {
    const key = this.getKey(branch);
    const directory = this.getDirectory();

    const cacheHit = restoreCache([directory], key, [key]);

    if (!cacheHit) {
      return undefined;
    }

    const fileName = this.getfileName(branch);
    const value = await fs.promises.readFile(fileName, { encoding: "utf8" });

    console.log("load", key, value);
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
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
