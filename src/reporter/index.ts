import { CoverageSet } from "../type";

export interface Reporter {
  report(
    targetCoverage: CoverageSet,
    currentCoverage: CoverageSet
  ): Promise<string>;
}
