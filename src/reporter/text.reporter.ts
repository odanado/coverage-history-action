import { Reporter } from "./index";
import { CoverageResult } from "../type";

export class TextReporter implements Reporter {
  report(
    targetCoverage: CoverageResult,
    currentCoverage: CoverageResult
  ): Promise<string> {
    return Promise.resolve(
      `target: ${targetCoverage.statement.total}\tcurrent: ${currentCoverage.statement.total}`
    );
  }
}
