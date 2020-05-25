import fs from "fs";
import path from "path";

import { restoreCache, saveCache } from "@actions/cache";

import { logger } from "../logger";
import { CoverageSet } from "../type";
import { Repository } from "./index";

export class CacheRepository implements Repository {
  private getDirectory(): string {
    return ".coverage-history";
  }

  private getFileName(): string {
    return path.join(this.getDirectory(), "coverage-history.json");
  }

  private getKey(): string {
    const key = ["coverage-history-action"].join(":");
    return key;
  }

  async save(
    branch: string,
    value: unknown,
    cache: CoverageSet | undefined
  ): Promise<void> {
    const directory = this.getDirectory();
    const baseKey = this.getKey();
    const fileName = this.getFileName();

    await fs.promises.mkdir(directory, { recursive: true });
    const data = JSON.stringify({ ...cache, [branch]: value });
    fs.promises.writeFile(fileName, data);

    const runId = process.env.GITHUB_RUN_ID;
    const key = `${baseKey}-${runId}`;
    saveCache([fileName], key);

    logger.info(`save to cache key: ${key}`);
  }

  async load(branch: string): Promise<unknown> {
    const key = this.getKey();
    const fileName = this.getFileName();

    const cacheHit = await restoreCache([fileName], key, [key]);

    logger.debug({ cacheHit });

    if (!cacheHit) return;

    logger.info("cache hit");
    const value = await fs.promises.readFile(fileName, {
      encoding: "utf8",
    });

    try {
      return JSON.parse(value)[branch];
    } catch {
      return undefined;
    }
  }

  async saveCoverage(branch: string, value: CoverageSet): Promise<void> {
    const cache = await this.loadCoverage(branch);
    await this.save(branch, value, cache);
  }
  async loadCoverage(branch: string): Promise<CoverageSet | undefined> {
    const value = await this.load(branch).catch((e) => {
      logger.debug(`load error: branch ${branch}. ${JSON.stringify(e)}`);
      return undefined;
    });
    if (value) {
      logger.debug(`loaded: ${JSON.stringify(value)}`);
      return value as CoverageSet;
    }
    return undefined;
  }
}
