import { Reporter } from "./index";
import { CoverageSet } from "../type";

export class TextReporter implements Reporter {
  report(
    targetCoverage: CoverageSet,
    currentCoverage: CoverageSet
  ): Promise<string> {
    return Promise.resolve(
      `target: ${targetCoverage.statement.total}\tcurrent: ${currentCoverage.statement.total}`
    );
  }
}
