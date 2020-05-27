import { Reporter } from "./index";
import { CoverageSet } from "../type";

export function tableMaker(
  strings: TemplateStringsArray,
  ...placeholders: string[]
): (values: { [key: string]: string }) => string {
  return (values: { [key: string]: string }): string => {
    return (
      strings[0] +
      placeholders
        .map((placeholder, i) => {
          return `${values[placeholder]}${strings[i + 1]}`;
        })
        .join("")
        .trim()
    );
  };
}

export class MarkdownReporter implements Reporter {
  private format(coverage: number): string {
    return (coverage * 100).toFixed(2);
  }
  report(
    targetCoverage: CoverageSet,
    currentCoverage: CoverageSet
  ): Promise<string> {
    const makeTable = tableMaker`
|  | target | current |
| - | -: | -: |
|  statement  | ${"targetStatement"} | ${"currentStatement"} |
|  branch  | ${"targetBranch"} | ${"currentBranch"} |
|  function  | ${"targetFunction"} | ${"currentFunction"} |
`;

    const table = makeTable({
      targetStatement: `${this.format(targetCoverage.statement.total)} %`,
      currentStatement: `${this.format(currentCoverage.statement.total)} %`,
      targetBranch: `${this.format(targetCoverage.branch.total)} %`,
      currentBranch: `${this.format(currentCoverage.branch.total)} %`,
      targetFunction: `${this.format(targetCoverage.function.total)} %`,
      currentFunction: `${this.format(currentCoverage.function.total)} %`,
    });

    return Promise.resolve(table);
  }
}
