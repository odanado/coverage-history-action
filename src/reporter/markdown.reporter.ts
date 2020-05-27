import { Reporter } from "./index";
import { CoverageSet } from "../type";

export class MarkdownReporter implements Reporter {
  private format(coverage: number): string {
    return (coverage * 100).toFixed(2);
  }
  report(
    targetCoverage: CoverageSet,
    currentCoverage: CoverageSet
  ): Promise<string> {
    const table = `
|  | target | current |
| - | -: | -: |
|  statement  | ${this.format(
      targetCoverage.statement.total
    )} % | ${this.format(currentCoverage.statement.total)} % |
|  branch  | ${this.format(targetCoverage.branch.total)} % | ${this.format(
      currentCoverage.branch.total
    )} % |
|  function  | ${this.format(targetCoverage.function.total)} % | ${this.format(
      currentCoverage.function.total
    )} % |
    `;
    return Promise.resolve(table);
  }
}

/*
|   |  master  | improve-istanbul-loader |
| - | -: | -: |
|  statement  |  TD  | 30% |
|  branch  |  TD  | 30% |
|  function |  TD  | 30% |
*/
