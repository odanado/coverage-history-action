import fs from "fs";
import { saveCache, restoreCache } from "@actions/cache";

import { logger } from "../logger";
import { CoverageResult } from "../type";
import { Repository } from "./index";

export class CacheRepository implements Repository {
  private getDirectory(): string {
    return ".coverage-history";
  }

  private getfileName(): string {
    return "coverage-history.json";
  }

  private getKey(): string {
    const key = ["coverage-history-action", "directory"].join(":");
    return key;
  }

  async save(branch: string, value: unknown): Promise<void> {
    const directory = this.getDirectory();
    const key = this.getKey();
    logger.debug(`save ${JSON.stringify({ branch, key, directory })}`);

    await fs.promises.mkdir(directory, { recursive: true });

    const cache = (await this.loadCoverage(branch)) ?? {};
    const data = JSON.stringify({ ...cache, [branch]: value });
    logger.debug(`data: ${data}`);

    fs.promises.writeFile(this.getfileName(), data);

    const runId = process.env.GITHUB_RUN_ID;

    await saveCache([directory], `${key}-${runId}`);
  }

  async load(branch: string): Promise<unknown> {
    const key = this.getKey();
    const directory = this.getDirectory();
    logger.debug(`load ${JSON.stringify({ branch, key, directory })}`);

    const cacheHit = restoreCache([directory], key, [key]);

    if (!cacheHit) {
      return undefined;
    }

    const fileName = this.getfileName();
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
