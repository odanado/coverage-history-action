import { CoverageResult } from "../type";

export interface Reporter {
  report(
    targetCoverage: CoverageResult,
    currentCoverage: CoverageResult
  ): Promise<string>;
}
