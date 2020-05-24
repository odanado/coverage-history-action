import fs from "fs";
import path from "path";
import { saveCache, restoreCache } from "@actions/cache";

import { logger } from "../logger";
import { CoverageResult } from "../type";
import { Repository } from "./index";

export class CacheRepository implements Repository {
  private getDirectory(): string {
    return ".coverage-history";
  }

  private getfileName(branch: string): string {
    logger.debug(`filename, ${{ directory: this.getDirectory(), branch }}`);
    return path.join(this.getDirectory(), `${branch}.json`);
  }

  private getKey(): string {
    const key = ["coverage-history-action", "coverage"].join(":");
    return key;
  }

  async save(branch: string, value: unknown): Promise<void> {
    const directory = this.getDirectory();
    const key = this.getKey();
    logger.debug(`save ${{ branch, key, directory }}`);

    await fs.promises.mkdir(directory, { recursive: true });

    fs.promises.writeFile(this.getfileName(branch), JSON.stringify(value));

    const runId = process.env.GITHUB_RUN_ID;

    await saveCache([directory], `${key}-${runId}`);
  }

  async load(branch: string): Promise<unknown> {
    const key = this.getKey();
    const directory = this.getDirectory();
    logger.debug(`load ${{ branch, key, directory }}`);

    const cacheHit = restoreCache([directory], key, [key]);

    if (!cacheHit) {
      return undefined;
    }

    const fileName = this.getfileName(branch);
    logger.debug((await fs.promises.readdir(this.getDirectory())).join("\n"));
    const value = await fs.promises.readFile(fileName, { encoding: "utf8" });

    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  }

  async saveCoverage(branch: string, value: CoverageResult): Promise<void> {
    await this.save(branch, value);
  }
  async loadCoverage(branch: string): Promise<CoverageResult | undefined> {
    const value = await this.load(branch);
    if (value) {
      return value as CoverageResult;
    }
    return undefined;
  }
}
