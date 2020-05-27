import { Reporter } from "./index";
import { BranchCoverage } from "../type";

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
  report(target: BranchCoverage, current: BranchCoverage): Promise<string> {
    const makeTable = tableMaker`
|  | ${"target"} | ${"current"} |
| - | -: | -: |
|  statement  | ${"targetStatement"} | ${"currentStatement"} |
|  branch  | ${"targetBranch"} | ${"currentBranch"} |
|  function  | ${"targetFunction"} | ${"currentFunction"} |
`;

    const table = makeTable({
      target: target.branch,
      current: current.branch,
      targetStatement: `${this.format(target.coverage.statement.total)} %`,
      currentStatement: `${this.format(current.coverage.statement.total)} %`,
      targetBranch: `${this.format(target.coverage.branch.total)} %`,
      currentBranch: `${this.format(current.coverage.branch.total)} %`,
      targetFunction: `${this.format(target.coverage.function.total)} %`,
      currentFunction: `${this.format(current.coverage.function.total)} %`,
    });

    return Promise.resolve(table);
  }
}
