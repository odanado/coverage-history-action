import fs from "fs";
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

  async save(branch: string, value: unknown): Promise<void> {
    const directory = this.getDirectory();
    const key = this.getKey();
    const fileName = this.getfileName();
    logger.debug(`save ${JSON.stringify({ branch, key, directory })}`);

    await fs.promises.mkdir(directory, { recursive: true });

    const cache = await this.loadCoverage(branch);
    const data = JSON.stringify({ ...cache, [branch]: value });
    logger.debug(`data: ${data}`);

    fs.promises.writeFile(fileName, data);

    await this.artifactClient.uploadArtifact(key, [fileName], process.cwd());
  }

  async load(branch: string): Promise<unknown> {
    const key = this.getKey();
    const directory = this.getDirectory();
    logger.debug(`load ${JSON.stringify({ branch, key, directory })}`);

    const { downloadPath } = await this.artifactClient.downloadArtifact(key);

    const value = await fs.promises.readFile(downloadPath, {
      encoding: "utf8",
    });

    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  }

  async saveCoverage(branch: string, value: CoverageResult): Promise<void> {
    await this.save(branch, value);

    await this.loadCoverage(branch);
  }
  async loadCoverage(branch: string): Promise<CoverageResult | undefined> {
    const value = await this.load(branch).catch((e) => {
      logger.debug(e);
      return undefined;
    });
    if (value) {
      logger.debug(`loaded: ${JSON.stringify(value)}`);
      return value as CoverageResult;
    }
    return undefined;
  }
}
