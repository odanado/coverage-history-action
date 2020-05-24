import fs from "fs";
import path from "path";
import os from "os";

import { create, ArtifactClient } from "@actions/artifact";

import { logger } from "../logger";
import { CoverageResult } from "../type";
import { Repository } from "./index";

export class ArtifactRepository implements Repository {
  private readonly artifactClient: ArtifactClient;

  constructor() {
    this.artifactClient = create();
  }

  private getDirectory(): string {
    return ".coverage-history";
  }

  private getfileName(): string {
    return "coverage-history.json";
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
    const fileName = this.getfileName();
    logger.debug(`save ${JSON.stringify({ branch, key, directory })}`);

    await fs.promises.mkdir(directory, { recursive: true });

    const data = JSON.stringify({ ...cache, [branch]: value });
    logger.debug(`data: ${data}`);

    fs.promises.writeFile(fileName, data);

    await this.artifactClient.uploadArtifact(key, [fileName], process.cwd());
  }

  async load(branch: string): Promise<unknown> {
    const key = this.getKey();
    const directory = this.getDirectory();
    logger.debug(`load ${JSON.stringify({ branch, key, directory })}`);

    const { downloadPath } = await this.artifactClient.downloadArtifact(
      key,
      os.tmpdir()
    );

    logger.debug(`${JSON.stringify({ downloadPath })}`);
    const fileName = path.join(downloadPath, this.getfileName());

    const value = await fs.promises.readFile(fileName, {
      encoding: "utf8",
    });

    try {
      return JSON.parse(value);
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
