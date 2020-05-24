import fs from "fs";
import path from "path";

import { restoreCache, saveCache } from "@actions/cache";

import { logger } from "../logger";
import { CoverageResult } from "../type";
import { Repository } from "./index";

export class ArtifactRepository implements Repository {
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
    cache: CoverageResult | undefined
  ): Promise<void> {
    const directory = this.getDirectory();
    const key = this.getKey();
    const fileName = this.getFileName();
    logger.debug(
      `save ${JSON.stringify({ branch, key, directory, fileName })}`
    );

    await fs.promises.mkdir(directory, { recursive: true });

    const data = JSON.stringify({ ...cache, [branch]: value });
    logger.debug(`data: ${data}`);

    fs.promises.writeFile(fileName, data);

    const runId = process.env.GITHUB_RUN_ID;
    saveCache([fileName], `${key}-${runId}`);
  }

  async load(branch: string): Promise<unknown> {
    const key = this.getKey();
    const directory = this.getDirectory();
    const fileName = this.getFileName();
    logger.debug(
      `load ${JSON.stringify({ branch, key, directory, fileName })}`
    );

    const cacheHit = restoreCache([fileName], key, [key]);

    logger.debug(`cacheHit ${JSON.stringify({ cacheHit })}`);

    if (!cacheHit) return;
    const value = await fs.promises.readFile(fileName, {
      encoding: "utf8",
    });

    try {
      return JSON.parse(value)[branch];
    } catch {
      return undefined;
    }
  }

  async saveCoverage(branch: string, value: CoverageResult): Promise<void> {
    const cache = await this.loadCoverage(branch);
    await this.save(branch, value, cache);

    await this.loadCoverage(branch);
  }
  async loadCoverage(branch: string): Promise<CoverageResult | undefined> {
    const value = await this.load(branch).catch((e) => {
      logger.debug(`load error: branch ${branch}. ${JSON.stringify(e)}`);
      return undefined;
    });
    if (value) {
      logger.debug(`loaded: ${JSON.stringify(value)}`);
      return value as CoverageResult;
    }
    return undefined;
  }
}
