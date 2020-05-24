import fs from "fs";
import path from "path";
import { saveCache, restoreCache } from "@actions/cache";

import { CoverageResult } from "../type";
import { Repository } from "./index";

export class CacheRepository implements Repository {
  private getDirectory(): string {
    return ".coverage-history";
  }
  private getFileNmae(branch: string) {
    return path.join(this.getDirectory(), `${branch}.json`);
  }
  async save(branch: string, value: unknown): Promise<void> {
    const directory = this.getDirectory();
    const key = this.getKey(branch);

    await fs.promises.mkdir(directory, { recursive: true });

    fs.promises.writeFile(this.getFileNmae(branch), JSON.stringify(value));

    await saveCache([directory], key);
  }

  async load(branch: string): Promise<unknown> {
    const key = this.getKey(branch);
    const directory = this.getDirectory();

    const cacheHit = restoreCache([directory], key);

    if (!cacheHit) {
      return undefined;
    }

    const fileNmae = this.getFileNmae(branch);
    const value = await fs.promises.readFile(fileNmae, { encoding: "utf8" });

    console.log("load", key, value);
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
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
