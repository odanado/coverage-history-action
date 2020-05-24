import { CoverageResult } from "../type";

export interface Repository {
  saveCoverage(branch: string, value: CoverageResult): Promise<void>;
  loadCoverage(branch: string): Promise<CoverageResult>;
}
