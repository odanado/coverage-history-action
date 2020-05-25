import { CoverageSet } from "../type";

export interface Repository {
  saveCoverage(branch: string, value: CoverageSet): Promise<void>;
  loadCoverage(branch: string): Promise<CoverageSet | undefined>;
}
